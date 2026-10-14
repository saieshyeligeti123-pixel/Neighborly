/**
 * Science API Service adhering to Google DeepMind Science Skills
 * Integrates authoritative public APIs: PubChem PUG REST, UniProtKB, and AlphaFold DB.
 */

export interface PubChemProperty {
  CID: number;
  MolecularFormula: string;
  MolecularWeight: string;
  CanonicalSMILES: string;
  InChIKey?: string;
  XLogP?: number;
  TPSA?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
  Complexity?: number;
}

export interface CompoundAnalysis {
  properties: PubChemProperty;
  structureImageUrl: string;
  lipinskiPassed: boolean;
  lipinskiViolations: string[];
  veberPassed: boolean;
  veberViolations: string[];
  sourceUrl: string;
}

export interface AlphaFoldModel {
  entryId: string;
  gene?: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  cifUrl: string;
  pdbUrl: string;
  paeImageUrl?: string;
  paeDocUrl?: string;
}

export interface ProteinAnalysis {
  accession: string;
  id: string;
  recommendedName: string;
  geneName?: string;
  organism: string;
  sequenceLength: number;
  functionSummary?: string;
  alphafold?: AlphaFoldModel;
  sourceUrl: string;
}

/**
 * Exponential backoff retry helper as prescribed by Science Skill
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseDelayMs = 600
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      const delay = !Number.isNaN(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    const errorBody = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status} (${response.statusText}) from ${url}: ${errorBody.slice(0, 300)}`);
  }
  throw new Error(`Exhausted retries for ${url}`);
}

/**
 * Query PubChem for chemical compound properties & evaluate Lipinski / Veber drug-likeness
 */
export async function fetchPubChemCompound(query: string): Promise<CompoundAnalysis> {
  const cleanQuery = encodeURIComponent(query.trim());
  
  // 1. Resolve compound name to CID
  let cid: number;
  if (/^\d+$/.test(query.trim())) {
    cid = parseInt(query.trim(), 10);
  } else {
    const nameUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${cleanQuery}/cids/JSON`;
    const nameRes = await fetchWithRetry(nameUrl);
    const nameData = await nameRes.json();
    if (!nameData.IdentifierList?.CID?.[0]) {
      throw new Error(`No PubChem compound found for "${query}"`);
    }
    cid = nameData.IdentifierList.CID[0];
  }

  // 2. Retrieve calculated physicochemical properties
  const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,Complexity/JSON`;
  const propRes = await fetchWithRetry(propUrl);
  const propData = await propRes.json();
  const properties: PubChemProperty = propData.PropertyTable?.Properties?.[0];

  if (!properties) {
    throw new Error(`Could not fetch physicochemical properties for CID ${cid}`);
  }

  // 3. Evaluate Lipinski Rule of 5
  const mw = parseFloat(properties.MolecularWeight) || 0;
  const logP = properties.XLogP ?? 0;
  const hbd = properties.HBondDonorCount ?? 0;
  const hba = properties.HBondAcceptorCount ?? 0;
  const rotBonds = properties.RotatableBondCount ?? 0;
  const tpsa = properties.TPSA ?? 0;

  const lipinskiViolations: string[] = [];
  if (mw > 500) lipinskiViolations.push(`Molecular Weight (${mw.toFixed(1)} Da > 500 Da)`);
  if (logP > 5) lipinskiViolations.push(`Lipophilicity XLogP (${logP} > 5)`);
  if (hbd > 5) lipinskiViolations.push(`H-Bond Donors (${hbd} > 5)`);
  if (hba > 10) lipinskiViolations.push(`H-Bond Acceptors (${hba} > 10)`);
  const lipinskiPassed = lipinskiViolations.length <= 1;

  // 4. Evaluate Veber Bioavailability Rules
  const veberViolations: string[] = [];
  if (rotBonds > 10) veberViolations.push(`Rotatable Bonds (${rotBonds} > 10)`);
  if (tpsa > 140) veberViolations.push(`Polar Surface Area TPSA (${tpsa} Å² > 140 Å²)`);
  const veberPassed = veberViolations.length === 0;

  const structureImageUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=320x320`;
  const sourceUrl = `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;

  return {
    properties,
    structureImageUrl,
    lipinskiPassed,
    lipinskiViolations,
    veberPassed,
    veberViolations,
    sourceUrl,
  };
}

/**
 * Query UniProtKB and AlphaFold DB for protein details & 3D structure predictions
 */
export async function fetchUniProtProtein(accession: string): Promise<ProteinAnalysis> {
  const cleanAcc = accession.trim().toUpperCase();
  const uniprotUrl = `https://rest.uniprot.org/uniprotkb/${cleanAcc}.json`;
  
  const res = await fetchWithRetry(uniprotUrl);
  const data = await res.json();

  const id = data.uniProtkbId || cleanAcc;
  const recommendedName = 
    data.proteinDescription?.recommendedName?.fullName?.value ||
    data.proteinDescription?.submissionNames?.[0]?.fullName?.value ||
    data.genes?.[0]?.geneName?.value ||
    cleanAcc;
  const geneName = data.genes?.[0]?.geneName?.value;
  const organism = data.organism?.scientificName || 'Unknown organism';
  const sequenceLength = data.sequence?.length || 0;

  // Extract function summary
  const functionComment = data.comments?.find((c: any) => c.commentType === 'FUNCTION');
  const functionSummary = functionComment?.texts?.[0]?.value;

  // Query AlphaFold DB dynamically as required by Science Skill
  let alphafold: AlphaFoldModel | undefined;
  try {
    const afUrl = `https://alphafold.ebi.ac.uk/api/prediction/${cleanAcc}`;
    const afRes = await fetch(afUrl);
    if (afRes.ok) {
      const afData = await afRes.json();
      if (Array.isArray(afData) && afData.length > 0) {
        const model = afData[0];
        alphafold = {
          entryId: model.entryId,
          gene: model.gene,
          uniprotAccession: model.uniprotAccession,
          uniprotId: model.uniprotId,
          uniprotDescription: model.uniprotDescription,
          taxId: model.taxId,
          organismScientificName: model.organismScientificName,
          cifUrl: model.cifUrl,
          pdbUrl: model.pdbUrl,
          paeImageUrl: model.paeImageUrl,
          paeDocUrl: model.paeDocUrl,
        };
      }
    }
  } catch (err) {
    // Non-fatal, protein might not have AFDB entry
  }

  return {
    accession: cleanAcc,
    id,
    recommendedName,
    geneName,
    organism,
    sequenceLength,
    functionSummary,
    alphafold,
    sourceUrl: `https://www.uniprot.org/uniprotkb/${cleanAcc}`,
  };
}

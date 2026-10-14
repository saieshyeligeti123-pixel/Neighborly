import React, { useState, useEffect } from 'react';
import { 
  fetchPubChemCompound, 
  fetchUniProtProtein, 
  CompoundAnalysis, 
  ProteinAnalysis 
} from '../../services/scienceApi';
import { 
  Dna, 
  FlaskConical, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Info,
  Microscope,
  Leaf,
  Droplet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PRESET_COMPOUNDS = [
  { label: 'Chlorophyll a', query: 'Chlorophyll a', desc: 'Photosynthetic plant pigment' },
  { label: 'Citric Acid', query: 'Citric Acid', desc: 'Natural organic fruit acid' },
  { label: 'Caffeine', query: 'Caffeine', desc: 'Natural botanical alkaloid' },
  { label: 'Urea (Fertilizer)', query: 'Urea', desc: 'Nitrogen-rich plant nutrient' },
  { label: 'Aspirin', query: 'Aspirin', desc: 'Salicylic acid derivative' },
];

const PRESET_PROTEINS = [
  { accession: 'P00875', name: 'RuBisCO Large Subunit', organism: 'Spinacia oleracea (Spinach)' },
  { accession: 'P42212', name: 'Green Fluorescent Protein (GFP)', organism: 'Aequorea victoria (Jellyfish)' },
  { accession: 'P04040', name: 'Catalase Enzyme', organism: 'Homo sapiens' },
  { accession: 'P04637', name: 'Cellular Tumor Antigen p53', organism: 'Homo sapiens' },
];

export const BioscienceLab: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useApp();

  const [activeTab, setActiveTab] = useState<'chemistry' | 'proteins'>('chemistry');
  
  // Chemistry state
  const [chemQuery, setChemQuery] = useState('Chlorophyll a');
  const [compoundData, setCompoundData] = useState<CompoundAnalysis | null>(null);
  const [chemLoading, setChemLoading] = useState(false);
  const [chemError, setChemError] = useState<string | null>(null);

  // Protein state
  const [proteinQuery, setProteinQuery] = useState('P00875');
  const [proteinData, setProteinData] = useState<ProteinAnalysis | null>(null);
  const [proteinLoading, setProteinLoading] = useState(false);
  const [proteinError, setProteinError] = useState<string | null>(null);

  // Auto-load default on mount (Mandatory Science Skill rule)
  useEffect(() => {
    handleSearchCompound('Chlorophyll a');
    handleSearchProtein('P00875');
  }, []);

  const handleSearchCompound = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setChemLoading(true);
    setChemError(null);
    try {
      const data = await fetchPubChemCompound(queryToSearch);
      setCompoundData(data);
    } catch (err: any) {
      setChemError(err.message || 'Failed to fetch compound data from PubChem.');
    } finally {
      setChemLoading(false);
    }
  };

  const handleSearchProtein = async (accToSearch: string) => {
    if (!accToSearch.trim()) return;
    setProteinLoading(true);
    setProteinError(null);
    try {
      const data = await fetchUniProtProtein(accToSearch);
      setProteinData(data);
    } catch (err: any) {
      setProteinError(err.message || 'Failed to fetch protein details from UniProt.');
    } finally {
      setProteinLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - iOS Style Glassmorphism */}
      <div className="ios-glass p-6 sm:p-8 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <FlaskConical className="w-4 h-4" />
              <span>Community Bioscience & Botany Lab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Community Bioscience Explorer
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Explore plant biology, organic soil compounds, and biomolecular structures using authoritative scientific databases (PubChem, UniProtKB, and AlphaFold DB). Perfect for community garden soil analysis, water purity inspection, and resident educational projects.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('Bioscience & Lab');
              setActiveView('browse');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Borrow Community Lab Tools</span>
          </button>
        </div>

        {/* Workbench Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10">
          <button
            onClick={() => setActiveTab('chemistry')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chemistry'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Plant & Soil Chemical Compounds (PubChem)</span>
          </button>
          <button
            onClick={() => setActiveTab('proteins')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proteins'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Proteins, Enzymes & AlphaFold DB</span>
          </button>
        </div>
      </div>

      {/* Tab 1: PubChem Chemistry & Soil Compounds */}
      {activeTab === 'chemistry' && (
        <div className="space-y-4">
          
          {/* Quick-Try Example Bar (Science Skill Mandate) */}
          <div className="ios-glass p-4 rounded-xl border border-white/40 dark:border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-1">
              Sample Biological Compounds:
            </span>
            {PRESET_COMPOUNDS.map(preset => (
              <button
                key={preset.query}
                onClick={() => {
                  setChemQuery(preset.query);
                  handleSearchCompound(preset.query);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                  chemQuery.toLowerCase() === preset.query.toLowerCase()
                    ? 'bg-emerald-800 text-white font-medium shadow-xs'
                    : 'bg-neutral-100/80 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/80'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={chemQuery}
                onChange={e => setChemQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchCompound(chemQuery)}
                placeholder="Search compound name or PubChem CID (e.g. 'Chlorophyll a', 'Citric Acid', '2244')..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              />
            </div>
            <button
              onClick={() => handleSearchCompound(chemQuery)}
              disabled={chemLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {chemLoading ? 'Searching PubChem...' : 'Explore Compound'}
            </button>
          </div>

          {chemError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{chemError}</span>
            </div>
          )}

          {/* Compound Result Card */}
          {compoundData && (
            <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 space-y-6">
              
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                
                {/* 2D Chemical Structure Render */}
                <div className="w-full md:w-64 bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-white/10 shadow-xs flex flex-col items-center justify-center">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    2D PubChem Depiction
                  </div>
                  <img
                    src={compoundData.structureImageUrl}
                    alt={chemQuery}
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                  <div className="text-[10px] text-neutral-400 mt-2 font-mono tabular-nums">
                    CID: {compoundData.properties.CID}
                  </div>
                </div>

                {/* Primary Chemical Properties */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                        Authoritative Record · PubChem PUG REST
                      </div>
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white capitalize mt-0.5">
                        {chemQuery}
                      </h2>
                    </div>

                    <a
                      href={compoundData.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>PubChem Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Physicochemical Properties Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">Molecular Formula</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.MolecularFormula}
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">Molecular Weight</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.MolecularWeight} Da
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">Lipophilicity (XLogP)</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.XLogP ?? 'N/A'}
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">Polar Surface Area (TPSA)</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.TPSA ?? 'N/A'} Å²
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">H-Bond Donors / Acceptors</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.HBondDonorCount ?? 0} / {compoundData.properties.HBondAcceptorCount ?? 0}
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10">
                      <div className="text-[11px] text-neutral-500">Rotatable Bonds</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono tabular-nums mt-0.5">
                        {compoundData.properties.RotatableBondCount ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Canonical SMILES */}
                  <div className="p-3 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10 text-xs">
                    <div className="text-[11px] text-neutral-500 font-medium mb-1">Canonical SMILES String</div>
                    <code className="block font-mono text-[11px] text-neutral-800 dark:text-neutral-200 break-all select-all">
                      {compoundData.properties.CanonicalSMILES}
                    </code>
                  </div>

                  {/* Lipinski & Veber Heuristic Evaluation (Science Skill Rule) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className={`p-3 rounded-xl border text-xs ${compoundData.lipinskiPassed ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Lipinski Rule of 5: {compoundData.lipinskiPassed ? 'Compliant' : 'Violations Noted'}</span>
                      </div>
                      <div className="text-[11px] mt-1 text-neutral-600 dark:text-neutral-400">
                        {compoundData.lipinskiViolations.length === 0 
                          ? 'Zero violations (ideal small molecule bioavailability).' 
                          : compoundData.lipinskiViolations.join(', ')}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs ${compoundData.veberPassed ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Veber Oral Bioavailability: {compoundData.veberPassed ? 'Compliant' : 'Violations'}</span>
                      </div>
                      <div className="text-[11px] mt-1 text-neutral-600 dark:text-neutral-400">
                        {compoundData.veberViolations.length === 0 
                          ? 'Meets rotatable bonds (≤10) and TPSA (≤140 Å²) criteria.' 
                          : compoundData.veberViolations.join(', ')}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Tab 2: UniProt & AlphaFold DB Proteins */}
      {activeTab === 'proteins' && (
        <div className="space-y-4">
          
          {/* Quick-Try Example Bar */}
          <div className="ios-glass p-4 rounded-xl border border-white/40 dark:border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-1">
              Sample Biomolecular Targets:
            </span>
            {PRESET_PROTEINS.map(preset => (
              <button
                key={preset.accession}
                onClick={() => {
                  setProteinQuery(preset.accession);
                  handleSearchProtein(preset.accession);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                  proteinQuery.toUpperCase() === preset.accession
                    ? 'bg-emerald-800 text-white font-medium shadow-xs'
                    : 'bg-neutral-100/80 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/80'
                }`}
              >
                <span>{preset.accession}</span>
                <span className="text-[10px] opacity-75 ml-1">({preset.name.split(' ')[0]})</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={proteinQuery}
                onChange={e => setProteinQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchProtein(proteinQuery)}
                placeholder="Enter UniProtKB Accession (e.g. 'P00875' for Spinach RuBisCO, 'P42212' for GFP)..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-mono uppercase"
              />
            </div>
            <button
              onClick={() => handleSearchProtein(proteinQuery)}
              disabled={proteinLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {proteinLoading ? 'Querying UniProt...' : 'Fetch Structure'}
            </button>
          </div>

          {proteinError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{proteinError}</span>
            </div>
          )}

          {/* Protein Result Card */}
          {proteinData && (
            <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    UniProtKB Annotated Record · {proteinData.accession}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                    {proteinData.recommendedName}
                  </h2>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                    <span className="italic">{proteinData.organism}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{proteinData.sequenceLength} amino acids</span>
                  </div>
                </div>

                <a
                  href={proteinData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-500 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors shrink-0"
                >
                  <span>UniProt Entry</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {proteinData.functionSummary && (
                <div className="p-4 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <div className="font-semibold text-neutral-900 dark:text-white mb-1">Biological Function</div>
                  <p>{proteinData.functionSummary}</p>
                </div>
              )}

              {/* AlphaFold DB Structure Section (Science Skill Mandate) */}
              <div className="p-5 bg-neutral-50/80 dark:bg-white/5 rounded-xl border border-neutral-200/60 dark:border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>AlphaFold DB 3D Structure Prediction</span>
                    </h3>
                    <div className="text-xs text-neutral-500">
                      DeepMind AlphaFold computational structural model
                    </div>
                  </div>

                  {proteinData.alphafold && (
                    <div className="flex items-center gap-2">
                      <a
                        href={proteinData.alphafold.cifUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        Download mmCIF (.cif)
                      </a>
                      <a
                        href={proteinData.alphafold.pdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        Download PDB (.pdb)
                      </a>
                    </div>
                  )}
                </div>

                {/* Canonical 4-Band AlphaFold pLDDT Confidence Scale (Mandatory Science Skill Rule) */}
                <div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    AlphaFold pLDDT Confidence Spectrum:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-[#0053D6]/30 bg-[#0053D6]/10 text-neutral-900 dark:text-white">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" />
                        <span>Very High (&gt;90)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">High accuracy active sites</div>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#65CBF3]/30 bg-[#65CBF3]/10 text-neutral-900 dark:text-white">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" />
                        <span>Confident (70–90)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Reliable backbone fold</div>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#FFDB13]/30 bg-[#FFDB13]/10 text-neutral-900 dark:text-white">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" />
                        <span>Low (50–70)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Loop or flexible linkers</div>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#FF7D45]/30 bg-[#FF7D45]/10 text-neutral-900 dark:text-white">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" />
                        <span>Very Low (&lt;50)</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Intrinsically disordered</div>
                    </div>
                  </div>
                </div>

                {proteinData.alphafold?.paeImageUrl && (
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Predicted Aligned Error (PAE) Domain Matrix
                    </div>
                    <img
                      src={proteinData.alphafold.paeImageUrl}
                      alt="AlphaFold PAE matrix"
                      className="w-48 h-48 rounded-lg border border-neutral-200 dark:border-white/10"
                    />
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* Community Equipment Sharing Notice */}
      <div className="ios-glass p-5 rounded-2xl border border-white/40 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white">
              Perform Real Biological Testing in the Community
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Residents can borrow our digital 1000x cell microscope, soil NPK/pH sensors, and water purity meters for free.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('Bioscience & Lab');
            setActiveView('browse');
          }}
          className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>View Available Lab Equipment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

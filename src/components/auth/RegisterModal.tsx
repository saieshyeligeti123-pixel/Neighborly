import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, ShieldCheck, Check, UploadCloud } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('Tower D');
  const [flatNumber, setFlatNumber] = useState('');
  const [residentType, setResidentType] = useState<'Owner' | 'Tenant'>('Owner');
  const [documentUploaded, setDocumentUploaded] = useState(true);
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'resident',
      communityId: 'Green Meadows Gated Community',
      block: block.trim(),
      flatNumber: flatNumber.trim(),
      residentType,
      bio: bio.trim(),
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Resident Registration (FR-01)</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Green Meadows Community Verification System</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Registration Submitted!</h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Your account has been created with <strong>Pending Verification (FR-02)</strong>. Community Administrator Mrs. L. Devi has been notified to verify your property documentation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
              <span className="font-semibold text-neutral-800">Security Rule (FR-02):</span> To ensure neighborhood trust, all new resident accounts require verification by the Community Management Office before borrowing or lending items.
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Full Legal Name *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Ananya Sen"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Email Address *
                </label>
                <input 
                  type="email"
                  required
                  placeholder="ananya@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Phone Number *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Tower / Block *
                </label>
                <select
                  value={block}
                  onChange={e => setBlock(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Tower A">Tower A</option>
                  <option value="Tower B">Tower B</option>
                  <option value="Tower C">Tower C</option>
                  <option value="Tower D">Tower D</option>
                  <option value="Villas">Villas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Flat No *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. D-502"
                  value={flatNumber}
                  onChange={e => setFlatNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Resident Type
                </label>
                <select
                  value={residentType}
                  onChange={e => setResidentType(e.target.value as any)}
                  className="w-full px-2.5 py-2 text-xs border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
            </div>

            {/* Verification Document Upload Mock */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Property Verification Document (Proof of Residence)
              </label>
              <div className="p-3 border border-dashed border-neutral-300 rounded-md bg-neutral-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs text-neutral-700 font-medium">
                    GreenMeadows_LeaseOrTitleDeed_Doc.pdf
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">Attached</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                About Yourself / Household
              </label>
              <textarea 
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell neighbors a little about your interests or tools you can share..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Complete Registration (FR-01)
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

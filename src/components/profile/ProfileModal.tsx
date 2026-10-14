import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, MapPin, ShieldCheck, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [block, setBlock] = useState(currentUser.block);
  const [flatNumber, setFlatNumber] = useState(currentUser.flatNumber);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      block: block.trim(),
      flatNumber: flatNumber.trim(),
      bio: bio.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Resident Profile (FR-04)</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Manage your community identity and contact</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Verification Badge */}
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-500">Status:</span>{' '}
              <strong className="text-neutral-900 capitalize">{currentUser.verificationStatus}</strong>
            </div>
            <div className="flex items-center text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>{currentUser.communityId}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Full Legal Name
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Tower / Block
              </label>
              <input 
                type="text"
                required
                value={block}
                onChange={e => setBlock(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Flat / Door No
              </label>
              <input 
                type="text"
                required
                value={flatNumber}
                onChange={e => setFlatNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Phone Number
            </label>
            <input 
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Community Bio & Resources Note
            </label>
            <textarea 
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell neighbors what tools or household items you typically lend..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Update Profile (FR-04)</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

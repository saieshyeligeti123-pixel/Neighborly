import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemCategory } from '../../types';
import { X, Plus, Image as ImageIcon, ShieldCheck, Check } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Cordless Power Drill Set', url: '/src/assets/images/item_powertool_drill_1791988686272.jpg' },
  { label: 'Indian Stone Wet Grinder / Kitchen', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Brass Pooja Diya & Urli Set', url: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80' },
  { label: 'Outdoor Camping Tent Gear', url: '/src/assets/images/item_camping_gear_1791988687135.jpg' },
  { label: 'High Pressure Washer Unit', url: '/src/assets/images/item_pressure_washer_1791988687655.jpg' },
  { label: 'Portable 4K Theater Projector', url: '/src/assets/images/item_projector_cinema_1791988687836.jpg' },
  { label: 'Compound Lab Microscope', url: '/src/assets/images/item_microscope_lab_1791990463170.jpg' },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addItem } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Power Tools');
  const [condition, setCondition] = useState<'Like New' | 'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [rentalPricePerDay, setRentalPricePerDay] = useState<number>(0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [locationInstructions, setLocationInstructions] = useState(
    `Pickup at ${currentUser.block}, Flat ${currentUser.flatNumber} or Clubhouse Desk.`
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an item title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description of the item.');
      return;
    }

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : imageUrl;

    addItem({
      title: title.trim(),
      description: description.trim(),
      category,
      imageUrl: finalImage,
      rentalPricePerDay: Number(rentalPricePerDay),
      securityDeposit: Number(securityDeposit),
      condition,
      availability: 'available',
      locationInstructions: locationInstructions.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">List Resource for Community (FR-05)</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Share with verified residents of Green Meadows</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
              {error}
            </div>
          )}

          {/* Item Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Resource Name / Title *
            </label>
            <input 
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Bosch Professional SDS Hammer Drill Kit"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Category *
              </label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Indian Household & Kitchen">Indian Household & Kitchen</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Camping & Outdoors">Camping & Outdoors</option>
                <option value="Cleaning & Washers">Cleaning & Washers</option>
                <option value="Audio & Visual">Audio & Visual</option>
                <option value="Gardening">Gardening</option>
                <option value="Home & DIY">Home & DIY</option>
                <option value="Bioscience & Lab">Bioscience & Lab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Condition *
              </label>
              <select 
                value={condition}
                onChange={e => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Pricing: Rental Price & Security Deposit in ₹ */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Daily Rental Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-500">₹</span>
                <input 
                  type="number"
                  min="0"
                  step="10"
                  value={rentalPricePerDay}
                  onChange={e => setRentalPricePerDay(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                Set ₹0 for free community borrowing
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Security Deposit (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-500">₹</span>
                <input 
                  type="number"
                  min="0"
                  step="50"
                  value={securityDeposit}
                  onChange={e => setSecurityDeposit(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                Held in escrow, refunded on return
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Description & Inclusions *
            </label>
            <textarea 
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe accessories included, specifications, and proper usage tips..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Select Resource Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative aspect-[4/3] rounded border cursor-pointer overflow-hidden ${imageUrl === preset.url && !customImageUrl ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-neutral-200 opacity-80 hover:opacity-100'}`}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.label} 
                    className="w-full h-full object-cover"
                  />
                  {imageUrl === preset.url && !customImageUrl && (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input 
              type="url"
              placeholder="Or enter custom image URL"
              value={customImageUrl}
              onChange={e => setCustomImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Location / Handover Instructions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Handover & Pickup Instructions
            </label>
            <input 
              type="text"
              value={locationInstructions}
              onChange={e => setLocationInstructions(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
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
              Publish Listing (FR-05)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

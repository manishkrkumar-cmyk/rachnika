import React from 'react';
import { CATEGORIES } from '../../utils/constants';

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  const isAllSelected = selectedCategory === null || selectedCategory === 'ALL';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2.5 mb-4 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
      {/* All Crafts Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 text-xs font-bold rounded-md whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
          isAllSelected
            ? 'bg-[#2874f0] text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 hover:text-[#2874f0]'
        }`}
      >
        <span>🌟</span>
        <span>All Products</span>
      </button>

      {/* Art & Craft Categories */}
      {CATEGORIES && CATEGORIES.map((cat) => {
        const isSelected = String(selectedCategory) === String(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition cursor-pointer ${
              isSelected
                ? 'bg-[#2874f0] text-white shadow-sm font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-[#2874f0]'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
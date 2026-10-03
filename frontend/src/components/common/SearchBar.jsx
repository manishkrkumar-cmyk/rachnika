import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <form onSubmit={onSearch} className="flex-1 max-w-2xl relative">
      <input
        type="text"
        placeholder="Search for products, brands and more"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white text-slate-800 text-sm py-2 pl-4 pr-10 rounded-sm focus:outline-none shadow-sm placeholder-slate-400"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 bottom-0 px-3 text-[#2874f0] hover:text-blue-700 flex items-center justify-center cursor-pointer"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-xs font-semibold">{message}</p>
    </div>
  );
}
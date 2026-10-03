import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-slate-400 text-xs py-8 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h4 className="text-slate-200 font-bold uppercase mb-2">About</h4>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Rachnika Stories</li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold uppercase mb-2">Help</h4>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">Payments</li>
            <li className="hover:underline cursor-pointer">Shipping</li>
            <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold uppercase mb-2">Policy</h4>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">Return Policy</li>
            <li className="hover:underline cursor-pointer">Terms Of Use</li>
            <li className="hover:underline cursor-pointer">Security</li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold uppercase mb-2">Social</h4>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">Twitter</li>
            <li className="hover:underline cursor-pointer">YouTube</li>
            <li className="hover:underline cursor-pointer">Instagram</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-700 text-center text-[11px]">
        © 2026 Rachnika. All rights reserved.
      </div>
    </footer>
  );
}
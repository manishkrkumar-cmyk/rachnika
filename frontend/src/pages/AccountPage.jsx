import React from 'react';
import { 
  Sparkles, 
  Package, 
  Heart, 
  MapPin, 
  Store, 
  ShieldCheck, 
  Smartphone, 
  LogOut, 
  Palette, 
  MessageSquare, 
  ChevronRight, 
  Award,
  ScrollText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function AccountPage({ currentUser, onNavigate, onLogout }) {
  const user = currentUser || {
    name: 'Artisan Collector',
    phone: '9876543210',
    email: 'collector@rachnika.in'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans antialiased text-stone-800">
      
      {/* 1. Header Profile & Artisan Guild Card */}
      <div className="bg-gradient-to-r from-stone-900 via-[#8B3A2B] to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-amber-900/40">
        
        {/* Background Subtle Motif */}
        <div className="absolute right-4 -bottom-6 text-9xl opacity-15 select-none pointer-events-none">
          🏺
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 font-serif font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-200">
              {user.name ? user.name.charAt(0).toUpperCase() : 'र'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-50">
                  {user.name}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Kala Sanrakshak
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 font-mono">
                +91 {user.phone} • {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-300" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Guild Patron Perks Strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-stone-300 text-[11px] block">Artisan Patronage</span>
            <strong className="text-amber-300 font-bold text-sm">Direct Maker Support</strong>
          </div>
          <div>
            <span className="text-stone-300 text-[11px] block">Verified Authenticity</span>
            <strong className="text-amber-300 font-bold text-sm">100% Handcrafted</strong>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-stone-300 text-[11px] block">Fragile Protection</span>
            <strong className="text-emerald-400 font-bold text-sm">Multi-Layer Guarantee</strong>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="bg-white border border-stone-200/90 hover:border-amber-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 block">My Orders</span>
          <span className="text-[10px] text-stone-500">Track shipments</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('store')}
          className="bg-white border border-stone-200/90 hover:border-amber-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 block">Wishlist</span>
          <span className="text-[10px] text-stone-500">Saved craftworks</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('seller')}
          className="bg-white border border-stone-200/90 hover:border-amber-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 block">Seller Studio</span>
          <span className="text-[10px] text-stone-500">Artisan dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="bg-white border border-stone-200/90 hover:border-amber-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-stone-900 block">Studio Care</span>
          <span className="text-[10px] text-stone-500">Artisan queries</span>
        </button>
      </div>

      {/* 3. Detailed Setting Modules */}
      <div className="space-y-6">
        
        {/* Section A: Artisan Studio & Craft Activities */}
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-900" /> Artisan & Studio Activities
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            <div 
              onClick={() => onNavigate('seller')}
              className="p-4 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Become a Verified Rachnika Artisan</strong>
                  <span className="text-stone-500 text-[11px]">List handloom textiles, terracotta pottery, and folk art without commission fees</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>

            <div 
              onClick={() => onNavigate('orders')}
              className="p-4 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ScrollText className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Custom Commission Requests</strong>
                  <span className="text-stone-500 text-[11px]">Track bespoke size or personalized portrait orders from Indian folk artists</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Section B: Delivery & Account Settings */}
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-900" /> Delivery Destinations & Security
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            <div 
              onClick={() => onNavigate('checkout')}
              className="p-4 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Saved Delivery Addresses</strong>
                  <span className="text-stone-500 text-[11px]">Electronic City, Bengaluru, Karnataka - 560100</span>
                </div>
              </div>
              <span className="text-amber-900 font-bold text-[11px] uppercase">Edit</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Active Device Login</strong>
                  <span className="text-stone-500 text-[11px]">Logged in securely via BCrypt session on this device</span>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                CURRENT DEVICE
              </span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Artisan Trust & Fair Trade Pledge</strong>
                  <span className="text-stone-500 text-[11px]">Direct maker payouts & eco-friendly packaging compliance</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Section C: Support & Sign Out */}
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-stone-100 text-xs">
            <div 
              onClick={() => onNavigate('orders')}
              className="p-4 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <div>
                  <strong className="block text-stone-900">Help & Artisan Care Desk</strong>
                  <span className="text-stone-500 text-[11px]">Direct chat for damaged fragile parcels, returns, or artisan contact</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>

            <div className="p-4 flex items-center justify-between bg-stone-50/50">
              <div>
                <span className="text-stone-500 text-[11px]">Rachnika Handcrafted Engine v2.4</span>
                <p className="text-[11px] text-stone-400">Authentic Indian Crafts • Fair Trade Verified</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="text-red-700 hover:text-red-800 font-bold text-xs uppercase px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
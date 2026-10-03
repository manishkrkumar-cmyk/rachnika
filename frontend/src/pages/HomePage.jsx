import React, { useState } from 'react';
import CategoryBar from '../components/product/CategoryBar';
import ProductCard from '../components/product/ProductCard';
import { Sparkles, ShieldCheck, HeartHandshake, Truck, RefreshCw } from 'lucide-react';

export default function HomePage({ products = [], onSelectProduct, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = selectedCategory
    ? products.filter((p) => String(p.categoryId) === String(selectedCategory))
    : products;

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        
        {/* Category Navigation Strip */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Artisan Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-[#8B3A2B] to-stone-900 text-white p-6 sm:p-10 mb-8 shadow-md">
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Curated Indian Craftsmanship
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold leading-tight text-amber-50">
              Handmade Treasures Directly from Master Artisans
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Explore authentic Madhubani paintings, terracotta clayware, handwoven textiles, and bespoke resin creations delivered straight from the craftsman's studio.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(1)}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold px-5 py-2.5 rounded-full transition shadow cursor-pointer"
              >
                Explore Paintings
              </button>
              <button
                onClick={() => onNavigate && onNavigate('seller')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer"
              >
                Join as an Artisan
              </button>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 select-none hidden md:block">
            🏺
          </div>
        </div>

        {/* Artisan Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs text-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-stone-900 font-bold">100% Genuine Crafts</strong>
              <span className="text-stone-500 text-[11px]">Direct maker attribution</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-stone-900 font-bold">Fragile Safe Transit</strong>
              <span className="text-stone-500 text-[11px]">Multi-layered eco-wrap</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-stone-900 font-bold">Fair Artisan Wages</strong>
              <span className="text-stone-500 text-[11px]">Zero middleman exploitation</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-stone-900 font-bold">Secure Checkout</strong>
              <span className="text-stone-500 text-[11px]">UPI, Cards & COD Verified</span>
            </div>
          </div>
        </div>

        {/* Craft Listings Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Handcrafted Collections</span>
              <span className="text-xs font-normal text-stone-500">
                ({filtered.length} {filtered.length === 1 ? 'item' : 'items'} available)
              </span>
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="text-sm font-bold text-stone-900">No craft items found in this collection</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">Try selecting another craft category or browse all works.</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-amber-900 text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-amber-950 transition cursor-pointer"
            >
              View All Crafts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
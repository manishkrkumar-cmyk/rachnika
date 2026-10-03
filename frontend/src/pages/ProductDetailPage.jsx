import React from 'react';
import { Star, ShieldCheck, Zap, ArrowLeft, ShoppingCart, Bolt } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductDetailPage({ product, onBack, onAddToCart, onBuyNow }) {
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      <button
        onClick={onBack}
        className="text-xs font-bold text-slate-600 hover:text-[#2874f0] flex items-center gap-1 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          <div className="w-full h-80 flex items-center justify-center p-4 border rounded-md bg-slate-50">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#ff9f00] hover:bg-[#e89000] text-white font-bold py-3 rounded text-sm uppercase flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(product)}
              className="bg-[#fb641b] hover:bg-[#e85a15] text-white font-bold py-3 rounded text-sm uppercase flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Bolt className="w-4 h-4" /> Buy Now
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-slate-800 leading-snug">{product.title}</h1>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
              {product.rating || '4.2'} <Star className="w-3 h-3 fill-current" />
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              ({product.reviewsCount || 10} ratings)
            </span>
            <span className="text-xs font-bold text-[#2874f0] italic flex items-center ml-2">
              <Zap className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500 mr-0.5" /> Assured
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Description & Specifications</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || 'No description provided by the seller.'}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>1 Year Manufacturer Warranty for Device and 6 Months for In-Box Accessories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onProductClick }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents navigating to product detail view
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-700/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between p-3.5 cursor-pointer"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3 flex items-center justify-center">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Authentic Handmade Badge */}
          <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Handmade
          </span>

          {/* Discount Tag */}
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Category & Title */}
        <div className="space-y-1">
          <p className="text-[10px] text-amber-900 font-bold tracking-wider uppercase">
            {product.categoryName || 'Artisan Collection'}
          </p>

          <h3 className="text-xs font-bold text-stone-900 line-clamp-2 group-hover:text-amber-900 transition leading-snug">
            {product.title}
          </h3>

          {/* Artisan Review & Rating Badge */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              <Star className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
              <span>{product.rating || '4.8'}</span>
            </span>
            <span className="text-[10px] text-stone-400">
              ({product.reviewsCount || 24} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add To Basket Action */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-stone-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-stone-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[9px] text-emerald-700 font-semibold block">
            Free Fragile Delivery
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
            added
              ? 'bg-emerald-700 text-white'
              : 'bg-amber-900 hover:bg-amber-950 text-white'
          }`}
          title="Add to Basket"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
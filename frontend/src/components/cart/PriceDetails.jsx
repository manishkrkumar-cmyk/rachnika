import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-slate-200 bg-white">
      {/* Product Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center bg-slate-50 border rounded p-1">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">Seller: Rachnika Retail Verified</p>
          
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-slate-900">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
              </span>
            )}
            {item.discount > 0 && (
              <span className="text-xs font-bold text-emerald-600">{item.discount}% Off</span>
            )}
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-slate-300 rounded">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, -1)}
              className="px-2.5 py-0.5 hover:bg-slate-100 font-bold text-slate-600 cursor-pointer"
            >
              -
            </button>
            <span className="px-3 py-0.5 text-xs font-bold border-x border-slate-300">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, 1)}
              className="px-2.5 py-0.5 hover:bg-slate-100 font-bold text-slate-600 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
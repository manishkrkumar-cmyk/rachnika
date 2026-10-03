import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartPage({ onNavigateToStore, onNavigateToCheckout }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const totalAmount = getCartTotal ? getCartTotal() : 0;
  const originalTotal = cartItems.reduce((acc, item) => {
    const orig = item.originalPrice || item.price || 0;
    return acc + orig * (item.quantity || 1);
  }, 0);
  const totalSavings = originalTotal > totalAmount ? originalTotal - totalAmount : 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-slate-200">
          <div className="w-20 h-20 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty!</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Explore our curated products and add items to your cart.
          </p>
          <button
            onClick={onNavigateToStore}
            className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs uppercase px-8 py-3 rounded shadow transition cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-t-lg border border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <h1 className="text-base font-bold text-slate-800">
              Flipkart Cart ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </h1>
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-b-lg divide-y divide-slate-100 shadow-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded border border-slate-200 flex-shrink-0"
                />

                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-bold text-slate-900">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                    )}
                    {item.discount > 0 && (
                      <span className="text-xs font-bold text-emerald-600">{item.discount}% off</span>
                    )}
                  </div>

                  {/* Quantity and Remove buttons */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-slate-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-slate-800">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>REMOVE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center shadow-sm">
            <button
              onClick={onNavigateToStore}
              className="text-xs font-semibold text-[#2874f0] hover:underline cursor-pointer"
            >
              ← Continue Shopping
            </button>
            <button
              onClick={onNavigateToCheckout}
              className="bg-[#fb641b] hover:bg-[#e85a15] text-white font-bold text-sm uppercase px-8 py-3 rounded shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Price Details */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              Price Details
            </h2>

            <div className="space-y-3 py-3 text-sm border-b border-slate-100">
              <div className="flex justify-between text-slate-700">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>- ₹{totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Delivery Charges</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-slate-900 py-3 border-b border-slate-100">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {totalSavings > 0 && (
              <p className="text-xs font-bold text-emerald-600 pt-3">
                You will save ₹{totalSavings.toFixed(2)} on this order
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
            <ShieldCheck className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic products.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
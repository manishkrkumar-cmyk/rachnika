import React from 'react';
import { Search, ShoppingBag, Store, Package, Sparkles, User, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar({ 
  onNavigate, 
  currentTab, 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  currentUser 
}) {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(e);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#8B3A2B] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-[#8B3A2B] flex items-center justify-center font-serif font-black text-xl shadow-inner group-hover:rotate-6 transition">
              र
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                Rachnika
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </span>
              <span className="block text-[10px] text-amber-200 tracking-wider uppercase font-semibold">
                HANDMADE & ARTISAN CRAFTS
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleFormSubmit} className="flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Madhubani, terracotta pottery, handloom rugs, candles..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] text-stone-900 rounded-full pl-11 pr-20 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />

              <div className="absolute right-1.5 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs transition cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Action Navigation: Become a Seller | Orders | Account/Login | Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold">
            
            {/* 1. Become a Seller */}
            <button
              type="button"
              onClick={() => onNavigate('seller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition cursor-pointer ${
                currentTab === 'seller' ? 'bg-white/20 text-white font-bold' : 'hover:bg-white/10 text-amber-100'
              }`}
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span className="whitespace-nowrap">Become a Seller</span>
            </button>

            {/* 2. Orders */}
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition cursor-pointer ${
                currentTab === 'orders' ? 'bg-white/20 text-white font-bold' : 'hover:bg-white/10 text-amber-100'
              }`}
            >
              <Package className="w-4 h-4 text-amber-300" />
              <span>Orders</span>
            </button>

            {/* 3. Account / Login Pill */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => onNavigate('account')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition cursor-pointer border ${
                  currentTab === 'account'
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                    : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-amber-300 text-stone-900 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[85px] truncate">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition cursor-pointer ${
                  currentTab === 'login'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-amber-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>Login</span>
              </button>
            )}

            {/* 4. Cart */}
            <button
              type="button"
              onClick={() => onNavigate('cart')}
              className={`relative flex items-center gap-1.5 font-bold px-4 py-1.5 rounded-full transition cursor-pointer shadow-sm ml-1 ${
                currentTab === 'cart'
                  ? 'bg-amber-300 text-[#8B3A2B]'
                  : 'bg-amber-400 hover:bg-amber-300 text-[#8B3A2B]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#8B3A2B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleFormSubmit} className="pb-3 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search handcrafted items..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] text-stone-900 rounded-full pl-10 pr-16 py-2 text-xs focus:outline-none placeholder:text-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 bg-amber-900 text-white text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}
import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { productApi } from './api/productApi';
import Navbar from './components/common/Navbar';
import ProductCard from './components/product/ProductCard';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerStudioPage from './pages/SellerStudioPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import Footer from './components/common/Footer';
import CategoryBar from './components/product/CategoryBar';
import { Sparkles, Truck, HeartHandshake, ShieldCheck, Palette } from 'lucide-react';

function MarketplaceApp() {
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'seller' | 'cart' | 'checkout' | 'orders' | 'login' | 'account'
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { addToCart } = useCart();

  // Load existing session on boot
  useEffect(() => {
    const savedUser = localStorage.getItem('rachnika_user_session');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAllProducts();
      setProducts(Array.isArray(data) && data.length > 0 ? data : getFallbackCrafts());
    } catch (err) {
      console.warn('Backend currently offline, using curated demo crafts catalog:', err);
      setProducts(getFallbackCrafts());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCrafts = () => [
    {
      id: 1,
      title: 'Handmade Madhubani Peacock Canvas Wall Art',
      description: 'Authentic Mithila folk painting crafted with natural dyes, twig nibs, and acrylic on primed cotton canvas.',
      price: 799,
      originalPrice: 1299,
      discount: 38,
      rating: 4.8,
      reviewsCount: 36,
      categoryId: 1,
      categoryName: 'Paintings & Wall Art',
      category: { id: 1, name: 'Paintings & Wall Art' },
      artisan: 'Mithila Folk Guild',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      stock: 12
    },
    {
      id: 2,
      title: 'Terracotta Hand-thrown Glazed Ceramic Coffee Mug Set',
      description: 'Lead-free, organic clay stoneware fired at 1200°C. Ergonomic handle and natural earthy speckled texture.',
      price: 499,
      originalPrice: 750,
      discount: 33,
      rating: 4.9,
      reviewsCount: 52,
      categoryId: 2,
      categoryName: 'Pottery & Ceramics',
      category: { id: 2, name: 'Pottery & Ceramics' },
      artisan: 'ClayRoots Studio',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
      stock: 18
    },
    {
      id: 3,
      title: 'Boho Macramé Handwoven Cotton Wall Hanging',
      description: '100% pure organic cotton twisted cord mounted on seasoned driftwood. Hand-knotted bohemian tapestry.',
      price: 649,
      originalPrice: 999,
      discount: 35,
      rating: 4.7,
      reviewsCount: 29,
      categoryId: 3,
      categoryName: 'Handmade Home Decor',
      category: { id: 3, name: 'Handmade Home Decor' },
      artisan: 'KnotCraft Collective',
      imageUrl: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600&auto=format&fit=crop&q=80',
      stock: 14
    },
    {
      id: 4,
      title: 'Sandalwood & Jasmine Hand-poured Soy Wax Candle',
      description: 'Eco-friendly soy candle infused with Mysore sandalwood essential oils and dried botanicals in amber jar.',
      price: 349,
      originalPrice: 499,
      discount: 30,
      rating: 4.6,
      reviewsCount: 41,
      categoryId: 4,
      categoryName: 'Candles & Fragrances',
      category: { id: 4, name: 'Candles & Fragrances' },
      artisan: 'Vedic Aromatics',
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
      stock: 25
    },
    {
      id: 5,
      title: 'Handloom Block-Printed Indigo Table Runner & Mats',
      description: 'Handcrafted Dabu mud resist printed table linen made by Bagru artisans using 100% natural plant dyes.',
      price: 599,
      originalPrice: 899,
      discount: 33,
      rating: 4.9,
      reviewsCount: 19,
      categoryId: 5,
      categoryName: 'Handloom & Textiles',
      category: { id: 5, name: 'Handloom & Textiles' },
      artisan: 'Chhipa Weavers',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
      stock: 10
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSelectedProduct(null);
    setActiveTab('store');

    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      const results = await productApi.searchProducts(searchQuery);
      if (Array.isArray(results) && results.length > 0) {
        setProducts(results);
      }
    } catch {
      // Local client filtering handles search automatically
    }
  };

  const handleNavigation = (tab) => {
    setSelectedProduct(null);
    setActiveTab(tab === 'home' ? 'store' : tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('rachnika_user_session');
    setCurrentUser(null);
    setActiveTab('store');
  };

  // Real-time filtering matching by product title, description, and selected category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      !selectedCategory || selectedCategory === 'ALL'
        ? true
        : String(p.category?.id ?? p.categoryId) === String(selectedCategory);

    const titleStr = (p.title || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch = !query || titleStr.includes(query) || descStr.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans antialiased text-stone-800">
      <div>
        <Navbar
          activeTab={activeTab}
          currentTab={activeTab === 'store' ? 'home' : activeTab}
          setActiveTab={handleNavigation}
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          currentUser={currentUser}
        />

        <main className="pb-16">
          {/* 1. Account Details Page */}
          {activeTab === 'account' && (
            <AccountPage
              currentUser={currentUser}
              onNavigate={handleNavigation}
              onLogout={handleLogout}
            />
          )}

          {/* 2. Login & Registration Page */}
          {activeTab === 'login' && (
            <LoginPage
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setActiveTab('account');
              }}
              onBackToStore={() => setActiveTab('store')}
            />
          )}

          {/* 3. Seller Studio */}
          {activeTab === 'seller' && (
            <SellerStudioPage
              onProductCreated={() => {
                loadProducts();
                setActiveTab('store');
              }}
            />
          )}

          {/* 4. Product Detail View */}
          {selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={(item) => addToCart(item)}
              onBuyNow={(item) => {
                addToCart(item);
                setSelectedProduct(null);
                setActiveTab('checkout');
              }}
            />
          )}

          {/* 5. Main Catalog Store */}
          {activeTab === 'store' && !selectedProduct && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Hero Banner */}
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
                      type="button"
                      onClick={() => setSelectedCategory(1)}
                      className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold px-5 py-2.5 rounded-full transition shadow cursor-pointer"
                    >
                      Explore Paintings
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('seller')}
                      className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer"
                    >
                      Become a Seller
                    </button>
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 select-none hidden md:block">
                  🏺
                </div>
              </div>

              {/* Guarantees */}
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
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold">Fair Artisan Wages</strong>
                    <span className="text-stone-500 text-[11px]">Zero middleman fees</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold">Secure Checkout</strong>
                    <span className="text-stone-500 text-[11px]">UPI, Cards & COD</span>
                  </div>
                </div>
              </div>

              {/* Product Gallery Grid */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-900" />
                  <span>
                    {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Handcrafted Collections'}
                  </span>
                  <span className="text-xs font-normal text-stone-500">
                    ({filteredProducts.length} items)
                  </span>
                </h2>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-24 text-center text-stone-500 text-sm font-semibold">
                  Curating artisan crafts...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs my-4">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-sm font-bold text-stone-900">
                    No crafts found matching your criteria
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="mt-3 bg-amber-900 hover:bg-amber-950 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow cursor-pointer"
                  >
                    View All Crafts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(item) => addToCart(item || product)}
                      onProductClick={(item) => setSelectedProduct(item || product)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. Cart View */}
          {activeTab === 'cart' && (
            <CartPage
              onNavigateToStore={() => setActiveTab('store')}
              onNavigateToCheckout={() => setActiveTab('checkout')}
              onContinueShopping={() => setActiveTab('store')}
              onProceedToCheckout={() => setActiveTab('checkout')}
            />
          )}

          {/* 7. Checkout View */}
          {activeTab === 'checkout' && (
            <CheckoutPage
              onNavigateToStore={() => setActiveTab('store')}
              onCancel={() => setActiveTab('cart')}
              onOrderSuccess={(order) => {
                setLastOrder(order);
                setActiveTab('orders');
              }}
            />
          )}

          {/* 8. Orders View */}
          {activeTab === 'orders' && (
            <OrdersPage
              lastOrder={lastOrder}
              onShopMore={() => setActiveTab('store')}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MarketplaceApp />
      </CartProvider>
    </AuthProvider>
  );
}
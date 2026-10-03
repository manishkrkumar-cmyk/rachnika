import React from 'react';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';

export default function ProductGrid({ products, loading, onAddToCart, onOpenDetail }) {
  if (loading) {
    return <Loader message="Fetching products from store..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center my-6">
        <p className="text-slate-600 font-semibold">No products listed in this section.</p>
        <p className="text-xs text-slate-400 mt-1">Sellers can add products using the "Become a Seller" button.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}
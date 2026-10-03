import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rachnika_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rachnika_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Number(item.quantity || 1) + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          ...product,
          price: Number(product.price || 0),
          originalPrice: Number(product.originalPrice || product.price || 0),
          discount: Number(product.discount || 0),
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity, 10) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('rachnika_cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => {
      const p = Number(item.price || 0);
      const q = Number(item.quantity || 1);
      return acc + p * q;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
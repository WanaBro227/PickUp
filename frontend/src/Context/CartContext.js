import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockCartItems } from '../Utils/mockData';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    } else {
      setCartItems(mockCartItems);
      localStorage.setItem('cart', JSON.stringify(mockCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((productId, quantity = 1) => {
  try {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.productId === productId
      );

      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [...prev, { productId, quantity }];
    });

  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + (item.quantity * 45000), 0); // Stub price

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};



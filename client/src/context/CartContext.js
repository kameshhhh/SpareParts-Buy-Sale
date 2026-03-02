import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data.data);
      setCartTotal(data.total);
      setCartCount(data.count);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await axios.post('/api/cart', { productId, quantity });
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return false;
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      await axios.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      await axios.delete('/api/cart');
      setCart([]);
      setCartTotal(0);
      setCartCount(0);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartCount, fetchCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

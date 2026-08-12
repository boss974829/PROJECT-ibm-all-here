import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const data = await api.getCart();
      setItems(data);
    } catch {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await api.addToCart(productId, quantity);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await api.updateCartItem(cartItemId, quantity);
    await refreshCart();
  };

  const removeItem = async (cartItemId) => {
    await api.removeCartItem(cartItemId);
    await refreshCart();
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, refreshCart, addToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

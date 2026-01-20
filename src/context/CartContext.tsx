import React, { createContext, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variantId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item => item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: Math.random().toString(36), productId: product.id, variantId, quantity, product }];
    });
  };

  const removeFromCart = (variantId: string) => setCart(prev => prev.filter(item => item.variantId !== variantId));
  const updateQuantity = (variantId: string, delta: number) => {
    setCart(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const clearCart = () => setCart([]);
  const totalPrice = cart.reduce((acc, item) => {
    const variant = item.product.variants.find(v => v.id === item.variantId);
    return acc + (variant ? variant.price * item.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems: cart.reduce((a,c)=>a+c.quantity,0), totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
import React, { createContext, useState } from 'react';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

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
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    // Stock Check
    const currentInCart = cart.find(i => i.variantId === variantId)?.quantity || 0;
    if (currentInCart + quantity > variant.stock) {
      toast.error(`Out of Stock! Only ${variant.stock} available.`);
      return;
    }

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
    setCart(prev => prev.map(item => {
      if (item.variantId !== variantId) return item;
      
      const newQty = item.quantity + delta;
      const variant = item.product.variants.find(v => v.id === variantId);
      
      if (variant && newQty > variant.stock) {
        toast.error("Max stock reached");
        return item;
      }
      return { ...item, quantity: Math.max(1, newQty) };
    }));
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
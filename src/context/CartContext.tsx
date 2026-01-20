import React, { createContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('supr_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('supr_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    // 1. Check if we already have this item to calculate total proposed quantity
    const existingItem = cart.find(item => item.productId === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQty + quantity;

    // 2. Validate Stock
    if (newTotalQty > product.stock) {
      toast.error(`Sorry, only ${product.stock} units available in stock!`);
      return;
    }

    setCart(prev => {
      if (existingItem) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: newTotalQty }
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
        productId: product.id, 
        quantity, 
        product 
      }];
    });
    
    // Only show success toast if not updating via + button in cart (usually addToCart is from product page)
    toast.success('Added to Cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // 1. Handle removal
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    // 2. Find the product to check stock
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    // 3. Validate Stock
    if (quantity > item.product.stock) {
      toast.error(`Max stock reached (${item.product.stock})`);
      return;
    }

    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean; // Added State
  setIsCartOpen: (open: boolean) => void; // Added Setter
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  validateStock: () => Promise<boolean>;
  total: number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // UI State moved here

  useEffect(() => {
    const savedCart = localStorage.getItem('supr_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('supr_cart', JSON.stringify(cart));
  }, [cart]);

  const validateStock = async (): Promise<boolean> => {
    let isValid = true;
    const updatedCart = [...cart];
    if (updatedCart.length === 0) return true;

    const productIds = cart.map(item => item.productId);
    const { data: products } = await supabase
      .from('products')
      .select('id, stock, name, price, is_deleted')
      .in('id', productIds);

    if (!products) return true;

    for (let i = 0; i < updatedCart.length; i++) {
      const item = updatedCart[i];
      const remoteProduct = products.find(p => p.id === item.productId);

      if (!remoteProduct || remoteProduct.is_deleted) {
        toast.error(`${item.product.name} is no longer available.`);
        updatedCart.splice(i, 1);
        i--;
        isValid = false;
        continue;
      }

      if (remoteProduct.stock < item.quantity) {
        toast.error(`Stock update: Only ${remoteProduct.stock} left of ${item.product.name}.`);
        if (remoteProduct.stock === 0) {
          updatedCart.splice(i, 1);
          i--;
        } else {
          updatedCart[i].quantity = remoteProduct.stock;
        }
        isValid = false;
      }
      
      if (remoteProduct.price !== item.product.price) {
          updatedCart[i].product.price = remoteProduct.price;
      }
    }

    if (!isValid) setCart(updatedCart);
    return isValid;
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find(item => item.productId === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    
    if (currentQty + quantity > product.stock) {
      toast.error(`Sorry, only ${product.stock} units available!`);
      return;
    }

    setCart(prev => {
      const newList = existingItem
        ? prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { id: product.id, productId: product.id, quantity, product }];
      return newList;
    });
    
    // Feature #6: Open Side Window automatically
    setIsCartOpen(true);
    toast.success('Added to Cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

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
    <CartContext.Provider value={{ 
      cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, validateStock, total, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};
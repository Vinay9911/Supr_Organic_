import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product, CartItem } from '../types';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext'; // Ensure you have this context
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useContext(AuthContext)!; // Start using Auth User

  // 1. INITIAL LOAD (Local or DB)
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const { data } = await supabase.from('carts').select('items').eq('user_id', user.id).single();
        if (data?.items) {
          setCart(data.items);
        } else {
          // If no DB cart, check local and sync up
          const local = localStorage.getItem('supr_cart');
          if (local) {
            const parsed = JSON.parse(local);
            setCart(parsed);
            await supabase.from('carts').upsert({ user_id: user.id, items: parsed });
          }
        }
      } else {
        const savedCart = localStorage.getItem('supr_cart');
        if (savedCart) try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
    };
    loadCart();
  }, [user]);

  // 2. PERSISTENCE (Save on Change)
  useEffect(() => {
    if (user) {
      const saveToDb = async () => {
        await supabase.from('carts').upsert({ user_id: user.id, items: cart }, { onConflict: 'user_id' });
      };
      saveToDb();
    } else {
      localStorage.setItem('supr_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // 3. REAL-TIME STOCK SYNC
  useEffect(() => {
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const updatedProduct = payload.new as Product;
        setCart(prev => {
          const needsUpdate = prev.some(item => item.productId === updatedProduct.id);
          if (!needsUpdate) return prev;

          return prev.map(item => {
            if (item.productId === updatedProduct.id) {
               // Update price dynamically
               const newItem = { ...item, product: { ...item.product, ...updatedProduct } };
               
               // Auto-reduce quantity if stock drops
               if (updatedProduct.stock < item.quantity) {
                  toast.error(`Stock alert: ${updatedProduct.name} only has ${updatedProduct.stock} left.`);
                  newItem.quantity = updatedProduct.stock;
               }
               return newItem;
            }
            return item;
          }).filter(item => item.quantity > 0); // Remove if stock hits 0
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
        updatedCart[i].quantity = remoteProduct.stock;
        isValid = false;
        if (remoteProduct.stock === 0) {
           updatedCart.splice(i, 1);
           i--;
        }
      }
      
      // Sync Price
      if (remoteProduct.price !== item.product.price) {
          updatedCart[i].product.price = remoteProduct.price;
      }
    }

    if (!isValid) setCart(updatedCart);
    return isValid;
  };

  const addToCart = async (product: Product, quantity: number) => {
    // Check Live Stock before adding
    const { data: freshProd } = await supabase.from('products').select('stock').eq('id', product.id).single();
    const actualStock = freshProd ? freshProd.stock : product.stock;

    const existingItem = cart.find(item => item.productId === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    
    if (currentQty + quantity > actualStock) {
      toast.error(`Sorry, only ${actualStock} units available right now!`);
      return;
    }

    setCart(prev => {
      const newList = existingItem
        ? prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { id: product.id, productId: product.id, quantity, product }];
      return newList;
    });
    
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
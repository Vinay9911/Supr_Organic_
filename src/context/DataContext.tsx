import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, FarmingMethod } from '../types';

interface DataContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: productsData, error } = await supabase.from('products').select(`*, product_variants(*)`);
      if (error) throw error;

      const formattedProducts: Product[] = productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category_id ? Category.MUSHROOMS : Category.SAFFRON,
        farmingMethod: p.farming_method as FarmingMethod,
        images: p.images || [],
        basePrice: p.base_price,
        isLaunchingSoon: p.is_launching_soon,
        rating: p.rating,
        reviewsCount: p.reviews_count,
        discountPercentage: p.discount_percentage,
        variants: p.product_variants.map((v: any) => ({
          id: v.id,
          weight: v.weight,
          price: v.price,
          stock: v.stock
        }))
      }));
      setProducts(formattedProducts);
    } catch (err) { console.error("Error fetching products:", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <DataContext.Provider value={{ products, loading, refreshProducts: fetchProducts }}>
      {children}
    </DataContext.Provider>
  );
};
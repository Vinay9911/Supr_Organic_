export enum Category {
  MUSHROOMS = 'Mushrooms',
  SAFFRON = 'Saffron',
}

export enum FarmingMethod {
  MODERN = 'Modern Farming',
  AEROPONIC = 'Aeroponic',
}

export type ProductStatus = 'active' | 'hidden' | 'coming_soon';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  farming_method: FarmingMethod;
  images: string[];
  price: number;        // Moved from variant
  stock: number;        // Moved from variant
  weight: string;       // Moved from variant
  status: ProductStatus; // New control field
  is_deleted: boolean;   // New soft-delete field
  rating: number;
  reviews_count: number;
  discount_percentage?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
}
export enum Category {
  MUSHROOMS = 'Mushrooms',
  SAFFRON = 'Saffron',
}

export enum FarmingMethod {
  MODERN = 'Modern Farming',
  AEROPONIC = 'Aeroponic',
}

export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  farmingMethod: FarmingMethod;
  images: string[];
  basePrice: number;
  isLaunchingSoon: boolean;
  rating: number;
  reviewsCount: number;
  discountPercentage?: number;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
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
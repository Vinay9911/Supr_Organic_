
export enum Category {
  SAFFRON = 'Saffron',
  MUSHROOMS = 'Mushrooms',
  MICROGREENS = 'Microgreens',
}

export enum FarmingMethod {
  AEROPONIC = 'Aeroponic',
  MODERN_FARMING = 'Modern Farming',
  HYDROPONIC = 'Hydroponic',
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
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
  variants: ProductVariant[];
  isLaunchingSoon: boolean;
  rating: number;
  reviewsCount: number;
  discountPercentage?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  addresses: string[];
}

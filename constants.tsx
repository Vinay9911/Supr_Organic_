
import { Category, FarmingMethod, Product } from './types';

export const SUPABASE_URL = 'https://mcohrkahvyyrtffojran.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWdkdGhzeGZtc2dkb2Fxc3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzAwNjQsImV4cCI6MjA4NDQwNjA2NH0.WERjPt79WZJjh3f2gEDpCY3JWhU1muwDZ2mlkBXokzs';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aeroponic Saffron (Grade A)',
    description: 'Ultra-pure saffron grown using advanced aeroponic technology. Zero soil contact, maximum crocin content.',
    category: Category.SAFFRON,
    farmingMethod: FarmingMethod.AEROPONIC,
    images: ['https://picsum.photos/seed/saffron1/800/800', 'https://picsum.photos/seed/saffron2/800/800'],
    basePrice: 450,
    variants: [
      { id: 'v1', weight: '0.5g', price: 450, stock: 0 },
      { id: 'v2', weight: '1g', price: 850, stock: 0 },
    ],
    isLaunchingSoon: true,
    rating: 4.9,
    reviewsCount: 0
  },
  {
    id: 'p2',
    name: 'Fresh Oyster Mushrooms',
    description: 'Velvety texture and delicate savory flavor. Grown in climate-controlled modern labs.',
    category: Category.MUSHROOMS,
    farmingMethod: FarmingMethod.MODERN_FARMING,
    images: ['https://picsum.photos/seed/oyster/800/800'],
    basePrice: 180,
    variants: [
      { id: 'v3', weight: '250g', price: 180, stock: 50 },
      { id: 'v4', weight: '500g', price: 340, stock: 30 },
    ],
    isLaunchingSoon: false,
    rating: 4.7,
    reviewsCount: 124,
    discountPercentage: 10
  },
  {
    id: 'p3',
    name: 'Shiitake Mushrooms',
    description: 'Rich, buttery, and meaty. A staple of modern healthy cuisine.',
    category: Category.MUSHROOMS,
    farmingMethod: FarmingMethod.MODERN_FARMING,
    images: ['https://picsum.photos/seed/shiitake/800/800'],
    basePrice: 350,
    variants: [
      { id: 'v5', weight: '200g', price: 350, stock: 20 },
    ],
    isLaunchingSoon: false,
    rating: 4.8,
    reviewsCount: 89
  },
  {
    id: 'p4',
    name: 'Lion\'s Mane Mushroom',
    description: 'Brain-boosting superfood. Grown using organic substrates in modern facilities.',
    category: Category.MUSHROOMS,
    farmingMethod: FarmingMethod.MODERN_FARMING,
    images: ['https://picsum.photos/seed/lionsmane/800/800'],
    basePrice: 420,
    variants: [
      { id: 'v6', weight: '200g', price: 420, stock: 15 },
    ],
    isLaunchingSoon: false,
    rating: 4.9,
    reviewsCount: 56
  },
  {
    id: 'p5',
    name: 'Button Mushrooms (Premium)',
    description: 'Clean, firm, and perfectly white. The classic choice, reimagined with modern farming.',
    category: Category.MUSHROOMS,
    farmingMethod: FarmingMethod.MODERN_FARMING,
    images: ['https://picsum.photos/seed/button/800/800'],
    basePrice: 120,
    variants: [
      { id: 'v7', weight: '250g', price: 120, stock: 100 },
      { id: 'v8', weight: '500g', price: 220, stock: 60 },
    ],
    isLaunchingSoon: false,
    rating: 4.5,
    reviewsCount: 312
  }
];

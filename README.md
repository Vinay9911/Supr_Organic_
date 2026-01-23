# 🍄 Supr Mushrooms - Premium E-Commerce Platform

A modern, full-stack e-commerce platform for selling premium lab-grown mushrooms and organic products. Built with React, TypeScript, Supabase, and Tailwind CSS.

🚀TRY IT NOW: [https://supr-mushroom.vercel.app](https://supr-mushroom.vercel.app/)


<img width="1724" height="1068" alt="Screenshot 2026-01-23 174248" src="https://github.com/user-attachments/assets/5a60143b-4c17-4174-8492-fafca21ba612" />


## 🌟 Features

### Customer Features
- **🛍️ Product Browsing**: Browse fresh mushrooms with real-time stock updates
- **🛒 Smart Shopping Cart**: Persistent cart with real-time stock validation
- **❤️ Wishlist**: Save favorite products for later
- **🎫 Coupon System**: Apply discount coupons with min order validation
- **📦 Order Tracking**: Track order status (Pending → Shipped → Delivered)
- **💳 Flexible Payment**: Support for UPI payments with proof upload & Cash on Delivery
- **🤖 AI Chef**: Generate custom recipes using your cart items (Gemini AI)
- **💬 Smart Chatbot**: AI-powered customer support + WhatsApp integration
- **👤 Guest Checkout**: Order without creating an account
- **🔐 Google OAuth**: Quick sign-in with Google

### Admin Features
- **📊 Analytics Dashboard**: Revenue tracking, order stats, and sales charts
- **📦 Order Management**: View, update, and track all orders with CSV export
- **🛍️ Product Management**: CRUD operations with image upload and compression
- **🎟️ Coupon Management**: Create and manage discount coupons
- **👥 Customer Database**: View customer order history and spending
- **🔔 Real-time Updates**: Live product stock synchronization
- **📸 Payment Verification**: View UPI payment screenshots

### Technical Highlights
- **⚡ Real-time**: Supabase real-time subscriptions for stock updates
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🎨 Smooth Animations**: Framer Motion for delightful UX
- **🔍 SEO Optimized**: JSON-LD structured data for AI search engines
- **🖼️ Image Optimization**: Automatic image compression before upload
- **🔒 Secure**: Row Level Security (RLS) policies on Supabase
- **🚀 Fast**: Optimized bundle with lazy loading

---

## 🏗️ Project Structure

```
supr-mushrooms/
├── src/
│   ├── assets/              # Images, logos, animations
│   │   ├── logo.png
│   │   └── hero-animation.gif
│   ├── components/          # Reusable React components
│   │   ├── AuthModal.tsx        # Login/Signup modal
│   │   ├── Chatbot.tsx          # AI chatbot with WhatsApp
│   │   ├── CheckoutModal.tsx    # Checkout flow with payments
│   │   ├── Footer.tsx           # Site footer
│   │   ├── LazyImage.tsx        # Lazy-loaded images
│   │   ├── Navbar.tsx           # Navigation with cart
│   │   └── SEO.tsx              # SEO meta tags & JSON-LD
│   ├── context/             # React Context API
│   │   ├── AuthContext.tsx      # User authentication
│   │   ├── CartContext.tsx      # Shopping cart logic
│   │   ├── DataContext.tsx      # Products data
│   │   └── WishlistContext.tsx  # Wishlist management
│   ├── lib/                 # Configuration & utilities
│   │   ├── config.ts            # App constants (admin email, etc.)
│   │   └── supabase.ts          # Supabase client initialization
│   ├── pages/               # Route pages
│   │   ├── AdminDashboard.tsx   # Admin panel
│   │   ├── AIChef.tsx           # Recipe generator
│   │   ├── Home.tsx             # Landing + shop
│   │   ├── OrderDetails.tsx     # Single order view
│   │   ├── ProductDetail.tsx    # Product details page
│   │   ├── ResetPassword.tsx    # Password reset
│   │   ├── UserOrders.tsx       # Customer order history
│   │   └── Wishlist.tsx         # Wishlist page
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.tsx             # React entry point
├── .env                     # Environment variables (NOT in git)
├── .gitignore
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vercel.json              # Vercel deployment config
└── vite.config.ts           # Vite bundler config
```

---

## 📦 Database Schema

### Tables Overview

#### 1. **products**
Stores all product information including pricing, stock, and images.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique product ID |
| name | text | Product name |
| description | text | Product description |
| price | numeric | Current price |
| stock | integer | Available quantity |
| weight | text | Package size (e.g., "200g") |
| status | text | `active`, `hidden`, `coming_soon` |
| images | text[] | Array of image URLs |
| category_id | uuid (FK) | Link to categories table |
| farming_method | text | "Modern Farming", etc. |
| is_deleted | boolean | Soft delete flag |
| rating | numeric | Average rating (0-5) |
| reviews_count | integer | Number of reviews |
| discount_percentage | numeric | Discount % |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update |

#### 2. **orders**
Customer orders with payment and shipping info.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Order ID |
| user_id | uuid (FK) | Registered user (NULL for guests) |
| guest_email | text | Guest checkout email |
| total_amount | numeric | Final order total |
| discount_applied | numeric | Coupon discount amount |
| status | text | `Pending`, `Shipped`, `Delivered` |
| shipping_address | text | Full delivery address |
| payment_method | text | "UPI" or "Cash on Delivery" |
| payment_proof_url | text | Screenshot URL (UPI) |
| coupon_code | text | Applied coupon |
| created_at | timestamptz | Order date |

#### 3. **order_items**
Individual products within each order.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Item ID |
| order_id | uuid (FK) | Links to orders table |
| product_id | uuid (FK) | Links to products table |
| quantity | integer | Quantity ordered |
| price_at_order | numeric | Price at checkout (snapshot) |
| product_name_snapshot | text | Product name at time of order |

#### 4. **coupons**
Discount coupons with validation rules.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Coupon ID |
| code | text | Coupon code (unique) |
| discount_percentage | integer | Discount % (e.g., 10 = 10%) |
| is_active | boolean | Active status |
| usage_count | integer | Times used |
| min_order_value | numeric | Minimum cart value |
| max_discount_amount | numeric | Maximum discount cap |
| created_at | timestamptz | Creation date |

#### 5. **carts**
Persistent shopping cart data (logged-in users).

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid (PK) | User ID |
| items | jsonb | Cart items array |
| updated_at | timestamptz | Last modified |

#### 6. **wishlist**
User's saved products for later.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Wishlist item ID |
| user_id | uuid | User ID |
| product_id | uuid (FK) | Product ID |
| created_at | timestamptz | Added date |

**Unique Constraint**: `(user_id, product_id)` - prevents duplicate wishlist entries

#### 7. **profiles**
Extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Links to auth.users |
| email | text | User email |
| full_name | text | Display name |
| phone | text | Phone number |
| addresses | text[] | Saved addresses |
| avatar_url | text | Profile picture |
| updated_at | timestamptz | Last update |

#### 8. **categories**
Product category definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Category ID |
| name | text | Category name |
| slug | text | URL-friendly slug (unique) |
| description | text | Category description |
| created_at | timestamptz | Creation date |

### Database Functions

#### `decrement_stock`
```sql
-- Safely decrements product stock (prevents negative values)
CREATE FUNCTION decrement_stock(row_id UUID, quantity INT)
```

#### `increment_coupon_usage`
```sql
-- Increments coupon usage count after successful order
CREATE FUNCTION increment_coupon_usage(coupon_code TEXT)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account ([supabase.com](https://supabase.com))
- Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/supr-mushrooms.git
cd supr-mushrooms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a new project on Supabase, then:

- Go to **Project Settings → API**
- Copy your `Project URL` and `anon public` key
- Enable **Email Auth** and **Google OAuth** in Authentication settings
- Create storage buckets: `products`, `payment_proofs`
- Import the database schema (create tables from schema above)
- Set up RLS policies (see Security section below)

4. **Configure environment variables**

Create `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini AI (for AI Chef & Chatbot)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

5. **Update admin email**

Edit `src/lib/config.ts`:
```typescript
export const ADMIN_EMAIL = 'youradmin@example.com';
```

6. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Recharts** - Admin analytics charts

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security
  - Authentication (Email + OAuth)
  - Storage for images

### AI & APIs
- **Google Gemini AI** - Recipe generation + chatbot
- **WhatsApp API** - Customer support integration

### State Management
- **React Context API** - Global state (Auth, Cart, Wishlist)

---

## 🔐 Security Features

### Supabase RLS Policies

#### Products (Public Read)
```sql
-- Anyone can view active products
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (is_deleted = false);

-- Only admin can modify
CREATE POLICY "Only admin can modify products"
ON products FOR ALL
USING (auth.email() = 'youradmin@example.com');
```

#### Orders (User-specific)
```sql
-- Users can only view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Admin can view all
CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
USING (auth.email() = 'youradmin@example.com');
```

#### Cart & Wishlist
```sql
-- Users can only access their own cart
CREATE POLICY "Users own their cart"
ON carts FOR ALL
USING (auth.uid() = user_id);
```

### Additional Security
- **Environment variables** for sensitive keys (never committed)
- **Password hashing** via Supabase Auth
- **JWT tokens** for API authentication
- **Input sanitization** on all forms
- **Image compression** to prevent large uploads

---

## 📱 Key Features Explained

### Real-time Stock Management

The cart automatically updates when products go out of stock:

```typescript
// CartContext.tsx - Real-time subscription
useEffect(() => {
  const channel = supabase
    .channel('public:products')
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'products' }, 
      (payload) => {
        // Update cart items with new stock levels
        setCart(prev => prev.map(item => {
          if (item.productId === payload.new.id) {
            if (payload.new.stock < item.quantity) {
              toast.error('Stock updated');
              return { ...item, quantity: payload.new.stock };
            }
          }
          return item;
        }));
      }
    )
    .subscribe();
}, []);
```

### Pre-Order System

Products with status `coming_soon` can be added to cart without stock checks:

```typescript
// CartContext.tsx
const isPreOrder = product.status === 'coming_soon';

if (!isPreOrder && quantity > product.stock) {
  toast.error('Insufficient stock');
  return;
}
```

### Coupon Validation

```typescript
// CheckoutModal.tsx
const validateCoupon = (coupon: Coupon) => {
  if (coupon.min_order_value && cartTotal < coupon.min_order_value) {
    toast.error(`Minimum order: ₹${coupon.min_order_value}`);
    return false;
  }
  
  let discount = (cartTotal * coupon.discount_percentage) / 100;
  if (coupon.max_discount_amount) {
    discount = Math.min(discount, coupon.max_discount_amount);
  }
  
  return discount;
};
```

### AI Recipe Generator

Uses Gemini AI to create custom recipes based on cart contents:

```typescript
// AIChef.tsx
const generateRecipe = async () => {
  const ingredients = cart.map(i => i.product.name).join(', ');
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Create a recipe using: ${ingredients}. 
    Format: 1) Name 2) Ingredients 3) Instructions`;
    
  const result = await model.generateContent(prompt);
  setRecipe(result.response.text());
};
```

---

## 🎨 Customization

### Branding Colors

Edit `index.html` to customize the color palette:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#bc6c25',      // Primary brand color
          dark: '#8b4513',       // Hover states
          cream: '#faedcd',      // Backgrounds
          light: '#fefae0',      // Page background
          green: '#18b918',      // Success/badges
          text: '#2d2d2d',       // Primary text
          muted: '#666666',      // Secondary text
        }
      }
    }
  }
}
```

### Add New Product Categories

1. Add enum value in `src/types/index.ts`:
```typescript
export enum Category {
  MUSHROOMS = 'Mushrooms',
  SAFFRON = 'Saffron',
  HERBS = 'Herbs', // New category
}
```

2. Create category in Supabase `categories` table:
```sql
INSERT INTO categories (name, slug, description)
VALUES ('Herbs', 'herbs', 'Fresh organic herbs');
```

---

## 📊 Admin Dashboard Guide

### Access Admin Panel
1. Log in with admin email (set in `config.ts`)
2. Navigate to `/admin`

### Managing Orders
- **View all orders** in Orders tab
- **Update status** via dropdown (Pending → Shipped → Delivered)
- **Bulk actions** - Select multiple orders and update status
- **Search & filter** by date, status, or customer
- **Export to CSV** for accounting

### Managing Products
- **Add product** - Fill form with name, description, price, stock, images
- **Edit product** - Click edit icon on any product
- **Soft delete** - Marks product as deleted (preserves order history)
- **Image upload** - Automatic compression to <1MB for fast loading
- **Stock updates** - Change stock; real-time update to all carts

### Creating Coupons
1. Go to **Coupons** tab
2. Enter:
   - Code (e.g., "SUMMER10")
   - Discount % (e.g., 10)
   - Min order value (optional)
3. Click **Add**

Customers can apply during checkout.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY`

3. **Deploy**
- Vercel will automatically build and deploy
- Your site will be live at `your-project.vercel.app`

### Alternative: Deploy to Netlify

```bash
npm run build

# Upload 'dist' folder to Netlify
# Configure redirects in netlify.toml:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🧪 Testing

### Manual Testing Checklist

**User Flow:**
- [ ] Browse products
- [ ] Add to cart
- [ ] Apply coupon
- [ ] Guest checkout
- [ ] UPI payment upload
- [ ] Track order status

**Admin Flow:**
- [ ] Create product
- [ ] Update stock
- [ ] Process order
- [ ] Generate coupon
- [ ] Export CSV

### Test Payment

Use test UPI ID: `test@upi` (dev mode)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Products not loading
- **Solution**: Check Supabase RLS policies are set correctly
- Ensure `products` table has `SELECT` policy for anonymous users

**Issue**: Images not uploading
- **Solution**: 
  1. Verify storage bucket `products` exists
  2. Set bucket to **Public** in Supabase Storage settings
  3. Check file size < 5MB

**Issue**: Real-time cart updates not working
- **Solution**: Enable Realtime in Supabase Project Settings → Database → Realtime

**Issue**: Authentication not working
- **Solution**: 
  1. Verify callback URLs in Supabase Auth settings
  2. Add your domain to **Redirect URLs** (e.g., `http://localhost:3000`)

**Issue**: Gemini API error
- **Solution**: Get a new API key from [aistudio.google.com](https://aistudio.google.com)

---

## 📄 License

MIT License - feel free to use this project for commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues or questions:
- **Email**: vinayaggarwal271@gmail.com
- **Phone**: +91-8826986127
- **WhatsApp**: [Chat with us](https://wa.me/918826986127)

---

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Vercel** - Hosting platform
- **Google Gemini** - AI capabilities
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations

---

## 📈 Roadmap

- [ ] Reviews & ratings system
- [ ] Product recommendations
- [ ] Email notifications (order updates)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Subscription boxes
- [ ] Loyalty points program

---

**Built with ❤️ by Supr Organic Team**

*Delivering nature's finest, grown with science.* 🍄

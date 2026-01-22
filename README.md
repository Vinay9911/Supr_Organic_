Here is the fully updated `README.md` file. It documents your new **Single Table Architecture**, **Soft Delete** logic, and all the latest features like the AI Chatbot and Admin Dashboard.

You can copy and paste this directly into your project's `README.md` file.

```markdown
# Supr Organic 🌱

**Eat Science. Live Organic.**

Supr Organic is a next-generation e-commerce platform for selling premium, lab-grown aeroponic products like Mushrooms and Saffron. Built with **React**, **TypeScript**, and **Supabase**, it features a modern soil-free farming aesthetic, real-time stock management, and an AI-powered assistant.

## 🚀 Features

### 🛒 Customer Experience
* **Modern Storefront:** Clean, responsive UI showcasing products with "Coming Soon" and "Out of Stock" indicators.
* **Single-Page Navigation:** Smooth scrolling to sections (Shop, Technology, Home) without reloading.
* **Smart Cart:** Real-time stock validation (prevents adding more items than available).
* **Wishlist:** Save favorite items (persisted locally).
* **AI Chef Assistant:** Integrated **Gemini AI** chatbot to answer questions about recipes and products.
* **Direct Support:** One-click WhatsApp & Email integration.
* **Order Tracking:** Visual timeline for order status (Pending → Shipped → Delivered).

### ⚡ Admin Dashboard
* **Product Management:**
    * **Single Table Architecture:** Edit Price, Stock, and Weight directly.
    * **Soft Deletes:** "Delete" hides the product (`is_deleted = true`) to preserve order history.
    * **Visibility Control:** Toggle status between `Active`, `Hidden`, and `Coming Soon`.
* **Order Management:** View orders with full item details and update statuses.
* **Analytics:** Real-time sales charts (Last 7 Days) using Recharts.
* **Coupons:** Create and manage discount codes.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Charts:** Recharts
* **Backend & Auth:** Supabase (PostgreSQL)
* **AI:** Google Gemini API
* **State Management:** React Context API

---

## 🗄️ Database Schema (Important)

**NOTE:** This project uses a **Single Table Architecture**. There is **NO** `product_variants` table.

### 1. `products`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `name` | text | Product Name |
| `price` | numeric | **Current Price** (Moved from variants) |
| `stock` | integer | **Current Stock** (Moved from variants) |
| `weight` | text | e.g., "200g" |
| `status` | text | `active`, `hidden`, or `coming_soon` |
| `is_deleted` | boolean | `true` = Soft Deleted (Trash) |

### 2. `orders` & `order_items`
* **Orders:** Stores user ID, total amount, shipping address, and status.
* **Order Items:** Links to `products(id)`. Snapshots the `price_at_order` to ensure history remains accurate even if product prices change later.

### 3. `coupons`
* Stores discount codes (`SUMMER2026`) and discount percentages.

---

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/supr-organic.git](https://github.com/your-username/supr-organic.git)
    cd supr-organic
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_GEMINI_API_KEY=your_google_gemini_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🔐 Admin Access

The Admin Dashboard is protected and visible only to specific users.
* **Admin URL:** `/admin` (or click "Admin" in the Navbar if logged in).
* **Default Admin Email:** `vinayaggarwal271@gmail.com`
    *(To add more admins, update the email check in `src/components/Navbar.tsx`)*.

---

## 📂 Project Structure


```

src/
├── assets/          # Images (Hero images, logos)
├── components/      # Reusable UI (Navbar, Chatbot, Charts)
├── context/         # Global State (Cart, Auth, Data)
├── lib/             # Supabase client & config
├── pages/           # Main Views (Home, ProductDetail, Admin)
└── types/           # TypeScript Interfaces (Single source of truth)

```

---

## © License

Designed and developed for **Supr Organic Agriculture Pvt. Ltd.** (2026).

```
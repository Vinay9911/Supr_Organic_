
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Create Products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id),
  farming_method text check (farming_method in ('Aeroponic', 'Modern Farming', 'Hydroponic')),
  images text[] default '{}',
  is_launching_soon boolean default false,
  base_price numeric(10, 2) not null,
  discount_percentage numeric(5, 2) default 0,
  rating numeric(3, 2) default 5.0,
  reviews_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create Product Variants table
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  weight text not null,
  price numeric(10, 2) not null,
  stock integer default 0,
  created_at timestamp with time zone default now()
);

-- Create Profiles (Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  addresses text[] default '{}',
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Create Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  total_amount numeric(12, 2) not null,
  status text check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) default 'Pending',
  shipping_address text not null,
  payment_method text not null,
  created_at timestamp with time zone default now()
);

-- Create Order Items table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null,
  price_at_order numeric(10, 2) not null
);

-- Row Level Security Policies
alter table products enable row level security;
create policy "Allow public read-only access to products" on products for select using (true);

alter table categories enable row level security;
create policy "Allow public read-only access to categories" on categories for select using (true);

alter table profiles enable row level security;
create policy "Users can view and update their own profile" on profiles
  for all using (auth.uid() = id);

alter table orders enable row level security;
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on orders
  for insert with check (auth.uid() = user_id);

-- Instructions: 
-- 1. Copy these commands into the SQL Editor in Supabase.
-- 2. Run them to set up your backend architecture.
-- 3. The Auth table is managed by Supabase automatically, but 'profiles' links to it.

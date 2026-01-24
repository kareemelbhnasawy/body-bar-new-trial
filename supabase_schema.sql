-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null, -- 'diet-food', 'supplements', 'gym-wear', 'equipment'
  subcategory text, -- e.g. 'protein', 'machines'
  description text,
  price numeric not null,
  regular_price numeric,
  images text[],
  stock_status text default 'in_stock',
  attributes jsonb -- { flavours: [], sizes: [], colors: [] }
);

-- MEAL PLANS
create table public.meal_plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- 'Slim Bar', 'Al Kudra Bar', 'Rep Max Bar'
  calorie_range text,
  diet_type text, -- 'vegan', 'balanced'
  description text,
  features text[], -- ['Free consultation', 'Weekend pause']
  variants jsonb -- [{ duration: '1 week', price: 500 }, ...]
);

-- COACHES
create table public.coaches (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text,
  bio text,
  specializations text[],
  years_experience integer,
  image_url text
);

-- COACHING SESSIONS (Bookings)
create table public.coaching_sessions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id),
  coach_id uuid references public.coaches(id),
  num_sessions integer,
  total_price numeric,
  status text default 'pending' -- 'confirmed', 'completed'
);

-- NEWSLETTER
create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CALORIE CALCULATOR RESULTS (Optional history)
create table public.calculator_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  input_data jsonb,
  output_data jsonb
);

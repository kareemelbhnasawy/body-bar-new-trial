-- Add guest checkout columns to orders table
-- Run this in the Supabase SQL editor after the base migration

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_email     text,
  ADD COLUMN IF NOT EXISTS guest_phone     text,
  ADD COLUMN IF NOT EXISTS guest_name      text,
  ADD COLUMN IF NOT EXISTS shipping_address text;

-- Make user_id nullable so guest orders don't require an account
ALTER TABLE public.orders
  ALTER COLUMN user_id DROP NOT NULL;

-- Allow unauthenticated inserts for guest checkout
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id          uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  product_id  text        NOT NULL,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text       NOT NULL,
  rating      integer     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  verified    boolean     DEFAULT false
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews (product_id);

-- wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id            uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at    timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id    text        NOT NULL,
  product_name  text        NOT NULL,
  product_price numeric     NOT NULL,
  product_image text,
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist"
  ON public.wishlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON public.wishlists (user_id);

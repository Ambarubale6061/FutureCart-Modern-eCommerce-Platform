-- Products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL,
  original_price numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  subcategory text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  images text [] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '{}',
  highlights text [] NOT NULL DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  rating numeric NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- Anyone can view products
CREATE POLICY "Anyone can view products" ON public.products FOR
SELECT USING (true);
-- Only admins can manage products
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);
-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins can update product images" ON storage.objects FOR
UPDATE TO authenticated USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin')
);
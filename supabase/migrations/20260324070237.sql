-- Allow anonymous uploads to product-images bucket via storage.objects RLS
CREATE POLICY "Allow anon uploads to product-images" ON storage.objects FOR
INSERT TO anon WITH CHECK (bucket_id = 'product-images');
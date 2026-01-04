-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;

-- Create permissive policies for portfolio bucket
CREATE POLICY "Anyone can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Anyone can update portfolio images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

CREATE POLICY "Anyone can delete portfolio images"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');
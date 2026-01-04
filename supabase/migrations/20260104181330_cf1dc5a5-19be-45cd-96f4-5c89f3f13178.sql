-- Drop existing restrictive policies on portfolio_items
DROP POLICY IF EXISTS "Authenticated users can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can update portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio items" ON public.portfolio_items;

-- Create permissive policies for portfolio_items (since Firebase auth is used, not Supabase auth)
CREATE POLICY "Anyone can insert portfolio items"
ON public.portfolio_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio items"
ON public.portfolio_items FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete portfolio items"
ON public.portfolio_items FOR DELETE
USING (true);
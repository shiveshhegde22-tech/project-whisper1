-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  room_type TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio
CREATE POLICY "Anyone can view portfolio items" 
ON public.portfolio_items 
FOR SELECT 
USING (true);

-- Authenticated users can manage portfolio
CREATE POLICY "Authenticated users can insert portfolio items" 
ON public.portfolio_items 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio items" 
ON public.portfolio_items 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete portfolio items" 
ON public.portfolio_items 
FOR DELETE 
TO authenticated
USING (true);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_details TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view all submissions
CREATE POLICY "Authenticated users can view submissions" 
ON public.submissions 
FOR SELECT 
TO authenticated
USING (true);

-- Authenticated users can update submissions
CREATE POLICY "Authenticated users can update submissions" 
ON public.submissions 
FOR UPDATE 
TO authenticated
USING (true);

-- Anyone can insert submissions (public form)
CREATE POLICY "Anyone can submit" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage policies for portfolio bucket
CREATE POLICY "Anyone can view portfolio images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can delete portfolio images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'portfolio');
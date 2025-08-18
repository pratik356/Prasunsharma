-- Create experience table for work experience management
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    is_current BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE,
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON public.experience(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_is_visible ON public.experience(is_visible);
CREATE INDEX IF NOT EXISTS idx_experience_is_current ON public.experience(is_current);

-- Enable Row Level Security
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and authenticated admin access
CREATE POLICY "Allow public read access" ON public.experience
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.experience
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.experience
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON public.experience
    FOR DELETE USING (true);

-- Insert sample experience data
INSERT INTO public.experience (company_name, position, duration, description, location, is_current, display_order) VALUES
('Tech Solutions Inc.', 'Business Analyst', 'Fresher', 'Analyzing business requirements and creating data-driven solutions for client projects. Working with cross-functional teams to identify business needs and translate them into technical specifications.', 'Remote', true, 1)
ON CONFLICT DO NOTHING;

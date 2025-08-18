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

-- Insert sample experience data
INSERT INTO public.experience (company_name, position, duration, description, location, is_current, display_order) VALUES
('Tech Solutions Inc.', 'Business Analyst', 'Fresher', 'Analyzing business requirements and creating data-driven solutions for client projects.', 'Remote', true, 1);

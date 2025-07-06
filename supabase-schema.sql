-- The Memory Grove Database Schema
-- Run this in your Supabase SQL Editor to set up the required tables

-- Create subscribers table for email capture
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page',
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'press', 'partnerships')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT contact_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscribers
-- Allow anyone to subscribe (insert)
CREATE POLICY "Allow public subscribers insert" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users can view subscribers
CREATE POLICY "Allow authenticated users to view subscribers" ON subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Create RLS policies for contact submissions  
-- Allow anyone to submit contact form
CREATE POLICY "Allow public contact form submissions" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users can view contact submissions
CREATE POLICY "Allow authenticated users to view contact submissions" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_subscribed_at ON subscribers(subscribed_at DESC);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(type);

-- Create a view for recent subscribers (useful for admin dashboard)
CREATE OR REPLACE VIEW recent_subscribers AS
SELECT 
  id,
  email,
  subscribed_at,
  source
FROM subscribers
WHERE subscribed_at > NOW() - INTERVAL '30 days'
ORDER BY subscribed_at DESC;

-- Create a view for contact submission summary
CREATE OR REPLACE VIEW contact_submission_summary AS
SELECT 
  type,
  COUNT(*) as count,
  MAX(submitted_at) as last_submission
FROM contact_submissions
GROUP BY type;

-- Optional: Create a function to get subscriber count
CREATE OR REPLACE FUNCTION get_subscriber_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM subscribers;
$$ LANGUAGE SQL STABLE;

-- Optional: Create a function to check if email exists
CREATE OR REPLACE FUNCTION email_exists(check_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM subscribers WHERE email = check_email
  );
$$ LANGUAGE SQL STABLE;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON recent_subscribers TO authenticated;
GRANT SELECT ON contact_submission_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscriber_count() TO anon;
GRANT EXECUTE ON FUNCTION email_exists(TEXT) TO anon;
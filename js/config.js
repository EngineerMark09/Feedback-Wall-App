// ============================================
// SUPABASE CONFIGURATION
// ============================================
// 
// INSTRUCTIONS - Sundin mo ito:
//
// 1. Go to https://supabase.com and Sign Up (free)
// 2. Click "New Project" and create one
// 3. Wait for it to be ready (~2 minutes)
// 4. Go to Project Settings → API
// 5. Copy your "Project URL" and "anon public" key
// 6. Paste them below:

const SUPABASE_URL = 'https://uyamuydarbrfgjpggkyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YW11eWRhcmJyZmdqcGdna3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODY2MjMsImV4cCI6MjA4MTQ2MjYyM30.P90g_OLiBlcG3dFmw9uaEs2y4-MW7xuTt65mWD8Ssu4';

// ============================================
// SUPABASE TABLE SETUP
// ============================================
//
// Go to your Supabase Dashboard → SQL Editor
// Run this SQL to create the table:
//
// CREATE TABLE messages (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(50) DEFAULT 'Anonymous',
//     message TEXT NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- Enable public access (for demo purposes)
// ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Allow public read" ON messages
//     FOR SELECT USING (true);
//
// CREATE POLICY "Allow public insert" ON messages
//     FOR INSERT WITH CHECK (true);
//
// ============================================

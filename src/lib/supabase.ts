import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client if configured, otherwise export null or a mock handler logic
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isConfigured = isSupabaseConfigured;

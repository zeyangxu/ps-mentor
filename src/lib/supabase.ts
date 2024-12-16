import { createClient } from '@supabase/supabase-js';

const isDevelopment = import.meta.env.MODE === 'development';

// Get URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL:', supabaseUrl);

// Validate URL format only in production
if (!supabaseUrl || (!isDevelopment && !supabaseUrl.startsWith('https://'))) {
  throw new Error(
    'Invalid Supabase URL. Production URL should be a valid HTTPS URL from your Supabase project settings.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Supabase Anon Key is required. Get it from your Supabase project settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
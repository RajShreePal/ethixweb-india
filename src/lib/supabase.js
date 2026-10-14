import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Public (browser-safe) key only. The service-role key never reaches the frontend.
export const supabase = url && key ? createClient(url, key) : null;

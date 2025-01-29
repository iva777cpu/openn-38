import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cykuernrptmjmlwqqhne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5a3Vlcm5ycHRtam1sd3FxaG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzM4NDcsImV4cCI6MjA0OTk0OTg0N30.JV-iU2Y1AMnhl3Emi0NvbWqCqaGeflujG6MCCyurg-I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
});
import { createClient } from '@supabase/supabase-js';

// TE WARTOŚCI MUSISZ POBRAĆ Z SUPABASE DASHBOARD -> PROJECT SETTINGS -> API
const VITE_SUPABASE_URL = 'https://wyjwysfsbkrlgkwxsrgc.supabase.co';
const VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5and5c2ZzYmtybGdrd3hzcmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzEzOTMsImV4cCI6MjA3OTc0NzM5M30.6mlNu0TFCQmsZDafG26rjMHVrZRyw6w0mhCsNR5bMz0';

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);


import { createClient } from '@supabase/supabase-js';

// TE WARTOŚCI MUSISZ POBRAĆ Z SUPABASE DASHBOARD -> PROJECT SETTINGS -> API
const SUPABASE_URL = 'https://wyjwysfsbkrlgkwxsrgc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5and5c2ZzYmtybGdrd3hzcmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzEzOTMsImV4cCI6MjA3OTc0NzM5M30.6mlNu0TFCQmsZDafG26rjMHVrZRyw6w0mhCsNR5bMz0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


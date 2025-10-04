import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvmgqzpqjelaxlijclfb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bWdxenBxamVsYXhsaWpjbGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzk0MjAsImV4cCI6MjA3NDkxNTQyMH0.EGNH-llbqTUYpgGWjwEq_IbwQDO_6ojCIBaVEugqX3A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

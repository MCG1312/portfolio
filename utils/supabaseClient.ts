import { createClient } from '@supabase/supabase-js';

// INSTRUCTIONS:
// 1. Go to https://supabase.com and create a new project.
// 2. Go to Project Settings > API.
// 3. Copy your "Project URL" and "anon public" key.
// 4. Paste them below.

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; 
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

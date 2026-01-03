import { createClient } from '@supabase/supabase-js';

// INSTRUCTIONS:
// 1. Go to https://supabase.com and create a new project.
// 2. Go to Project Settings > API.
// 3. Copy your "Project URL" and "anon public" key.
// 4. Paste them below.

const SUPABASE_URL = 'https://uccqnyhfaozwjvwghjgv.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_zXPkn22QdHczBAeql3U_zA_iIM-wuHk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

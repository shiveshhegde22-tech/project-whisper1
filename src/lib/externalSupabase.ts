import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://jxxvlgtuxvtpnnmvgded.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'sb_publishable_cMZ2kXqdvxMfvNU9tV8TVg_DNopbS5-';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);

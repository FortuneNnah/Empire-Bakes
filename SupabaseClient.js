import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.HTML_SUPABASE_URL
const supabaseKey = process.env.HTML_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

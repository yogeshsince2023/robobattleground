import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Prevent runtime crash if environment variables are placeholder text or empty
if (!supabaseUrl || !supabaseUrl.startsWith('http') || supabaseUrl.includes('your_project_url_here')) {
  supabaseUrl = 'https://placeholder-project-url.supabase.co'
  supabaseKey = 'placeholder-anon-key'
}

export const supabase = createClient(supabaseUrl, supabaseKey)

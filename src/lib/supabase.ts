import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Memory = {
  id: string
  title?: string
  content?: string
  file_url?: string
  file_type?: 'image' | 'video' | 'audio' | 'text'
  file_name?: string
  file_size?: number
  tags: string[]
  created_at: string
  updated_at: string
  metadata?: {
    location?: string
    date_taken?: string
    dimensions?: { width: number; height: number }
  }
}

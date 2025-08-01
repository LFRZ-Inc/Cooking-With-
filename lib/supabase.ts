import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aenfbkvdazgcnizdqlrs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmZia3ZkYXpnY25pemRxbHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTI0NDUsImV4cCI6MjA2OTU4ODQ0NX0.rCXbPSGIsITmVC9LFT36nzmYE3b5ALKFpb6cni2Ajmk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (generated from your schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: 'viewer' | 'publisher' | 'admin'
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role?: 'viewer' | 'publisher' | 'admin'
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: 'viewer' | 'publisher' | 'admin'
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string
          author_id: string | null
          category_id: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          prep_time_minutes: number
          cook_time_minutes: number
          servings: number
          instructions: any[] // JSONB
          tips: string | null
          image_url: string | null
          status: 'draft' | 'published' | 'archived'
          rating: number
          rating_count: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          author_id?: string | null
          category_id?: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          prep_time_minutes: number
          cook_time_minutes: number
          servings: number
          instructions: any[]
          tips?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          rating?: number
          rating_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          author_id?: string | null
          category_id?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          prep_time_minutes?: number
          cook_time_minutes?: number
          servings?: number
          instructions?: any[]
          tips?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          rating?: number
          rating_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          author_id: string
          category: string | null
          image_url: string | null
          status: 'draft' | 'published' | 'archived'
          featured: boolean
          view_count: number
          read_time_minutes: number | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          author_id: string
          category?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          view_count?: number
          read_time_minutes?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          author_id?: string
          category?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          view_count?: number
          read_time_minutes?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number | null
          unit: string | null
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount?: number | null
          unit?: string | null
          notes?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          amount?: number | null
          unit?: string | null
          notes?: string | null
          order_index?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'viewer' | 'publisher' | 'admin'
      recipe_difficulty: 'easy' | 'medium' | 'hard'
      recipe_status: 'draft' | 'published' | 'archived'
      newsletter_status: 'draft' | 'published' | 'archived'
    }
  }
} 
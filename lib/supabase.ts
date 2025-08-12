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
          version_number: number
          parent_recipe_id: string | null
          is_original: boolean
          branch_name: string | null
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
          version_number?: number
          parent_recipe_id?: string | null
          is_original?: boolean
          branch_name?: string | null
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
          version_number?: number
          parent_recipe_id?: string | null
          is_original?: boolean
          branch_name?: string | null
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
      user_ratings: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          rating: number
          is_self_rating: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          rating: number
          is_self_rating?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          rating?: number
          is_self_rating?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recipe_versions: {
        Row: {
          id: string
          recipe_id: string
          version_number: number
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          prep_time_minutes: number
          cook_time_minutes: number
          servings: number
          instructions: any[] // JSONB
          tips: string | null
          image_url: string | null
          ingredients: any[] // JSONB - snapshot of ingredients at this version
          change_summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          version_number: number
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          prep_time_minutes: number
          cook_time_minutes: number
          servings: number
          instructions: any[]
          tips?: string | null
          image_url?: string | null
          ingredients: any[]
          change_summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          version_number?: number
          title?: string
          description?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          prep_time_minutes?: number
          cook_time_minutes?: number
          servings?: number
          instructions?: any[]
          tips?: string | null
          image_url?: string | null
          ingredients?: any[]
          change_summary?: string | null
          created_at?: string
        }
      }
      translations: {
        Row: {
          id: string
          content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id: string
          field_name: string
          original_text: string
          translated_text: string
          source_language: string
          target_language: string
          translation_status: 'pending' | 'completed' | 'failed' | 'outdated'
          translation_provider: string
          confidence_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id: string
          field_name: string
          original_text: string
          translated_text: string
          source_language: string
          target_language: string
          translation_status?: 'pending' | 'completed' | 'failed' | 'outdated'
          translation_provider?: string
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_type?: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id?: string
          field_name?: string
          original_text?: string
          translated_text?: string
          source_language?: string
          target_language?: string
          translation_status?: 'pending' | 'completed' | 'failed' | 'outdated'
          translation_provider?: string
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      translation_jobs: {
        Row: {
          id: string
          content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id: string
          target_language: string
          priority: 'low' | 'normal' | 'high' | 'urgent'
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          error_message: string | null
          retry_count: number
          max_retries: number
          created_at: string
          updated_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id: string
          target_language: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
          updated_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          content_type?: 'recipe' | 'newsletter' | 'category' | 'tag'
          content_id?: string
          target_language?: string
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
          updated_at?: string
          processed_at?: string | null
        }
      }
      user_language_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_language: string
          fallback_language: string
          auto_translate: boolean
          translation_quality: 'fast' | 'balanced' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_language: string
          fallback_language?: string
          auto_translate?: boolean
          translation_quality?: 'fast' | 'balanced' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_language?: string
          fallback_language?: string
          auto_translate?: boolean
          translation_quality?: 'fast' | 'balanced' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      // Recipe import-related tables
      recipe_imports: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          source_url: string | null
          source_domain: string | null
          import_method: 'webpage' | 'image' | 'text' | 'manual'
          original_content: string | null
          import_metadata: any | null
          import_status: 'processing' | 'completed' | 'failed' | 'reviewed'
          confidence_score: number | null
          field_mapping: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          source_url?: string | null
          source_domain?: string | null
          import_method: 'webpage' | 'image' | 'text' | 'manual'
          original_content?: string | null
          import_metadata?: any | null
          import_status?: 'processing' | 'completed' | 'failed' | 'reviewed'
          confidence_score?: number | null
          field_mapping?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          source_url?: string | null
          source_domain?: string | null
          import_method?: 'webpage' | 'image' | 'text' | 'manual'
          original_content?: string | null
          import_metadata?: any | null
          import_status?: 'processing' | 'completed' | 'failed' | 'reviewed'
          confidence_score?: number | null
          field_mapping?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      import_sources: {
        Row: {
          id: string
          domain: string
          site_name: string | null
          recipe_pattern: string | null
          extraction_rules: any | null
          success_rate: number | null
          total_imports: number | null
          last_import_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain: string
          site_name?: string | null
          recipe_pattern?: string | null
          extraction_rules?: any | null
          success_rate?: number | null
          total_imports?: number | null
          last_import_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          domain?: string
          site_name?: string | null
          recipe_pattern?: string | null
          extraction_rules?: any | null
          success_rate?: number | null
          total_imports?: number | null
          last_import_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      import_templates: {
        Row: {
          id: string
          source_domain: string
          template_name: string
          field_selectors: any
          validation_rules: any | null
          priority: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_domain: string
          template_name: string
          field_selectors: any
          validation_rules?: any | null
          priority?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_domain?: string
          template_name?: string
          field_selectors?: any
          validation_rules?: any | null
          priority?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      import_queue: {
        Row: {
          id: string
          user_id: string
          import_type: 'webpage' | 'image' | 'text'
          source_data: string
          priority: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          retry_count: number | null
          max_retries: number | null
          processing_started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          import_type: 'webpage' | 'image' | 'text'
          source_data: string
          priority?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          retry_count?: number | null
          max_retries?: number | null
          processing_started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          import_type?: 'webpage' | 'image' | 'text'
          source_data?: string
          priority?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          retry_count?: number | null
          max_retries?: number | null
          processing_started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      import_analytics: {
        Row: {
          id: string
          date: string
          import_method: string
          source_domain: string | null
          total_imports: number | null
          successful_imports: number | null
          failed_imports: number | null
          average_confidence: number | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          import_method: string
          source_domain?: string | null
          total_imports?: number | null
          successful_imports?: number | null
          failed_imports?: number | null
          average_confidence?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          import_method?: string
          source_domain?: string | null
          total_imports?: number | null
          successful_imports?: number | null
          failed_imports?: number | null
          average_confidence?: number | null
          created_at?: string
        }
      }
      // Recipe organization tables
      recipe_collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          cover_image_url: string | null
          is_public: boolean
          is_featured: boolean
          recipe_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          is_featured?: boolean
          recipe_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          is_featured?: boolean
          recipe_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      recipe_collection_items: {
        Row: {
          id: string
          collection_id: string
          recipe_id: string
          added_at: string
          notes: string | null
          order_index: number
        }
        Insert: {
          id?: string
          collection_id: string
          recipe_id: string
          added_at?: string
          notes?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          collection_id?: string
          recipe_id?: string
          added_at?: string
          notes?: string | null
          order_index?: number
        }
      }
      recipe_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          parent_category_id: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_category_id?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_category_id?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      recipe_category_assignments: {
        Row: {
          id: string
          recipe_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          category_id?: string
          created_at?: string
        }
      }
      recipe_tags: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          usage_count: number
          is_system_tag: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          usage_count?: number
          is_system_tag?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          usage_count?: number
          is_system_tag?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recipe_tag_assignments: {
        Row: {
          id: string
          recipe_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      recipe_meal_types: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      recipe_meal_type_assignments: {
        Row: {
          id: string
          recipe_id: string
          meal_type_id: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          meal_type_id: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          meal_type_id?: string
          created_at?: string
        }
      }
      recipe_cuisine_types: {
        Row: {
          id: string
          name: string
          description: string | null
          country_code: string | null
          flag_emoji: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          country_code?: string | null
          flag_emoji?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          country_code?: string | null
          flag_emoji?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      recipe_cuisine_type_assignments: {
        Row: {
          id: string
          recipe_id: string
          cuisine_type_id: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          cuisine_type_id: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          cuisine_type_id?: string
          created_at?: string
        }
      }
      recipe_dietary_restrictions: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          is_allergen: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_allergen?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_allergen?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      recipe_dietary_restriction_assignments: {
        Row: {
          id: string
          recipe_id: string
          dietary_restriction_id: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          dietary_restriction_id: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          dietary_restriction_id?: string
          created_at?: string
        }
      }
      // Meal planning tables
      meal_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          is_active: boolean
          total_meals: number
          total_calories: number
          total_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          is_active?: boolean
          total_meals?: number
          total_calories?: number
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          is_active?: boolean
          total_meals?: number
          total_calories?: number
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
      }
      meal_plan_items: {
        Row: {
          id: string
          meal_plan_id: string
          recipe_id: string
          day_of_week: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings: number
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          recipe_id: string
          day_of_week: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          recipe_id?: string
          day_of_week?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_active: boolean
          total_items: number
          estimated_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_active?: boolean
          total_items?: number
          estimated_cost?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          total_items?: number
          estimated_cost?: number
          created_at?: string
          updated_at?: string
        }
      }
      shopping_list_items: {
        Row: {
          id: string
          shopping_list_id: string
          ingredient_name: string
          amount: number | null
          unit: string | null
          category: string | null
          is_checked: boolean
          priority: number
          estimated_price: number | null
          notes: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shopping_list_id: string
          ingredient_name: string
          amount?: number | null
          unit?: string | null
          category?: string | null
          is_checked?: boolean
          priority?: number
          estimated_price?: number | null
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shopping_list_id?: string
          ingredient_name?: string
          amount?: number | null
          unit?: string | null
          category?: string | null
          is_checked?: boolean
          priority?: number
          estimated_price?: number | null
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Recipe adjustments tables
      measurement_units: {
        Row: {
          id: string
          name: string
          abbreviation: string
          unit_type: 'volume' | 'weight' | 'length' | 'count' | 'temperature' | 'time'
          base_unit: boolean
          conversion_factor: number
          base_unit_name: string | null
          is_metric: boolean
          is_imperial: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          abbreviation: string
          unit_type: 'volume' | 'weight' | 'length' | 'count' | 'temperature' | 'time'
          base_unit?: boolean
          conversion_factor?: number
          base_unit_name?: string | null
          is_metric?: boolean
          is_imperial?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string
          unit_type?: 'volume' | 'weight' | 'length' | 'count' | 'temperature' | 'time'
          base_unit?: boolean
          conversion_factor?: number
          base_unit_name?: string | null
          is_metric?: boolean
          is_imperial?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      unit_conversions: {
        Row: {
          id: string
          from_unit_id: string
          to_unit_id: string
          conversion_factor: number
          formula: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_unit_id: string
          to_unit_id: string
          conversion_factor: number
          formula?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          from_unit_id?: string
          to_unit_id?: string
          conversion_factor?: number
          formula?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      recipe_scaling_history: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          original_servings: number
          new_servings: number
          scaling_factor: number
          original_ingredients: any
          scaled_ingredients: any
          cooking_time_adjustment: number | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          original_servings: number
          new_servings: number
          scaling_factor: number
          original_ingredients: any
          scaled_ingredients: any
          cooking_time_adjustment?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          original_servings?: number
          new_servings?: number
          scaling_factor?: number
          original_ingredients?: any
          scaled_ingredients?: any
          cooking_time_adjustment?: number | null
          created_at?: string
        }
      }
      ingredient_substitutions: {
        Row: {
          id: string
          original_ingredient: string
          substitute_ingredient: string
          substitution_ratio: number
          unit: string | null
          notes: string | null
          category: string
          is_verified: boolean
          usage_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          original_ingredient: string
          substitute_ingredient: string
          substitution_ratio?: number
          unit?: string | null
          notes?: string | null
          category: string
          is_verified?: boolean
          usage_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          original_ingredient?: string
          substitute_ingredient?: string
          substitution_ratio?: number
          unit?: string | null
          notes?: string | null
          category?: string
          is_verified?: boolean
          usage_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cooking_equipment: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          time_adjustment_factor: number
          temperature_adjustment: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          time_adjustment_factor?: number
          temperature_adjustment?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          time_adjustment_factor?: number
          temperature_adjustment?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      cooking_time_adjustments: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          original_prep_time: number | null
          original_cook_time: number | null
          adjusted_prep_time: number
          adjusted_cook_time: number
          adjustment_reason: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          original_prep_time?: number | null
          original_cook_time?: number | null
          adjusted_prep_time: number
          adjusted_cook_time: number
          adjustment_reason: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          original_prep_time?: number | null
          original_cook_time?: number | null
          adjusted_prep_time?: number
          adjusted_cook_time?: number
          adjustment_reason?: string
          notes?: string | null
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
      translation_status: 'pending' | 'completed' | 'failed' | 'outdated'
      job_priority: 'low' | 'normal' | 'high' | 'urgent'
      job_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
      translation_quality: 'fast' | 'balanced' | 'high'
      import_method: 'webpage' | 'image' | 'text' | 'manual'
      import_status: 'processing' | 'completed' | 'failed' | 'reviewed'
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
      unit_type: 'volume' | 'weight' | 'length' | 'count' | 'temperature' | 'time'
    }
  }
} 
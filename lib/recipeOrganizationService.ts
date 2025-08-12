'use client'

import { supabase } from './supabase'

export interface RecipeCollection {
  id: string
  user_id: string
  name: string
  description?: string
  cover_image_url?: string
  is_public: boolean
  is_featured: boolean
  recipe_count: number
  created_at: string
  updated_at: string
}

export interface RecipeCollectionItem {
  id: string
  collection_id: string
  recipe_id: string
  added_at: string
  notes?: string
  order_index: number
}

export interface RecipeCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  parent_category_id?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface RecipeTag {
  id: string
  name: string
  description?: string
  color?: string
  usage_count: number
  is_system_tag: boolean
  created_at: string
  updated_at: string
}

export interface RecipeMealType {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order: number
  created_at: string
}

export interface RecipeCuisineType {
  id: string
  name: string
  description?: string
  country_code?: string
  flag_emoji?: string
  sort_order: number
  created_at: string
}

export interface RecipeDietaryRestriction {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  is_allergen: boolean
  sort_order: number
  created_at: string
}

export class RecipeOrganizationService {
  private static instance: RecipeOrganizationService

  static getInstance(): RecipeOrganizationService {
    if (!RecipeOrganizationService.instance) {
      RecipeOrganizationService.instance = new RecipeOrganizationService()
    }
    return RecipeOrganizationService.instance
  }

  // Recipe Collections
  async createCollection(data: {
    name: string
    description?: string
    cover_image_url?: string
    is_public?: boolean
  }): Promise<RecipeCollection | null> {
    try {
      const { data: collection, error } = await supabase
        .from('recipe_collections')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return collection
    } catch (error) {
      console.error('Error creating collection:', error)
      return null
    }
  }

  async getUserCollections(userId: string): Promise<RecipeCollection[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_collections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user collections:', error)
      return []
    }
  }

  async getPublicCollections(): Promise<RecipeCollection[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_collections')
        .select('*')
        .eq('is_public', true)
        .order('recipe_count', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching public collections:', error)
      return []
    }
  }

  async addRecipeToCollection(collectionId: string, recipeId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_collection_items')
        .insert([{
          collection_id: collectionId,
          recipe_id: recipeId,
          notes
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding recipe to collection:', error)
      return false
    }
  }

  async removeRecipeFromCollection(collectionId: string, recipeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('recipe_id', recipeId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing recipe from collection:', error)
      return false
    }
  }

  async getCollectionRecipes(collectionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_collection_items')
        .select(`
          *,
          recipes (*)
        `)
        .eq('collection_id', collectionId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data?.map(item => item.recipes) || []
    } catch (error) {
      console.error('Error fetching collection recipes:', error)
      return []
    }
  }

  // Recipe Categories
  async getCategories(): Promise<RecipeCategory[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  async assignCategoryToRecipe(recipeId: string, categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_category_assignments')
        .insert([{
          recipe_id: recipeId,
          category_id: categoryId
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning category to recipe:', error)
      return false
    }
  }

  async removeCategoryFromRecipe(recipeId: string, categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_category_assignments')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('category_id', categoryId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing category from recipe:', error)
      return false
    }
  }

  // Recipe Tags
  async getTags(): Promise<RecipeTag[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_tags')
        .select('*')
        .order('usage_count', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }

  async createTag(data: { name: string; description?: string; color?: string }): Promise<RecipeTag | null> {
    try {
      const { data: tag, error } = await supabase
        .from('recipe_tags')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return tag
    } catch (error) {
      console.error('Error creating tag:', error)
      return null
    }
  }

  async assignTagToRecipe(recipeId: string, tagId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_tag_assignments')
        .insert([{
          recipe_id: recipeId,
          tag_id: tagId
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning tag to recipe:', error)
      return false
    }
  }

  async removeTagFromRecipe(recipeId: string, tagId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_tag_assignments')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('tag_id', tagId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing tag from recipe:', error)
      return false
    }
  }

  // Recipe Meal Types
  async getMealTypes(): Promise<RecipeMealType[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_meal_types')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching meal types:', error)
      return []
    }
  }

  async assignMealTypeToRecipe(recipeId: string, mealTypeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_meal_type_assignments')
        .insert([{
          recipe_id: recipeId,
          meal_type_id: mealTypeId
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning meal type to recipe:', error)
      return false
    }
  }

  // Recipe Cuisine Types
  async getCuisineTypes(): Promise<RecipeCuisineType[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_cuisine_types')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching cuisine types:', error)
      return []
    }
  }

  async assignCuisineTypeToRecipe(recipeId: string, cuisineTypeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_cuisine_type_assignments')
        .insert([{
          recipe_id: recipeId,
          cuisine_type_id: cuisineTypeId
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning cuisine type to recipe:', error)
      return false
    }
  }

  // Recipe Dietary Restrictions
  async getDietaryRestrictions(): Promise<RecipeDietaryRestriction[]> {
    try {
      const { data, error } = await supabase
        .from('recipe_dietary_restrictions')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching dietary restrictions:', error)
      return []
    }
  }

  async assignDietaryRestrictionToRecipe(recipeId: string, dietaryRestrictionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_dietary_restriction_assignments')
        .insert([{
          recipe_id: recipeId,
          dietary_restriction_id: dietaryRestrictionId
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning dietary restriction to recipe:', error)
      return false
    }
  }

  // Advanced Search and Filtering
  async searchRecipes(filters: {
    search?: string
    categories?: string[]
    tags?: string[]
    mealTypes?: string[]
    cuisineTypes?: string[]
    dietaryRestrictions?: string[]
    difficulty?: string
    maxPrepTime?: number
    maxCookTime?: number
    minServings?: number
    maxServings?: number
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('recipes')
        .select(`
          *,
          recipe_category_assignments!inner(recipe_categories!inner(*)),
          recipe_tag_assignments!inner(recipe_tags!inner(*)),
          recipe_meal_type_assignments!inner(recipe_meal_types!inner(*)),
          recipe_cuisine_type_assignments!inner(recipe_cuisine_types!inner(*)),
          recipe_dietary_restriction_assignments!inner(recipe_dietary_restrictions!inner(*))
        `)

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }

      if (filters.maxPrepTime) {
        query = query.lte('prep_time_minutes', filters.maxPrepTime)
      }

      if (filters.maxCookTime) {
        query = query.lte('cook_time_minutes', filters.maxCookTime)
      }

      if (filters.minServings) {
        query = query.gte('servings', filters.minServings)
      }

      if (filters.maxServings) {
        query = query.lte('servings', filters.maxServings)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching recipes:', error)
      return []
    }
  }

  // Recipe Recommendations
  async getRecommendedRecipes(recipeId: string, limit: number = 6): Promise<any[]> {
    try {
      // Get the current recipe's categories, tags, and cuisine types
      const { data: currentRecipe } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_category_assignments(recipe_categories(*)),
          recipe_tag_assignments(recipe_tags(*)),
          recipe_cuisine_type_assignments(recipe_cuisine_types(*))
        `)
        .eq('id', recipeId)
        .single()

      if (!currentRecipe) return []

      // Find similar recipes based on shared categories, tags, or cuisine types
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_category_assignments(recipe_categories(*)),
          recipe_tag_assignments(recipe_tags(*)),
          recipe_cuisine_type_assignments(recipe_cuisine_types(*))
        `)
        .neq('id', recipeId)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting recommended recipes:', error)
      return []
    }
  }

  // Analytics and Insights
  async getRecipeAnalytics(userId: string): Promise<any> {
    try {
      const { data: userRecipes } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_category_assignments(recipe_categories(*)),
          recipe_tag_assignments(recipe_tags(*)),
          recipe_meal_type_assignments(recipe_meal_types(*)),
          recipe_cuisine_type_assignments(recipe_cuisine_types(*))
        `)
        .eq('author_id', userId)

      if (!userRecipes) return {}

      // Calculate analytics
      const totalRecipes = userRecipes.length
      const avgRating = userRecipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / totalRecipes
      const totalViews = userRecipes.reduce((sum, recipe) => sum + (recipe.view_count || 0), 0)

      // Most popular categories
      const categoryCounts: { [key: string]: number } = {}
      userRecipes.forEach(recipe => {
        recipe.recipe_category_assignments?.forEach((assignment: any) => {
          const categoryName = assignment.recipe_categories?.name
          if (categoryName) {
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
          }
        })
      })

      // Most used tags
      const tagCounts: { [key: string]: number } = {}
      userRecipes.forEach(recipe => {
        recipe.recipe_tag_assignments?.forEach((assignment: any) => {
          const tagName = assignment.recipe_tags?.name
          if (tagName) {
            tagCounts[tagName] = (tagCounts[tagName] || 0) + 1
          }
        })
      })

      return {
        totalRecipes,
        avgRating,
        totalViews,
        popularCategories: Object.entries(categoryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count })),
        popularTags: Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }))
      }
    } catch (error) {
      console.error('Error getting recipe analytics:', error)
      return {}
    }
  }
}

// Export singleton instance
export const recipeOrganizationService = RecipeOrganizationService.getInstance() 
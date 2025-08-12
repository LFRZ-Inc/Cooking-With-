'use client'

import { supabase } from './supabase'

export interface MealPlan {
  id: string
  user_id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  is_active: boolean
  total_meals: number
  total_calories: number
  total_cost: number
  created_at: string
  updated_at: string
}

export interface MealPlanItem {
  id: string
  meal_plan_id: string
  recipe_id: string
  day_of_week: number // 1=Monday, 7=Sunday
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  servings: number
  notes?: string
  order_index: number
  created_at: string
  recipe?: any // Joined recipe data
}

export interface ShoppingList {
  id: string
  user_id: string
  name: string
  description?: string
  is_active: boolean
  total_items: number
  estimated_cost: number
  created_at: string
  updated_at: string
}

export interface ShoppingListItem {
  id: string
  shopping_list_id: string
  ingredient_name: string
  amount?: number
  unit?: string
  category?: string
  is_checked: boolean
  priority: number
  estimated_price?: number
  notes?: string
  order_index: number
  created_at: string
  updated_at: string
}

export class MealPlanningService {
  private static instance: MealPlanningService

  static getInstance(): MealPlanningService {
    if (!MealPlanningService.instance) {
      MealPlanningService.instance = new MealPlanningService()
    }
    return MealPlanningService.instance
  }

  // Meal Plans
  async createMealPlan(data: {
    name: string
    description?: string
    start_date: string
    end_date: string
  }): Promise<MealPlan | null> {
    try {
      const { data: mealPlan, error } = await supabase
        .from('meal_plans')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return mealPlan
    } catch (error) {
      console.error('Error creating meal plan:', error)
      return null
    }
  }

  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching meal plans:', error)
      return []
    }
  }

  async getMealPlan(mealPlanId: string): Promise<MealPlan | null> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('id', mealPlanId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching meal plan:', error)
      return null
    }
  }

  async updateMealPlan(mealPlanId: string, updates: Partial<MealPlan>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .update(updates)
        .eq('id', mealPlanId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating meal plan:', error)
      return false
    }
  }

  async deleteMealPlan(mealPlanId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealPlanId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting meal plan:', error)
      return false
    }
  }

  // Meal Plan Items
  async addRecipeToMealPlan(data: {
    meal_plan_id: string
    recipe_id: string
    day_of_week: number
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    servings?: number
    notes?: string
  }): Promise<MealPlanItem | null> {
    try {
      const { data: mealPlanItem, error } = await supabase
        .from('meal_plan_items')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return mealPlanItem
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error)
      return null
    }
  }

  async getMealPlanItems(mealPlanId: string): Promise<MealPlanItem[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .select(`
          *,
          recipes (*)
        `)
        .eq('meal_plan_id', mealPlanId)
        .order('day_of_week', { ascending: true })
        .order('order_index', { ascending: true })

      if (error) throw error
      return data?.map(item => ({
        ...item,
        recipe: item.recipes
      })) || []
    } catch (error) {
      console.error('Error fetching meal plan items:', error)
      return []
    }
  }

  async updateMealPlanItem(itemId: string, updates: Partial<MealPlanItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_plan_items')
        .update(updates)
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating meal plan item:', error)
      return false
    }
  }

  async removeRecipeFromMealPlan(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_plan_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing recipe from meal plan:', error)
      return false
    }
  }

  // Shopping Lists
  async createShoppingList(data: {
    name: string
    description?: string
  }): Promise<ShoppingList | null> {
    try {
      const { data: shoppingList, error } = await supabase
        .from('shopping_lists')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return shoppingList
    } catch (error) {
      console.error('Error creating shopping list:', error)
      return null
    }
  }

  async getUserShoppingLists(userId: string): Promise<ShoppingList[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
      return []
    }
  }

  async getShoppingList(listId: string): Promise<ShoppingList | null> {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', listId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching shopping list:', error)
      return null
    }
  }

  async updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update(updates)
        .eq('id', listId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating shopping list:', error)
      return false
    }
  }

  async deleteShoppingList(listId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting shopping list:', error)
      return false
    }
  }

  // Shopping List Items
  async addItemToShoppingList(data: {
    shopping_list_id: string
    ingredient_name: string
    amount?: number
    unit?: string
    category?: string
    priority?: number
    estimated_price?: number
    notes?: string
  }): Promise<ShoppingListItem | null> {
    try {
      const { data: shoppingListItem, error } = await supabase
        .from('shopping_list_items')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return shoppingListItem
    } catch (error) {
      console.error('Error adding item to shopping list:', error)
      return null
    }
  }

  async getShoppingListItems(listId: string): Promise<ShoppingListItem[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('shopping_list_id', listId)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching shopping list items:', error)
      return []
    }
  }

  async updateShoppingListItem(itemId: string, updates: Partial<ShoppingListItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update(updates)
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating shopping list item:', error)
      return false
    }
  }

  async removeItemFromShoppingList(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing item from shopping list:', error)
      return false
    }
  }

  async toggleShoppingListItem(itemId: string): Promise<boolean> {
    try {
      // First get the current state
      const { data: currentItem } = await supabase
        .from('shopping_list_items')
        .select('is_checked')
        .eq('id', itemId)
        .single()

      if (!currentItem) return false

      // Toggle the checked state
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_checked: !currentItem.is_checked })
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error toggling shopping list item:', error)
      return false
    }
  }

  // Advanced Features
  async generateShoppingListFromMealPlan(mealPlanId: string, shoppingListName?: string): Promise<ShoppingList | null> {
    try {
      // Get meal plan items with recipes and ingredients
      const { data: mealPlanItems } = await supabase
        .from('meal_plan_items')
        .select(`
          *,
          recipes (
            *,
            recipe_ingredients (*)
          )
        `)
        .eq('meal_plan_id', mealPlanId)

      if (!mealPlanItems || mealPlanItems.length === 0) return null

      // Create shopping list
      const shoppingList = await this.createShoppingList({
        name: shoppingListName || `Shopping List - ${new Date().toLocaleDateString()}`,
        description: `Generated from meal plan`
      })

      if (!shoppingList) return null

      // Aggregate ingredients from all recipes
      const ingredientMap = new Map<string, { amount: number; unit: string; category: string }>()

      mealPlanItems.forEach(item => {
        const recipe = item.recipes
        if (recipe?.recipe_ingredients) {
          recipe.recipe_ingredients.forEach((ingredient: any) => {
            const key = `${ingredient.name}-${ingredient.unit}`
            const scaledAmount = (ingredient.amount || 0) * item.servings

            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!
              existing.amount += scaledAmount
            } else {
              ingredientMap.set(key, {
                amount: scaledAmount,
                unit: ingredient.unit || '',
                category: this.categorizeIngredient(ingredient.name)
              })
            }
          })
        }
      })

      // Add ingredients to shopping list
      ingredientMap.forEach((details, ingredientName) => {
        this.addItemToShoppingList({
          shopping_list_id: shoppingList.id,
          ingredient_name: ingredientName.split('-')[0], // Remove unit from name
          amount: details.amount,
          unit: details.unit,
          category: details.category
        })
      })

      return shoppingList
    } catch (error) {
      console.error('Error generating shopping list from meal plan:', error)
      return null
    }
  }

  private categorizeIngredient(ingredientName: string): string {
    const name = ingredientName.toLowerCase()
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || name.includes('cream')) {
      return 'dairy'
    } else if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('fish')) {
      return 'meat'
    } else if (name.includes('apple') || name.includes('banana') || name.includes('tomato') || name.includes('lettuce')) {
      return 'produce'
    } else if (name.includes('flour') || name.includes('sugar') || name.includes('oil') || name.includes('salt')) {
      return 'pantry'
    } else {
      return 'other'
    }
  }

  // Analytics and Insights
  async getMealPlanAnalytics(userId: string): Promise<any> {
    try {
      const { data: mealPlans } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)

      if (!mealPlans) return {}

      const totalMealPlans = mealPlans.length
      const activeMealPlans = mealPlans.filter(plan => plan.is_active).length
      const totalMeals = mealPlans.reduce((sum, plan) => sum + plan.total_meals, 0)
      const totalCalories = mealPlans.reduce((sum, plan) => sum + plan.total_calories, 0)

      return {
        totalMealPlans,
        activeMealPlans,
        totalMeals,
        totalCalories,
        averageMealsPerPlan: totalMealPlans > 0 ? totalMeals / totalMealPlans : 0,
        averageCaloriesPerPlan: totalMealPlans > 0 ? totalCalories / totalMealPlans : 0
      }
    } catch (error) {
      console.error('Error getting meal plan analytics:', error)
      return {}
    }
  }

  async getShoppingListAnalytics(userId: string): Promise<any> {
    try {
      const { data: shoppingLists } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)

      if (!shoppingLists) return {}

      const totalLists = shoppingLists.length
      const activeLists = shoppingLists.filter(list => list.is_active).length
      const totalItems = shoppingLists.reduce((sum, list) => sum + list.total_items, 0)
      const totalCost = shoppingLists.reduce((sum, list) => sum + (list.estimated_cost || 0), 0)

      return {
        totalLists,
        activeLists,
        totalItems,
        totalCost,
        averageItemsPerList: totalLists > 0 ? totalItems / totalLists : 0,
        averageCostPerList: totalLists > 0 ? totalCost / totalLists : 0
      }
    } catch (error) {
      console.error('Error getting shopping list analytics:', error)
      return {}
    }
  }
}

// Export singleton instance
export const mealPlanningService = MealPlanningService.getInstance() 
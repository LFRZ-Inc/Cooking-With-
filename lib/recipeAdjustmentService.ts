'use client'

import { supabase } from './supabase'

export interface MeasurementUnit {
  id: string
  name: string
  abbreviation: string
  unit_type: 'volume' | 'weight' | 'length' | 'count' | 'temperature' | 'time'
  base_unit: boolean
  conversion_factor: number
  base_unit_name?: string
  is_metric: boolean
  is_imperial: boolean
  sort_order: number
}

export interface UnitConversion {
  id: string
  from_unit_id: string
  to_unit_id: string
  conversion_factor: number
  formula?: string
  notes?: string
}

export interface RecipeScalingHistory {
  id: string
  recipe_id: string
  user_id: string
  original_servings: number
  new_servings: number
  scaling_factor: number
  original_ingredients: any
  scaled_ingredients: any
  cooking_time_adjustment?: number
  created_at: string
}

export interface IngredientSubstitution {
  id: string
  original_ingredient: string
  substitute_ingredient: string
  substitution_ratio: number
  unit?: string
  notes?: string
  category: string
  is_verified: boolean
  usage_count: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CookingEquipment {
  id: string
  name: string
  category: string
  description?: string
  time_adjustment_factor: number
  temperature_adjustment?: number
  notes?: string
}

export interface ScaledRecipe {
  title: string
  servings: number
  prep_time_minutes: number
  cook_time_minutes: number
  ingredients: ScaledIngredient[]
  instructions: string[]
  scaling_factor: number
}

export interface ScaledIngredient {
  name: string
  amount: number
  unit: string
  original_amount: number
  original_unit: string
  converted_amount?: number
  converted_unit?: string
}

export class RecipeAdjustmentService {
  private static instance: RecipeAdjustmentService

  static getInstance(): RecipeAdjustmentService {
    if (!RecipeAdjustmentService.instance) {
      RecipeAdjustmentService.instance = new RecipeAdjustmentService()
    }
    return RecipeAdjustmentService.instance
  }

  // Measurement Units
  async getMeasurementUnits(unitType?: string): Promise<MeasurementUnit[]> {
    try {
      let query = supabase
        .from('measurement_units')
        .select('*')
        .order('sort_order', { ascending: true })

      if (unitType) {
        query = query.eq('unit_type', unitType)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching measurement units:', error)
      return []
    }
  }

  async getUnitConversion(fromUnitId: string, toUnitId: string): Promise<UnitConversion | null> {
    try {
      const { data, error } = await supabase
        .from('unit_conversions')
        .select('*')
        .eq('from_unit_id', fromUnitId)
        .eq('to_unit_id', toUnitId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching unit conversion:', error)
      return null
    }
  }

  // Recipe Scaling
  async scaleRecipe(recipeId: string, newServings: number, userId: string): Promise<ScaledRecipe | null> {
    try {
      // Get the original recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (*)
        `)
        .eq('id', recipeId)
        .single()

      if (recipeError || !recipe) throw new Error('Recipe not found')

      const originalServings = recipe.servings || 1
      const scalingFactor = newServings / originalServings

      // Scale ingredients
      const scaledIngredients: ScaledIngredient[] = []
      const originalIngredients: any[] = []

      if (recipe.recipe_ingredients) {
        for (const ingredient of recipe.recipe_ingredients) {
          const originalAmount = ingredient.amount || 0
          const scaledAmount = originalAmount * scalingFactor

          originalIngredients.push({
            name: ingredient.name,
            amount: originalAmount,
            unit: ingredient.unit
          })

          scaledIngredients.push({
            name: ingredient.name,
            amount: scaledAmount,
            unit: ingredient.unit,
            original_amount: originalAmount,
            original_unit: ingredient.unit
          })
        }
      }

      // Scale cooking times
      const scaledPrepTime = Math.round((recipe.prep_time_minutes || 0) * scalingFactor)
      const scaledCookTime = Math.round((recipe.cook_time_minutes || 0) * scalingFactor)

      // Save scaling history
      await this.saveScalingHistory({
        recipe_id: recipeId,
        user_id: userId,
        original_servings: originalServings,
        new_servings: newServings,
        scaling_factor: scalingFactor,
        original_ingredients: originalIngredients,
        scaled_ingredients: scaledIngredients,
        cooking_time_adjustment: (scaledPrepTime + scaledCookTime) - (recipe.prep_time_minutes + recipe.cook_time_minutes)
      })

      return {
        title: recipe.title,
        servings: newServings,
        prep_time_minutes: scaledPrepTime,
        cook_time_minutes: scaledCookTime,
        ingredients: scaledIngredients,
        instructions: recipe.instructions || [],
        scaling_factor: scalingFactor
      }
    } catch (error) {
      console.error('Error scaling recipe:', error)
      return null
    }
  }

  private async saveScalingHistory(data: {
    recipe_id: string
    user_id: string
    original_servings: number
    new_servings: number
    scaling_factor: number
    original_ingredients: any
    scaled_ingredients: any
    cooking_time_adjustment?: number
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recipe_scaling_history')
        .insert([data])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error saving scaling history:', error)
      return false
    }
  }

  // Unit Conversions
  async convertUnit(amount: number, fromUnit: string, toUnit: string): Promise<{ amount: number; unit: string } | null> {
    try {
      // Get unit IDs
      const { data: fromUnitData } = await supabase
        .from('measurement_units')
        .select('id, unit_type')
        .eq('abbreviation', fromUnit)
        .single()

      const { data: toUnitData } = await supabase
        .from('measurement_units')
        .select('id, unit_type')
        .eq('abbreviation', toUnit)
        .single()

      if (!fromUnitData || !toUnitData) return null

      // Check if units are of the same type
      if (fromUnitData.unit_type !== toUnitData.unit_type) return null

      // Handle temperature conversions specially
      if (fromUnitData.unit_type === 'temperature') {
        return this.convertTemperature(amount, fromUnit, toUnit)
      }

      // Get conversion factor
      const conversion = await this.getUnitConversion(fromUnitData.id, toUnitData.id)
      if (!conversion) return null

      const convertedAmount = amount * conversion.conversion_factor

      return {
        amount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
        unit: toUnit
      }
    } catch (error) {
      console.error('Error converting unit:', error)
      return null
    }
  }

  private convertTemperature(amount: number, fromUnit: string, toUnit: string): { amount: number; unit: string } | null {
    if (fromUnit === '°C' && toUnit === '°F') {
      return {
        amount: Math.round((amount * 9/5 + 32) * 10) / 10,
        unit: '°F'
      }
    } else if (fromUnit === '°F' && toUnit === '°C') {
      return {
        amount: Math.round(((amount - 32) * 5/9) * 10) / 10,
        unit: '°C'
      }
    }
    return null
  }

  // Ingredient Substitutions
  async getSubstitutions(ingredientName: string): Promise<IngredientSubstitution[]> {
    try {
      const { data, error } = await supabase
        .from('ingredient_substitutions')
        .select('*')
        .ilike('original_ingredient', `%${ingredientName}%`)
        .order('is_verified', { ascending: false })
        .order('usage_count', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching substitutions:', error)
      return []
    }
  }

  async getPopularSubstitutions(limit: number = 10): Promise<IngredientSubstitution[]> {
    try {
      const { data, error } = await supabase
        .from('ingredient_substitutions')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching popular substitutions:', error)
      return []
    }
  }

  async addSubstitution(data: {
    original_ingredient: string
    substitute_ingredient: string
    substitution_ratio: number
    unit?: string
    notes?: string
    category: string
  }): Promise<IngredientSubstitution | null> {
    try {
      const { data: substitution, error } = await supabase
        .from('ingredient_substitutions')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return substitution
    } catch (error) {
      console.error('Error adding substitution:', error)
      return null
    }
  }

  async incrementSubstitutionUsage(substitutionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ingredient_substitutions')
        .update({ usage_count: supabase.rpc('increment') })
        .eq('id', substitutionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error incrementing substitution usage:', error)
      return false
    }
  }

  // Cooking Equipment
  async getCookingEquipment(category?: string): Promise<CookingEquipment[]> {
    try {
      let query = supabase
        .from('cooking_equipment')
        .select('*')
        .order('name', { ascending: true })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching cooking equipment:', error)
      return []
    }
  }

  async adjustCookingTime(recipeId: string, equipmentId: string, userId: string): Promise<{
    prep_time_minutes: number
    cook_time_minutes: number
    temperature_adjustment?: number
  } | null> {
    try {
      // Get recipe
      const { data: recipe } = await supabase
        .from('recipes')
        .select('prep_time_minutes, cook_time_minutes')
        .eq('id', recipeId)
        .single()

      if (!recipe) return null

      // Get equipment
      const { data: equipment } = await supabase
        .from('cooking_equipment')
        .select('*')
        .eq('id', equipmentId)
        .single()

      if (!equipment) return null

      // Calculate adjusted times
      const adjustedPrepTime = Math.round((recipe.prep_time_minutes || 0) * equipment.time_adjustment_factor)
      const adjustedCookTime = Math.round((recipe.cook_time_minutes || 0) * equipment.time_adjustment_factor)

      // Save adjustment
      await this.saveCookingTimeAdjustment({
        recipe_id: recipeId,
        user_id: userId,
        original_prep_time: recipe.prep_time_minutes,
        original_cook_time: recipe.cook_time_minutes,
        adjusted_prep_time: adjustedPrepTime,
        adjusted_cook_time: adjustedCookTime,
        adjustment_reason: `Equipment: ${equipment.name}`
      })

      return {
        prep_time_minutes: adjustedPrepTime,
        cook_time_minutes: adjustedCookTime,
        temperature_adjustment: equipment.temperature_adjustment
      }
    } catch (error) {
      console.error('Error adjusting cooking time:', error)
      return null
    }
  }

  private async saveCookingTimeAdjustment(data: {
    recipe_id: string
    user_id: string
    original_prep_time?: number
    original_cook_time?: number
    adjusted_prep_time: number
    adjusted_cook_time: number
    adjustment_reason: string
    notes?: string
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cooking_time_adjustments')
        .insert([data])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error saving cooking time adjustment:', error)
      return false
    }
  }

  // Smart Recipe Adjustments
  async getSmartAdjustments(recipeId: string, userId: string): Promise<{
    scaling_suggestions: { servings: number; reason: string }[]
    substitution_suggestions: IngredientSubstitution[]
    equipment_suggestions: CookingEquipment[]
  }> {
    try {
      // Get recipe
      const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

      if (!recipe) return { scaling_suggestions: [], substitution_suggestions: [], equipment_suggestions: [] }

      // Scaling suggestions based on common serving sizes
      const scalingSuggestions = [
        { servings: 2, reason: 'Perfect for couples' },
        { servings: 4, reason: 'Family-sized portions' },
        { servings: 6, reason: 'Dinner party portions' },
        { servings: 8, reason: 'Large gathering portions' }
      ].filter(suggestion => suggestion.servings !== recipe.servings)

      // Get popular substitutions for recipe ingredients
      const { data: ingredients } = await supabase
        .from('recipe_ingredients')
        .select('name')
        .eq('recipe_id', recipeId)

      const substitutionSuggestions: IngredientSubstitution[] = []
      if (ingredients) {
        for (const ingredient of ingredients.slice(0, 3)) { // Limit to first 3 ingredients
          const substitutions = await this.getSubstitutions(ingredient.name)
          substitutionSuggestions.push(...substitutions.slice(0, 2)) // Top 2 substitutions per ingredient
        }
      }

      // Equipment suggestions based on recipe type
      const equipmentSuggestions = await this.getCookingEquipment()

      return {
        scaling_suggestions: scalingSuggestions,
        substitution_suggestions: substitutionSuggestions,
        equipment_suggestions: equipmentSuggestions
      }
    } catch (error) {
      console.error('Error getting smart adjustments:', error)
      return { scaling_suggestions: [], substitution_suggestions: [], equipment_suggestions: [] }
    }
  }

  // Analytics
  async getAdjustmentAnalytics(userId: string): Promise<any> {
    try {
      const { data: scalingHistory } = await supabase
        .from('recipe_scaling_history')
        .select('*')
        .eq('user_id', userId)

      const { data: timeAdjustments } = await supabase
        .from('cooking_time_adjustments')
        .select('*')
        .eq('user_id', userId)

      if (!scalingHistory) return {}

      const totalScalingEvents = scalingHistory.length
      const averageScalingFactor = scalingHistory.reduce((sum, event) => sum + event.scaling_factor, 0) / totalScalingEvents
      const mostScaledRecipes = scalingHistory.reduce((acc, event) => {
        acc[event.recipe_id] = (acc[event.recipe_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalScalingEvents,
        averageScalingFactor: Math.round(averageScalingFactor * 100) / 100,
        mostScaledRecipes: Object.entries(mostScaledRecipes)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([recipeId, count]) => ({ recipeId, count })),
        totalTimeAdjustments: timeAdjustments?.length || 0
      }
    } catch (error) {
      console.error('Error getting adjustment analytics:', error)
      return {}
    }
  }
}

// Export singleton instance
export const recipeAdjustmentService = RecipeAdjustmentService.getInstance() 
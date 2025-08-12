'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import RecipeAdjustments from '@/components/RecipeAdjustments'
import { recipeAdjustmentService } from '@/lib/recipeAdjustmentService'
import { supabase } from '@/lib/supabase'
import { Scale, Calculator, ChefHat, Clock, TrendingUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function RecipeAdjustmentPage() {
  const { user } = useAuth()
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>({})

  useEffect(() => {
    if (user) {
      loadUserRecipes()
      loadAnalytics()
    }
  }, [user])

  const loadUserRecipes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, servings, prep_time_minutes, cook_time_minutes')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error loading recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!user) return
    
    try {
      const adjustmentAnalytics = await recipeAdjustmentService.getAdjustmentAnalytics(user.id)
      setAnalytics(adjustmentAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access Recipe Adjustments</h1>
          <p className="text-gray-600 mb-6">Scale recipes, convert units, and customize your cooking experience</p>
          <Link
            href="/login"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Adjustments</h1>
            <p className="text-gray-600">
              Scale, convert, and customize your recipes with smart adjustments
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Recipe</h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
                  <p className="text-gray-600 mb-4">Create your first recipe to start adjusting</p>
                  <Link
                    href="/create/recipe"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Create Recipe
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedRecipe?.id === recipe.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                      <p className="text-sm text-gray-600">
                        {recipe.servings} servings • {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Analytics */}
            {Object.keys(analytics).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Adjustment Stats</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Scaling Events</span>
                    <span className="font-medium">{analytics.totalScalingEvents || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Scaling Factor</span>
                    <span className="font-medium">{analytics.averageScalingFactor || 0}x</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Adjustments</span>
                    <span className="font-medium">{analytics.totalTimeAdjustments || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recipe Adjustments */}
          <div className="lg:col-span-2">
            {selectedRecipe ? (
              <RecipeAdjustments
                recipeId={selectedRecipe.id}
                currentServings={selectedRecipe.servings}
                onScaledRecipe={(scaledRecipe) => {
                  console.log('Recipe scaled:', scaledRecipe)
                  // You could update the UI here or save the scaled recipe
                }}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Recipe</h3>
                <p className="text-gray-600">
                  Choose a recipe from the list to start scaling, converting units, and making adjustments.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Adjustment Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Scale className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Recipe Scaling</h3>
              </div>
              <p className="text-sm text-gray-600">
                Automatically scale ingredients and cooking times for different serving sizes.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Unit Conversions</h3>
              </div>
              <p className="text-sm text-gray-600">
                Convert between metric and imperial units, volumes, weights, and temperatures.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChefHat className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Ingredient Substitutions</h3>
              </div>
              <p className="text-sm text-gray-600">
                Find and suggest ingredient substitutions for dietary needs or availability.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Equipment Adjustments</h3>
              </div>
              <p className="text-sm text-gray-600">
                Adjust cooking times and temperatures based on your available equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Tips and Tricks */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Scaling Tips</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Scaling works best for 0.5x to 4x the original recipe</li>
                <li>• Very large scaling may require equipment adjustments</li>
                <li>• Some ingredients don't scale linearly (spices, salt)</li>
                <li>• Always taste and adjust seasonings after scaling</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Conversion Tips</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use weight measurements for baking accuracy</li>
                <li>• Temperature conversions are exact, not approximate</li>
                <li>• Volume conversions may vary by ingredient density</li>
                <li>• Keep a conversion chart handy for quick reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
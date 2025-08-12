'use client'

import React, { useState, useEffect } from 'react'
import { recipeOrganizationService } from '@/lib/recipeOrganizationService'
import { Sparkles, Clock, Users, Star, ChefHat } from 'lucide-react'
import Link from 'next/link'

interface RecipeRecommendationsProps {
  currentRecipeId?: string
  userId?: string
  limit?: number
  title?: string
}

export default function RecipeRecommendations({ 
  currentRecipeId, 
  userId, 
  limit = 6,
  title = "Recommended Recipes"
}: RecipeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRecipeId) {
      loadRecommendations()
    }
  }, [currentRecipeId])

  const loadRecommendations = async () => {
    if (!currentRecipeId) return

    try {
      setLoading(true)
      const results = await recipeOrganizationService.getRecommendedRecipes(currentRecipeId, limit)
      setRecommendations(results)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {recipe.image_url && (
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            
            <div className="p-4">
              <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                {recipe.title}
              </h4>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {recipe.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{recipe.prep_time_minutes + recipe.cook_time_minutes}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>
                
                {recipe.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{recipe.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Recipe metadata badges */}
              <div className="flex flex-wrap gap-1 mt-3">
                {recipe.recipe_category_assignments?.slice(0, 2).map((assignment: any) => (
                  <span
                    key={assignment.recipe_categories?.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {assignment.recipe_categories?.icon} {assignment.recipe_categories?.name}
                  </span>
                ))}
                
                {recipe.recipe_tag_assignments?.slice(0, 1).map((assignment: any) => (
                  <span
                    key={assignment.recipe_tags?.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    {assignment.recipe_tags?.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 
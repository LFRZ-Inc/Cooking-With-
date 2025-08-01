'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TrashIcon, RefreshCwIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface Recipe {
  id: string
  title: string
  description: string
  author_id: string | null
  difficulty: string
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  created_at: string
}

interface DbError {
  message: string
  details?: string
  hint?: string
  code?: string
}

export default function AdminPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [clearingAll, setClearingAll] = useState(false)

  const fetchRecipes = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(`Database Error: ${fetchError.message}`)
        console.error('Fetch error:', fetchError)
      } else {
        setRecipes(data || [])
        setSuccessMessage(`Successfully loaded ${data?.length || 0} recipes`)
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`)
      console.error('Network error:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecipe = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    setDeletingId(id)
    setError(null)
    try {
      // First delete ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id)

      if (ingredientsError) {
        throw new Error(`Failed to delete ingredients: ${ingredientsError.message}`)
      }

      // Then delete recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (recipeError) {
        throw new Error(`Failed to delete recipe: ${recipeError.message}`)
      }

      setSuccessMessage(`Successfully deleted "${title}"`)
      fetchRecipes() // Refresh the list
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const clearAllUserRecipes = async () => {
    if (!confirm('Are you sure you want to delete ALL user-created recipes? This cannot be undone!')) return
    
    setClearingAll(true)
    setError(null)
    try {
      // Get all recipe IDs first
      const { data: recipeData, error: fetchError } = await supabase
        .from('recipes')
        .select('id')

      if (fetchError) {
        throw new Error(`Failed to fetch recipes: ${fetchError.message}`)
      }

      const recipeIds = recipeData?.map(r => r.id) || []

      // Delete all ingredients first
      if (recipeIds.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .in('recipe_id', recipeIds)

        if (ingredientsError) {
          throw new Error(`Failed to delete ingredients: ${ingredientsError.message}`)
        }
      }

      // Then delete all recipes
      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (recipesError) {
        throw new Error(`Failed to delete recipes: ${recipesError.message}`)
      }

      setSuccessMessage(`Successfully deleted ${recipeIds.length} recipes and their ingredients`)
      fetchRecipes() // Refresh the list
    } catch (err: any) {
      setError(err.message)
    } finally {
      setClearingAll(false)
    }
  }

  const testRecipeCreation = async () => {
    setError(null)
    try {
      // Test creating a recipe
      const testRecipe = {
        title: 'Test Recipe - Safe to Delete',
        description: 'This is a test recipe created by the admin panel',
        author_id: null, // Test anonymous creation
        difficulty: 'easy' as const,
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        servings: 2,
        instructions: JSON.stringify(['Test step 1', 'Test step 2']),
        tips: 'Test tip',
        status: 'published' as const,
        rating: 0,
        rating_count: 0,
        view_count: 0
      }

      const { data, error: createError } = await supabase
        .from('recipes')
        .insert([testRecipe])
        .select()
        .single()

      if (createError) {
        throw new Error(`Recipe creation failed: ${createError.message}`)
      }

      setSuccessMessage(`Test recipe created successfully with ID: ${data.id}`)
      fetchRecipes()
    } catch (err: any) {
      setError(`Test failed: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchRecipes()
    // Clear messages after 5 seconds
    const timer = setTimeout(() => {
      setSuccessMessage(null)
      setError(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage recipes and troubleshoot database issues</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">Error:</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Success:</p>
            </div>
            <p className="text-green-700 mt-1">{successMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchRecipes}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            
            <button
              onClick={testRecipeCreation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Test Recipe Creation
            </button>
            
            <button
              onClick={clearAllUserRecipes}
              disabled={clearingAll}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {clearingAll ? 'Clearing...' : 'Clear All Recipes'}
            </button>
          </div>
        </div>

        {/* Recipes List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Database Recipes ({recipes.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recipes found in database</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {recipe.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{recipe.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recipe.author_id ? (
                          <span className="text-green-600 font-mono">{recipe.author_id.substring(0, 8)}...</span>
                        ) : (
                          <span className="text-red-500 font-medium">NULL</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(recipe.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteRecipe(recipe.id, recipe.title)}
                          disabled={deletingId === recipe.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
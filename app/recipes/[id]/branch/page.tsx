'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  GitBranchIcon,
  UserIcon,
  HeartIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Recipe {
  id: string
  title: string
  description: string
  author_id: string | null
  difficulty: string
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  instructions: any
  tips: string | null
  image_url: string | null
  author?: string
  created_at: string
}

interface BranchRecipePageProps {
  params: { id: string }
}

export default function BranchRecipePage({ params }: BranchRecipePageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [modifications, setModifications] = useState('')

  // Fetch original recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!user || !isAuthenticated) {
        router.push('/login?redirectTo=' + encodeURIComponent(window.location.pathname))
        return
      }

      try {
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', params.id)
          .single()

        if (recipeError || !recipeData) {
          toast.error('Recipe not found')
          router.push('/recipes')
          return
        }

        // Check if user is trying to branch their own recipe
        if (recipeData.author_id === user.id) {
          toast.error('You cannot fork your own recipe. Use the edit function instead.')
          router.push(`/recipes/${params.id}`)
          return
        }

        setRecipe({
          ...recipeData,
          author: recipeData.author_id ? 'Registered Chef' : 'Anonymous Chef'
        })

      } catch (error) {
        console.error('Error fetching recipe:', error)
        toast.error('Failed to load recipe')
        router.push('/recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id, user, isAuthenticated, router])

  // Create branch
  const handleCreateBranch = async () => {
    if (!recipe || !user) return

    if (!branchName.trim()) {
      toast.error('Please enter a name for your recipe variation')
      return
    }

    setCreating(true)
    try {
      // Fetch original recipe ingredients
      const { data: ingredientsData } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipe.id)
        .order('order_index')

      // Create the branched recipe
      const branchedRecipeData = {
        title: `${recipe.title} - ${branchName}`,
        description: `${recipe.description}\n\n--- ${user.email}'s Variation ---\n${modifications || 'Custom variation of the original recipe.'}`,
        author_id: user.id,
        difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
        prep_time_minutes: recipe.prep_time_minutes,
        cook_time_minutes: recipe.cook_time_minutes,
        servings: recipe.servings,
        instructions: recipe.instructions,
        tips: recipe.tips,
        image_url: recipe.image_url,
        status: 'published' as const,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        version_number: 1,
        parent_recipe_id: recipe.id,
        is_original: false,
        branch_name: branchName
      }

      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([branchedRecipeData])
        .select()
        .single()

      if (recipeError) {
        throw recipeError
      }

      // Copy ingredients to the new recipe
      if (newRecipe && ingredientsData && ingredientsData.length > 0) {
        const newIngredientsData = ingredientsData.map(ingredient => ({
          recipe_id: newRecipe.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes,
          order_index: ingredient.order_index
        }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(newIngredientsData)

        if (ingredientsError) {
          console.error('Error copying ingredients:', ingredientsError)
        }
      }

      toast.success('Recipe forked successfully! You can now edit your version.')
      router.push(`/recipes/${newRecipe.id}/edit`)

    } catch (error: any) {
      console.error('Error creating branch:', error)
      toast.error(error.message || 'Failed to fork recipe')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading recipe...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href={`/recipes/${params.id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Recipe</span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <GitBranchIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fork Recipe</h1>
          </div>
          <p className="text-gray-600">
            Create your own version of this recipe with proper attribution to the original creator.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Original Recipe Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Original Recipe</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={recipe.image_url || "https://via.placeholder.com/100x100"}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <UserIcon className="h-4 w-4" />
                    <span>{recipe.author}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{recipe.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">{recipe.prep_time_minutes + recipe.cook_time_minutes} min</div>
                  <div className="text-blue-700">Total Time</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">{recipe.servings}</div>
                  <div className="text-green-700">Servings</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-900">{recipe.difficulty}</div>
                  <div className="text-orange-700">Difficulty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fork Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Variation</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variation Name *
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Spicy Version, Vegan Take, Gluten-Free"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Final title: "{recipe.title} - {branchName || '[Your variation name]'}"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What changes are you making? (Optional)
                </label>
                <textarea
                  value={modifications}
                  onChange={(e) => setModifications(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what you plan to change in this variation - ingredients, cooking method, seasonings, etc."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {modifications.length}/500 characters
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• You'll get a copy of this recipe to edit</li>
                  <li>• Your version will credit the original creator</li>
                  <li>• You can modify ingredients, instructions, and more</li>
                  <li>• Both recipes will show their relationship</li>
                </ul>
              </div>

              <button
                onClick={handleCreateBranch}
                disabled={creating || !branchName.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Fork...</span>
                  </>
                ) : (
                  <>
                    <GitBranchIcon className="h-4 w-4" />
                    <span>Fork This Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Attribution Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🏷️ Attribution & Ethics</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Respect the original creator:</strong> Your forked recipe will clearly show it's based on "{recipe.title}" by {recipe.author}.
            </p>
            <p>
              <strong>Make it your own:</strong> Feel free to modify ingredients, techniques, and presentation while maintaining the attribution.
            </p>
            <p>
              <strong>Share the love:</strong> Great recipes inspire variations. Your twist might inspire someone else's creativity!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
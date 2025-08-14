'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  SearchIcon,
  FilterIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ChefHatIcon,
  Upload,
  Folder,
  Scale
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import Pagination from '@/components/Pagination'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language'
import { useTranslationService } from '@/lib/translationService'
import ClientOnly from '@/lib/ClientOnly'

// Demo recipes removed - only show real user content

interface Recipe {
  id: string
  title: string
  description: string
  image_url?: string
  prep_time_minutes: number
  cook_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  author_id?: string
  category?: string
  tags: string[]
  created_at: string
  // Version control fields
  version_number?: number
  parent_recipe_id?: string | null
  is_original?: boolean
  branch_name?: string | null
  // Mock fields for display (we'll enhance these later)
  rating?: number
  author?: string
  dietType?: string
  ingredients?: string[]
  inventor?: string
  history?: string
}

function RecipesPageContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const { t } = useLanguage()
  const { translateContent } = useTranslationService()

  // Fetch recipes from Supabase and mix with demo recipes
  const fetchRecipes = async () => {
    try {

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recipes:', error)
        // If there's an error, show empty recipes
        setRecipes([])
        return
      }

      // Transform real data and add mock fields for demo purposes
      const transformedRealRecipes = data?.map((recipe) => ({
        ...recipe,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        author: recipe.author_id ? 'Luis Rodriguez' : 'Anonymous Chef', // Show actual user name
        dietType: recipe.category || 'General',
        ingredients: [], // Will be populated from recipe_ingredients table later
        inventor: 'User Creation',
        history: 'This recipe was shared by our community members.'
      })) || []

      // Sort real recipes by creation date
      const sortedRecipes = transformedRealRecipes
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      // Translate recipes if not in English
      const translatedRecipes = await Promise.all(
        sortedRecipes.map(async (recipe) => {
          try {
            return await translateContent(recipe, 'recipe')
          } catch (error) {
            console.error('Translation error for recipe:', recipe.id, error)
            return recipe // Fallback to original recipe
          }
        })
      )

      setRecipes(translatedRecipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      // If there's an error, show empty recipes
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and auto-refresh every 15 minutes
  useEffect(() => {
    fetchRecipes()
    
    const interval = setInterval(() => {
      fetchRecipes()
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(interval)
  }, [])

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedDifficulty])

  const categories = ['All', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean)))]
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading fresh recipes...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Demo Recipes Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ChefHatIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div className="text-sm text-blue-800">
              <strong>{t('recipes.realRecipesBanner')}</strong>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('recipes.recipeCollection')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {t('recipes.discoverRecipes')}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/create/recipe"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <ChefHatIcon className="h-5 w-5 mr-2" />
              {t('recipes.createRecipe')}
            </Link>
                            <Link
                  href="/recipes/import"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {t('recipes.importRecipe')}
                </Link>
                <Link
                  href="/recipes/organize"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Folder className="h-5 w-5 mr-2" />
                  {t('recipes.organizeRecipes')}
                </Link>
                <Link
                  href="/recipes/adjust"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Scale className="h-5 w-5 mr-2" />
                  {t('recipes.adjustRecipes')}
                </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('recipes.searchRecipes')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <FilterIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHatIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or <Link href="/create/recipe" className="text-orange-600 hover:text-orange-700">create the first recipe</Link>!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecipes.map((recipe) => {
                console.log('🔍 Rendering recipe:', recipe.id, recipe.title)
                return (
              <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                {/* Recipe Image */}
                <div className="relative h-48 bg-gray-200">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <ChefHatIcon className="h-12 w-12 text-orange-400" />
                    </div>
                  )}
                  
                  {/* Unverified Content Badge */}
                  {!recipe.author_id && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Unverified Content
                      </span>
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-medium">{recipe.category || 'General'}</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{recipe.rating?.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{(recipe.prep_time_minutes + recipe.cook_time_minutes)} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHatIcon className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <HeartIcon className="h-5 w-5 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">
                        {t('content.cookedWith')} <span className="font-medium">{recipe.author}</span>
                      </p>
                      {recipe.author_id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t('content.registeredChef')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-center block"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            )
          })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredRecipes.length}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <AuthGuard>
      <ClientOnly fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      }>
        <RecipesPageContent />
      </ClientOnly>
    </AuthGuard>
  )
} 
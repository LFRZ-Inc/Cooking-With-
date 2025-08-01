'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  SearchIcon,
  FilterIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ChefHatIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'

// Mock demo recipes - these will be mixed with real user submissions
const demoRecipes = [
  {
    id: 9001, // High ID to avoid conflicts
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh porcini mushrooms.",
    image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: "medium" as const,
    servings: 4,
    author_id: "demo_user_123", // Demo user
    category: "Italian",
    tags: ["Italian", "Vegetarian", "Rice"],
    created_at: "2024-01-15T10:00:00Z",
    rating: 4.8,
    author: "Chef Maria",
    dietType: "Vegetarian",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Arborio rice (1 cup)", "Porcini mushrooms (200g)", "Parmigiano-Reggiano (100g)", "Dry white wine (1/2 cup)", "Warm vegetable broth (1 liter)", "Onion (1 medium)", "Butter (4 tbsp)", "Extra virgin olive oil (2 tbsp)", "Fresh parsley", "Salt and white pepper"],
    inventor: "Traditional Northern Italian dish",
    history: "Risotto originated in Northern Italy during the 14th century when rice cultivation began in the Po Valley. The technique of slowly adding warm broth to rice was perfected by Milanese cooks, creating the signature creamy texture without cream. This mushroom variation became popular in the 19th century when dried porcini mushrooms became widely available."
  },
  {
    id: 9002,
    title: "Classic Margherita Pizza",
    description: "Traditional Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, and basil.",
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    prep_time_minutes: 30,
    cook_time_minutes: 15,
    difficulty: "medium" as const,
    servings: 2,
    author_id: "demo_user_456", // Demo user
    category: "Italian",
    tags: ["Italian", "Pizza", "Vegetarian"],
    created_at: "2024-01-12T14:30:00Z",
    rating: 4.9,
    author: "Pizzaiolo Antonio",
    dietType: "Vegetarian",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Neapolitan pizza dough (300g)", "San Marzano tomatoes (200g)", "Mozzarella di bufala (150g)", "Fresh basil leaves", "Extra virgin olive oil", "Sea salt", "Tipo 00 flour for dusting"],
    inventor: "Raffaele Esposito (1889)",
    history: "Created in 1889 by pizzaiolo Raffaele Esposito at Pizzeria Brandi in Naples for Queen Margherita of Savoy. The pizza featured the colors of the Italian flag: red tomatoes, white mozzarella, and green basil. This was the birth of the modern pizza as we know it, transforming from a simple flatbread into an artistic culinary expression."
  },
  {
    id: 9003,
    title: "Chocolate Lava Cake",
    description: "Decadent individual chocolate cake with a molten center, invented by Jean-Georges Vongerichten.",
    image_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    prep_time_minutes: 15,
    cook_time_minutes: 12,
    difficulty: "hard" as const,
    servings: 4,
    author_id: undefined, // Anonymous demo submission
    category: "Dessert",
    tags: ["Dessert", "Chocolate", "French"],
    created_at: "2024-01-10T16:45:00Z",
    rating: 4.7,
    author: "Anonymous Chef",
    dietType: "Vegetarian",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Dark chocolate 70% (100g)", "Unsalted butter (100g)", "Large eggs (2 whole + 2 yolks)", "Caster sugar (60g)", "Plain flour (30g)", "Butter for ramekins", "Cocoa powder for dusting", "Vanilla ice cream (to serve)"],
    inventor: "Jean-Georges Vongerichten (1987)",
    history: "Invented by accident in 1987 by chef Jean-Georges Vongerichten at Lafayette Restaurant in New York. He was baking chocolate sponge cakes when he pulled one out too early and discovered the molten center. This happy accident became one of the most iconic desserts of the late 20th century, popularizing the concept of 'controlled undercooking' in fine dining."
  },
  {
    id: 9004,
    title: "Grilled Salmon with Herbs",
    description: "Wild-caught salmon grilled to perfection with a Mediterranean herb crust and lemon.",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: "easy" as const,
    servings: 4,
    author_id: "demo_user_789", // Demo user
    category: "Seafood",
    tags: ["Seafood", "Mediterranean", "Keto"],
    created_at: "2024-01-08T12:20:00Z",
    rating: 4.6,
    author: "Chef Dimitris",
    dietType: "Keto",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Wild salmon fillets (4 x 150g)", "Fresh dill (2 tbsp)", "Fresh oregano (1 tbsp)", "Lemon zest and juice", "Extra virgin olive oil (3 tbsp)", "Garlic (2 cloves)", "Sea salt", "Freshly ground black pepper", "Capers (optional)"],
    inventor: "Ancient Mediterranean tradition",
    history: "Grilling fish over open flames dates back to ancient Mediterranean civilizations, particularly the Greeks and Romans around 800 BCE. The combination of herbs like oregano and dill with fish was documented in ancient Greek cooking texts. This preparation method preserved the fish's natural flavors while the herbs provided antimicrobial properties, crucial before refrigeration."
  }
]

interface Recipe {
  id: number | string
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

  // Fetch recipes from Supabase and mix with demo recipes
  const fetchRecipes = async () => {
    try {
      console.log('🔍 Demo recipes before processing:', demoRecipes.map(r => ({ id: r.id, title: r.title })))
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recipes:', error)
        // If there's an error, just show demo recipes
        console.log('🔍 Setting recipes to demo recipes only:', demoRecipes.map(r => ({ id: r.id, title: r.title })))
        setRecipes(demoRecipes)
        return
      }

      // Transform real data and add mock fields for demo purposes
      const transformedRealRecipes = data?.map((recipe) => ({
        ...recipe,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        author: recipe.author_id ? 'Registered Chef' : 'Anonymous Chef',
        dietType: recipe.category || 'General',
        ingredients: [], // Will be populated from recipe_ingredients table later
        inventor: 'User Creation',
        history: 'This recipe was shared by our community members.'
      })) || []

      console.log('🔍 Real recipes from DB:', transformedRealRecipes.map(r => ({ id: r.id, title: r.title })))

      // Mix demo recipes with real recipes, sorting by creation date
      const allRecipes = [...demoRecipes, ...transformedRealRecipes]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      console.log('🔍 All recipes after mixing and sorting:', allRecipes.map(r => ({ id: r.id, title: r.title })))
      setRecipes(allRecipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      // If there's an error, just show demo recipes
      console.log('🔍 Catch block - Setting recipes to demo recipes:', demoRecipes.map(r => ({ id: r.id, title: r.title })))
      setRecipes(demoRecipes)
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

  // Debug filtered recipes
  console.log('🔍 Filtered recipes for rendering:', filteredRecipes.map(r => ({ id: r.id, title: r.title })))

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
              <strong>Real Recipes from Our Community!</strong> These are actual recipes shared by users like you. Even though some are marked as demos, they are completely real and followable recipes.
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipe Collection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing recipes shared by our community of passionate cooks and chefs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipes..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
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
                    <p className="text-sm text-gray-600">
                      Cooked With! <span className="font-medium">{recipe.author}</span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-center block"
                    onClick={() => console.log('Navigating to recipe:', recipe.id, 'for title:', recipe.title)}
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <AuthGuard>
      <RecipesPageContent />
    </AuthGuard>
  )
} 
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeftIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ChefHatIcon,
  HeartIcon,
  PrinterIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  EditIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import StarRating, { DualRatingDisplay } from '@/components/StarRating'
import VersionNavigator from '@/components/VersionNavigator'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import ClientOnly from '@/lib/ClientOnly'

// Demo recipes - same as in recipes page
const demoRecipes = [
  {
    id: "9001",
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh porcini mushrooms.",
    image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: "medium" as const,
    servings: 4,
    author_id: "demo_user_123",
    category: "Italian",
    tags: ["Italian", "Vegetarian", "Rice"],
    created_at: "2024-01-15T10:00:00Z",
    author: "Chef Maria",
    ingredients: [
      "Arborio rice (1 cup)",
      "Porcini mushrooms (200g)",
      "Parmigiano-Reggiano (100g)",
      "Dry white wine (1/2 cup)",
      "Warm vegetable broth (1 liter)",
      "Onion (1 medium)",
      "Butter (4 tbsp)",
      "Extra virgin olive oil (2 tbsp)",
      "Fresh parsley",
      "Salt and white pepper"
    ],
    instructions: [
      "Soak the porcini mushrooms in warm water for 20 minutes, then drain and chop.",
      "Heat olive oil and 2 tbsp butter in a heavy-bottomed pan over medium heat.",
      "Add finely chopped onion and cook until translucent, about 3-4 minutes.",
      "Add rice and stir for 2 minutes until grains are well-coated and slightly translucent.",
      "Pour in white wine and stir until absorbed.",
      "Add warm broth one ladle at a time, stirring constantly until absorbed before adding more.",
      "After 18 minutes, add chopped mushrooms and continue stirring.",
      "Once rice is creamy and al dente, remove from heat.",
      "Stir in remaining butter and grated Parmigiano-Reggiano.",
      "Season with salt and pepper, garnish with fresh parsley and serve immediately."
    ],
    inventor: "Traditional Northern Italian dish",
    history: "Risotto originated in Northern Italy during the 14th century when rice cultivation began in the Po Valley. The technique of slowly adding warm broth to rice was perfected by Milanese cooks, creating the signature creamy texture without cream. This mushroom variation became popular in the 19th century when dried porcini mushrooms became widely available.",
    rating: 4.8,
    prepTime: "15 min",
    cookTime: "20 min",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null
  },
  {
    id: "9002",
    title: "Classic Margherita Pizza",
    description: "Traditional Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, and basil.",
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
    prep_time_minutes: 30,
    cook_time_minutes: 15,
    difficulty: "medium" as const,
    servings: 2,
    author_id: "demo_user_456",
    category: "Italian",
    tags: ["Italian", "Pizza", "Vegetarian"],
    created_at: "2024-01-12T14:30:00Z",
    author: "Pizzaiolo Antonio",
    ingredients: [
      "Neapolitan pizza dough (300g)",
      "San Marzano tomatoes (200g)",
      "Mozzarella di bufala (150g)",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Sea salt",
      "Tipo 00 flour for dusting"
    ],
    instructions: [
      "Preheat oven to its highest temperature (usually 500°F/260°C) with pizza stone inside.",
      "Crush San Marzano tomatoes by hand and season with salt.",
      "Stretch pizza dough on floured surface to 12-inch circle.",
      "Spread thin layer of crushed tomatoes, leaving 1-inch border for crust.",
      "Tear mozzarella into chunks and distribute evenly.",
      "Drizzle lightly with olive oil.",
      "Transfer to preheated pizza stone and bake 10-15 minutes until crust is golden.",
      "Remove from oven and immediately top with fresh basil leaves.",
      "Drizzle with olive oil and serve immediately."
    ],
    inventor: "Raffaele Esposito (1889)",
    history: "Created in 1889 by pizzaiolo Raffaele Esposito at Pizzeria Brandi in Naples for Queen Margherita of Savoy. The pizza featured the colors of the Italian flag: red tomatoes, white mozzarella, and green basil. This was the birth of the modern pizza as we know it, transforming from a simple flatbread into an artistic culinary expression.",
    rating: 4.9,
    prepTime: "30 min",
    cookTime: "15 min",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null
  },
  {
    id: "9003",
    title: "Chocolate Lava Cake",
    description: "Decadent individual chocolate cake with a molten center, invented by Jean-Georges Vongerichten.",
    image_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    prep_time_minutes: 15,
    cook_time_minutes: 12,
    difficulty: "hard" as const,
    servings: 4,
    author_id: undefined,
    category: "Dessert",
    tags: ["Dessert", "Chocolate", "French"],
    created_at: "2024-01-10T16:45:00Z",
    author: "Anonymous Chef",
    ingredients: [
      "Dark chocolate 70% (100g)",
      "Unsalted butter (100g)",
      "Large eggs (2 whole + 2 yolks)",
      "Caster sugar (60g)",
      "Plain flour (30g)",
      "Butter for ramekins",
      "Cocoa powder for dusting",
      "Vanilla ice cream (to serve)"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Butter four 6-oz ramekins and dust with cocoa.",
      "Melt chocolate and butter in double boiler until smooth. Remove from heat.",
      "In separate bowl, whisk eggs, egg yolks, and sugar until thick and pale.",
      "Slowly whisk chocolate mixture into egg mixture.",
      "Fold in flour until just combined - don't overmix.",
      "Divide batter among prepared ramekins.",
      "Bake 12-14 minutes until edges are firm but centers still jiggle slightly.",
      "Let stand 1 minute, then run knife around edges and invert onto plates.",
      "Serve immediately with vanilla ice cream."
    ],
    inventor: "Jean-Georges Vongerichten (1987)",
    history: "Invented by accident in 1987 by chef Jean-Georges Vongerichten at Lafayette Restaurant in New York. He was baking chocolate sponge cakes when he pulled one out too early and discovered the molten center. This happy accident became one of the most iconic desserts of the late 20th century, popularizing the concept of 'controlled undercooking' in fine dining.",
    rating: 4.7,
    prepTime: "15 min",
    cookTime: "12 min",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null
  },
  {
    id: "9004",
    title: "Grilled Salmon with Herbs",
    description: "Wild-caught salmon grilled to perfection with a Mediterranean herb crust and lemon.",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: "easy" as const,
    servings: 4,
    author_id: "demo_user_789",
    category: "Seafood",
    tags: ["Seafood", "Mediterranean", "Keto"],
    created_at: "2024-01-08T12:20:00Z",
    author: "Chef Dimitris",
    ingredients: [
      "Wild salmon fillets (4 x 150g)",
      "Fresh dill (2 tbsp)",
      "Fresh oregano (1 tbsp)",
      "Lemon zest and juice",
      "Extra virgin olive oil (3 tbsp)",
      "Garlic (2 cloves)",
      "Sea salt",
      "Freshly ground black pepper",
      "Capers (optional)"
    ],
    instructions: [
      "Preheat grill to medium-high heat and oil grates.",
      "Pat salmon fillets dry and season with salt and pepper.",
      "Mix chopped herbs, minced garlic, lemon zest, and olive oil.",
      "Brush herb mixture generously over salmon fillets.",
      "Grill skin-side up for 4-5 minutes until nice grill marks form.",
      "Flip carefully and grill 3-4 minutes more until fish flakes easily.",
      "Remove from grill and squeeze fresh lemon juice over top.",
      "Garnish with capers if using and serve immediately."
    ],
    inventor: "Ancient Mediterranean tradition",
    history: "Grilling fish over open flames dates back to ancient Mediterranean civilizations, particularly the Greeks and Romans around 800 BCE. The combination of herbs like oregano and dill with fish was documented in ancient Greek cooking texts. This preparation method preserved the fish's natural flavors while the herbs provided antimicrobial properties, crucial before refrigeration.",
    rating: 4.6,
    prepTime: "10 min",
    cookTime: "15 min",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null
  }
]

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
  ingredients?: string[]
  instructions?: string[]
  author?: string
  inventor?: string
  history?: string
  rating?: number
  prepTime?: string
  cookTime?: string
  version_number?: number
  parent_recipe_id?: string | null
  is_original?: boolean
  branch_name?: string | null
}

interface RecipePageProps {
  params: { id: string }
}

// Helper function to safely parse instructions
function parseInstructions(instructions: any): string[] {
  // If it's already an array, return it
  if (Array.isArray(instructions)) {
    return instructions.filter(inst => typeof inst === 'string' && inst.trim() !== '')
  }
  
  // If it's a string, try to parse as JSON
  if (typeof instructions === 'string') {
    try {
      const parsed = JSON.parse(instructions)
      if (Array.isArray(parsed)) {
        return parsed.filter(inst => typeof inst === 'string' && inst.trim() !== '')
      }
      // If it's a single string that failed JSON parsing, treat it as a single instruction
      return [instructions]
    } catch (error) {
      console.warn('Failed to parse instructions as JSON:', error)
      // If JSON parsing fails, treat the string as a single instruction
      return [instructions]
    }
  }
  
  // Fallback
  return []
}

// Helper function to parse and scale ingredients
function parseIngredient(ingredient: string, scale: number) {
  // Pattern 1: "Item name (quantity unit)" - most common format
  const pattern1 = /^(.+?)\s*\(([^)]+)\)(.*)$/
  const match1 = ingredient.match(pattern1)
  
  if (match1) {
    const [, itemName, quantityPart, extra] = match1
    
    // Extract number and unit from the quantity part
    const quantityMatch = quantityPart.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/)
    
    if (quantityMatch) {
      const [, quantity, unit] = quantityMatch
      const scaledQuantity = scaleQuantity(quantity, scale)
      return `${itemName.trim()} (${scaledQuantity} ${unit.trim()})${extra}`
    } else {
      // If we can't parse the quantity, return original
      return ingredient
    }
  }
  
  // Pattern 2: "quantity unit item name" 
  const pattern2 = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-Z]+)\s+(.+)$/
  const match2 = ingredient.match(pattern2)
  
  if (match2) {
    const [, quantity, unit, itemName] = match2
    const scaledQuantity = scaleQuantity(quantity, scale)
    return `${scaledQuantity} ${unit} ${itemName}`
  }
  
  // Pattern 3: "quantity item name" (no unit)
  const pattern3 = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/
  const match3 = ingredient.match(pattern3)
  
  if (match3) {
    const [, quantity, itemName] = match3
    const scaledQuantity = scaleQuantity(quantity, scale)
    return `${scaledQuantity} ${itemName}`
  }
  
  // If no quantity found, return original ingredient (for items like "Salt to taste")
  return ingredient
}

function scaleQuantity(quantity: string, scale: number): string {
  // Handle fractions
  if (quantity.includes('/')) {
    const [numerator, denominator] = quantity.split('/').map(Number)
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return quantity // Return original if parsing fails
    }
    const decimal = numerator / denominator
    const scaled = decimal * scale
    return formatQuantity(scaled)
  }
  
  // Handle regular numbers
  const num = parseFloat(quantity)
  if (isNaN(num)) {
    return quantity // Return original if not a number
  }
  const scaled = num * scale
  return formatQuantity(scaled)
}

function formatQuantity(num: number): string {
  if (num === 0) return "0"
  
  // Convert common decimals to fractions for readability
  const fractionMap: { [key: string]: string } = {
    "0.125": "1/8",
    "0.25": "1/4", 
    "0.33": "1/3",
    "0.5": "1/2",
    "0.66": "2/3",
    "0.75": "3/4"
  }
  
  // Check for exact fraction matches
  const rounded = Math.round(num * 1000) / 1000
  const fractionKey = rounded.toString()
  if (fractionMap[fractionKey]) {
    return fractionMap[fractionKey]
  }
  
  // For numbers with fractional parts, try to represent as mixed numbers
  if (num > 1) {
    const whole = Math.floor(num)
    const fraction = num - whole
    
    // Check if the fractional part matches a common fraction
    const fractionRounded = Math.round(fraction * 1000) / 1000
    const fracKey = fractionRounded.toString()
    if (fractionMap[fracKey]) {
      return `${whole} ${fractionMap[fracKey]}`
    }
  }
  
  // Round to reasonable precision for display
  if (num < 0.1) return (Math.round(num * 100) / 100).toString()
  if (num < 1) return (Math.round(num * 10) / 10).toString()
  if (num < 10) return (Math.round(num * 4) / 4).toString()
  
  // For larger numbers, round to 1 decimal place if needed
  return num % 1 === 0 ? Math.round(num).toString() : (Math.round(num * 10) / 10).toString()
}

function RecipePageContent({ params }: RecipePageProps) {
  const { user } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState(4)
  const [userRating, setUserRating] = useState(0)
  const [selfRating, setSelfRating] = useState(0)
  const [communityRating, setCommunityRating] = useState(0)
  const [communityCount, setCommunityCount] = useState(0)
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [displayedRecipe, setDisplayedRecipe] = useState<Recipe | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<any>(null)

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      const id = params.id
      
      // Check if it's a demo recipe (string ID starting with "900")
      console.log('🔍 Checking recipe ID:', id, 'Type:', typeof id, 'StartsWith900:', id.startsWith("900"))
      console.log('🔍 Available demo recipe IDs:', demoRecipes.map(r => r.id))
      
      if (id.startsWith("900")) {
        console.log('🔍 Found demo recipe ID, searching...')
        const demoRecipe = demoRecipes.find(r => r.id === id)
        if (demoRecipe) {
          console.log('🔍 Demo recipe found:', demoRecipe.title)
          setRecipe(demoRecipe)
          setServings(demoRecipe.servings)
        } else {
          console.log('🔍 Demo recipe not found with ID:', id)
          notFound()
        }
        setLoading(false)
        return
      }

      // Check if the ID is a valid UUID format for database recipes
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.log('Invalid recipe ID format. Expected UUID or demo recipe ID (900X):', id)
        notFound()
        return
      }

      // Fetch real recipe from Supabase (ID is a UUID string)
      try {
        console.log('Fetching recipe with ID:', id)
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single()

        console.log('Recipe fetch result:', { recipeData, recipeError })

        if (recipeError) {
          console.error('Recipe fetch error:', recipeError)
          if (recipeError.code === 'PGRST116') {
            // No rows returned
            notFound()
            return
          }
          // Other database errors - show error instead of 404
          throw new Error(`Database error: ${recipeError.message}`)
        }

        if (!recipeData) {
          console.log('No recipe data returned')
          notFound()
          return
        }

        // Fetch recipe ingredients
        console.log('Fetching ingredients for recipe ID:', id)
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .eq('recipe_id', id)
          .order('order_index')

        console.log('Ingredients fetch result:', { ingredientsData, ingredientsError })

        if (ingredientsError) {
          console.error('Ingredients fetch error:', ingredientsError)
          // Don't fail the whole recipe for ingredients error, just log it
        }

        // Transform the data for display
        const transformedRecipe: Recipe = {
          ...recipeData,
          ingredients: ingredientsData?.map(ing => {
            // Handle different ingredient formatting
            if (ing.amount && ing.unit) {
              return `${ing.name} (${ing.amount} ${ing.unit})`
            } else if (ing.amount) {
              return `${ing.name} (${ing.amount})`
            } else {
              return ing.name
            }
          }) || [],
          instructions: parseInstructions(recipeData.instructions),
          author: recipeData.author_id ? 'Registered Chef' : 'Anonymous Chef',
          inventor: 'User Creation',
          history: 'This recipe was shared by our community members.',
          rating: 4.5 + Math.random() * 0.5,
          prepTime: `${recipeData.prep_time_minutes} min`,
          cookTime: `${recipeData.cook_time_minutes} min`
        }

        setRecipe(transformedRecipe)
        setDisplayedRecipe(transformedRecipe)
        setServings(transformedRecipe.servings)
      } catch (error) {
        console.error('Error fetching recipe:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  // Fetch ratings for this recipe
  const fetchRatings = async () => {
    if (!recipe) return

    try {
      // Fetch all ratings for this recipe
      const { data: ratings, error } = await supabase
        .from('user_ratings')
        .select('*')
        .eq('recipe_id', recipe.id)

      if (error) {
        console.error('Error fetching ratings:', error)
        return
      }

      const allRatings = ratings || []
      
      // Find user's rating (if logged in)
      const userRatingData = user ? allRatings.find(r => r.user_id === user.id) : null
      setUserRating(userRatingData?.rating || 0)

      // Find self-rating (recipe author's rating)
      const selfRatingData = recipe.author_id ? allRatings.find(r => r.user_id === recipe.author_id && r.is_self_rating) : null
      setSelfRating(selfRatingData?.rating || 0)

      // Calculate community rating (exclude self-ratings)
      const communityRatings = allRatings.filter(r => !r.is_self_rating)
      setCommunityCount(communityRatings.length)
      
      if (communityRatings.length > 0) {
        const avgRating = communityRatings.reduce((sum, r) => sum + r.rating, 0) / communityRatings.length
        setCommunityRating(avgRating)
      } else {
        setCommunityRating(0)
      }

    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setRatingsLoading(false)
    }
  }

  // Submit or update user rating
  const handleRatingChange = async (newRating: number) => {
    if (!user || !recipe) {
      toast.error('Please log in to rate recipes')
      return
    }

    try {
      const isAuthor = recipe.author_id === user.id
      const ratingData = {
        user_id: user.id,
        recipe_id: recipe.id.toString(),
        rating: newRating,
        is_self_rating: isAuthor
      }

      // Check if user already has a rating
      const { data: existingRating } = await supabase
        .from('user_ratings')
        .select('*')
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id)
        .single()

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('user_ratings')
          .update({ rating: newRating, updated_at: new Date().toISOString() })
          .eq('id', existingRating.id)

        if (error) throw error
        toast.success(isAuthor ? 'Self-rating updated!' : 'Rating updated!')
      } else {
        // Create new rating
        const { error } = await supabase
          .from('user_ratings')
          .insert([ratingData])

        if (error) throw error
        toast.success(isAuthor ? 'Self-rating added!' : 'Rating added!')
      }

      // Update local state
      setUserRating(newRating)
      if (isAuthor) {
        setSelfRating(newRating)
      }

      // Refresh ratings to update community average
      fetchRatings()

    } catch (error: any) {
      console.error('Error saving rating:', error)
      toast.error('Failed to save rating')
    }
  }

  // Handle version navigation
  const handleVersionChange = (versionData: any) => {
    if (!versionData) {
      // Show current version
      setDisplayedRecipe(recipe)
      setSelectedVersion(null)
    } else {
      // Show historical version
      const versionRecipe = {
        ...recipe,
        ...versionData,
        ingredients: versionData.ingredients?.map((ing: any) => 
          typeof ing === 'string' ? ing : `${ing.amount || ''} ${ing.unit || ''} ${ing.item || ing.name || ''}`.trim()
        ) || [],
        instructions: versionData.instructions || [],
        version_number: versionData.version_number
      }
      setDisplayedRecipe(versionRecipe)
      setSelectedVersion(versionData)
    }
  }

  // Fetch ratings when recipe loads
  useEffect(() => {
    if (recipe) {
      fetchRatings()
    }
  }, [recipe, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading recipe...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe || !displayedRecipe) {
    notFound()
  }

  const servingScale = servings / displayedRecipe.servings
  const scaledIngredients = displayedRecipe.ingredients?.map(ingredient => 
    parseIngredient(ingredient, servingScale)
  ) || []

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Version Navigator */}
      {recipe && recipe.version_number && recipe.version_number > 1 && (
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <VersionNavigator
            recipe={recipe}
            currentVersion={recipe.version_number}
            onVersionChange={handleVersionChange}
          />
        </div>
      )}

      {/* Hero Section */}
        <div className="relative h-96 bg-gray-900">
          <img 
            src={displayedRecipe.image_url || "https://via.placeholder.com/800x600"} 
            alt={displayedRecipe.title}
            className="w-full h-full object-cover opacity-70"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/recipes"
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Recipes</span>
        </Link>

        {/* Recipe Title & Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                {displayedRecipe.category}
              </span>
              {/* Version indicator */}
              {selectedVersion && (
                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                  Version {selectedVersion.version_number}
                </span>
              )}
              <span className="bg-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {displayedRecipe.difficulty}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{displayedRecipe.title}</h1>
            <p className="text-xl text-gray-200 mb-4">{displayedRecipe.description}</p>
            
            <div className="flex items-center space-x-6 text-gray-200">
              <div className="flex items-center space-x-1">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">
                  {communityRating > 0 ? communityRating.toFixed(1) : 'Unrated'}
                </span>
                {communityCount > 0 && (
                  <span className="text-sm opacity-75">({communityCount})</span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5" />
                <span>Prep: {displayedRecipe.prepTime} | Cook: {displayedRecipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UsersIcon className="h-5 w-5" />
                <span>Serves {displayedRecipe.servings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Ingredients & Info */}
          <div className="md:col-span-1 space-y-6">
            {/* Recipe Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cooked With!</span>
                  <span className="font-medium">{recipe.author}</span>
                </div>
                
                {/* Demo Recipe Notice */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">📚 Demo Recipe</p>
                      <p>This is a demo recipe showcasing our platform features. However, it's a <strong>real, tested recipe</strong> with accurate ingredients and instructions that you can follow to create this dish!</p>
                    </div>
                  </div>
                </div>
                
                {/* Anonymous Content Disclaimer */}
                {!recipe.author_id && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-xs text-amber-800">
                        <p className="font-medium mb-1">⚠️ Unverified Content</p>
                        <p>This recipe was submitted anonymously and has not been verified by a registered user. Please use caution and verify ingredients and instructions before cooking.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="font-medium">{recipe.prepTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time:</span>
                  <span className="font-medium">{recipe.cookTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Servings:</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
              </div>

              {/* Serving Size Selector */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg border">
                <h4 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Cooking for how many people?
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    disabled={servings <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-700">{servings}</div>
                    <div className="text-xs text-primary-600">
                      {servings === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {servings !== recipe.servings && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      Ingredients scaled {servingScale > 1 ? 'up' : 'down'} by {Math.round(servingScale * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                  <HeartIcon className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <ShareIcon className="h-4 w-4" />
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <PrinterIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Edit Button (only for recipe author) */}
              {recipe.author_id && user?.id === recipe.author_id && (
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <EditIcon className="h-4 w-4" />
                  <span>Edit Recipe</span>
                </Link>
              )}
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Ratings</h3>
              
              {!ratingsLoading ? (
                <div className="space-y-4">
                  {/* Display Ratings */}
                  <DualRatingDisplay
                    selfRating={selfRating}
                    communityRating={communityRating}
                    communityCount={communityCount}
                    size="md"
                    showLabels={true}
                  />

                  {/* Interactive Rating for Users */}
                  {user && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">
                          {recipe.author_id === user.id ? 'Rate Your Recipe:' : 'Rate This Recipe:'}
                        </h4>
                        <StarRating
                          rating={userRating}
                          interactive={true}
                          onRatingChange={handleRatingChange}
                          showValue={true}
                          size="md"
                        />
                        {userRating > 0 && (
                          <p className="text-sm text-gray-600">
                            {recipe.author_id === user.id 
                              ? 'Your self-rating helps others understand your confidence in this recipe.'
                              : 'Thank you for rating this recipe!'
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Login Prompt for Non-Users */}
                  {!user && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 text-center">
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                          Log in
                        </Link>
                        {' '}to rate this recipe
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                  <span className="ml-2 text-gray-600">Loading ratings...</span>
                </div>
              )}
            </div>

            {/* Recipe Branching */}
            {user && recipe.author_id !== user.id && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Your Take</h3>
                <p className="text-gray-600 mb-4">
                  Want to modify this recipe with your own twist? Create your own version while giving credit to the original creator.
                </p>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/recipes/${recipe.id}/branch`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🍴</span>
                    <span>Fork This Recipe</span>
                  </Link>
                  <div className="text-sm text-gray-500">
                    Your version will credit "{displayedRecipe.author}" as the original creator
                  </div>
                </div>
              </div>
            )}

            {/* Recipe Family Tree (if this is a branch) */}
            {recipe && recipe.parent_recipe_id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Recipe Family Tree</h3>
                <p className="text-blue-700 mb-3">
                  This recipe is a variation of another recipe. 
                  {recipe.branch_name && (
                    <span className="font-medium"> Branch: "{recipe.branch_name}"</span>
                  )}
                </p>
                <Link
                  href={`/recipes/${recipe.parent_recipe_id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                >
                  <span>👨‍🍳</span>
                  <span>View Original Recipe</span>
                </Link>
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <span className="text-sm text-gray-500">
                  For {servings} {servings === 1 ? 'person' : 'people'}
                </span>
              </div>
              <ul className="space-y-3">
                {scaledIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
              
              {servings !== recipe.servings && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    <strong>Smart Scaling:</strong> All quantities have been automatically adjusted for {servings} {servings === 1 ? 'person' : 'people'} 
                    (original recipe serves {recipe.servings}).
                  </p>
                </div>
              )}
            </div>

            {/* Historical Information */}
            {recipe.inventor && (
              <div className="bg-amber-50 border-l-4 border-amber-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Historical Origins</h3>
                <p className="text-sm text-amber-700 mb-2">
                  <strong>Inventor/Origin:</strong> {recipe.inventor}
                </p>
                <p className="text-sm text-amber-600 leading-relaxed">
                  {recipe.history}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-2xl font-semibold mb-6">Instructions</h3>
              <ol className="space-y-6">
                {recipe.instructions?.map((instruction, index) => (
                  <li key={index} className="flex space-x-4">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>

              {/* Scaling Tips */}
              {servings !== recipe.servings && (
                <div className="mt-6 bg-amber-50 border-l-4 border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    <UsersIcon className="h-5 w-5 inline mr-2" />
                    Scaling Tips
                  </h4>
                  <div className="text-amber-700 text-sm space-y-2">
                    {servingScale > 2 && (
                      <p>• <strong>Large batches:</strong> You may need a bigger pot/pan and slightly longer cooking times for even heating.</p>
                    )}
                    {servingScale < 0.75 && (
                      <p>• <strong>Small portions:</strong> Watch cooking times closely - smaller quantities may cook faster.</p>
                    )}
                    <p>• <strong>Seasonings:</strong> Taste as you go - salt and spices may need fine-tuning when scaled.</p>
                    {(recipe.category === "Dessert" || recipe.title.includes("Cake")) && servingScale !== 1 && (
                      <p>• <strong>Baking note:</strong> For best results with scaled baking recipes, consider making multiple smaller batches.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecipePage({ params }: RecipePageProps) {
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
        <RecipePageContent params={params} />
      </ClientOnly>
    </AuthGuard>
  )
} 
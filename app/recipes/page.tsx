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
import { useLanguage } from '@/lib/language'
import ClientOnly from '@/lib/ClientOnly'

// Mock demo recipes - these will be mixed with real user submissions
const demoRecipes = [
  {
    id: "9001", // High ID to avoid conflicts - string to match UUID pattern
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
    id: "9004",
    title: "Authentic Tacos al Pastor",
    description: "Traditional Mexican street tacos with marinated pork, pineapple, and homemade salsa verde.",
    image_url: "https://images.unsplash.com/photo-1565299585323-38174c7e9b72?w=400",
    prep_time_minutes: 45,
    cook_time_minutes: 25,
    difficulty: "medium" as const,
    servings: 6,
    author_id: "luisdrod750@gmail.com",
    category: "Mexican",
    tags: ["Mexican", "Street Food", "Pork", "Tacos"],
    created_at: "2024-01-20T12:00:00Z",
    rating: 4.9,
    author: "Luis Rodriguez",
    dietType: "Regular",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Pork shoulder (2 lbs)", "Corn tortillas (12)", "Fresh pineapple (1 cup diced)", "White onion (1 medium)", "Cilantro (1/2 cup)", "Lime (3 limes)", "Achiote paste (2 tbsp)", "Orange juice (1/2 cup)", "White vinegar (1/4 cup)", "Garlic (4 cloves)", "Chipotle peppers (2)", "Salt and pepper"],
    inventor: "Traditional Mexican recipe - Recipe adapted from Taquería El Califa",
    history: "Tacos al Pastor originated in central Mexico, created by Lebanese immigrants who adapted their shawarma technique using local ingredients. The vertical trompo cooking method and pineapple addition became signature elements of this beloved street food."
  },
  {
    id: "9005",
    title: "Japanese Ramen with Soft-Boiled Eggs",
    description: "Rich tonkotsu-style ramen with perfectly cooked soft-boiled eggs and tender chashu pork.",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    prep_time_minutes: 60,
    cook_time_minutes: 180,
    difficulty: "hard" as const,
    servings: 4,
    author_id: "luisdrod750@gmail.com",
    category: "Japanese",
    tags: ["Japanese", "Soup", "Noodles", "Comfort Food"],
    created_at: "2024-01-18T15:30:00Z",
    rating: 4.7,
    author: "Luis Rodriguez",
    dietType: "Regular",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Ramen noodles (4 portions)", "Pork bones (2 lbs)", "Chashu pork belly (1 lb)", "Eggs (4)", "Green onions (4)", "Nori sheets (4)", "Miso paste (3 tbsp)", "Soy sauce (1/4 cup)", "Sake (2 tbsp)", "Garlic (6 cloves)", "Ginger (2 inches)", "Bamboo shoots (1/2 cup)"],
    inventor: "Traditional Japanese recipe - Inspired by Ippudo Ramen techniques",
    history: "Ramen evolved from Chinese lamian noodles brought to Japan in the early 20th century. Tonkotsu ramen, with its rich pork bone broth, was perfected in Fukuoka and became one of Japan's most beloved comfort foods."
  },
  {
    id: "9006",
    title: "Mediterranean Quinoa Salad",
    description: "Fresh and healthy quinoa salad with cherry tomatoes, cucumbers, feta cheese, and lemon herb dressing.",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    difficulty: "easy" as const,
    servings: 6,
    author_id: "luisdrod750@gmail.com",
    category: "Mediterranean",
    tags: ["Mediterranean", "Healthy", "Vegetarian", "Salad"],
    created_at: "2024-01-16T11:15:00Z",
    rating: 4.6,
    author: "Luis Rodriguez",
    dietType: "Vegetarian",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Quinoa (1.5 cups)", "Cherry tomatoes (2 cups)", "Cucumber (1 large)", "Red onion (1/2 medium)", "Feta cheese (1 cup crumbled)", "Kalamata olives (1/2 cup)", "Fresh parsley (1/2 cup)", "Fresh mint (1/4 cup)", "Lemon juice (1/4 cup)", "Extra virgin olive oil (1/3 cup)", "Garlic (2 cloves)", "Salt and pepper"],
    inventor: "Modern Mediterranean fusion - Recipe inspired by traditional Greek village salads",
    history: "This quinoa salad combines the ancient grain quinoa, originally from the Andes, with classic Mediterranean flavors. It represents the modern fusion of healthy superfoods with traditional Mediterranean diet principles."
  },
  {
    id: "9007",
    title: "Korean Kimchi Fried Rice",
    description: "Spicy and flavorful Korean fried rice made with fermented kimchi, vegetables, and topped with a fried egg.",
    image_url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400",
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: "easy" as const,
    servings: 4,
    author_id: "luisdrod750@gmail.com",
    category: "Korean",
    tags: ["Korean", "Spicy", "Rice", "Comfort Food"],
    created_at: "2024-01-14T18:45:00Z",
    rating: 4.8,
    author: "Luis Rodriguez",
    dietType: "Regular",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Cooked rice (3 cups, day-old preferred)", "Kimchi (1.5 cups chopped)", "Kimchi juice (3 tbsp)", "Vegetable oil (2 tbsp)", "Sesame oil (1 tbsp)", "Garlic (3 cloves minced)", "Green onions (3, chopped)", "Soy sauce (2 tbsp)", "Gochujang (1 tbsp)", "Eggs (4)", "Sesame seeds (for garnish)"],
    inventor: "Traditional Korean home cooking - Recipe learned from Korean grandmother in LA Koreatown",
    history: "Kimchi fried rice (kimchi bokkeumbap) is a beloved Korean comfort food that transforms leftover rice and aged kimchi into a satisfying meal. It's considered the ultimate Korean home cooking dish, often made when the refrigerator needs cleaning out."
  },
  {
    id: "9008",
    title: "French Coq au Vin",
    description: "Classic French braised chicken in red wine with pearl onions, mushrooms, and herbs.",
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
    prep_time_minutes: 30,
    cook_time_minutes: 90,
    difficulty: "medium" as const,
    servings: 6,
    author_id: "luisdrod750@gmail.com",
    category: "French",
    tags: ["French", "Braised", "Chicken", "Wine"],
    created_at: "2024-01-12T14:20:00Z",
    rating: 4.5,
    author: "Luis Rodriguez",
    dietType: "Regular",
    version_number: 1,
    parent_recipe_id: null,
    is_original: true,
    branch_name: null,
    ingredients: ["Chicken thighs (8 pieces)", "Bacon (6 strips)", "Pearl onions (1 lb)", "Mushrooms (8 oz)", "Red wine (750ml bottle)", "Chicken stock (2 cups)", "Tomato paste (2 tbsp)", "Fresh thyme (2 sprigs)", "Bay leaves (2)", "Garlic (4 cloves)", "Butter (3 tbsp)", "Flour (3 tbsp)", "Fresh parsley (for garnish)"],
    inventor: "Traditional French recipe - Adapted from Julia Child's 'Mastering the Art of French Cooking'",
    history: "Coq au Vin is a classic French dish that dates back to ancient Gaul. Legend says Julius Caesar was served this dish by the Gauls as a symbol of their fighting spirit. The dish was popularized in America by Julia Child."
  },
  {
    id: "9002",
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
    id: "9003",
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
    id: "9004",
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
  const { t } = useLanguage()

  // Fetch recipes from Supabase and mix with demo recipes
  const fetchRecipes = async () => {
    try {

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recipes:', error)
        // If there's an error, just show demo recipes
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

      // Mix demo recipes with real recipes, sorting by creation date
      const allRecipes = [...demoRecipes, ...transformedRealRecipes]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setRecipes(allRecipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      // If there's an error, just show demo recipes
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
            {filteredRecipes.map((recipe) => {
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
                    <p className="text-sm text-gray-600">
                      Cooked With! <span className="font-medium">{recipe.author}</span>
                    </p>
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
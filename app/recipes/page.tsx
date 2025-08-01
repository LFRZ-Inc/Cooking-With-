'use client'
import React, { useState } from 'react'
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

// Mock recipe data
const recipes = [
  {
    id: 1,
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh porcini mushrooms.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    cookTime: "35 min",
    difficulty: "Medium",
    rating: 4.8,
    author: "Chef Maria",
    authorId: "user_123", // Authenticated user
    category: "Italian",
    dietType: "Vegetarian",
    ingredients: ["Arborio rice (1 cup)", "Porcini mushrooms (200g)", "Parmigiano-Reggiano (100g)", "Dry white wine (1/2 cup)", "Warm vegetable broth (1 liter)", "Onion (1 medium)", "Butter (4 tbsp)", "Extra virgin olive oil (2 tbsp)", "Fresh parsley", "Salt and white pepper"],
    inventor: "Traditional Northern Italian dish",
    history: "Risotto originated in Northern Italy during the 14th century when rice cultivation began in the Po Valley. The technique of slowly adding warm broth to rice was perfected by Milanese cooks, creating the signature creamy texture without cream. This mushroom variation became popular in the 19th century when dried porcini mushrooms became widely available."
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    description: "Traditional Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, and basil.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    cookTime: "15 min",
    difficulty: "Medium",
    rating: 4.9,
    author: "Pizzaiolo Antonio",
    authorId: "user_456", // Authenticated user
    category: "Italian",
    dietType: "Vegetarian",
    ingredients: ["Neapolitan pizza dough (300g)", "San Marzano tomatoes (200g)", "Mozzarella di bufala (150g)", "Fresh basil leaves", "Extra virgin olive oil", "Sea salt", "Tipo 00 flour for dusting"],
    inventor: "Raffaele Esposito (1889)",
    history: "Created in 1889 by pizzaiolo Raffaele Esposito at Pizzeria Brandi in Naples for Queen Margherita of Savoy. The pizza featured the colors of the Italian flag: red tomatoes, white mozzarella, and green basil. This was the birth of the modern pizza as we know it, transforming from a simple flatbread into an artistic culinary expression."
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    description: "Decadent individual chocolate cake with a molten center, invented by Jean-Georges Vongerichten.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    cookTime: "12 min",
    difficulty: "Hard",
    rating: 4.7,
    author: "Pastry Chef Laurent",
    authorId: null, // Anonymous submission
    category: "Dessert",
    dietType: "Vegetarian",
    ingredients: ["Dark chocolate 70% (100g)", "Unsalted butter (100g)", "Large eggs (2 whole + 2 yolks)", "Caster sugar (60g)", "Plain flour (30g)", "Butter for ramekins", "Cocoa powder for dusting", "Vanilla ice cream (to serve)"],
    inventor: "Jean-Georges Vongerichten (1987)",
    history: "Invented by accident in 1987 by chef Jean-Georges Vongerichten at Lafayette Restaurant in New York. He was baking chocolate sponge cakes when he pulled one out too early and discovered the molten center. This happy accident became one of the most iconic desserts of the late 20th century, popularizing the concept of 'controlled undercooking' in fine dining."
  },
  {
    id: 4,
    title: "Grilled Salmon with Herbs",
    description: "Wild-caught salmon grilled to perfection with a Mediterranean herb crust and lemon.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    cookTime: "15 min",
    difficulty: "Easy",
    rating: 4.6,
    author: "Chef Dimitris",
    authorId: "user_789", // Authenticated user
    category: "Seafood",
    dietType: "Keto",
    ingredients: ["Wild salmon fillets (4 x 150g)", "Fresh dill (2 tbsp)", "Fresh oregano (1 tbsp)", "Lemon zest and juice", "Extra virgin olive oil (3 tbsp)", "Garlic (2 cloves)", "Sea salt", "Freshly ground black pepper", "Capers (optional)"],
    inventor: "Ancient Mediterranean tradition",
    history: "Grilling fish over open flames dates back to ancient Mediterranean civilizations, particularly the Greeks and Romans around 800 BCE. The combination of herbs like oregano and dill with fish was documented in ancient Greek cooking texts. This preparation method preserved the fish's natural flavors while the herbs provided antimicrobial properties, crucial before refrigeration."
  },
  {
    id: 5,
    title: "Quinoa Buddha Bowl",
    description: "Nutritious power bowl with rainbow vegetables, quinoa, and tahini dressing inspired by macrobiotic principles.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    cookTime: "25 min",
    difficulty: "Easy",
    rating: 4.5,
    author: "Wellness Chef Sarah",
    authorId: null, // Anonymous submission
    category: "Healthy",
    dietType: "Vegan",
    ingredients: ["Tricolor quinoa (1 cup)", "Roasted chickpeas (150g)", "Avocado (1 ripe)", "Roasted sweet potato cubes", "Fresh spinach (2 cups)", "Tahini (3 tbsp)", "Lemon juice (2 tbsp)", "Maple syrup (1 tsp)", "Purple cabbage (shredded)", "Hemp seeds", "Pomegranate seeds"],
    inventor: "Modern fusion of ancient traditions",
    history: "Buddha bowls emerged in the 1970s California health food movement, combining ancient grains like quinoa (cultivated by the Incas since 3000 BCE) with macrobiotic principles from Japanese Zen Buddhism. The concept of balanced, colorful meals in one bowl reflects the Buddhist principle of mindful eating and nutritional harmony. Quinoa was considered sacred by the Incas, called 'chisaya mama' or 'mother of all grains.'"
  },
  {
    id: 6,
    title: "Beef Bourguignon",
    description: "Classic Burgundian beef stew slowly braised in red wine with pearl onions and mushrooms.",
    image: "https://images.unsplash.com/photo-1574653853027-5ec760facb1d?w=400",
    cookTime: "3 hours",
    difficulty: "Hard",
    rating: 4.8,
    author: "Chef Auguste",
    authorId: "user_101", // Authenticated user
    category: "French",
    dietType: "None",
    ingredients: ["Beef chuck cut in cubes (1.5kg)", "Burgundy red wine (750ml)", "Pearl onions (300g)", "Button mushrooms (250g)", "Carrots (3 large)", "Bacon lardons (150g)", "Beef stock (500ml)", "Tomato paste (2 tbsp)", "Fresh thyme", "Bay leaves (2)", "Flour (3 tbsp)", "Butter (2 tbsp)"],
    inventor: "Auguste Escoffier (refined version)",
    history: "Originally a peasant dish from the Burgundy region of France, dating back to the Middle Ages when local farmers would slow-cook tough cuts of beef in local wine. The dish was elevated to haute cuisine status by Auguste Escoffier in the early 20th century. Julia Child's recipe in 'Mastering the Art of French Cooking' (1961) introduced this sophisticated stew to American home cooks, making it a symbol of French culinary excellence."
  }
]

const categories = ["All", "Italian", "French", "Seafood", "Dessert", "Healthy"]
const dietTypes = ["All", "Vegetarian", "Vegan", "Keto", "Gluten-Free"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

function RecipesPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDietType, setSelectedDietType] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         )
    
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory
    const matchesDietType = selectedDietType === 'All' || recipe.dietType === selectedDietType
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDietType && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Recipe Collection
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Discover amazing recipes from our community of passionate cooks
          </p>
          
          {/* Demo Recipe Notice */}
          <div className="max-w-3xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">📚 Demo Recipes Notice</p>
                <p>These recipes are displayed as examples to showcase our platform's features. However, they are <strong>real, tested recipes</strong> that you can cook and enjoy! Each recipe has been carefully crafted with accurate ingredients, measurements, and instructions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <FilterIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <div className="text-sm text-gray-500">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 mt-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Diet Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet Type
                </label>
                <select
                  value={selectedDietType}
                  onChange={(e) => setSelectedDietType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {dietTypes.map(dietType => (
                    <option key={dietType} value={dietType}>{dietType}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="relative">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Cooked With! {recipe.author}</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>
                  
                  {/* Anonymous Content Disclaimer */}
                  {!recipe.authorId && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-600 text-xs">⚠️</span>
                        <span className="text-xs text-amber-800 font-medium">Unverified Content</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">Anonymous submission - use caution</p>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {recipe.difficulty}
                      </span>
                      {recipe.dietType !== 'None' && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          {recipe.dietType}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Key ingredients:</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs">
                          {ingredient}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{recipe.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    {recipe.inventor && (
                      <div className="bg-amber-50 border-l-4 border-amber-200 p-3 mb-4">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Historical Origins</p>
                        <p className="text-xs text-amber-700 mb-1">
                          <strong>Inventor:</strong> {recipe.inventor}
                        </p>
                        <p className="text-xs text-amber-600 leading-relaxed">
                          {recipe.history}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="block w-full text-center btn-primary mt-4"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChefHatIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all recipes.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedDietType('All')
                setSelectedDifficulty('All')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
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
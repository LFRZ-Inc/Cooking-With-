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

// Mock recipe data
const recipes = [
  {
    id: 1,
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh mushrooms.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    cookTime: "30 min",
    difficulty: "Medium",
    rating: 4.8,
    author: "Chef Maria",
    category: "Italian",
    dietType: "Vegetarian",
    ingredients: ["Arborio rice", "Mushrooms", "Parmesan", "White wine", "Vegetable broth", "Onion"]
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    cookTime: "45 min",
    difficulty: "Easy",
    rating: 4.9,
    author: "Tony's Kitchen",
    category: "Italian",
    dietType: "Vegetarian",
    ingredients: ["Pizza dough", "Mozzarella", "Tomatoes", "Basil", "Olive oil"]
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center, perfect for dessert lovers.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    cookTime: "25 min",
    difficulty: "Hard",
    rating: 4.7,
    author: "Sweet Dreams Bakery",
    category: "Dessert",
    dietType: "Vegetarian",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla"]
  },
  {
    id: 4,
    title: "Grilled Salmon with Herbs",
    description: "Fresh Atlantic salmon grilled to perfection with aromatic herbs.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    cookTime: "20 min",
    difficulty: "Easy",
    rating: 4.6,
    author: "Ocean Breeze",
    category: "Seafood",
    dietType: "Keto",
    ingredients: ["Salmon fillet", "Dill", "Lemon", "Olive oil", "Garlic", "Black pepper"]
  },
  {
    id: 5,
    title: "Quinoa Buddha Bowl",
    description: "Nutritious and colorful bowl packed with quinoa, vegetables, and tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    cookTime: "35 min",
    difficulty: "Easy",
    rating: 4.5,
    author: "Healthy Bites",
    category: "Healthy",
    dietType: "Vegan",
    ingredients: ["Quinoa", "Chickpeas", "Avocado", "Sweet potato", "Tahini", "Spinach"]
  },
  {
    id: 6,
    title: "Beef Bourguignon",
    description: "Classic French beef stew braised in red wine with vegetables.",
    image: "https://images.unsplash.com/photo-1574653853027-5ec760facb1d?w=400",
    cookTime: "2.5 hours",
    difficulty: "Hard",
    rating: 4.8,
    author: "French Bistro",
    category: "French",
    dietType: "None",
    ingredients: ["Beef chuck", "Red wine", "Carrots", "Onions", "Mushrooms", "Thyme"]
  }
]

const categories = ["All", "Italian", "French", "Seafood", "Dessert", "Healthy"]
const dietTypes = ["All", "Vegetarian", "Vegan", "Keto", "Gluten-Free"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

export default function RecipesPage() {
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
          <p className="text-lg text-gray-600">
            Discover amazing recipes from our community of passionate cooks
          </p>
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
                    <span className="text-sm text-gray-500">by {recipe.author}</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>
                  
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
                    <div className="flex flex-wrap gap-1">
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
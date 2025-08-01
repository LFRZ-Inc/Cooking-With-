'use client'
import React from 'react'
import Link from 'next/link'
import { 
  ChefHatIcon, 
  BookOpenIcon, 
  NewspaperIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon
} from 'lucide-react'

// Mock data for demo
const featuredRecipes = [
  {
    id: 1,
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh mushrooms.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    cookTime: "30 min",
    difficulty: "Medium",
    rating: 4.8,
    author: "Chef Maria",
    ingredients: ["Arborio rice", "Mushrooms", "Parmesan", "White wine"]
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
    ingredients: ["Pizza dough", "Mozzarella", "Tomatoes", "Basil"]
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
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar"]
  }
]

const latestNewsletters = [
  {
    id: 1,
    title: "Fall Comfort Foods: 10 Recipes to Warm Your Soul",
    excerpt: "As the leaves change color, discover heartwarming recipes perfect for cozy autumn evenings...",
    author: "Emily Chen",
    publishDate: "Oct 15, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "The Art of French Pastry: A Beginner's Guide",
    excerpt: "Master the fundamentals of French pastry with these essential techniques and recipes...",
    author: "Jean-Pierre Dubois",
    publishDate: "Oct 12, 2024",
    readTime: "8 min read"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary-500">Cooking With!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing recipes, share your culinary creations, and stay updated with our delicious newsletters. 
              Join a community of passionate home cooks and professional chefs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/recipes" className="btn-primary text-lg px-8 py-3">
                Explore Recipes
              </Link>
              <Link href="/newsletters" className="btn-secondary text-lg px-8 py-3">
                Read Newsletters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Why Choose Cooking With!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to elevate your cooking journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe Collection</h3>
              <p className="text-gray-600">
                Thousands of recipes from home cooks and professional chefs, all with detailed ingredients and step-by-step instructions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <NewspaperIcon className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Culinary Newsletters</h3>
              <p className="text-gray-600">
                Stay updated with the latest food trends, cooking tips, and seasonal recipes delivered right to your inbox.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join a vibrant community where everyone can share their favorite recipes and culinary discoveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Featured Recipes
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked favorites from our community
              </p>
            </div>
            <Link href="/recipes" className="btn-primary">
              View All Recipes
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
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
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {recipe.difficulty}
                    </span>
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
        </div>
      </section>

      {/* Latest Newsletters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Latest Newsletters
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with culinary insights and trends
              </p>
            </div>
            <Link href="/newsletters" className="btn-primary">
              View All Newsletters
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {latestNewsletters.map((newsletter) => (
              <article key={newsletter.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>by {newsletter.author}</span>
                  <span>{newsletter.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {newsletter.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {newsletter.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{newsletter.publishDate}</span>
                  <Link 
                    href={`/newsletters/${newsletter.id}`}
                    className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of food enthusiasts who share and discover amazing recipes every day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/signup" className="bg-white text-primary-500 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Join the Community
            </Link>
            <Link href="/create" className="border-2 border-white text-white hover:bg-white hover:text-primary-500 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Share Your Recipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 
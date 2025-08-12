'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import RecipeCollections from '@/components/RecipeCollections'
import AdvancedRecipeSearch from '@/components/AdvancedRecipeSearch'
import RecipeRecommendations from '@/components/RecipeRecommendations'
import { Folder, Search, Sparkles, BarChart3, Tag, Users, ChefHat } from 'lucide-react'
import Link from 'next/link'

export default function RecipeOrganizationPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('collections')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCollection, setSelectedCollection] = useState<any>(null)

  const tabs = [
    { id: 'collections', name: 'Collections', icon: Folder },
    { id: 'search', name: 'Advanced Search', icon: Search },
    { id: 'recommendations', name: 'Recommendations', icon: Sparkles },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access Recipe Organization</h1>
          <p className="text-gray-600 mb-6">Create collections, discover recipes, and get personalized recommendations</p>
          <Link
            href="/login"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Organization</h1>
            <p className="text-gray-600">
              Organize, discover, and manage your recipe collection with advanced features
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-8">
            <RecipeCollections
              onCollectionSelect={setSelectedCollection}
              showCreateButton={true}
            />
            
            {selectedCollection && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCollection.name} Collection
                  </h3>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{selectedCollection.description}</p>
                <div className="text-sm text-gray-500">
                  {selectedCollection.recipe_count} recipes • Created {new Date(selectedCollection.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Recipe Search</h2>
              <p className="text-gray-600 mb-6">
                Find recipes using multiple filters including categories, tags, meal types, cuisine types, and more.
              </p>
              
              <AdvancedRecipeSearch
                onSearchResults={setSearchResults}
                onFiltersChange={(filters) => console.log('Filters changed:', filters)}
              />
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                        {recipe.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{recipe.prep_time_minutes + recipe.cook_time_minutes}m</span>
                        <span>{recipe.servings} servings</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Recommendations</h2>
              <p className="text-gray-600 mb-6">
                Discover new recipes based on your preferences and cooking history.
              </p>
              
              <RecipeRecommendations
                userId={user.id}
                limit={9}
                title="Recommended for You"
              />
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipe Analytics</h2>
              <p className="text-gray-600 mb-6">
                Insights about your recipe collection and cooking patterns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ChefHat className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Recipes</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Folder className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Collections</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Tag className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tags Used</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Popular Categories</h3>
                  <div className="space-y-2">
                    {['Dinner', 'Desserts', 'Breakfast', 'Snacks', 'Beverages'].map((category, index) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{12 - index * 2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Most Used Tags</h3>
                  <div className="space-y-2">
                    {['Quick & Easy', 'Family-Friendly', 'Healthy', 'Budget-Friendly', 'Comfort Food'].map((tag, index) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{tag}</span>
                        <span className="text-sm text-gray-500">{15 - index * 2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
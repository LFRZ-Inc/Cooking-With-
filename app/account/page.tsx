'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UserIcon,
  SettingsIcon,
  BookOpenIcon,
  ChefHatIcon,
  NewspaperIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import AuthGuard from '@/components/AuthGuard'

interface UserRecipe {
  id: number
  title: string
  description: string
  image_url?: string
  prep_time_minutes: number
  cook_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  created_at: string
}

interface UserNewsletter {
  id: number
  title: string
  excerpt: string
  category?: string
  featured: boolean
  publish_date: string
  read_time_minutes: number
  created_at: string
}

function AccountPageContent() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([])
  const [userNewsletters, setUserNewsletters] = useState<UserNewsletter[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch user's content
  const fetchUserContent = async () => {
    if (!user?.id) return

    try {
      // Fetch user's recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (recipesError) {
        console.error('Error fetching user recipes:', recipesError)
      } else {
        setUserRecipes(recipes || [])
      }

      // Fetch user's newsletters
      const { data: newsletters, error: newslettersError } = await supabase
        .from('newsletters')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (newslettersError) {
        console.error('Error fetching user newsletters:', newslettersError)
      } else {
        setUserNewsletters(newsletters || [])
      }
    } catch (error) {
      console.error('Error fetching user content:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserContent()
  }, [user?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'recipes', label: 'My Recipes', icon: ChefHatIcon },
    { id: 'newsletters', label: 'My Articles', icon: NewspaperIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Overview</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Statistics Cards */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Total Recipes</p>
                        <p className="text-2xl font-bold">{userRecipes.length}</p>
                      </div>
                      <ChefHatIcon className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Articles</p>
                        <p className="text-2xl font-bold">{userNewsletters.length}</p>
                      </div>
                      <NewspaperIcon className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Account Status</p>
                        <p className="text-lg font-semibold">Active</p>
                      </div>
                      <UserIcon className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    href="/create/recipe"
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChefHatIcon className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Create New Recipe</p>
                      <p className="text-sm text-gray-600">Share your culinary creations</p>
                    </div>
                  </Link>

                  <Link
                    href="/create/newsletter"
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <NewspaperIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Write Article</p>
                      <p className="text-sm text-gray-600">Share cooking tips and stories</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Recipes ({userRecipes.length})</h2>
                <Link
                  href="/create/recipe"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create New Recipe
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : userRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHatIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No recipes yet</h3>
                  <p className="text-gray-500 mb-4">Start sharing your culinary creations!</p>
                  <Link
                    href="/create/recipe"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Create Your First Recipe
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 bg-gray-200">
                        {recipe.image_url ? (
                          <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <ChefHatIcon className="h-8 w-8 text-orange-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{recipe.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                          </div>
                          <span className="capitalize">{recipe.difficulty}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Created {formatDate(recipe.created_at)}</span>
                          <div className="flex space-x-2">
                            <Link
                              href={`/recipes/${recipe.id}`}
                              className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'newsletters' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Articles ({userNewsletters.length})</h2>
                <Link
                  href="/create/newsletter"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Write New Article
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : userNewsletters.length === 0 ? (
                <div className="text-center py-12">
                  <NewspaperIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No articles yet</h3>
                  <p className="text-gray-500 mb-4">Start sharing your cooking insights!</p>
                  <Link
                    href="/create/newsletter"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write Your First Article
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userNewsletters.map((newsletter) => (
                    <div key={newsletter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{newsletter.title}</h3>
                            {newsletter.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{newsletter.excerpt}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Published {formatDate(newsletter.publish_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>{newsletter.read_time_minutes} min read</span>
                            </div>
                            {newsletter.category && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {newsletter.category}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex space-x-2">
                          <Link
                            href={`/newsletters/${newsletter.id}`}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Account Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                      <p className="text-sm text-gray-600">{user?.created_at ? formatDate(user.created_at) : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">Email notifications for new recipes</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-700">Email notifications for new articles</span>
                    </label>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={signOut}
                      className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountPageContent />
    </AuthGuard>
  )
} 
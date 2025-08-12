'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { recipeOrganizationService, RecipeCollection } from '@/lib/recipeOrganizationService'
import { Plus, Folder, Users, Eye, Edit, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RecipeCollectionsProps {
  onCollectionSelect?: (collection: RecipeCollection) => void
  showCreateButton?: boolean
}

export default function RecipeCollections({ 
  onCollectionSelect, 
  showCreateButton = true 
}: RecipeCollectionsProps) {
  const { user } = useAuth()
  const [collections, setCollections] = useState<RecipeCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    is_public: false
  })

  useEffect(() => {
    if (user) {
      loadCollections()
    }
  }, [user])

  const loadCollections = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const userCollections = await recipeOrganizationService.getUserCollections(user.id)
      const publicCollections = await recipeOrganizationService.getPublicCollections()
      
      // Combine user collections with public collections, avoiding duplicates
      const allCollections = [...userCollections]
      publicCollections.forEach(publicCollection => {
        if (!userCollections.find(uc => uc.id === publicCollection.id)) {
          allCollections.push(publicCollection)
        }
      })
      
      setCollections(allCollections)
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newCollection.name.trim()) return

    try {
      const collection = await recipeOrganizationService.createCollection({
        ...newCollection,
        name: newCollection.name.trim()
      })

      if (collection) {
        setCollections(prev => [collection, ...prev])
        setShowCreateModal(false)
        setNewCollection({ name: '', description: '', is_public: false })
        toast.success('Collection created successfully!')
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Failed to create collection')
    }
  }

  const handleCollectionClick = (collection: RecipeCollection) => {
    if (onCollectionSelect) {
      onCollectionSelect(collection)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recipe Collections</h2>
          <p className="text-gray-600">Organize your recipes into custom collections</p>
        </div>
        {showCreateButton && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Collection
          </button>
        )}
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-600 mb-4">Create your first collection to start organizing recipes</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => handleCollectionClick(collection)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Folder className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {collection.is_public ? (
                        <>
                          <Users className="h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Private
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {collection.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{collection.recipe_count} recipes</span>
                <span className="text-xs">
                  {new Date(collection.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Collection</h3>
            
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Family Favorites"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newCollection.is_public}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                  Make this collection public
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 
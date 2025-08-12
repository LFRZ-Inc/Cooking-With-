'use client'

import React, { useState, useEffect } from 'react'
import { recipeOrganizationService } from '@/lib/recipeOrganizationService'
import { Search, Filter, X, Clock, Users, Star, ChefHat } from 'lucide-react'

interface AdvancedRecipeSearchProps {
  onSearchResults: (recipes: any[]) => void
  onFiltersChange?: (filters: any) => void
}

export default function AdvancedRecipeSearch({ 
  onSearchResults, 
  onFiltersChange 
}: AdvancedRecipeSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
    mealTypes: [] as string[],
    cuisineTypes: [] as string[],
    dietaryRestrictions: [] as string[],
    difficulty: '',
    maxPrepTime: 0,
    maxCookTime: 0,
    minServings: 0,
    maxServings: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as any[],
    tags: [] as any[],
    mealTypes: [] as any[],
    cuisineTypes: [] as any[],
    dietaryRestrictions: [] as any[]
  })

  useEffect(() => {
    loadAvailableFilters()
  }, [])

  const loadAvailableFilters = async () => {
    try {
      const [categories, tags, mealTypes, cuisineTypes, dietaryRestrictions] = await Promise.all([
        recipeOrganizationService.getCategories(),
        recipeOrganizationService.getTags(),
        recipeOrganizationService.getMealTypes(),
        recipeOrganizationService.getCuisineTypes(),
        recipeOrganizationService.getDietaryRestrictions()
      ])

      setAvailableFilters({
        categories,
        tags,
        mealTypes,
        cuisineTypes,
        dietaryRestrictions
      })
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim() && Object.values(filters).every(v => 
      Array.isArray(v) ? v.length === 0 : !v
    )) return

    setLoading(true)
    try {
      const searchFilters = {
        search: searchTerm.trim() || undefined,
        ...filters
      }

      // Remove empty filters
      Object.keys(searchFilters).forEach(key => {
        const value = searchFilters[key as keyof typeof searchFilters]
        if (Array.isArray(value) && value.length === 0) {
          delete searchFilters[key as keyof typeof searchFilters]
        } else if (value === '' || value === 0) {
          delete searchFilters[key as keyof typeof searchFilters]
        }
      })

      const results = await recipeOrganizationService.searchRecipes(searchFilters)
      onSearchResults(results)
      
      if (onFiltersChange) {
        onFiltersChange(searchFilters)
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleArrayFilter = (filterType: string, itemId: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType as keyof typeof prev] as string[]).includes(itemId)
        ? (prev[filterType as keyof typeof prev] as string[]).filter((id: string) => id !== itemId)
        : [...(prev[filterType as keyof typeof prev] as string[]), itemId]
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      mealTypes: [],
      cuisineTypes: [],
      dietaryRestrictions: [],
      difficulty: '',
      maxPrepTime: 0,
      maxCookTime: 0,
      minServings: 0,
      maxServings: 0
    })
    setSearchTerm('')
  }

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== 0
  ) || searchTerm.trim()

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search recipes by title, description, or ingredients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
            showFilters || hasActiveFilters
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
              {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '' && v !== 0).length + (searchTerm.trim() ? 1 : 0)}
            </span>
          )}
        </button>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-orange-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.categories.map(categoryId => {
            const category = availableFilters.categories.find(c => c.id === categoryId)
            return category ? (
              <span key={categoryId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {category.icon} {category.name}
                <button
                  onClick={() => toggleArrayFilter('categories', categoryId)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null
          })}

          {filters.tags.map(tagId => {
            const tag = availableFilters.tags.find(t => t.id === tagId)
            return tag ? (
              <span key={tagId} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {tag.name}
                <button
                  onClick={() => toggleArrayFilter('tags', tagId)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null
          })}

          {filters.difficulty && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Difficulty: {filters.difficulty}
              <button
                onClick={() => handleFilterChange('difficulty', '')}
                className="ml-1 hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => toggleArrayFilter('categories', category.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.icon} {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag.id)}
                      onChange={() => toggleArrayFilter('tags', tag.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Meal Types */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Meal Types</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.mealTypes.map((mealType) => (
                  <label key={mealType.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.mealTypes.includes(mealType.id)}
                      onChange={() => toggleArrayFilter('mealTypes', mealType.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {mealType.icon} {mealType.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisine Types */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Cuisine Types</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.cuisineTypes.map((cuisineType) => (
                  <label key={cuisineType.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.cuisineTypes.includes(cuisineType.id)}
                      onChange={() => toggleArrayFilter('cuisineTypes', cuisineType.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {cuisineType.flag_emoji} {cuisineType.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Dietary Restrictions</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.dietaryRestrictions.map((restriction) => (
                  <label key={restriction.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.dietaryRestrictions.includes(restriction.id)}
                      onChange={() => toggleArrayFilter('dietaryRestrictions', restriction.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {restriction.icon} {restriction.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recipe Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Difficulty</h3>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Prep Time (max)</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="15"
                    value={filters.maxPrepTime}
                    onChange={(e) => handleFilterChange('maxPrepTime', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[3rem]">
                    {filters.maxPrepTime === 0 ? 'Any' : `${filters.maxPrepTime}m`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Cook Time (max)</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="240"
                    step="15"
                    value={filters.maxCookTime}
                    onChange={(e) => handleFilterChange('maxCookTime', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[3rem]">
                    {filters.maxCookTime === 0 ? 'Any' : `${filters.maxCookTime}m`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Servings</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={filters.minServings || ''}
                      onChange={(e) => handleFilterChange('minServings', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={filters.maxServings || ''}
                      onChange={(e) => handleFilterChange('maxServings', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
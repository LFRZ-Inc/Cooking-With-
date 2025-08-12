'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { recipeAdjustmentService, ScaledRecipe, IngredientSubstitution, CookingEquipment } from '@/lib/recipeAdjustmentService'
import { Scale, Calculator, Clock, ChefHat, ArrowRight, Plus, Check, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RecipeAdjustmentsProps {
  recipeId: string
  currentServings: number
  onScaledRecipe?: (scaledRecipe: ScaledRecipe) => void
}

export default function RecipeAdjustments({ 
  recipeId, 
  currentServings, 
  onScaledRecipe 
}: RecipeAdjustmentsProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('scaling')
  const [newServings, setNewServings] = useState(currentServings)
  const [scaledRecipe, setScaledRecipe] = useState<ScaledRecipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [substitutions, setSubstitutions] = useState<IngredientSubstitution[]>([])
  const [equipment, setEquipment] = useState<CookingEquipment[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string>('')
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false)
  const [newSubstitution, setNewSubstitution] = useState({
    original_ingredient: '',
    substitute_ingredient: '',
    substitution_ratio: 1,
    unit: '',
    notes: '',
    category: 'availability'
  })

  const tabs = [
    { id: 'scaling', name: 'Recipe Scaling', icon: Scale },
    { id: 'conversions', name: 'Unit Converter', icon: Calculator },
    { id: 'substitutions', name: 'Substitutions', icon: ChefHat },
    { id: 'equipment', name: 'Equipment', icon: Clock }
  ]

  useEffect(() => {
    if (user) {
      loadSubstitutions()
      loadEquipment()
    }
  }, [user])

  const loadSubstitutions = async () => {
    try {
      const popularSubstitutions = await recipeAdjustmentService.getPopularSubstitutions(10)
      setSubstitutions(popularSubstitutions)
    } catch (error) {
      console.error('Error loading substitutions:', error)
    }
  }

  const loadEquipment = async () => {
    try {
      const equipmentList = await recipeAdjustmentService.getCookingEquipment()
      setEquipment(equipmentList)
    } catch (error) {
      console.error('Error loading equipment:', error)
    }
  }

  const handleScaleRecipe = async () => {
    if (!user || newServings === currentServings) return

    setLoading(true)
    try {
      const scaled = await recipeAdjustmentService.scaleRecipe(recipeId, newServings, user.id)
      if (scaled) {
        setScaledRecipe(scaled)
        if (onScaledRecipe) {
          onScaledRecipe(scaled)
        }
        toast.success(`Recipe scaled to ${newServings} servings!`)
      }
    } catch (error) {
      console.error('Error scaling recipe:', error)
      toast.error('Failed to scale recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleEquipmentChange = async (equipmentId: string) => {
    if (!user || !equipmentId) return

    try {
      const adjustment = await recipeAdjustmentService.adjustCookingTime(recipeId, equipmentId, user.id)
      if (adjustment) {
        toast.success(`Cooking time adjusted for ${equipment.find(e => e.id === equipmentId)?.name}`)
      }
    } catch (error) {
      console.error('Error adjusting cooking time:', error)
      toast.error('Failed to adjust cooking time')
    }
  }

  const handleAddSubstitution = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newSubstitution.original_ingredient || !newSubstitution.substitute_ingredient) return

    try {
      const substitution = await recipeAdjustmentService.addSubstitution(newSubstitution)

      if (substitution) {
        setSubstitutions(prev => [substitution, ...prev])
        setShowSubstitutionModal(false)
        setNewSubstitution({
          original_ingredient: '',
          substitute_ingredient: '',
          substitution_ratio: 1,
          unit: '',
          notes: '',
          category: 'availability'
        })
        toast.success('Substitution added successfully!')
      }
    } catch (error) {
      console.error('Error adding substitution:', error)
      toast.error('Failed to add substitution')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recipe Adjustments</h2>
          <p className="text-gray-600">Scale, convert, and customize your recipes</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Scaling Tab */}
      {activeTab === 'scaling' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Scaling</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Servings: {currentServings}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newServings}
                    onChange={(e) => setNewServings(parseInt(e.target.value) || currentServings)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={handleScaleRecipe}
                    disabled={loading || newServings === currentServings}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Scaling...' : 'Scale Recipe'}
                  </button>
                </div>
              </div>

              {scaledRecipe && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Scaled Recipe</h4>
                  <div className="space-y-2 text-sm text-orange-800">
                    <p><strong>Servings:</strong> {scaledRecipe.servings}</p>
                    <p><strong>Prep Time:</strong> {scaledRecipe.prep_time_minutes} minutes</p>
                    <p><strong>Cook Time:</strong> {scaledRecipe.cook_time_minutes} minutes</p>
                    <p><strong>Scaling Factor:</strong> {scaledRecipe.scaling_factor.toFixed(2)}x</p>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-orange-900 mb-2">Scaled Ingredients:</h5>
                    <div className="space-y-1">
                      {scaledRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                          <span>{ingredient.name}</span>
                          <span className="text-orange-600 text-xs">
                            (was {ingredient.original_amount} {ingredient.original_unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversions Tab */}
      {activeTab === 'conversions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Converter</h3>
            <p className="text-gray-600 mb-4">
              Convert between different measurement units for your recipes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Volume</h4>
                <div className="space-y-2 text-sm">
                  <p>• 1 cup = 16 tablespoons = 48 teaspoons</p>
                  <p>• 1 liter = 4.23 cups</p>
                  <p>• 1 gallon = 16 cups</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Weight</h4>
                <div className="space-y-2 text-sm">
                  <p>• 1 pound = 16 ounces = 453.59 grams</p>
                  <p>• 1 kilogram = 2.2 pounds</p>
                  <p>• 1 ounce = 28.35 grams</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Temperature</h4>
                <div className="space-y-2 text-sm">
                  <p>• °F = °C × 9/5 + 32</p>
                  <p>• °C = (°F - 32) × 5/9</p>
                  <p>• 350°F = 177°C</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Common Conversions</h4>
                <div className="space-y-2 text-sm">
                  <p>• 1 stick butter = 1/2 cup = 8 tablespoons</p>
                  <p>• 1 large egg = 1/4 cup</p>
                  <p>• 1 cup flour ≈ 120 grams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Substitutions Tab */}
      {activeTab === 'substitutions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ingredient Substitutions</h3>
              <button
                onClick={() => setShowSubstitutionModal(true)}
                className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            
            <div className="space-y-4">
              {substitutions.map((substitution) => (
                <div key={substitution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{substitution.original_ingredient}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{substitution.substitute_ingredient}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {substitution.substitution_ratio}:1 ratio
                      {substitution.unit && ` in ${substitution.unit}`}
                      {substitution.notes && ` • ${substitution.notes}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {substitution.is_verified && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      substitution.category === 'dietary' ? 'bg-blue-100 text-blue-800' :
                      substitution.category === 'allergy' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {substitution.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cooking Equipment Adjustments</h3>
            <p className="text-gray-600 mb-4">
              Select your cooking equipment to automatically adjust cooking times and temperatures.
            </p>
            
            <div className="space-y-4">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.category === 'oven' ? 'bg-orange-100 text-orange-800' :
                        item.category === 'stovetop' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'appliance' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Time factor: {item.time_adjustment_factor}x
                      {item.temperature_adjustment && ` • Temp: ${item.temperature_adjustment > 0 ? '+' : ''}${item.temperature_adjustment}°F`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEquipmentChange(item.id)}
                    className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Substitution Modal */}
      {showSubstitutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Ingredient Substitution</h3>
            
            <form onSubmit={handleAddSubstitution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Ingredient *
                </label>
                <input
                  type="text"
                  value={newSubstitution.original_ingredient}
                  onChange={(e) => setNewSubstitution(prev => ({ ...prev, original_ingredient: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., butter"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Substitute Ingredient *
                </label>
                <input
                  type="text"
                  value={newSubstitution.substitute_ingredient}
                  onChange={(e) => setNewSubstitution(prev => ({ ...prev, substitute_ingredient: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., olive oil"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ratio
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newSubstitution.substitution_ratio}
                    onChange={(e) => setNewSubstitution(prev => ({ ...prev, substitution_ratio: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newSubstitution.unit}
                    onChange={(e) => setNewSubstitution(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., cup"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newSubstitution.category}
                  onChange={(e) => setNewSubstitution(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="availability">Availability</option>
                  <option value="dietary">Dietary</option>
                  <option value="allergy">Allergy</option>
                  <option value="preference">Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSubstitution.notes}
                  onChange={(e) => setNewSubstitution(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Optional notes..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubstitutionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Add Substitution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 
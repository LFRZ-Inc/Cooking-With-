'use client'
import React, { useState } from 'react'
import { 
  PlusIcon,
  XIcon,
  ImageIcon,
  ClockIcon,
  UsersIcon,
  ChefHatIcon
} from 'lucide-react'

import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

function CreateRecipePageContent() {
  const { user } = useAuth() // Optional user for attribution
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dietType: '',
    difficulty: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    imageUrl: '',
    ingredients: [{ item: '', amount: '', unit: '' }],
    instructions: [''],
    tips: '',
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', amount: '', unit: '' }]
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const updateIngredient = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? value : inst
      )
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Prepare recipe data for Supabase (anonymous or authenticated)
      const recipeData = {
        title: formData.title,
        description: formData.description,
        author_id: user?.id || null, // Use Supabase auth user ID or null for anonymous
        difficulty: formData.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
        prep_time_minutes: parseInt(formData.prepTime) || 0,
        cook_time_minutes: parseInt(formData.cookTime) || 0,
        servings: parseInt(formData.servings) || 1,
        instructions: JSON.stringify(formData.instructions.filter(inst => inst.trim() !== '')),
        tips: formData.tips || null,
        image_url: formData.imageUrl || null,
        status: 'published' as const,
        rating: 0,
        rating_count: 0,
        view_count: 0,
        version_number: 1,
        parent_recipe_id: null,
        is_original: true,
        branch_name: null
      }

      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single()

      if (recipeError) {
        throw recipeError
      }

      // Add ingredients
      if (recipe && formData.ingredients.length > 0) {
        const ingredientsData = formData.ingredients
          .filter(ing => ing.item.trim() !== '')
          .map((ingredient, index) => ({
            recipe_id: recipe.id,
            name: `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`.trim(),
            amount: parseFloat(ingredient.amount) || null,
            unit: ingredient.unit || null,
            order_index: index
          }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsData)

        if (ingredientsError) {
          console.error('Error adding ingredients:', ingredientsError)
        }
      }

      toast.success('Recipe created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        dietType: '',
        difficulty: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        imageUrl: '',
        ingredients: [{ item: '', amount: '', unit: '' }],
        instructions: [''],
        tips: '',
        tags: [] as string[]
      })

    } catch (error: any) {
      console.error('Error creating recipe:', error)
      toast.error(error.message || 'Failed to create recipe')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Share your culinary creation with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  className="input-field"
                  placeholder="e.g., Grandma's Chocolate Chip Cookies"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                  className="input-field"
                  placeholder="Describe your recipe, what makes it special, and any background story..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diet Type
                  </label>
                  <select
                    value={formData.dietType}
                    onChange={(e) => setFormData(prev => ({...prev, dietType: e.target.value}))}
                    className="input-field"
                  >
                    <option value="">Select diet type</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Low-Carb">Low-Carb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({...prev, difficulty: e.target.value}))}
                    className="input-field"
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Time and Servings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Time & Servings
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Prep Time (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({...prev, prepTime: e.target.value}))}
                  className="input-field"
                  placeholder="15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ChefHatIcon className="h-4 w-4 inline mr-1" />
                  Cook Time (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({...prev, cookTime: e.target.value}))}
                  className="input-field"
                  placeholder="30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UsersIcon className="h-4 w-4 inline mr-1" />
                  Servings *
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({...prev, servings: e.target.value}))}
                  className="input-field"
                  placeholder="4"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recipe Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recipe Image
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({...prev, imageUrl: e.target.value}))}
                  className="input-field"
                  placeholder="https://example.com/your-recipe-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste a link to your recipe image. Try free hosting: 
                  <a href="https://imgur.com" target="_blank" rel="noopener" className="text-primary-600 hover:text-primary-700 ml-1">Imgur</a>,
                  <a href="https://postimg.cc" target="_blank" rel="noopener" className="text-primary-600 hover:text-primary-700 ml-1">PostImage</a>, or
                  <a href="https://drive.google.com" target="_blank" rel="noopener" className="text-primary-600 hover:text-primary-700 ml-1">Google Drive</a>
                </p>
              </div>
              
              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative">
                    <img
                      src={formData.imageUrl}
                      alt="Recipe preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = 'block'
                        e.currentTarget.nextElementSibling?.classList.add('hidden')
                      }}
                    />
                    <div className="hidden w-full max-w-md h-48 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-red-600">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Invalid image URL</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Ingredients
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="btn-secondary flex items-center space-x-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Ingredient</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="w-20 input-field"
                    placeholder="1"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-32 input-field"
                  >
                    <option value="">Unit</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="piece">piece</option>
                  </select>
                  <input
                    type="text"
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Ingredient name"
                    required
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Instructions
              </h2>
              <button
                type="button"
                onClick={addInstruction}
                className="btn-secondary flex items-center space-x-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Step</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    rows={2}
                    className="flex-1 input-field"
                    placeholder="Describe this cooking step in detail..."
                    required
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Tips & Notes
                </label>
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData(prev => ({...prev, tips: e.target.value}))}
                  rows={3}
                  className="input-field"
                  placeholder="Share any helpful tips, substitutions, or notes about this recipe..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 input-field"
                    placeholder="Add a tag (e.g., comfort food, quick meal)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-primary-500 hover:text-primary-700"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <button
                type="button"
                className="btn-secondary"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Publish Recipe
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CreateRecipePage() {
  return <CreateRecipePageContent />
} 
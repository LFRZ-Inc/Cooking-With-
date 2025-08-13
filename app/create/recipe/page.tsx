'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/language'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import toast from 'react-hot-toast'

interface RecipeFormData {
  title: string
  description: string
  imageUrl: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: string[]
  instructions: string[]
  selfRating: number
  originalCreator?: string
  culturalOrigin?: string
}

export default function CreateRecipePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    ingredients: [''],
    instructions: [''],
    selfRating: 5
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to create a recipe')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            image_url: formData.imageUrl || null,
            prep_time_minutes: formData.prepTime,
            cook_time_minutes: formData.cookTime,
            servings: formData.servings,
            difficulty: formData.difficulty,
            ingredients: JSON.stringify(formData.ingredients.filter(ing => ing.trim())),
            instructions: JSON.stringify(formData.instructions.filter(inst => inst.trim())),
            author_id: user.id,
            self_rating: formData.selfRating,
            original_creator: formData.originalCreator || null,
            cultural_origin: formData.culturalOrigin || null,
            is_original: true
          }
        ])
        .select()

      if (error) throw error

      toast.success('Recipe created successfully!')
      router.push(`/recipes/${data[0].id}`)
    } catch (error: any) {
      console.error('Error creating recipe:', error)
      toast.error('Failed to create recipe: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
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
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }))
  }

  // Pre-filled recipe data for testing
  const sampleRecipes = [
    {
      title: "Classic Margherita Pizza",
      description: "A traditional Neapolitan pizza with fresh mozzarella, basil, and San Marzano tomatoes. This recipe honors the original 1889 creation by pizzaiolo Raffaele Esposito for Queen Margherita of Savoy.",
      imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
      prepTime: 30,
      cookTime: 12,
      servings: 4,
      difficulty: "medium" as const,
      ingredients: [
        "2 cups (00 flour) for authentic Neapolitan style",
        "1 cup warm water",
        "1 tsp active dry yeast",
        "1 tsp salt",
        "1 tbsp olive oil",
        "8 oz fresh mozzarella di bufala",
        "1/2 cup San Marzano tomato sauce",
        "Fresh basil leaves",
        "Extra virgin olive oil for drizzling"
      ],
      instructions: [
        "Mix flour, yeast, and salt in a large bowl",
        "Gradually add warm water and olive oil, kneading until smooth",
        "Let dough rise for 2 hours in a warm place",
        "Preheat oven to 500°F (260°C) with a pizza stone",
        "Roll out dough into 12-inch circle",
        "Spread tomato sauce, add torn mozzarella",
        "Bake for 10-12 minutes until crust is golden",
        "Add fresh basil and drizzle with olive oil"
      ],
      selfRating: 5,
      originalCreator: "Raffaele Esposito (1889)",
      culturalOrigin: "Neapolitan, Italy"
    },
    {
      title: "Pad Thai",
      description: "Thailand's most famous noodle dish, adapted from traditional Chinese stir-fry techniques. This version balances sweet, sour, salty, and spicy flavors authentically.",
      imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: "medium" as const,
      ingredients: [
        "8 oz rice noodles",
        "2 tbsp tamarind paste",
        "2 tbsp fish sauce",
        "2 tbsp palm sugar",
        "2 eggs",
        "8 oz shrimp or chicken",
        "2 cups bean sprouts",
        "4 green onions, chopped",
        "1/4 cup crushed peanuts",
        "2 limes, cut into wedges",
        "2 tbsp vegetable oil",
        "2 cloves garlic, minced"
      ],
      instructions: [
        "Soak rice noodles in warm water for 30 minutes",
        "Mix tamarind paste, fish sauce, and palm sugar for sauce",
        "Heat oil in wok, add garlic and protein",
        "Push ingredients aside, scramble eggs",
        "Add drained noodles and sauce",
        "Toss until noodles are coated and heated through",
        "Add bean sprouts and green onions",
        "Garnish with peanuts and lime wedges"
      ],
      selfRating: 5,
      originalCreator: "Traditional Thai cuisine",
      culturalOrigin: "Thailand"
    },
    {
      title: "Beef Bourguignon",
      description: "A classic French stew from Burgundy, made famous by Julia Child. This slow-cooked dish features tender beef braised in red wine with pearl onions and mushrooms.",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
      prepTime: 45,
      cookTime: 180,
      servings: 6,
      difficulty: "hard" as const,
      ingredients: [
        "3 lbs beef chuck, cut into 2-inch cubes",
        "1 bottle Burgundy red wine",
        "2 cups beef stock",
        "1 lb pearl onions",
        "1 lb mushrooms, quartered",
        "4 carrots, sliced",
        "4 cloves garlic, minced",
        "2 tbsp tomato paste",
        "2 bay leaves",
        "1 tsp thyme",
        "4 tbsp butter",
        "4 tbsp flour",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Pat beef dry and season with salt and pepper",
        "Brown beef in batches in a Dutch oven",
        "Remove beef, add onions and carrots, cook until softened",
        "Add garlic and tomato paste, cook 1 minute",
        "Return beef, add wine, stock, bay leaves, and thyme",
        "Simmer covered for 2-3 hours until beef is tender",
        "Sauté mushrooms separately in butter",
        "Add mushrooms and pearl onions to stew",
        "Simmer 30 minutes more until sauce thickens"
      ],
      selfRating: 5,
      originalCreator: "Traditional Burgundian cuisine",
      culturalOrigin: "Burgundy, France"
    }
  ]

  const loadSampleRecipe = (recipe: typeof sampleRecipes[0]) => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      selfRating: recipe.selfRating,
      originalCreator: recipe.originalCreator,
      culturalOrigin: recipe.culturalOrigin
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('create.createNewRecipe')}</h1>

          {/* Sample Recipe Loader */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('create.quickStart')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleRecipes.map((recipe, index) => (
                <button
                  key={index}
                  onClick={() => loadSampleRecipe(recipe)}
                  className="p-3 text-left bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-medium text-blue-900">{recipe.title}</h4>
                  <p className="text-sm text-blue-700 mt-1">{recipe.culturalOrigin}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.recipeTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Classic Margherita Pizza"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.difficultyLevel')} *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('create.description')} *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your recipe, its origins, and what makes it special..."
              />
            </div>

            {/* Attribution Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.originalCreator')}
                </label>
                <input
                  type="text"
                  value={formData.originalCreator || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalCreator: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Julia Child, Traditional Italian cuisine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.culturalOrigin')}
                </label>
                <input
                  type="text"
                  value={formData.culturalOrigin || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalOrigin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Neapolitan, Italy"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('create.recipeImage')}
              </label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                placeholder="Upload a beautiful photo of your dish..."
              />
            </div>

            {/* Time and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.selfRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, selfRating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  + Add Ingredient
                </button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      required
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 2 cups all-purpose flour"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions *
                </label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mt-2">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <textarea
                        required
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe this step..."
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t('create.creatingRecipe') : t('create.createRecipe')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
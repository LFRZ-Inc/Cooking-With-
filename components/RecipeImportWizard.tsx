'use client'
import React, { useState, useRef } from 'react'
import { 
  Globe, 
  Camera, 
  FileText, 
  Upload, 
  Check, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Edit3,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useTranslationService } from '@/lib/translationService'
import toast from 'react-hot-toast'

interface RecipeImportWizardProps {
  onImportComplete?: (recipe: any) => void
  onClose?: () => void
}

interface ImportStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface ParsedRecipe {
  title: string
  description?: string
  ingredients: string[]
  instructions: string[]
  prep_time_minutes?: number
  cook_time_minutes?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'
  image_url?: string
  source_url?: string
  confidence_score: number
}

export default function RecipeImportWizard({ onImportComplete, onClose }: RecipeImportWizardProps) {
  const { user } = useAuth()
  const { currentLanguage } = useTranslationService()
  const [currentStep, setCurrentStep] = useState(0)
  const [importType, setImportType] = useState<'webpage' | 'image' | 'text' | null>(null)
  const [sourceData, setSourceData] = useState('')
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedRecipe, setEditedRecipe] = useState<ParsedRecipe | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importSteps: ImportStep[] = [
    {
      id: 'method',
      title: 'Choose Import Method',
      description: 'Select how you want to import your recipe',
      icon: <Upload className="h-6 w-6" />
    },
    {
      id: 'source',
      title: 'Provide Source',
      description: 'Enter the recipe source',
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: 'review',
      title: 'Review & Edit',
      description: 'Review the parsed recipe and make adjustments',
      icon: <Edit3 className="h-6 w-6" />
    },
    {
      id: 'complete',
      title: 'Import Complete',
      description: 'Your recipe has been imported successfully',
      icon: <Check className="h-6 w-6" />
    }
  ]

  const importMethods = [
    {
      id: 'webpage',
      title: 'Import from Website',
      description: 'Paste a recipe URL to import',
      icon: <Globe className="h-8 w-8" />,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'image',
      title: 'Import from Image',
      description: 'Upload a photo or screenshot of a recipe',
      icon: <Camera className="h-8 w-8" />,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'text',
      title: 'Import from Text',
      description: 'Paste recipe text directly',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  const handleImportMethodSelect = (method: 'webpage' | 'image' | 'text') => {
    setImportType(method)
    setCurrentStep(1)
  }

  const handleSourceSubmit = async () => {
    if (!sourceData.trim()) {
      toast.error('Please provide the recipe source')
      return
    }

    setIsImporting(true)
    try {
      const response = await fetch('/api/recipes/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          import_type: importType,
          source_data: sourceData,
          user_id: user?.id,
          auto_translate: currentLanguage !== 'en',
          target_language: currentLanguage
        }),
      })

      if (!response.ok) {
        throw new Error('Import failed')
      }

      const result = await response.json()
      setParsedRecipe(result.recipe)
      setEditedRecipe(result.recipe)
      setCurrentStep(2)
      toast.success('Recipe parsed successfully!')
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to import recipe')
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSourceData(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditField = (field: keyof ParsedRecipe, value: any) => {
    if (!editedRecipe) return
    
    setEditedRecipe({
      ...editedRecipe,
      [field]: value
    })
  }

  const handleSaveRecipe = async () => {
    if (!editedRecipe) return

    setIsImporting(true)
    try {
      const response = await fetch('/api/recipes/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          import_type: 'text',
          source_data: JSON.stringify(editedRecipe),
          user_id: user?.id,
          auto_translate: currentLanguage !== 'en',
          target_language: currentLanguage
        }),
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      const result = await response.json()
      setCurrentStep(3)
      toast.success('Recipe imported successfully!')
      
      if (onImportComplete) {
        onImportComplete(result.recipe)
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save recipe')
    } finally {
      setIsImporting(false)
    }
  }

  const handleAddIngredient = () => {
    if (!editedRecipe) return
    
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients, '']
    })
  }

  const handleRemoveIngredient = (index: number) => {
    if (!editedRecipe) return
    
    setEditedRecipe({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.filter((_, i) => i !== index)
    })
  }

  const handleAddInstruction = () => {
    if (!editedRecipe) return
    
    setEditedRecipe({
      ...editedRecipe,
      instructions: [...editedRecipe.instructions, '']
    })
  }

  const handleRemoveInstruction = (index: number) => {
    if (!editedRecipe) return
    
    setEditedRecipe({
      ...editedRecipe,
      instructions: editedRecipe.instructions.filter((_, i) => i !== index)
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How would you like to import your recipe?
              </h3>
              <p className="text-gray-600">
                Choose the method that works best for your recipe source
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {importMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleImportMethodSelect(method.id as any)}
                  className={`${method.color} text-white p-6 rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col items-center space-y-3`}
                >
                  {method.icon}
                  <div className="text-center">
                    <h4 className="font-medium">{method.title}</h4>
                    <p className="text-sm opacity-90">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {importType === 'webpage' && 'Enter Recipe URL'}
                {importType === 'image' && 'Upload Recipe Image'}
                {importType === 'text' && 'Paste Recipe Text'}
              </h3>
              <p className="text-gray-600">
                {importType === 'webpage' && 'Paste the URL of the recipe you want to import'}
                {importType === 'image' && 'Upload a photo or screenshot of the recipe'}
                {importType === 'text' && 'Copy and paste the recipe text here'}
              </p>
            </div>

            {importType === 'webpage' && (
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://example.com/recipe"
                  value={sourceData}
                  onChange={(e) => setSourceData(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ExternalLink className="h-4 w-4" />
                  <span>Supported sites: AllRecipes, Food Network, Epicurious, and more</span>
                </div>
              </div>
            )}

            {importType === 'image' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="h-6 w-6 inline mr-2" />
                    Choose Image
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}

            {importType === 'text' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Paste your recipe text here..."
                  value={sourceData}
                  onChange={(e) => setSourceData(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="text-sm text-gray-600">
                  <p>💡 Tip: Include ingredients and instructions sections for better parsing</p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSourceSubmit}
                disabled={isImporting || !sourceData.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import Recipe'
                )}
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Review & Edit Recipe
                </h3>
                <p className="text-gray-600">
                  Review the parsed recipe and make any necessary adjustments
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Confidence: {Math.round((parsedRecipe?.confidence_score || 0) * 100)}%</span>
                </div>
              </div>
            </div>

            {editedRecipe && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    value={editedRecipe.title}
                    onChange={(e) => handleEditField('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editedRecipe.description || ''}
                    onChange={(e) => handleEditField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ingredients
                    </label>
                    <button
                      onClick={handleAddIngredient}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => {
                            const newIngredients = [...editedRecipe.ingredients]
                            newIngredients[index] = e.target.value
                            handleEditField('ingredients', newIngredients)
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Instructions
                    </label>
                    <button
                      onClick={handleAddInstruction}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-sm text-gray-500 mt-2">{index + 1}.</span>
                        <textarea
                          value={instruction}
                          onChange={(e) => {
                            const newInstructions = [...editedRecipe.instructions]
                            newInstructions[index] = e.target.value
                            handleEditField('instructions', newInstructions)
                          }}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <button
                          onClick={() => handleRemoveInstruction(index)}
                          className="text-red-500 hover:text-red-600 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipe Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={editedRecipe.prep_time_minutes || ''}
                      onChange={(e) => handleEditField('prep_time_minutes', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cook Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={editedRecipe.cook_time_minutes || ''}
                      onChange={(e) => handleEditField('cook_time_minutes', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servings
                    </label>
                    <input
                      type="number"
                      value={editedRecipe.servings || ''}
                      onChange={(e) => handleEditField('servings', parseInt(e.target.value) || 4)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSaveRecipe}
                    disabled={isImporting}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 inline mr-2" />
                        Save Recipe
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recipe Imported Successfully!
              </h3>
              <p className="text-gray-600">
                Your recipe has been imported and is ready to use.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setCurrentStep(0)
                  setImportType(null)
                  setSourceData('')
                  setParsedRecipe(null)
                  setEditedRecipe(null)
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Import Another Recipe
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Import Recipe
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {importSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < importSteps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                {importSteps[currentStep].title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  )
} 
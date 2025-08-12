'use client'
import React, { useState } from 'react'
import { Plus, Upload, Globe, Camera, FileText } from 'lucide-react'
import RecipeImportWizard from '@/components/RecipeImportWizard'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RecipeImportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)

  const handleImportComplete = (recipe: any) => {
    toast.success(`Recipe "${recipe.title}" imported successfully!`)
    // Redirect to the imported recipe
    router.push(`/recipes/${recipe.id}`)
  }

  const handleCloseWizard = () => {
    setShowWizard(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in to Import Recipes
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to import recipes to your collection.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Import Recipe
              </h1>
              <p className="text-gray-600">
                Import recipes from websites, images, or text
              </p>
            </div>
            <button
              onClick={() => router.push('/recipes')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Recipes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Upload className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Import Your Favorite Recipes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Easily import recipes from any website, photo, or text. Our smart parser will extract all the details and add them to your collection.
          </p>
        </div>

        {/* Import Methods Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import from Website
            </h3>
            <p className="text-gray-600 mb-4">
              Paste a recipe URL and we'll automatically extract all the details.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• AllRecipes, Food Network</li>
              <li>• Epicurious, Bon Appétit</li>
              <li>• And many more sites</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import from Image
            </h3>
            <p className="text-gray-600 mb-4">
              Upload a photo or screenshot of a recipe and we'll extract the text.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Recipe photos</li>
              <li>• Screenshots</li>
              <li>• Handwritten notes</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import from Text
            </h3>
            <p className="text-gray-600 mb-4">
              Copy and paste recipe text directly and we'll parse it for you.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Social media posts</li>
              <li>• Email recipes</li>
              <li>• Any text format</li>
            </ul>
          </div>
        </div>

        {/* Start Import Button */}
        <div className="text-center">
          <button
            onClick={() => setShowWizard(true)}
            className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium flex items-center mx-auto"
          >
            <Plus className="h-6 w-6 mr-2" />
            Start Importing Recipe
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Why Import with Cooking With?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">AI</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Smart Parsing</h4>
              <p className="text-sm text-gray-600">
                Advanced AI automatically extracts ingredients, instructions, and cooking times.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-600 font-bold">🌍</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Auto Translation</h4>
              <p className="text-sm text-gray-600">
                Recipes are automatically translated to your preferred language.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600 font-bold">✏️</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Easy Editing</h4>
              <p className="text-sm text-gray-600">
                Review and edit parsed content before saving to your collection.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-orange-600 font-bold">📱</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Mobile Friendly</h4>
              <p className="text-sm text-gray-600">
                Import recipes on any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3">💡 Import Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• For best results, use recipes with clear ingredient lists and step-by-step instructions</li>
            <li>• When importing from images, ensure the text is clear and well-lit</li>
            <li>• You can always edit the parsed content before saving</li>
            <li>• Imported recipes are automatically translated to your language preference</li>
          </ul>
        </div>
      </div>

      {/* Import Wizard Modal */}
      {showWizard && (
        <RecipeImportWizard
          onImportComplete={handleImportComplete}
          onClose={handleCloseWizard}
        />
      )}
    </div>
  )
} 
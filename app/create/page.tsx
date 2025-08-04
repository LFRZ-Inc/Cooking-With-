'use client'
import React from 'react'
import Link from 'next/link'
import { 
  BookOpenIcon,
  NewspaperIcon,
  PlusCircleIcon,
  ChefHatIcon,
  PenToolIcon
} from 'lucide-react'


function CreatePageContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Share Your Culinary Creativity
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you have an amazing recipe to share or culinary insights to publish, 
            choose how you'd like to contribute to our community.
          </p>
        </div>

        {/* Create Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Create Recipe */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <ChefHatIcon className="h-10 w-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Share a Recipe
              </h2>
              <p className="text-gray-600">
                Add your favorite recipe with ingredients, instructions, and cooking tips
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Upload photos of your dish and ingredients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Add detailed ingredient measurements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Include step-by-step cooking instructions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Set difficulty level and cooking time</span>
                </div>
              </div>
              
              <Link 
                href="/create/recipe" 
                className="block w-full text-center btn-primary"
              >
                Create Recipe
              </Link>
            </div>
          </div>

          {/* Create Newsletter */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <PenToolIcon className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Write a Newsletter
              </h2>
              <p className="text-gray-600">
                Share culinary insights, cooking tips, and food trends with the community
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Rich text editor with formatting options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Add images and recipe references</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Categorize your content with tags</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Schedule publishing for optimal reach</span>
                </div>
              </div>
              
              <Link 
                href="/create/newsletter" 
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Write Newsletter
              </Link>
            </div>
          </div>
        </div>



        {/* Tips */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Tips for Great Content
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">For Recipes:</h4>
              <ul className="space-y-1">
                <li>• Use high-quality, well-lit photos</li>
                <li>• Be precise with measurements</li>
                <li>• Include prep and cooking times</li>
                <li>• Add personal tips and variations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Newsletters:</h4>
              <ul className="space-y-1">
                <li>• Choose engaging, descriptive titles</li>
                <li>• Use subheadings for better readability</li>
                <li>• Include relevant images and examples</li>
                <li>• End with a clear call-to-action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  return <CreatePageContent />
} 
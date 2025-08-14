import React from 'react'
import Link from 'next/link'
import { FileQuestionIcon, HomeIcon, ArrowLeftIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FileQuestionIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/recipes"
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Recipes</span>
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
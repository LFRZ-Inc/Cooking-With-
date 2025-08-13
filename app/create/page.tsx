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
import { useLanguage } from '@/lib/language'


function CreatePageContent() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            {t('create.shareCulinaryCreativity')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('create.chooseContribution')}
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
                {t('create.shareRecipe')}
              </h2>
              <p className="text-gray-600">
                {t('create.addFavoriteRecipe')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.uploadPhotos')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.addMeasurements')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.stepByStep')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.setDifficulty')}</span>
                </div>
              </div>
              
              <Link 
                href="/create/recipe" 
                className="block w-full text-center btn-primary"
              >
                {t('create.createRecipe')}
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
                {t('create.writeNewsletter')}
              </h2>
              <p className="text-gray-600">
                {t('create.shareCulinaryInsights')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.richTextEditor')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.addImages')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.categorizeContent')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t('create.schedulePublishing')}</span>
                </div>
              </div>
              
              <Link 
                href="/create/newsletter" 
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('create.writeNewsletterButton')}
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
'use client'
import React, { useState } from 'react'
import { 
  PlusIcon,
  XIcon,
  ImageIcon,
  NewspaperIcon,
  TagIcon,
  EyeIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'

function CreateNewsletterPage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featured: false,
    publishDate: '',
    readTime: ''
  })

  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  const categories = [
    'Techniques',
    'Seasonal', 
    'Health',
    'Fermentation',
    'Baking',
    'Wine',
    'Ingredients',
    'Equipment',
    'Culture',
    'Nutrition'
  ]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Newsletter data:', formData)
    alert('Newsletter submitted! (This will be connected to database)')
  }

  const renderPreview = () => {
    const contentParagraphs = formData.content.split('\n\n').filter(p => p.trim())
    
    return (
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary-500 px-3 py-1 rounded-full text-white text-sm font-medium">
                {formData.category || 'Category'}
              </span>
              {formData.featured && (
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-black text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {formData.title || 'Newsletter Title'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {formData.excerpt || 'Newsletter excerpt will appear here...'}
            </p>
            
            <div className="flex items-center space-x-4 text-gray-500">
              <span>{formData.readTime || '5 min read'}</span>
              <span>•</span>
              <span>{formData.publishDate || 'Today'}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-gray-400 italic">Newsletter content will appear here...</p>
            )}
          </div>

          {formData.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Write New Newsletter
          </h1>
          <p className="text-gray-600">
            Share your culinary insights and knowledge with the community
          </p>
        </div>

        {/* Preview Toggle */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !isPreview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <NewspaperIcon className="h-4 w-4 inline mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPreview 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-2" />
              Preview
            </button>
          </div>
        </div>

        {isPreview ? renderPreview() : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Newsletter Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    className="input-field"
                    placeholder="e.g., The Science of Perfect Bread Making"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
                    rows={3}
                    className="input-field"
                    placeholder="Write a compelling excerpt that summarizes your newsletter..."
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
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData(prev => ({...prev, readTime: e.target.value}))}
                      className="input-field"
                      placeholder="e.g., 8 min read"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({...prev, featured: e.target.checked}))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Article</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Content
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
                  rows={20}
                  className="input-field"
                  placeholder="Write your newsletter content here. Use double line breaks to separate paragraphs..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Use double line breaks to create paragraph breaks. Rich text formatting coming soon!
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tags
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Tags
                </label>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 input-field"
                    placeholder="Type a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add</span>
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
                  Publish Newsletter
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function CreateNewsletterPageWithAuth() {
  return (
    <AuthGuard>
      <CreateNewsletterPage />
    </AuthGuard>
  )
} 
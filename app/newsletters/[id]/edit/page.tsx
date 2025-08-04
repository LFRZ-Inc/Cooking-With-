'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  PlusIcon,
  XIcon,
  ImageIcon,
  NewspaperIcon,
  TagIcon,
  EyeIcon,
  SaveIcon,
  ArrowLeftIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import AuthGuard from '@/components/AuthGuard'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/link'

interface Newsletter {
  id: string
  title: string
  excerpt: string
  content: string
  category?: string
  tags: string[]
  featured: boolean
  image_url?: string
  author_id: string
  created_at: string
  updated_at: string
  published_at: string
  read_time_minutes?: number
}

function EditNewsletterPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const newsletterId = params.id as string

  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featured: false,
    imageUrl: '',
    readTime: ''
  })

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

  // Fetch newsletter data
  useEffect(() => {
    const fetchNewsletter = async () => {
      if (!newsletterId) return

      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', newsletterId)
          .single()

        if (error) {
          throw error
        }

        if (!data) {
          toast.error('Newsletter not found')
          router.push('/account')
          return
        }

        // Check if user owns this newsletter
        if (data.author_id !== user?.id) {
          toast.error('You can only edit your own articles')
          router.push('/account')
          return
        }

        setNewsletter(data)
        setFormData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category || '',
          tags: [], // We'll need to fetch tags separately if using junction table
          featured: data.featured,
          imageUrl: data.image_url || '',
          readTime: data.read_time_minutes ? `${data.read_time_minutes} min read` : ''
        })
      } catch (error: any) {
        console.error('Error fetching newsletter:', error)
        toast.error('Failed to load newsletter')
        router.push('/account')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchNewsletter()
    }
  }, [newsletterId, user, router])

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
    setSaving(true)

    try {
      // Update newsletter data with modification tracking
      const newsletterData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category || null,
        image_url: formData.imageUrl || null,
        featured: formData.featured,
        read_time_minutes: formData.readTime ? parseInt(formData.readTime.replace(/\D/g, '')) : null,
        updated_at: new Date().toISOString() // Track modification date
        // Note: We preserve original created_at and published_at for transparency
      }

      const { error } = await supabase
        .from('newsletters')
        .update(newsletterData)
        .eq('id', newsletterId)
        .eq('author_id', user?.id) // Extra security check

      if (error) {
        throw error
      }

      toast.success('Article updated successfully!')
      router.push('/account')
    } catch (error: any) {
      console.error('Error updating newsletter:', error)
      toast.error(error.message || 'Failed to update article')
    } finally {
      setSaving(false)
    }
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
              <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm font-medium">
                Modified Version
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {formData.title || 'Newsletter Title'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {formData.excerpt || 'Newsletter excerpt will appear here...'}
            </p>
            
            <div className="flex items-center space-x-4 text-gray-500 mb-6">
              <span>{formData.readTime || '5 min read'}</span>
              <span>•</span>
              <span>Originally published: {newsletter ? new Date(newsletter.published_at).toLocaleDateString() : 'Today'}</span>
              <span>•</span>
              <span>Last modified: {newsletter?.updated_at ? new Date(newsletter.updated_at).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>

          {/* Newsletter Image */}
          {formData.imageUrl && (
            <div className="mb-6">
              <img
                src={formData.imageUrl}
                alt="Newsletter header"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-lg text-gray-600">Loading article...</span>
        </div>
      </div>
    )
  }

  if (!newsletter) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/account"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Edit Article
              </h1>
              <p className="text-gray-600">
                Update your article while preserving its original publication date
              </p>
            </div>
          </div>
          
          {/* Publication transparency */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <NewspaperIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p><strong>Transparency Notice:</strong> This article was originally published on {new Date(newsletter.published_at).toLocaleDateString()}. 
                Any modifications will be tracked and the "last modified" date will be updated to maintain editorial transparency.</p>
              </div>
            </div>
          </div>
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

            {/* Newsletter Image */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Newsletter Image
              </h2>
              
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData(prev => ({...prev, imageUrl: url}))}
                placeholder="Drag and drop your newsletter image here, or click to browse"
              />
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
                <Link
                  href="/account"
                  className="btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4" />
                      <span>Update Article</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function EditNewsletterPageWithAuth() {
  return (
    <AuthGuard>
      <EditNewsletterPage />
    </AuthGuard>
  )
} 
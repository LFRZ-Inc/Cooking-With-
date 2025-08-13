'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SearchIcon, ClockIcon, UserIcon, TagIcon, StarIcon, CalendarIcon, NewspaperIcon } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language'
import ClientOnly from '@/lib/ClientOnly'

interface Newsletter {
  id: number
  title: string
  excerpt: string
  content: string
  author_id?: string
  category?: string
  tags: string[]
  featured: boolean
  publish_date: string
  read_time_minutes: number
  created_at: string
  author?: string
  authorImage?: string
  readTime?: string
  publishDate?: string
  image?: string
}

// Mock demo newsletters - these will be mixed with real user submissions
const getDemoNewsletters = (t: any) => [
  {
    id: 9001,
    title: t('newsletterContent.fallComfortFoods.title'),
    excerpt: t('newsletterContent.fallComfortFoods.excerpt'),
    content: t('newsletterContent.fallComfortFoods.content'),
    author_id: "demo_user_555",
    category: "Seasonal",
    tags: ["Fall", "Comfort Food", "Soups", "Stews"],
    featured: true,
    publish_date: "2024-01-15",
    read_time_minutes: 5,
    created_at: "2024-01-15T10:00:00Z",
    author: "Emily Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100",
    readTime: "5 min read",
    publishDate: "2024-01-15",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
  },
  {
    id: 9002,
    title: t('newsletterContent.frenchPastry.title'),
    excerpt: t('newsletterContent.frenchPastry.excerpt'),
    content: t('newsletterContent.frenchPastry.content'),
    author_id: undefined,
    category: "Techniques",
    tags: ["French", "Pastry", "Baking", "Techniques"],
    featured: true,
    publish_date: "2024-01-12",
    read_time_minutes: 8,
    created_at: "2024-01-12T14:30:00Z",
    author: "Anonymous Writer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "8 min read",
    publishDate: "2024-01-12",
    image: "https://images.unsplash.com/photo-1555507036-ab794f0aadb2?w=600"
  },
  {
    id: 9003,
    title: t('newsletterContent.plantBasedProtein.title'),
    excerpt: t('newsletterContent.plantBasedProtein.excerpt'),
    content: t('newsletterContent.plantBasedProtein.content'),
    author_id: "demo_user_666",
    category: "Health",
    tags: ["Vegan", "Protein", "Health", "Plant-Based"],
    featured: false,
    publish_date: "2024-01-08",
    read_time_minutes: 6,
    created_at: "2024-01-08T16:20:00Z",
    author: "Sarah Green",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    readTime: "6 min read",
    publishDate: "2024-01-08",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
  },
  {
    id: 9004,
    title: t('newsletterContent.streetFoodRevolution.title'),
    excerpt: t('newsletterContent.streetFoodRevolution.excerpt'),
    content: t('newsletterContent.streetFoodRevolution.content'),
    author_id: "demo_writer_1",
    category: "International",
    tags: ["Street Food", "International", "Authentic", "Home Cooking"],
    featured: true,
    publish_date: "2024-01-22",
    read_time_minutes: 7,
    created_at: "2024-01-22T09:00:00Z",
    author: "Marcus Chen",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    readTime: "7 min read",
    publishDate: "2024-01-22",
    image: "https://images.unsplash.com/photo-1565299585323-38174c7e9b72?w=600"
  },
  {
    id: 9005,
    title: t('newsletterContent.fermentationScience.title'),
    excerpt: t('newsletterContent.fermentationScience.excerpt'),
    content: t('newsletterContent.fermentationScience.content'),
    author_id: "demo_writer_2",
    category: "Health",
    tags: ["Fermentation", "Health", "Probiotics", "Traditional"],
    featured: false,
    publish_date: "2024-01-20",
    read_time_minutes: 6,
    created_at: "2024-01-20T14:30:00Z",
    author: "Dr. Kimiko Tanaka",
    authorImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100",
    readTime: "6 min read",
    publishDate: "2024-01-20",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600"
  },
  {
    id: 9006,
    title: t('newsletterContent.mediterraneanDiet.title'),
    excerpt: t('newsletterContent.mediterraneanDiet.excerpt'),
    content: t('newsletterContent.mediterraneanDiet.content'),
    author_id: "demo_writer_3",
    category: "Health",
    tags: ["Mediterranean", "Healthy Eating", "Lifestyle", "Nutrition"],
    featured: true,
    publish_date: "2024-01-18",
    read_time_minutes: 8,
    created_at: "2024-01-18T11:15:00Z",
    author: "Sofia Rosetti",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    readTime: "8 min read",
    publishDate: "2024-01-18",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
  }
]

function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const { t } = useLanguage()
  
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={newsletter.image}
          alt={newsletter.title}
          className="w-full h-full object-cover"
        />
        {newsletter.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              {t('newsletters.featured')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category and Read Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-orange-600 text-sm font-medium">
            {newsletter.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            {newsletter.readTime}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {newsletter.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {newsletter.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {newsletter.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {newsletter.tags.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{newsletter.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={newsletter.authorImage}
              alt={newsletter.author}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{newsletter.author}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {newsletter.publishDate}
          </div>
        </div>

        {/* Read More Button */}
        <Link
          href={`/newsletters/${newsletter.id}`}
          className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          {t('newsletters.readFullArticle')}
        </Link>
      </div>
    </article>
  )
}

export default function NewslettersPage() {
  const { t } = useLanguage()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Fetch newsletters from Supabase and mix with demo newsletters
  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching newsletters:', error)
        setNewsletters(getDemoNewsletters(t))
        return
      }

      // Transform real data and add mock fields for demo purposes
      const transformedRealNewsletters = data?.map((newsletter) => ({
        ...newsletter,
        author: newsletter.author_id ? 'Registered Author' : 'Anonymous Writer',
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100",
        readTime: `${newsletter.read_time_minutes} min read`,
        publishDate: new Date(newsletter.publish_date).toLocaleDateString(),
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
      })) || []

      // Mix demo newsletters with real newsletters, sorting by creation date
      const allNewsletters = [...getDemoNewsletters(t), ...transformedRealNewsletters]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNewsletters(allNewsletters)
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      setNewsletters(getDemoNewsletters(t))
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and auto-refresh every 15 minutes
  useEffect(() => {
    fetchNewsletters()
    
    const interval = setInterval(() => {
      fetchNewsletters()
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(interval)
  }, [t]) // Add t as dependency to refetch when language changes

  // Filter newsletters based on search and filters
  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeatured = !showFeaturedOnly || newsletter.featured
    
    return matchesSearch && matchesFeatured
  })

  return (
    <AuthGuard>
      <ClientOnly fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      }>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                  {t('newsletters.title')}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('newsletters.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('newsletters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{t('newsletters.featuredOnly')}</span>
                </label>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <StarIcon className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                <p className="text-orange-800 text-sm">
                  {t('newsletters.demoNotice')}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="text-lg text-gray-600">{t('newsletters.loadingArticles')}</span>
                </div>
              </div>
            )}

            {/* Newsletter Grid */}
            {!loading && (
              <>
                {filteredNewsletters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="text-gray-400 mb-4">
                        <NewspaperIcon className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('newsletters.noArticlesFound')}
                      </h3>
                      <p className="text-gray-600">
                        {t('newsletters.noArticlesDescription')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNewsletters.map((newsletter) => (
                      <NewsletterCard key={newsletter.id} newsletter={newsletter} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </ClientOnly>
    </AuthGuard>
  )
} 
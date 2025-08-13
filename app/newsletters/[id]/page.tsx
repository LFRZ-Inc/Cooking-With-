'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ClockIcon, UserIcon, CalendarIcon, ShareIcon, BookmarkIcon, PrinterIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language'
import { useTranslationService } from '@/lib/translationService'
import { notFound } from 'next/navigation'

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

// Demo newsletters with translation support
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

interface NewsletterPageProps {
  params: { id: string }
}

function NewsletterPageContent({ params }: NewsletterPageProps) {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { translateContent, currentLanguage } = useTranslationService()

  // Fetch newsletter data
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true)
        setError(null)
        const id = params.id
        
        // Check if it's a demo newsletter (numeric ID >= 9000)
        const numericId = parseInt(id)
        if (!isNaN(numericId) && numericId >= 9000) {
          const demoNewsletter = getDemoNewsletters(t).find(n => n.id === numericId)
          if (demoNewsletter) {
            setNewsletter(demoNewsletter)
          } else {
            setError('Newsletter not found')
            notFound()
          }
          setLoading(false)
          return
        }

        // Fetch real newsletter from Supabase (ID is a UUID string)
        const { data: newsletterData, error: newsletterError } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', id)
          .single()

        if (newsletterError) {
          console.error('Supabase error:', newsletterError)
          setError('Failed to load newsletter')
          notFound()
          return
        }

        if (!newsletterData) {
          setError('Newsletter not found')
          notFound()
          return
        }

        // Transform the data for display
        const transformedNewsletter: Newsletter = {
          ...newsletterData,
          author: newsletterData.author_id ? 'Registered Author' : 'Anonymous Writer',
          authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100",
          readTime: `${newsletterData.read_time_minutes} min read`,
          publishDate: new Date(newsletterData.publish_date).toLocaleDateString(),
          image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
        }

        // Translate newsletter if not in English
        try {
          const translatedNewsletter = await translateContent(transformedNewsletter, 'newsletter')
          setNewsletter(translatedNewsletter)
        } catch (error) {
          console.error('Translation error for newsletter:', error)
          // Fallback to original newsletter
          setNewsletter(transformedNewsletter)
        }
      } catch (error) {
        console.error('Error fetching newsletter:', error)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletter()
  }, [params.id, t, translateContent])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-600">{t('newsletters.loadingArticle')}</span>
          </div>
        </div>
      </div>
    )
  }

  if (!newsletter) {
    notFound()
  }

  // Convert markdown-style content to JSX
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n')
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <Link
            href="/newsletters"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t('newsletters.backToArticles')}
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {newsletter.category && (
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                {newsletter.category}
              </span>
            )}
            {newsletter.featured && (
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                {t('newsletters.featured')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {newsletter.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            {newsletter.excerpt}
          </p>

          {/* Author and Metadata */}
          <div className="flex items-center space-x-6 text-gray-300">
            <div className="flex items-center">
              <img
                src={newsletter.authorImage}
                alt={newsletter.author}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-medium">{newsletter.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{newsletter.publishDate}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{newsletter.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm p-8">
              {/* Article Image */}
              {newsletter.image && (
                <div className="mb-8">
                  <img
                    src={newsletter.image}
                    alt={newsletter.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Text */}
              <div className="prose prose-lg max-w-none">
                {renderContent(newsletter.content)}
              </div>

              {/* Tags */}
              {newsletter.tags && newsletter.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {newsletter.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('newsletters.shareThisArticle')}
              </h3>
              
              <div className="space-y-3">
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  {t('newsletters.saveArticle')}
                </button>
                
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  {t('newsletters.share')}
                </button>
                
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  {t('newsletters.print')}
                </button>
              </div>

              {/* Author Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <img
                    src={newsletter.authorImage}
                    alt={newsletter.author}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{newsletter.author}</h4>
                    <p className="text-sm text-gray-600">{t('newsletters.aboutAuthor')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {t('newsletters.authorBio')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsletterPage({ params }: NewsletterPageProps) {
  return <NewsletterPageContent params={params} />
} 
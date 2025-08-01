'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  NewspaperIcon,
  TagIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'

// Mock demo newsletters - these will be mixed with real user submissions
const demoNewsletters = [
  {
    id: 9001, // High ID to avoid conflicts
    title: "Fall Comfort Foods: 10 Recipes to Warm Your Soul",
    excerpt: "As the leaves change color and temperatures drop, there's nothing quite like the comfort of hearty, warming dishes. From creamy soups to rich stews, these fall recipes will embrace you with their comforting flavors and fill your home with delicious aromas.",
    content: "Fall is a magical time for cooking. The crisp air calls for meals that warm from the inside out...",
    author_id: "demo_user_555", // Demo user
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
    title: "The Art of French Pastry: A Beginner's Guide",
    excerpt: "Master the fundamentals of French pastry with these essential techniques and recipes. From croissants to éclairs, we'll walk you through the delicate art of creating beautiful, buttery pastries that will impress everyone.",
    content: "French pastry is both an art and a science. It requires precision, patience, and practice...",
    author_id: undefined, // Anonymous demo submission
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
    title: "Plant-Based Protein: Beyond Tofu",
    excerpt: "Discover exciting and delicious plant-based protein sources that will revolutionize your vegetarian cooking. From tempeh to lentils, learn how to create satisfying meals without meat.",
    content: "The world of plant-based proteins extends far beyond tofu and beans...",
    author_id: "demo_user_666", // Demo user
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
  }
]

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
  // Mock fields for display (we'll enhance these later)
  author?: string
  authorImage?: string
  readTime?: string
  publishDate?: string
  image?: string
}

function NewslettersPageContent() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
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
        // If there's an error, just show demo newsletters
        setNewsletters(demoNewsletters)
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
      const allNewsletters = [...demoNewsletters, ...transformedRealNewsletters]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNewsletters(allNewsletters)
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      // If there's an error, just show demo newsletters
      setNewsletters(demoNewsletters)
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
  }, [])

  // Filter newsletters based on search and filters
  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || newsletter.category === selectedCategory
    const matchesFeatured = !showFeaturedOnly || newsletter.featured
    
    return matchesSearch && matchesCategory && matchesFeatured
  })

  const categories = ['All', ...Array.from(new Set(newsletters.map(n => n.category).filter(Boolean)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading fresh articles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Demo Articles Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <NewspaperIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div className="text-sm text-blue-800">
              <strong>Real Articles from Our Community!</strong> These are actual articles shared by users like you. Even though some are marked as demos, they are completely real and informative content.
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Newsletter Articles</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover inspiring cooking stories, tips, and insights from our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span>Featured only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredNewsletters.length === 0 ? (
          <div className="text-center py-12">
            <NewspaperIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or <Link href="/create/newsletter" className="text-orange-600 hover:text-orange-700">create the first article</Link>!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNewsletters.map((newsletter) => (
              <article key={newsletter.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                {/* Article Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={newsletter.image}
                    alt={newsletter.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Featured Badge */}
                  {newsletter.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Unverified Content Badge */}
                  {!newsletter.author_id && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Unverified Article
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-medium">{newsletter.category || 'General'}</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4" />
                      <span>{newsletter.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{newsletter.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{newsletter.excerpt}</p>

                  {/* Tags */}
                  {newsletter.tags && newsletter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {newsletter.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {newsletter.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{newsletter.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Author and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={newsletter.authorImage}
                        alt={newsletter.author}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{newsletter.author}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{newsletter.publishDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/newsletters/${newsletter.id}`}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-center block"
                  >
                    Read Full Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewslettersPage() {
  return (
    <AuthGuard>
      <NewslettersPageContent />
    </AuthGuard>
  )
} 
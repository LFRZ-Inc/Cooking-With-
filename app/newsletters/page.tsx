'use client'
import React, { useState } from 'react'
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

// Mock newsletter data
const newsletters = [
  {
    id: 1,
    title: "Fall Comfort Foods: 10 Recipes to Warm Your Soul",
    excerpt: "As the leaves change color and temperatures drop, there's nothing quite like the comfort of hearty, warming dishes. From creamy soups to rich stews, these fall recipes will embrace you with their comforting flavors and fill your home with delicious aromas.",
    content: "Fall is a magical time for cooking. The crisp air calls for meals that warm from the inside out...",
    author: "Emily Chen",
    authorId: "user_555", // Authenticated user
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100",
    publishDate: "2024-10-15",
    readTime: "5 min read",
    category: "Seasonal",
    tags: ["Fall", "Comfort Food", "Soups", "Stews"],
    featured: true,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
  },
  {
    id: 2,
    title: "The Art of French Pastry: A Beginner's Guide",
    excerpt: "Master the fundamentals of French pastry with these essential techniques and recipes. From croissants to éclairs, we'll walk you through the delicate art of creating beautiful, buttery pastries that will impress everyone.",
    content: "French pastry is both an art and a science. It requires precision, patience, and practice...",
    author: "Jean-Pierre Dubois",
    authorId: null, // Anonymous submission
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    publishDate: "2024-10-12",
    readTime: "8 min read",
    category: "Techniques",
    tags: ["French", "Pastry", "Baking", "Techniques"],
    featured: true,
    image: "https://images.unsplash.com/photo-1555507036-ab794f0aadb2?w=600"
  },
  {
    id: 3,
    title: "Plant-Based Protein: Beyond Tofu",
    excerpt: "Discover exciting and delicious plant-based protein sources that will revolutionize your vegetarian cooking. From tempeh to lentils, learn how to create satisfying meals without meat.",
    content: "The world of plant-based proteins extends far beyond tofu and beans...",
    author: "Sarah Green",
    authorId: "user_666", // Authenticated user
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    publishDate: "2024-10-08",
    readTime: "6 min read",
    category: "Health",
    tags: ["Vegan", "Protein", "Health", "Plant-Based"],
    featured: false,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
  },
  {
    id: 4,
    title: "Fermentation 101: Getting Started with Kimchi",
    excerpt: "Learn the ancient art of fermentation by making your own kimchi at home. This comprehensive guide covers everything from selecting ingredients to proper fermentation techniques.",
    content: "Fermentation is one of humanity's oldest food preservation methods...",
    author: "Min-Jun Kim",
    authorId: null, // Anonymous submission
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    publishDate: "2024-10-05",
    readTime: "7 min read",
    category: "Fermentation",
    tags: ["Fermentation", "Korean", "Probiotics", "Preservation"],
    featured: false,
    image: "https://images.unsplash.com/photo-1505253213348-cd54c92b37be?w=600"
  },
  {
    id: 5,
    title: "Holiday Baking: Make-Ahead Desserts",
    excerpt: "Simplify your holiday entertaining with these make-ahead dessert recipes. From cookies to cakes, these treats can be prepared in advance without sacrificing flavor or quality.",
    content: "The holidays can be stressful, but your desserts don't have to be...",
    author: "Maria Rodriguez",
    authorId: "user_777", // Authenticated user
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    publishDate: "2024-10-01",
    readTime: "4 min read",
    category: "Baking",
    tags: ["Holidays", "Baking", "Make-Ahead", "Desserts"],
    featured: false,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600"
  },
  {
    id: 6,
    title: "Wine Pairing Basics: Match Food and Wine Like a Pro",
    excerpt: "Unlock the secrets of perfect wine pairing with this comprehensive guide. Learn the fundamental principles that will help you create harmonious combinations every time.",
    content: "Wine pairing doesn't have to be intimidating or reserved for sommeliers...",
    author: "Robert Sommelier",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    publishDate: "2024-09-28",
    readTime: "9 min read",
    category: "Wine",
    tags: ["Wine", "Pairing", "Entertaining", "Beverages"],
    featured: false,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600"
  }
]

const categories = ["All", "Seasonal", "Techniques", "Health", "Fermentation", "Baking", "Wine"]

function NewslettersPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         newsletter.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         newsletter.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         newsletter.tags.some(tag => 
                           tag.toLowerCase().includes(searchQuery.toLowerCase())
                         )
    
    const matchesCategory = selectedCategory === 'All' || newsletter.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredNewsletters = filteredNewsletters.filter(newsletter => newsletter.featured)
  const regularNewsletters = filteredNewsletters.filter(newsletter => !newsletter.featured)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Culinary Newsletters
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest culinary insights, techniques, and trends
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search newsletters, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {filteredNewsletters.length} newsletter{filteredNewsletters.length !== 1 ? 's' : ''} found
            </div>
            <Link href="/create/newsletter" className="btn-primary">
              Write Newsletter
            </Link>
          </div>
        </div>

        {/* Featured Newsletters */}
        {featuredNewsletters.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredNewsletters.map((newsletter) => (
                <article key={newsletter.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={newsletter.image} 
                      alt={newsletter.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={newsletter.authorImage} 
                        alt={newsletter.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{newsletter.author}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{new Date(newsletter.publishDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <ClockIcon className="h-3 w-3" />
                          <span>{newsletter.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Anonymous Content Disclaimer */}
                    {!newsletter.authorId && (
                      <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-600 text-xs">⚠️</span>
                          <span className="text-xs text-amber-800 font-medium">Unverified Article</span>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">Anonymous submission - verify information independently</p>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                      {newsletter.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {newsletter.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newsletter.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/newsletters/${newsletter.id}`}
                      className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Newsletters */}
        {regularNewsletters.length > 0 ? (
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Latest Articles
            </h2>
            <div className="space-y-6">
              {regularNewsletters.map((newsletter) => (
                <article key={newsletter.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 flex-shrink-0">
                      <img 
                        src={newsletter.image} 
                        alt={newsletter.title}
                        className="w-full h-32 md:h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <img 
                          src={newsletter.authorImage} 
                          alt={newsletter.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{newsletter.author}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{new Date(newsletter.publishDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <ClockIcon className="h-3 w-3" />
                            <span>{newsletter.readTime}</span>
                          </div>
                        </div>
                        <div className="flex-1"></div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {newsletter.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                        {newsletter.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 text-sm">
                        {newsletter.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {newsletter.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          href={`/newsletters/${newsletter.id}`}
                          className="text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <NewspaperIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all newsletters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
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
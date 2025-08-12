'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ShareIcon,
  BookmarkIcon,
  PrinterIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import TranslationStatus from '@/components/TranslationStatus'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language'
import { useTranslationService } from '@/lib/translationService'
import ClientOnly from '@/lib/ClientOnly'

// Demo newsletters - same as in newsletters page
const demoNewsletters = [
  {
    id: 9001,
    title: "Fall Comfort Foods: 10 Recipes to Warm Your Soul",
    excerpt: "As the leaves change color and temperatures drop, there's nothing quite like the comfort of hearty, warming dishes. From creamy soups to rich stews, these fall recipes will embrace you with their comforting flavors and fill your home with delicious aromas.",
    content: `Fall is a magical time for cooking. The crisp air calls for meals that warm from the inside out, and there's something deeply satisfying about creating dishes that bring comfort and joy to those we love.

## The Science of Comfort Food

Comfort foods trigger emotional responses that go beyond mere nutrition. When temperatures drop, our bodies naturally crave heartier, more calorie-dense foods. This isn't just psychological – it's evolutionary. Our ancestors needed extra energy to survive colder months, and these cravings helped ensure survival.

## 10 Essential Fall Comfort Recipes

### 1. Butternut Squash Soup with Sage
This velvety soup combines the natural sweetness of butternut squash with aromatic sage. The key is roasting the squash first to concentrate its flavors, then blending with vegetable stock and a touch of cream for richness.

### 2. Classic Beef Stew
A slow-simmered masterpiece that transforms tough cuts of beef into tender, fall-apart morsels. Red wine adds depth, while root vegetables provide earthiness and substance.

### 3. Maple Glazed Acorn Squash
Simple yet elegant, this side dish highlights autumn's bounty. The natural sugars caramelize during roasting, creating a perfect balance of sweet and savory.

### 4. Apple Cider Braised Chicken
Local apple cider becomes the braising liquid for this aromatic dish. Thyme and rosemary complement the fruity notes, while the long cooking time ensures incredibly tender meat.

### 5. Wild Mushroom Risotto
Earthy mushrooms and creamy Arborio rice create a dish that's both luxurious and comforting. The key is adding warm stock gradually while stirring constantly.

### 6. Pumpkin Bread with Spiced Butter
Moist, spiced pumpkin bread paired with homemade butter infused with cinnamon and nutmeg. This makes your kitchen smell like autumn itself.

### 7. Roasted Root Vegetable Medley
Carrots, parsnips, beets, and turnips roasted until caramelized. A drizzle of honey and fresh thyme elevates these humble vegetables to restaurant quality.

### 8. Cinnamon Apple Crisp
A rustic dessert that celebrates the season's apple harvest. The oat streusel topping adds texture while vanilla ice cream provides a temperature contrast.

### 9. Hearty Lentil Soup
Protein-packed lentils simmered with vegetables and aromatic spices. This one-pot meal is both satisfying and nutritious.

### 10. Spiced Hot Chocolate
Rich, creamy hot chocolate infused with warming spices like cinnamon, nutmeg, and cayenne. Top with whipped cream and a sprinkle of cocoa powder.

## Tips for Perfect Fall Cooking

- **Layer your flavors**: Build complexity by browning meats and vegetables before adding liquids
- **Use seasonal produce**: Take advantage of autumn's harvest for peak flavors
- **Low and slow**: Many fall dishes benefit from longer cooking times at lower temperatures
- **Spice thoughtfully**: Warm spices like cinnamon, nutmeg, and cloves enhance autumn dishes`,
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
    title: "The Art of French Pastry: A Beginner's Guide",
    excerpt: "Master the fundamentals of French pastry with these essential techniques and recipes. From croissants to éclairs, we'll walk you through the delicate art of creating beautiful, buttery pastries that will impress everyone.",
    content: `French pastry is both an art and a science. It requires precision, patience, and practice, but the results are absolutely worth the effort.

## Understanding the Basics

### Temperature Control
Temperature is crucial in pastry making. Butter should be the right consistency – neither too soft nor too hard. Room temperature is usually ideal for most applications.

### Quality Ingredients
French pastry relies on quality ingredients. Use European-style butter with higher fat content, fresh eggs, and quality flour for the best results.

## Essential Techniques

### 1. Lamination
This technique creates the flaky layers in croissants and puff pastry by folding butter into dough repeatedly.

### 2. Choux Pastry
The base for éclairs and cream puffs, this pastry is cooked twice – once on the stove and once in the oven.

### 3. Pâte Brisée
A versatile short pastry perfect for tarts and quiches.

## Beginner Recipes to Try

Start with simple recipes like madeleines or fruit tarts before progressing to more complex pastries like croissants.`,
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
    title: "Plant-Based Protein: Beyond Tofu",
    excerpt: "Discover exciting and delicious plant-based protein sources that will revolutionize your vegetarian cooking. From tempeh to lentils, learn how to create satisfying meals without meat.",
    content: `The world of plant-based proteins extends far beyond tofu and beans. With creativity and the right techniques, you can create deeply satisfying, protein-rich meals that even carnivores will love.

## Protein-Rich Alternatives

### Tempeh
Fermented soybeans with a nutty flavor and firm texture. Perfect for grilling, marinating, or crumbling into dishes.

### Seitan
Made from wheat gluten, seitan has a meaty texture that works well in stir-fries and stews.

### Nutritional Yeast
Adds a cheesy, umami flavor while providing complete proteins and B vitamins.

### Hemp Seeds
Mild, nutty seeds that can be sprinkled on almost anything for extra protein.

### Quinoa
One of the few plant foods that contains all essential amino acids.

## Cooking Techniques

- **Marination**: Most plant proteins benefit from marinating to add flavor
- **Texture variation**: Combine different proteins for interesting textures
- **Umami boosting**: Use mushrooms, soy sauce, and miso to add depth

These ingredients open up a world of culinary possibilities while providing complete nutrition.`,
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
    title: "Street Food Revolution: Global Flavors in Your Kitchen",
    excerpt: "Explore how street food from around the world has influenced modern home cooking. From Korean kimchi to Mexican tacos, discover how to recreate authentic street flavors at home.",
    content: `Street food represents the heart and soul of culinary culture across the globe. These humble dishes, born from necessity and creativity, have now found their way into high-end restaurants and home kitchens alike.

## The Global Street Food Movement

From the bustling markets of Bangkok to the food trucks of Los Angeles, street food has become a cultural phenomenon. These dishes tell stories of migration, adaptation, and innovation that span generations.

### Why Street Food Matters

- **Authenticity**: Street food often represents the most authentic flavors of a culture
- **Accessibility**: Simple ingredients transformed into extraordinary meals
- **Innovation**: Constant evolution and fusion of flavors
- **Community**: Brings people together around shared culinary experiences

## Bringing Street Flavors Home

### Korean Influence: Beyond Kimchi

Korean street food has revolutionized home cooking with its bold flavors and fermented elements. Dishes like kimchi fried rice and Korean corn dogs have found their way into mainstream cooking.

### Mexican Street Food: The Taco Revolution

Tacos al pastor, elote, and street-style quesadillas have transformed how we think about Mexican cuisine in home kitchens.

### Southeast Asian Inspirations

Pad thai, banh mi, and pho have become household favorites, bringing complex flavors and fresh ingredients to everyday cooking.

## Essential Techniques for Home Cooks

- **High heat cooking**: Many street foods rely on intense heat for char and flavor
- **Fresh ingredients**: The key to authentic flavors
- **Simple seasoning**: Let ingredients shine through proper seasoning
- **Quick assembly**: Street food is about fast, efficient preparation

The beauty of street food lies in its simplicity and bold flavors that can easily be recreated at home.`,
    author_id: "luisdrod750@gmail.com",
    category: "International",
    tags: ["Street Food", "International", "Authentic", "Home Cooking"],
    featured: true,
    publish_date: "2024-01-22",
    read_time_minutes: 7,
    created_at: "2024-01-22T09:00:00Z",
    author: "Luis Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "7 min read",
    publishDate: "2024-01-22",
    image: "https://images.unsplash.com/photo-1565299585323-38174c7e9b72?w=600"
  },
  {
    id: 9005,
    title: "The Science of Fermentation: Ancient Techniques for Modern Health",
    excerpt: "Dive into the fascinating world of fermentation, from kimchi and sauerkraut to kombucha and kefir. Learn how these age-old preservation methods boost flavor and nutrition.",
    content: `Fermentation is one of humanity's oldest food preservation techniques, predating recorded history. Today, we're rediscovering the incredible health benefits and complex flavors that fermented foods bring to our tables.

## Understanding Fermentation

### The Science Behind the Magic

Fermentation occurs when beneficial bacteria, yeasts, or molds break down sugars and starches in food, creating lactic acid, alcohol, or other compounds that preserve the food and enhance its nutritional value.

### Types of Fermentation

- **Lactic Acid Fermentation**: Creates sauerkraut, kimchi, and yogurt
- **Alcoholic Fermentation**: Produces wine, beer, and kombucha
- **Acetic Acid Fermentation**: Makes vinegar and some pickles

## Health Benefits

### Gut Health Revolution

Fermented foods are rich in probiotics - beneficial bacteria that support digestive health and boost immune function.

### Enhanced Nutrition

- **Increased bioavailability**: Fermentation makes nutrients more accessible
- **Vitamin production**: Some fermented foods produce B vitamins and vitamin K
- **Reduced antinutrients**: Fermentation breaks down compounds that inhibit nutrient absorption

## Getting Started at Home

### Easy Fermented Foods to Try

- **Sauerkraut**: Just cabbage and salt
- **Water kefir**: Simple probiotic drink
- **Fermented salsa**: Add beneficial bacteria to your favorite recipe

### Safety Tips

- Use clean equipment and proper ratios
- Monitor pH levels when possible
- Trust your senses - off smells indicate problems

The ancient art of fermentation offers modern solutions for health and flavor.`,
    author_id: "luisdrod750@gmail.com",
    category: "Health",
    tags: ["Fermentation", "Health", "Probiotics", "Traditional"],
    featured: false,
    publish_date: "2024-01-20",
    read_time_minutes: 6,
    created_at: "2024-01-20T14:30:00Z",
    author: "Luis Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "6 min read",
    publishDate: "2024-01-20",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600"
  },
  {
    id: 9006,
    title: "Mediterranean Diet: More Than Just Olive Oil",
    excerpt: "Uncover the true secrets of the Mediterranean diet beyond the basics. Explore regional variations, seasonal eating patterns, and the social aspects that make this lifestyle so beneficial.",
    content: `The Mediterranean diet has gained worldwide recognition for its health benefits, but there's so much more to it than olive oil and fish. This ancient way of eating encompasses a complete lifestyle approach to nutrition.

## Beyond the Basics

### Regional Variations

The Mediterranean spans multiple countries, each with unique culinary traditions:

- **Greek Islands**: Emphasis on herbs, feta, and fresh seafood
- **Southern Italy**: Pasta, tomatoes, and regional olive varieties
- **Southern France**: Wine culture and seasonal produce
- **Spanish Coast**: Rice dishes, seafood, and preserved foods

### The Social Component

Mediterranean eating is inherently social. Meals are community events that strengthen family bonds and social connections.

## Key Principles

### Seasonal Eating

- **Spring**: Fresh greens, herbs, and early vegetables
- **Summer**: Tomatoes, peppers, and abundant fruit
- **Fall**: Nuts, grapes, and olive harvest
- **Winter**: Preserved foods, citrus, and hearty stews

### Quality Over Quantity

- **Fresh, local ingredients**: Prioritize seasonal and regional foods
- **Minimal processing**: Simple preparation methods
- **Shared meals**: Eating together enhances satisfaction

## Practical Implementation

### Daily Patterns

- **Breakfast**: Often simple - bread, fruit, coffee
- **Lunch**: The main meal, eaten leisurely
- **Dinner**: Light, often featuring vegetables

### Cooking Methods

- **Grilling and roasting**: Enhance natural flavors
- **Slow cooking**: Stews and braises for complex flavors
- **Raw preparations**: Salads and fresh combinations

The Mediterranean lifestyle teaches us that good food is about more than nutrition - it's about community, tradition, and joy.`,
    author_id: "luisdrod750@gmail.com",
    category: "Health",
    tags: ["Mediterranean", "Healthy Eating", "Lifestyle", "Regional"],
    featured: true,
    publish_date: "2024-01-18",
    read_time_minutes: 8,
    created_at: "2024-01-18T11:45:00Z",
    author: "Luis Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "8 min read",
    publishDate: "2024-01-18",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
  },
  {
    id: 9007,
    title: "Kitchen Knife Skills: The Foundation of Great Cooking",
    excerpt: "Master the essential knife skills that every home cook should know. From proper grip techniques to advanced cuts, learn how good knife work elevates your cooking.",
    content: `Proper knife skills are the foundation of efficient and safe cooking. Whether you're a beginner or looking to refine your technique, mastering these fundamental skills will transform your time in the kitchen.

## The Fundamentals

### Choosing the Right Knife

- **Chef's knife**: 8-10 inch blade for most tasks
- **Paring knife**: Small blade for detail work
- **Serrated knife**: For tomatoes and bread
- **Utility knife**: Medium-sized for various tasks

### Proper Grip and Stance

- **Pinch grip**: Hold the blade between thumb and forefinger
- **Guide hand**: Curl fingertips under, knuckles forward
- **Stable stance**: Feet shoulder-width apart, cutting board at elbow height

## Essential Cuts

### Basic Techniques

- **Slice**: Straight cuts for even cooking
- **Dice**: Uniform cubes for consistent texture
- **Julienne**: Thin matchsticks for quick cooking
- **Chiffonade**: Ribbon cuts for herbs and leafy greens

### Advanced Skills

- **Brunoise**: Fine dice for delicate dishes
- **Tourne**: Seven-sided cuts for elegant presentation
- **Batonnet**: Thick matchsticks for french fries

## Safety First

### Knife Care

- **Sharp knives are safer**: Dull blades require more pressure
- **Proper storage**: Use knife blocks or magnetic strips
- **Regular maintenance**: Hone before each use, sharpen when needed

### Cutting Board Basics

- **Stable surface**: Use non-slip mats if needed
- **Separate boards**: Different boards for meat and vegetables
- **Proper cleaning**: Sanitize after each use

## Practice Makes Perfect

### Daily Exercises

- **Repetition**: Practice cuts on inexpensive vegetables
- **Speed development**: Focus on consistency first, speed second
- **Muscle memory**: Regular practice builds confidence

Good knife skills not only make cooking more efficient but also more enjoyable and safe.`,
    author_id: "luisdrod750@gmail.com",
    category: "Techniques",
    tags: ["Knife Skills", "Techniques", "Basics", "Safety"],
    featured: false,
    publish_date: "2024-01-16",
    read_time_minutes: 5,
    created_at: "2024-01-16T16:20:00Z",
    author: "Luis Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "5 min read",
    publishDate: "2024-01-16",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"
  },
  {
    id: 9008,
    title: "Seasonal Cooking: Winter Comfort Foods Around the World",
    excerpt: "Explore how different cultures create warming, comforting dishes during cold months. From Japanese hotpot to German stews, discover winter comfort food traditions.",
    content: `As winter settles in across the northern hemisphere, kitchens around the world come alive with the aromas of hearty, warming dishes. Each culture has developed its own approach to winter comfort foods.

## Global Winter Traditions

### Asian Comfort Foods

- **Japanese Nabe**: Communal hot pot with vegetables and protein
- **Korean Jjigae**: Spicy stews that warm the soul
- **Chinese Hot Pot**: Social dining with endless combinations
- **Thai Khao Tom**: Rice porridge perfect for cold mornings

### European Heartiness

- **German Eintopf**: One-pot meals with meat and vegetables
- **French Pot-au-Feu**: Classic beef and vegetable stew
- **Italian Minestrone**: Vegetable-rich soup that varies by region
- **Hungarian Goulash**: Paprika-spiced beef stew

### Latin American Warmth

- **Mexican Pozole**: Hominy soup with rich, complex flavors
- **Brazilian Feijoada**: Black bean stew with various meats
- **Peruvian Sancocho**: Hearty soup with yuca and corn

## Common Elements

### Slow Cooking Methods

Winter dishes often benefit from long, slow cooking that builds complex flavors and tender textures.

### Root Vegetables

- **Nutritional density**: Stored energy for cold months
- **Natural sweetness**: Balances hearty proteins
- **Versatile preparation**: From roasted to stewed

### Warming Spices

- **Ginger and garlic**: Natural warming properties
- **Cinnamon and cloves**: Sweet warming spices
- **Chili and pepper**: Heat that builds from within

## Modern Applications

### Adapting Traditional Recipes

- **Slow cookers**: Modern tools for ancient techniques
- **Pressure cooking**: Faster results with similar outcomes
- **Make-ahead meals**: Batch cooking for busy schedules

### Nutritional Benefits

Winter comfort foods often provide exactly what our bodies need during cold months - warming calories, immune-boosting nutrients, and psychological comfort.

The best winter comfort foods combine tradition, nutrition, and the simple pleasure of a warm meal shared with others.`,
    author_id: "luisdrod750@gmail.com",
    category: "Seasonal",
    tags: ["Winter", "Comfort Food", "International", "Seasonal"],
    featured: true,
    publish_date: "2024-01-14",
    read_time_minutes: 6,
    created_at: "2024-01-14T13:10:00Z",
    author: "Luis Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    readTime: "6 min read",
    publishDate: "2024-01-14",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600"
  }
]

interface Newsletter {
  id: number | string
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
          const demoNewsletter = demoNewsletters.find(n => n.id === numericId)
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
  }, [params.id])

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
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.replace('## ', '')}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-gray-800 mt-6 mb-3">{line.replace('### ', '')}</h3>)
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={i} className="font-semibold text-gray-900 mb-2">{line.replace(/\*\*/g, '')}</p>)
      } else if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
        elements.push(<p key={i} className="italic text-gray-700 mb-4 text-center">{line.replace(/\*/g, '')}</p>)
      } else if (line === '') {
        elements.push(<div key={i} className="mb-4"></div>)
      } else if (line.length > 0) {
        // Handle inline bold text
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        const formattedLine = parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.replace(/\*\*/g, '')}</strong>
          }
          return part
        })
        elements.push(<p key={i} className="text-gray-700 mb-4 leading-relaxed">{formattedLine}</p>)
      }
    }
    
    return elements
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={newsletter.image} 
          alt={newsletter.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/newsletters"
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>{t('navigation.backToArticles')}</span>
        </Link>

        {/* Article Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                {newsletter.category}
              </span>
              {newsletter.featured && (
                <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium text-black">
                  {t('common.featured')}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{newsletter.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{newsletter.excerpt}</p>
            
            <div className="flex items-center space-x-6 text-gray-200">
              <div className="flex items-center space-x-2">
                <img 
                  src={newsletter.authorImage} 
                  alt={newsletter.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{newsletter.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-5 w-5" />
                <span>{new Date(newsletter.publish_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5" />
                <span>{newsletter.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Translation Status */}
        <TranslationStatus
          contentType="newsletter"
          contentId={newsletter.id.toString()}
          originalLanguage="en"
          translatedLanguage={currentLanguage !== 'en' ? currentLanguage : undefined}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                {renderContent(newsletter.content)}
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {newsletter.tags.map((tag, index) => (
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

              {/* Author Bio */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <img 
                    src={newsletter.authorImage} 
                    alt={newsletter.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('newsletters.aboutAuthor')} {newsletter.author}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {newsletter.author} {t('newsletters.authorBio')}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Article Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">{t('newsletters.shareThisArticle')}</h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                    <BookmarkIcon className="h-4 w-4" />
                    <span>{t('common.save')}</span>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <ShareIcon className="h-4 w-4" />
                    <span>{t('common.share')}</span>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <PrinterIcon className="h-4 w-4" />
                    <span>{t('common.print')}</span>
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">{t('common.relatedArticles')}</h3>
                <div className="space-y-4">
                  {demoNewsletters
                    .filter(n => n.id !== newsletter.id && n.category === newsletter.category)
                    .slice(0, 3)
                    .map((related) => (
                      <Link 
                        key={related.id}
                        href={`/newsletters/${related.id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <img 
                            src={related.image} 
                            alt={related.title}
                            className="w-16 h-16 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{related.readTime}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-primary-800 mb-2">{t('common.stayUpdated')}</h3>
                <p className="text-sm text-primary-700 mb-4">
                  {t('newsletters.getLatestRecipes')}
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder={t('newsletters.emailPlaceholder')}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                    {t('common.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsletterPage({ params }: NewsletterPageProps) {
  return (
    <AuthGuard>
      <ClientOnly fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      }>
        <NewsletterPageContent params={params} />
      </ClientOnly>
    </AuthGuard>
  )
} 
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeftIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ChefHatIcon,
  HeartIcon,
  PrinterIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon
} from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'

// Same recipe data as in the recipes page
const recipes = [
  {
    id: 1,
    title: "Creamy Mushroom Risotto",
    description: "A rich and creamy Italian classic made with arborio rice and fresh porcini mushrooms.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    cookTime: "35 min",
    prepTime: "15 min",
    difficulty: "Medium",
    rating: 4.8,
    author: "Chef Maria",
    authorId: "user_123", // Authenticated user
    category: "Italian",
    dietType: "Vegetarian",
    servings: 4,
    ingredients: [
      "Arborio rice (1 cup)",
      "Porcini mushrooms (200g)",
      "Parmigiano-Reggiano (100g)",
      "Dry white wine (1/2 cup)",
      "Warm vegetable broth (1 liter)",
      "Onion (1 medium)",
      "Butter (4 tbsp)",
      "Extra virgin olive oil (2 tbsp)",
      "Fresh parsley",
      "Salt and white pepper"
    ],
    instructions: [
      "Soak the porcini mushrooms in warm water for 20 minutes, then drain and chop.",
      "Heat olive oil and 2 tbsp butter in a heavy-bottomed pan over medium heat.",
      "Add finely chopped onion and cook until translucent, about 3-4 minutes.",
      "Add the rice and stir to coat with oil, toasting for 2 minutes until edges are translucent.",
      "Pour in the white wine and stir until absorbed.",
      "Add warm broth one ladle at a time, stirring constantly until absorbed before adding more.",
      "After 15 minutes, add the chopped porcini mushrooms.",
      "Continue adding broth and stirring until rice is creamy but still al dente, about 18-20 minutes total.",
      "Remove from heat and stir in remaining butter and grated Parmigiano-Reggiano.",
      "Season with salt and white pepper to taste.",
      "Garnish with fresh parsley and extra cheese before serving immediately."
    ],
    tips: "The key to perfect risotto is patience and constant stirring. Never add cold broth - it should always be warm to maintain the cooking temperature.",
    inventor: "Traditional Northern Italian dish",
    history: "Risotto originated in Northern Italy during the 14th century when rice cultivation began in the Po Valley. The technique of slowly adding warm broth to rice was perfected by Milanese cooks, creating the signature creamy texture without cream. This mushroom variation became popular in the 19th century when dried porcini mushrooms became widely available."
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    description: "Traditional Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, and basil.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
    cookTime: "15 min",
    prepTime: "30 min",
    difficulty: "Medium",
    rating: 4.9,
    author: "Pizzaiolo Antonio",
    category: "Italian",
    dietType: "Vegetarian",
    servings: 2,
    ingredients: [
      "Neapolitan pizza dough (300g)",
      "San Marzano tomatoes (200g)",
      "Mozzarella di bufala (150g)",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Sea salt",
      "Tipo 00 flour for dusting"
    ],
    instructions: [
      "Preheat your oven to its highest temperature (500°F/260°C) with a pizza stone or baking sheet inside.",
      "Crush the San Marzano tomatoes by hand, season with salt and a drizzle of olive oil.",
      "On a floured surface, stretch the dough into a 12-inch circle, keeping the edges slightly thicker.",
      "Transfer to parchment paper and spread the tomato sauce thinly, leaving a 1-inch border.",
      "Tear the mozzarella into small pieces and distribute evenly over the sauce.",
      "Slide the pizza (on parchment) onto the hot stone or baking sheet.",
      "Bake for 10-15 minutes until the crust is golden and cheese is bubbly with some charred spots.",
      "Remove from oven and immediately top with fresh basil leaves.",
      "Drizzle with extra virgin olive oil and let cool for 2-3 minutes before slicing."
    ],
    tips: "For the best results, use a pizza stone and get your oven as hot as possible. The dough should be room temperature for easy stretching.",
    inventor: "Raffaele Esposito (1889)",
    history: "Created in 1889 by pizzaiolo Raffaele Esposito at Pizzeria Brandi in Naples for Queen Margherita of Savoy. The pizza featured the colors of the Italian flag: red tomatoes, white mozzarella, and green basil. This was the birth of the modern pizza as we know it, transforming from a simple flatbread into an artistic culinary expression."
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    description: "Decadent individual chocolate cake with a molten center, invented by Jean-Georges Vongerichten.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    cookTime: "12 min",
    prepTime: "20 min",
    difficulty: "Hard",
    rating: 4.7,
    author: "Pastry Chef Laurent",
    authorId: "user_456", // Authenticated user
    category: "Dessert",
    dietType: "Vegetarian",
    servings: 4,
    ingredients: [
      "Dark chocolate 70% (100g)",
      "Unsalted butter (100g)",
      "Large eggs (2 whole + 2 yolks)",
      "Caster sugar (60g)",
      "Plain flour (30g)",
      "Butter for ramekins",
      "Cocoa powder for dusting",
      "Vanilla ice cream (to serve)"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Butter 4 ramekins and dust with cocoa powder.",
      "Melt chocolate and butter in a double boiler until smooth. Let cool slightly.",
      "In a bowl, whisk whole eggs, egg yolks, and sugar until thick and pale.",
      "Gradually fold the chocolate mixture into the egg mixture.",
      "Sift flour over the mixture and gently fold in until just combined.",
      "Divide batter evenly among prepared ramekins.",
      "Bake for 10-12 minutes until edges are firm but centers still jiggle slightly.",
      "Let rest for 1 minute, then run a knife around edges to loosen.",
      "Invert onto serving plates and let sit for 10 seconds before lifting ramekins.",
      "Dust with powdered sugar and serve immediately with vanilla ice cream."
    ],
    tips: "The key is timing - underbake slightly for the molten center. These can be made ahead and refrigerated, just add 1-2 extra minutes of baking time.",
    inventor: "Jean-Georges Vongerichten (1987)",
    history: "Invented by accident in 1987 by chef Jean-Georges Vongerichten at Lafayette Restaurant in New York. He was baking chocolate sponge cakes when he pulled one out too early and discovered the molten center. This happy accident became one of the most iconic desserts of the late 20th century, popularizing the concept of 'controlled undercooking' in fine dining."
  },
  {
    id: 4,
    title: "Grilled Salmon with Herbs",
    description: "Wild-caught salmon grilled to perfection with a Mediterranean herb crust and lemon.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    cookTime: "15 min",
    prepTime: "10 min",
    difficulty: "Easy",
    rating: 4.6,
    author: "Chef Dimitris",
    authorId: "user_789", // Authenticated user
    category: "Seafood",
    dietType: "Keto",
    servings: 4,
    ingredients: [
      "Wild salmon fillets (4 x 150g)",
      "Fresh dill (2 tbsp)",
      "Fresh oregano (1 tbsp)",
      "Lemon zest and juice",
      "Extra virgin olive oil (3 tbsp)",
      "Garlic (2 cloves)",
      "Sea salt",
      "Freshly ground black pepper",
      "Capers (optional)"
    ],
    instructions: [
      "Remove salmon from refrigerator 15 minutes before cooking to bring to room temperature.",
      "Preheat grill to medium-high heat and oil the grates.",
      "Mix minced garlic, dill, oregano, lemon zest, and olive oil in a bowl.",
      "Pat salmon fillets dry and season both sides with salt and pepper.",
      "Brush the herb mixture generously over the salmon fillets.",
      "Grill skin-side down for 4-5 minutes without moving.",
      "Carefully flip and grill for another 3-4 minutes until internal temperature reaches 145°F.",
      "Remove from grill and immediately squeeze fresh lemon juice over the fish.",
      "Let rest for 2 minutes before serving.",
      "Garnish with additional fresh herbs and capers if desired."
    ],
    tips: "Don't move the salmon once it hits the grill - let it develop a good sear. The fish is done when it flakes easily with a fork.",
    inventor: "Ancient Mediterranean tradition",
    history: "Grilling fish over open flames dates back to ancient Mediterranean civilizations, particularly the Greeks and Romans around 800 BCE. The combination of herbs like oregano and dill with fish was documented in ancient Greek cooking texts. This preparation method preserved the fish's natural flavors while the herbs provided antimicrobial properties, crucial before refrigeration."
  },
  {
    id: 5,
    title: "Quinoa Buddha Bowl",
    description: "Nutritious power bowl with rainbow vegetables, quinoa, and tahini dressing inspired by macrobiotic principles.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    cookTime: "25 min",
    prepTime: "15 min",
    difficulty: "Easy",
    rating: 4.5,
    author: "Wellness Chef Sarah",
    authorId: null, // Anonymous submission
    category: "Healthy",
    dietType: "Vegan",
    servings: 2,
    ingredients: [
      "Tricolor quinoa (1 cup)",
      "Roasted chickpeas (150g)",
      "Avocado (1 ripe)",
      "Roasted sweet potato cubes",
      "Fresh spinach (2 cups)",
      "Tahini (3 tbsp)",
      "Lemon juice (2 tbsp)",
      "Maple syrup (1 tsp)",
      "Purple cabbage (shredded)",
      "Hemp seeds",
      "Pomegranate seeds"
    ],
    instructions: [
      "Rinse quinoa and cook in 2 cups water with a pinch of salt for 15 minutes until fluffy.",
      "Preheat oven to 400°F. Toss cubed sweet potato with olive oil, salt, and pepper.",
      "Roast sweet potato for 20-25 minutes until tender and lightly caramelized.",
      "For tahini dressing: whisk tahini, lemon juice, maple syrup, and 2-3 tbsp water until smooth.",
      "Drain and rinse canned chickpeas, then roast with spices for 15-20 minutes until crispy.",
      "Massage spinach leaves with a little olive oil and lemon juice.",
      "Slice avocado and prepare other toppings.",
      "Assemble bowls: place quinoa as base, arrange vegetables in sections.",
      "Top with roasted chickpeas, hemp seeds, and pomegranate seeds.",
      "Drizzle generously with tahini dressing before serving."
    ],
    tips: "Prep components ahead of time for quick assembly. The tahini dressing keeps well in the fridge for up to a week.",
    inventor: "Modern fusion of ancient traditions",
    history: "Buddha bowls emerged in the 1970s California health food movement, combining ancient grains like quinoa (cultivated by the Incas since 3000 BCE) with macrobiotic principles from Japanese Zen Buddhism. The concept of balanced, colorful meals in one bowl reflects the Buddhist principle of mindful eating and nutritional harmony. Quinoa was considered sacred by the Incas, called 'chisaya mama' or 'mother of all grains.'"
  },
  {
    id: 6,
    title: "Beef Bourguignon",
    description: "Classic Burgundian beef stew slowly braised in red wine with pearl onions and mushrooms.",
    image: "https://images.unsplash.com/photo-1574653853027-5ec760facb1d?w=800",
    cookTime: "3 hours",
    prepTime: "30 min",
    difficulty: "Hard",
    rating: 4.8,
    author: "Chef Auguste",
    authorId: "user_101", // Authenticated user
    category: "French",
    dietType: "None",
    servings: 6,
    ingredients: [
      "Beef chuck cut in cubes (1.5kg)",
      "Burgundy red wine (750ml)",
      "Pearl onions (300g)",
      "Button mushrooms (250g)",
      "Carrots (3 large)",
      "Bacon lardons (150g)",
      "Beef stock (500ml)",
      "Tomato paste (2 tbsp)",
      "Fresh thyme",
      "Bay leaves (2)",
      "Flour (3 tbsp)",
      "Butter (2 tbsp)"
    ],
    instructions: [
      "Marinate beef cubes in red wine overnight with herbs and vegetables.",
      "Remove beef and strain marinade, reserving liquid and vegetables separately.",
      "Pat beef dry and season with salt and pepper. Dust lightly with flour.",
      "Brown bacon lardons in a heavy Dutch oven, then remove and set aside.",
      "Brown beef cubes in batches in the bacon fat until well-seared on all sides.",
      "Add reserved vegetables and cook until softened, about 5 minutes.",
      "Add tomato paste and cook for 1 minute, then return beef to pot.",
      "Pour in reserved marinade and enough stock to just cover the meat.",
      "Bring to a simmer, cover, and braise in 325°F oven for 2.5-3 hours.",
      "In the last 30 minutes, add pearl onions and mushrooms.",
      "Adjust seasoning and serve with crusty bread or mashed potatoes."
    ],
    tips: "Marinating overnight is crucial for flavor. Don't skip the browning step - it adds incredible depth to the final dish.",
    inventor: "Auguste Escoffier (refined version)",
    history: "Originally a peasant dish from the Burgundy region of France, dating back to the Middle Ages when local farmers would slow-cook tough cuts of beef in local wine. The dish was elevated to haute cuisine status by Auguste Escoffier in the early 20th century. Julia Child's recipe in 'Mastering the Art of French Cooking' (1961) introduced this sophisticated stew to American home cooks, making it a symbol of French culinary excellence."
  }
]

interface RecipePageProps {
  params: {
    id: string
  }
}

// Helper function to parse and scale ingredients
function parseIngredient(ingredient: string, scale: number) {
  // Pattern 1: "Item name (quantity unit)" - most common format
  const pattern1 = /^(.+?)\s*\(([^)]+)\)(.*)$/
  const match1 = ingredient.match(pattern1)
  
  if (match1) {
    const [, itemName, quantityPart, extra] = match1
    
    // Extract number and unit from the quantity part
    const quantityMatch = quantityPart.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/)
    
    if (quantityMatch) {
      const [, quantity, unit] = quantityMatch
      const scaledQuantity = scaleQuantity(quantity, scale)
      return `${itemName.trim()} (${scaledQuantity} ${unit.trim()})${extra}`
    } else {
      // If we can't parse the quantity, return original
      return ingredient
    }
  }
  
  // Pattern 2: "quantity unit item name" 
  const pattern2 = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-Z]+)\s+(.+)$/
  const match2 = ingredient.match(pattern2)
  
  if (match2) {
    const [, quantity, unit, itemName] = match2
    const scaledQuantity = scaleQuantity(quantity, scale)
    return `${scaledQuantity} ${unit} ${itemName}`
  }
  
  // Pattern 3: "quantity item name" (no unit)
  const pattern3 = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/
  const match3 = ingredient.match(pattern3)
  
  if (match3) {
    const [, quantity, itemName] = match3
    const scaledQuantity = scaleQuantity(quantity, scale)
    return `${scaledQuantity} ${itemName}`
  }
  
  // If no quantity found, return original ingredient (for items like "Salt to taste")
  return ingredient
}

function scaleQuantity(quantity: string, scale: number): string {
  // Handle fractions
  if (quantity.includes('/')) {
    const [numerator, denominator] = quantity.split('/').map(Number)
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return quantity // Return original if parsing fails
    }
    const decimal = numerator / denominator
    const scaled = decimal * scale
    return formatQuantity(scaled)
  }
  
  // Handle regular numbers
  const num = parseFloat(quantity)
  if (isNaN(num)) {
    return quantity // Return original if not a number
  }
  const scaled = num * scale
  return formatQuantity(scaled)
}

function formatQuantity(num: number): string {
  if (num === 0) return "0"
  
  // Convert common decimals to fractions for readability
  const fractionMap: { [key: string]: string } = {
    "0.125": "1/8",
    "0.25": "1/4", 
    "0.33": "1/3",
    "0.5": "1/2",
    "0.66": "2/3",
    "0.75": "3/4"
  }
  
  // Check for exact fraction matches
  const rounded = Math.round(num * 1000) / 1000
  const fractionKey = rounded.toString()
  if (fractionMap[fractionKey]) {
    return fractionMap[fractionKey]
  }
  
  // For numbers with fractional parts, try to represent as mixed numbers
  if (num > 1) {
    const whole = Math.floor(num)
    const fraction = num - whole
    
    // Check if the fractional part matches a common fraction
    const fractionRounded = Math.round(fraction * 1000) / 1000
    const fracKey = fractionRounded.toString()
    if (fractionMap[fracKey]) {
      return `${whole} ${fractionMap[fracKey]}`
    }
  }
  
  // Round to reasonable precision for display
  if (num < 0.1) return (Math.round(num * 100) / 100).toString()
  if (num < 1) return (Math.round(num * 10) / 10).toString()
  if (num < 10) return (Math.round(num * 4) / 4).toString()
  
  // For larger numbers, round to 1 decimal place if needed
  return num % 1 === 0 ? Math.round(num).toString() : (Math.round(num * 10) / 10).toString()
}

function RecipePageContent({ params }: RecipePageProps) {
  const recipe = recipes.find(r => r.id === parseInt(params.id))
  const [selectedServings, setSelectedServings] = useState(recipe?.servings || 4)

  if (!recipe) {
    notFound()
  }

  const servingScale = selectedServings / recipe.servings
  const scaledIngredients = recipe.ingredients.map(ingredient => 
    parseIngredient(ingredient, servingScale)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/recipes"
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Recipes</span>
        </Link>

        {/* Recipe Title & Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.category}
              </span>
              {recipe.dietType !== 'None' && (
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.dietType}
                </span>
              )}
              <span className="bg-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.difficulty}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
            <p className="text-xl text-gray-200 mb-4">{recipe.description}</p>
            
            <div className="flex items-center space-x-6 text-gray-200">
              <div className="flex items-center space-x-1">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">{recipe.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-5 w-5" />
                <span>Prep: {recipe.prepTime} | Cook: {recipe.cookTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UsersIcon className="h-5 w-5" />
                <span>Serves {recipe.servings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Ingredients & Info */}
          <div className="md:col-span-1 space-y-6">
            {/* Recipe Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cooked With!</span>
                  <span className="font-medium">{recipe.author}</span>
                </div>
                
                {/* Anonymous Content Disclaimer */}
                {!recipe.authorId && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-xs text-amber-800">
                        <p className="font-medium mb-1">⚠️ Unverified Content</p>
                        <p>This recipe was submitted anonymously and has not been verified by a registered user. Please use caution and verify ingredients and instructions before cooking.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="font-medium">{recipe.prepTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time:</span>
                  <span className="font-medium">{recipe.cookTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Servings:</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
              </div>

              {/* Serving Size Selector */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg border">
                <h4 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Cooking for how many people?
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setSelectedServings(Math.max(1, selectedServings - 1))}
                    className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    disabled={selectedServings <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-700">{selectedServings}</div>
                    <div className="text-xs text-primary-600">
                      {selectedServings === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedServings(selectedServings + 1)}
                    className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {selectedServings !== recipe.servings && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      Ingredients scaled {servingScale > 1 ? 'up' : 'down'} by {Math.round(servingScale * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                  <HeartIcon className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <ShareIcon className="h-4 w-4" />
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <PrinterIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <span className="text-sm text-gray-500">
                  For {selectedServings} {selectedServings === 1 ? 'person' : 'people'}
                </span>
              </div>
              <ul className="space-y-3">
                {scaledIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
              
              {selectedServings !== recipe.servings && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    <strong>Smart Scaling:</strong> All quantities have been automatically adjusted for {selectedServings} {selectedServings === 1 ? 'person' : 'people'} 
                    (original recipe serves {recipe.servings}).
                  </p>
                </div>
              )}
            </div>

            {/* Historical Information */}
            {recipe.inventor && (
              <div className="bg-amber-50 border-l-4 border-amber-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Historical Origins</h3>
                <p className="text-sm text-amber-700 mb-2">
                  <strong>Inventor/Origin:</strong> {recipe.inventor}
                </p>
                <p className="text-sm text-amber-600 leading-relaxed">
                  {recipe.history}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-2xl font-semibold mb-6">Instructions</h3>
              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex space-x-4">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>

              {recipe.tips && (
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    <ChefHatIcon className="h-5 w-5 inline mr-2" />
                    Chef's Tips
                  </h4>
                  <p className="text-blue-700 text-sm leading-relaxed">{recipe.tips}</p>
                </div>
              )}

              {/* Scaling Tips */}
              {selectedServings !== recipe.servings && (
                <div className="mt-6 bg-amber-50 border-l-4 border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    <UsersIcon className="h-5 w-5 inline mr-2" />
                    Scaling Tips
                  </h4>
                  <div className="text-amber-700 text-sm space-y-2">
                    {servingScale > 2 && (
                      <p>• <strong>Large batches:</strong> You may need a bigger pot/pan and slightly longer cooking times for even heating.</p>
                    )}
                    {servingScale < 0.75 && (
                      <p>• <strong>Small portions:</strong> Watch cooking times closely - smaller quantities may cook faster.</p>
                    )}
                    <p>• <strong>Seasonings:</strong> Taste as you go - salt and spices may need fine-tuning when scaled.</p>
                    {(recipe.category === "Dessert" || recipe.title.includes("Cake")) && servingScale !== 1 && (
                      <p>• <strong>Baking note:</strong> For best results with scaled baking recipes, consider making multiple smaller batches.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecipePage({ params }: RecipePageProps) {
  return (
    <AuthGuard>
      <RecipePageContent params={params} />
    </AuthGuard>
  )
} 
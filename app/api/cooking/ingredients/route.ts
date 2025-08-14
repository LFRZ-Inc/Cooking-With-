import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production.up.railway.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ingredient = searchParams.get('ingredient')
    const type = searchParams.get('type') || 'all'

    // Forward request to Railway Cooking Ethos AI
    const url = new URL(`${COOKING_ETHOS_AI_URL}/api/cooking/ingredients`)
    if (ingredient) url.searchParams.set('ingredient', ingredient)
    if (type) url.searchParams.set('type', type)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Ingredients API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredient, query } = await request.json()

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient is required' },
        { status: 400 }
      )
    }

    // Forward request to Railway Cooking Ethos AI
    const response = await fetch(`${COOKING_ETHOS_AI_URL}/api/cooking/ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredient,
        query,
        source: 'cooking_with'
      })
    })

    if (!response.ok) {
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Ingredients API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
  "chicken": {
    name: "Chicken",
    description: "Versatile protein source commonly used in cooking",
    cooking_methods: ["bake", "grill", "pan-fry", "roast", "poach", "braise"],
    substitutions: ["turkey", "tofu", "tempeh", "seitan", "fish"],
    nutrition: "High protein, low fat, good source of B vitamins",
    storage: "Refrigerate at 40°F or below, use within 2-3 days",
    tips: ["Always cook to 165°F internal temperature", "Let rest for 5-10 minutes after cooking", "Use different cuts for different cooking methods"]
  },
  "tomato": {
    name: "Tomato",
    description: "Fruit commonly used as a vegetable in cooking",
    cooking_methods: ["raw", "cook", "roast", "sauce", "soup", "salad"],
    substitutions: ["bell peppers", "mushrooms", "zucchini", "eggplant"],
    nutrition: "Rich in lycopene, vitamin C, and antioxidants",
    storage: "Store at room temperature until ripe, then refrigerate",
    tips: ["Remove seeds for less acidity", "Score an X before blanching", "Use different varieties for different purposes"]
  },
  "onion": {
    name: "Onion",
    description: "Essential aromatic vegetable used in most cuisines",
    cooking_methods: ["sauté", "caramelize", "roast", "raw", "pickle"],
    substitutions: ["shallots", "leeks", "scallions", "garlic"],
    nutrition: "Good source of vitamin C, fiber, and antioxidants",
    storage: "Store in cool, dry place away from potatoes",
    tips: ["Chill before cutting to reduce tears", "Use different types for different flavors", "Caramelize slowly for sweetness"]
  },
  "garlic": {
    name: "Garlic",
    description: "Pungent bulb used for flavoring in many cuisines",
    cooking_methods: ["mince", "roast", "sauté", "raw", "pickle"],
    substitutions: ["garlic powder", "shallots", "onion", "chives"],
    nutrition: "Contains allicin, known for health benefits",
    storage: "Store in cool, dry place with good air circulation",
    tips: ["Remove green sprout for milder flavor", "Crush before mincing for more flavor", "Don't burn - becomes bitter"]
  },
  "butter": {
    name: "Butter",
    description: "Dairy fat used for cooking, baking, and flavoring",
    cooking_methods: ["melt", "cream", "clarify", "brown", "spread"],
    substitutions: ["olive oil", "coconut oil", "applesauce", "avocado"],
    nutrition: "High in saturated fat, contains vitamins A, D, E, K",
    storage: "Refrigerate, can be frozen for longer storage",
    tips: ["Use room temperature for baking", "Clarify for higher smoke point", "Brown for nutty flavor"]
  },
  "eggs": {
    name: "Eggs",
    description: "Versatile protein source used in cooking and baking",
    cooking_methods: ["scramble", "fry", "boil", "poach", "bake"],
    substitutions: ["flax seeds", "chia seeds", "banana", "applesauce", "commercial egg replacers"],
    nutrition: "Complete protein, vitamins B12, D, and choline",
    storage: "Refrigerate in original carton",
    tips: ["Room temperature eggs work better for baking", "Fresh eggs are harder to peel when boiled", "Check freshness with water test"]
  },
  "milk": {
    name: "Milk",
    description: "Dairy liquid used in cooking, baking, and beverages",
    cooking_methods: ["drink", "cook", "bake", "ferment", "froth"],
    substitutions: ["almond milk", "soy milk", "oat milk", "coconut milk", "water"],
    nutrition: "Good source of calcium, protein, and vitamin D",
    storage: "Refrigerate, use by expiration date",
    tips: ["Scald milk for better yeast activation", "Use whole milk for richer flavor", "Don't boil - can curdle"]
  },
  "flour": {
    name: "Flour",
    description: "Ground grain powder used in baking and cooking",
    cooking_methods: ["bake", "thicken", "coat", "dust"],
    substitutions: ["almond flour", "coconut flour", "oat flour", "gluten-free blends"],
    nutrition: "Carbohydrates, some protein, fortified with vitamins",
    storage: "Store in cool, dry place in airtight container",
    tips: ["Sift for lighter baked goods", "Measure by weight for accuracy", "Different types for different purposes"]
  },
  "sugar": {
    name: "Sugar",
    description: "Sweet crystalline substance used in cooking and baking",
    cooking_methods: ["dissolve", "caramelize", "cream", "sprinkle"],
    substitutions: ["honey", "maple syrup", "agave", "stevia", "monk fruit"],
    nutrition: "Pure carbohydrate, no nutrients",
    storage: "Store in cool, dry place in airtight container",
    tips: ["Different types for different purposes", "Caramelize carefully - burns easily", "Cream with butter for light texture"]
  },
  "salt": {
    name: "Salt",
    description: "Essential mineral used for seasoning and preservation",
    cooking_methods: ["season", "preserve", "brine", "cure"],
    substitutions: ["soy sauce", "miso", "anchovies", "capers"],
    nutrition: "Sodium chloride, essential for body function",
    storage: "Store in cool, dry place",
    tips: ["Season in layers", "Different types have different flavors", "Essential for bringing out flavors"]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ingredient = searchParams.get('ingredient')
    const type = searchParams.get('type') || 'all'

    if (ingredient) {
      // Get specific ingredient info
      const ingredientInfo = ingredientDatabase[ingredient.toLowerCase()]
      
      if (!ingredientInfo) {
        return NextResponse.json(
          { error: 'Ingredient not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        ingredient: ingredientInfo
      })
    }

    // Get all ingredients or filtered by type
    let ingredients = Object.entries(ingredientDatabase).map(([key, value]) => ({
      key,
      ...value
    }))

    if (type !== 'all') {
      // Filter by type (could be expanded)
      ingredients = ingredients.filter(ing => {
        // Add filtering logic based on type
        return true
      })
    }

    return NextResponse.json({
      success: true,
      ingredients,
      total: ingredients.length
    })

  } catch (error) {
    console.error('Ingredients API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredient, query } = await request.json()

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient is required' },
        { status: 400 }
      )
    }

    const ingredientInfo = ingredientDatabase[ingredient.toLowerCase()]
    
    if (!ingredientInfo) {
      return NextResponse.json({
        success: true,
        response: `I don't have specific information about ${ingredient}, but I can help you with general cooking questions about it. What would you like to know?`,
        suggestions: [
          "How to cook common ingredients",
          "Ingredient substitutions",
          "Food safety guidelines"
        ]
      })
    }

    // Generate response based on query type
    let response = ""
    let suggestions = []

    if (query?.includes('substitute') || query?.includes('replace')) {
      response = `For ${ingredientInfo.name}, you can substitute with: ${ingredientInfo.substitutions.join(', ')}. The best choice depends on your recipe and dietary needs.`
      suggestions = ["How to use substitutes", "Recipe modifications", "Dietary restrictions"]
    } else if (query?.includes('cook') || query?.includes('method')) {
      response = `${ingredientInfo.name} can be cooked using these methods: ${ingredientInfo.cooking_methods.join(', ')}. ${ingredientInfo.tips[0]}`
      suggestions = ["Cooking techniques", "Recipe ideas", "Kitchen tips"]
    } else if (query?.includes('store') || query?.includes('keep')) {
      response = `To store ${ingredientInfo.name}: ${ingredientInfo.storage}`
      suggestions = ["Food storage tips", "Kitchen organization", "Food safety"]
    } else {
      response = `${ingredientInfo.name}: ${ingredientInfo.description}. ${ingredientInfo.tips[0]}`
      suggestions = [
        `How to cook ${ingredientInfo.name}`,
        `Substitutes for ${ingredientInfo.name}`,
        `Storage tips for ${ingredientInfo.name}`
      ]
    }

    return NextResponse.json({
      success: true,
      response,
      suggestions,
      ingredient: ingredientInfo
    })

  } catch (error) {
    console.error('Ingredients API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

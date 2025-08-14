import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production.up.railway.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'general'
    const difficulty = searchParams.get('difficulty')
    const limit = searchParams.get('limit') || '5'

    // Forward request to Railway Cooking Ethos AI
    const url = new URL(`${COOKING_ETHOS_AI_URL}/api/cooking/tips`)
    url.searchParams.set('category', category)
    if (difficulty) url.searchParams.set('difficulty', difficulty)
    url.searchParams.set('limit', limit)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Cooking tips API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, category } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Forward request to Railway Cooking Ethos AI
    const response = await fetch(`${COOKING_ETHOS_AI_URL}/api/cooking/tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        category,
        source: 'cooking_with'
      })
    })

    if (!response.ok) {
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Cooking tips API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
  "general": [
    {
      title: "Mise en Place",
      tip: "Always prep all your ingredients before starting to cook. This French term means 'everything in its place' and will make cooking much smoother.",
      category: "preparation",
      difficulty: "beginner"
    },
    {
      title: "Season in Layers",
      tip: "Add salt and seasoning throughout the cooking process, not just at the end. This builds flavor depth.",
      category: "seasoning",
      difficulty: "beginner"
    },
    {
      title: "Taste as You Go",
      tip: "Always taste your food while cooking and adjust seasoning accordingly. You can always add more, but you can't take it away.",
      category: "seasoning",
      difficulty: "beginner"
    },
    {
      title: "Keep Knives Sharp",
      tip: "A sharp knife is safer than a dull one. Sharp knives require less force and are less likely to slip.",
      category: "safety",
      difficulty: "beginner"
    },
    {
      title: "Read Recipes Completely",
      tip: "Read through the entire recipe before starting. This helps you understand the process and avoid surprises.",
      category: "preparation",
      difficulty: "beginner"
    }
  ],
  "baking": [
    {
      title: "Room Temperature Ingredients",
      tip: "Use room temperature eggs, butter, and milk for better mixing and consistent results in baked goods.",
      category: "baking",
      difficulty: "beginner"
    },
    {
      title: "Don't Overmix",
      tip: "Overmixing batter creates tough baked goods. Mix just until ingredients are combined.",
      category: "baking",
      difficulty: "intermediate"
    },
    {
      title: "Preheat Your Oven",
      tip: "Always preheat your oven for at least 10-15 minutes before baking for even cooking.",
      category: "baking",
      difficulty: "beginner"
    },
    {
      title: "Measure Precisely",
      tip: "Baking is a science. Use a kitchen scale for accurate measurements, especially for flour.",
      category: "baking",
      difficulty: "beginner"
    },
    {
      title: "Check Doneness",
      tip: "Use a toothpick or cake tester to check if baked goods are done. It should come out clean or with a few moist crumbs.",
      category: "baking",
      difficulty: "beginner"
    }
  ],
  "safety": [
    {
      title: "Wash Hands Frequently",
      tip: "Wash your hands with warm, soapy water for at least 20 seconds before, during, and after cooking.",
      category: "safety",
      difficulty: "beginner"
    },
    {
      title: "Separate Cutting Boards",
      tip: "Use separate cutting boards for raw meat, poultry, seafood, and vegetables to prevent cross-contamination.",
      category: "safety",
      difficulty: "beginner"
    },
    {
      title: "Safe Temperatures",
      tip: "Use a food thermometer to ensure meat reaches safe internal temperatures: Chicken 165°F, Ground beef 160°F, Fish 145°F.",
      category: "safety",
      difficulty: "beginner"
    },
    {
      title: "Temperature Danger Zone",
      tip: "Keep hot foods hot (above 140°F) and cold foods cold (below 40°F). Bacteria grow rapidly between 40-140°F.",
      category: "safety",
      difficulty: "beginner"
    },
    {
      title: "Clean as You Go",
      tip: "Clean surfaces and utensils that come in contact with raw meat immediately to prevent contamination.",
      category: "safety",
      difficulty: "beginner"
    }
  ],
  "techniques": [
    {
      title: "Proper Knife Grip",
      tip: "Hold the knife with your index finger and thumb on the blade, other fingers wrapped around the handle for better control.",
      category: "techniques",
      difficulty: "beginner"
    },
    {
      title: "Claw Grip for Cutting",
      tip: "Use the claw grip when cutting - curl your fingers under and use your knuckles as a guide for the knife.",
      category: "techniques",
      difficulty: "beginner"
    },
    {
      title: "Deglazing",
      tip: "After searing meat, add liquid (wine, broth) to the hot pan to release flavorful browned bits stuck to the bottom.",
      category: "techniques",
      difficulty: "intermediate"
    },
    {
      title: "Resting Meat",
      tip: "Let cooked meat rest for 5-10 minutes before cutting. This allows juices to redistribute and prevents them from running out.",
      category: "techniques",
      difficulty: "beginner"
    },
    {
      title: "Blanching",
      tip: "Quickly cook vegetables in boiling water, then shock in ice water to stop cooking and preserve color and texture.",
      category: "techniques",
      difficulty: "intermediate"
    }
  ],
  "seasoning": [
    {
      title: "Salt Enhances Flavor",
      tip: "Salt doesn't just make food salty - it enhances and brings out other flavors in your dish.",
      category: "seasoning",
      difficulty: "beginner"
    },
    {
      title: "Fresh Herbs Last",
      tip: "Add fresh herbs at the end of cooking to preserve their delicate flavor and bright color.",
      category: "seasoning",
      difficulty: "beginner"
    },
    {
      title: "Toast Spices",
      tip: "Toast whole spices in a dry pan before grinding to release their essential oils and enhance flavor.",
      category: "seasoning",
      difficulty: "intermediate"
    },
    {
      title: "Balance Flavors",
      tip: "Balance sweet, sour, salty, bitter, and umami flavors for a well-rounded dish.",
      category: "seasoning",
      difficulty: "intermediate"
    },
    {
      title: "Acid Brightens",
      tip: "A squeeze of lemon juice or splash of vinegar can brighten and balance rich or heavy dishes.",
      category: "seasoning",
      difficulty: "beginner"
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'general'
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '5')

    let tips = cookingTips[category] || cookingTips.general

    // Filter by difficulty if specified
    if (difficulty) {
      tips = tips.filter(tip => tip.difficulty === difficulty)
    }

    // Limit results
    tips = tips.slice(0, limit)

    return NextResponse.json({
      success: true,
      tips,
      category,
      total: tips.length
    })

  } catch (error) {
    console.error('Cooking tips API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, category } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Find relevant tips based on query
    const queryLower = query.toLowerCase()
    let relevantTips = []

    // Search through all categories
    Object.entries(cookingTips).forEach(([cat, tips]) => {
      tips.forEach(tip => {
        if (tip.title.toLowerCase().includes(queryLower) || 
            tip.tip.toLowerCase().includes(queryLower) ||
            tip.category.toLowerCase().includes(queryLower)) {
          relevantTips.push({ ...tip, category: cat })
        }
      })
    })

    // If no specific matches, return general tips
    if (relevantTips.length === 0) {
      relevantTips = cookingTips.general.slice(0, 3).map(tip => ({ ...tip, category: 'general' }))
    }

    // Limit to top 3 most relevant
    relevantTips = relevantTips.slice(0, 3)

    let response = ""
    if (relevantTips.length > 0) {
      response = `Here are some helpful cooking tips for you:\n\n${relevantTips.map(tip => 
        `• ${tip.title}: ${tip.tip}`
      ).join('\n\n')}`
    } else {
      response = "I don't have specific tips for that, but here are some general cooking tips that are always helpful."
    }

    return NextResponse.json({
      success: true,
      response,
      tips: relevantTips,
      suggestions: [
        "Baking tips",
        "Kitchen safety",
        "Cooking techniques",
        "Seasoning advice"
      ]
    })

  } catch (error) {
    console.error('Cooking tips API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

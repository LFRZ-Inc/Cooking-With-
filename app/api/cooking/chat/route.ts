import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const { message, context, user_preferences } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Forward request to Railway Cooking Ethos AI
    const response = await fetch(`${COOKING_ETHOS_AI_URL}/api/cooking/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
        user_preferences,
        source: 'cooking_with' // Identify as coming from Cooking With!
      })
    })

    if (!response.ok) {
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Cooking chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateCookingResponse(message: string, context?: any, user_preferences?: any) {
  // Cooking knowledge base
  const cookingKnowledge = {
    chicken: {
      response: "To cook chicken breast properly, preheat your oven to 400°F (200°C). Season the chicken with salt, pepper, and your favorite herbs. Place it in a baking dish and cook for 20-25 minutes until the internal temperature reaches 165°F (74°C). Let it rest for 5 minutes before slicing.",
      suggestions: ["How to make chicken marinade", "Chicken cooking techniques", "Safe cooking temperatures"]
    },
    pasta: {
      response: "To make pasta, bring a large pot of salted water to a boil. Add your pasta and cook according to package directions (usually 8-12 minutes). Drain and serve with your favorite sauce. Remember: the water should taste like seawater for proper seasoning!",
      suggestions: ["Pasta sauce recipes", "Al dente cooking tips", "Pasta types and uses"]
    },
    substitute: {
      response: "Here are some common cooking substitutions: Butter can be replaced with olive oil, coconut oil, or applesauce in baking. Eggs can be substituted with flax seeds, chia seeds, or commercial egg replacers. Milk can be replaced with almond milk, soy milk, or oat milk.",
      suggestions: ["Baking substitutions", "Dairy alternatives", "Gluten-free options"]
    },
    temperature: {
      response: "Safe cooking temperatures: Chicken and turkey (165°F/74°C), Ground beef (160°F/71°C), Fish (145°F/63°C), Pork (145°F/63°C), Beef steaks (145°F/63°C for medium-rare). Always use a food thermometer for accuracy!",
      suggestions: ["Food safety guidelines", "Cooking temperature charts", "Kitchen safety tips"]
    },
    knife: {
      response: "Proper knife skills are essential for cooking. Hold the knife with your index finger and thumb on the blade, other fingers wrapped around the handle. Use a rocking motion for chopping, and always keep your fingers curled under to avoid cuts. Keep your knives sharp - a dull knife is more dangerous than a sharp one!",
      suggestions: ["Basic knife cuts", "Knife maintenance", "Kitchen safety"]
    },
    seasoning: {
      response: "Seasoning is key to great cooking! Salt enhances flavors, pepper adds warmth, and herbs bring freshness. Season in layers - a little salt while cooking, then adjust at the end. Remember: you can always add more, but you can't take it away!",
      suggestions: ["Herb and spice guide", "Seasoning techniques", "Flavor pairing"]
    },
    baking: {
      response: "Baking is a science! Measure ingredients precisely, preheat your oven, and don't overmix. Room temperature ingredients work best for most recipes. Always check doneness with a toothpick or thermometer.",
      suggestions: ["Baking basics", "Common baking mistakes", "Baking substitutions"]
    },
    meal_planning: {
      response: "Meal planning saves time and money! Plan your meals for the week, make a shopping list, and prep ingredients in advance. Consider batch cooking and freezing portions for busy days.",
      suggestions: ["Weekly meal planning", "Grocery shopping tips", "Meal prep ideas"]
    }
  }

  // Determine response based on message content
  let response = "I'm your specialized cooking assistant! I can help with recipes, cooking techniques, ingredient substitutions, food safety, and more. What would you like to know about cooking?"
  let suggestions = ["How to cook chicken breast", "Pasta cooking tips", "Ingredient substitutions", "Safe cooking temperatures"]
  let confidence = 0.85

  // Check for specific cooking topics
  if (message.includes('chicken') && (message.includes('cook') || message.includes('make'))) {
    const knowledge = cookingKnowledge.chicken
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('pasta') && (message.includes('make') || message.includes('cook'))) {
    const knowledge = cookingKnowledge.pasta
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('substitute') || message.includes('alternative') || message.includes('replace')) {
    const knowledge = cookingKnowledge.substitute
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('temperature') && message.includes('safe')) {
    const knowledge = cookingKnowledge.temperature
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('knife') || message.includes('cut') || message.includes('chop')) {
    const knowledge = cookingKnowledge.knife
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('season') || message.includes('salt') || message.includes('spice')) {
    const knowledge = cookingKnowledge.seasoning
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('bake') || message.includes('baking') || message.includes('oven')) {
    const knowledge = cookingKnowledge.baking
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('meal') && message.includes('plan')) {
    const knowledge = cookingKnowledge.meal_planning
    response = knowledge.response
    suggestions = knowledge.suggestions
  } else if (message.includes('tip') || message.includes('advice') || message.includes('help')) {
    // Get cooking tips
    try {
      const tipsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cooking/tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message })
      })
      
      if (tipsResponse.ok) {
        const tipsData = await tipsResponse.json()
        response = tipsData.response
        suggestions = tipsData.suggestions
      }
    } catch (error) {
      console.error('Error fetching tips:', error)
    }
  } else if (message.includes('ingredient') || message.includes('substitute') || message.includes('cook')) {
    // Check for ingredient-specific questions
    const commonIngredients = ['chicken', 'tomato', 'onion', 'garlic', 'butter', 'eggs', 'milk', 'flour', 'sugar', 'salt']
    const foundIngredient = commonIngredients.find(ing => message.includes(ing))
    
    if (foundIngredient) {
      try {
        const ingredientResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cooking/ingredients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredient: foundIngredient, query: message })
        })
        
        if (ingredientResponse.ok) {
          const ingredientData = await ingredientResponse.json()
          response = ingredientData.response
          suggestions = ingredientData.suggestions
        }
      } catch (error) {
        console.error('Error fetching ingredient info:', error)
      }
    }
  }

  return {
    response,
    suggestions,
    confidence,
    timestamp: new Date().toISOString()
  }
}

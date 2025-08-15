import { NextRequest, NextResponse } from 'next/server'

// Use local Ethos-AI system instead of broken Railway deployment
const ETHOS_AI_URL = process.env.ETHOS_AI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const { message, context, user_preferences } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Add cooking-specific context to make Ethos-AI cooking-focused
    const cookingContext = {
      ...context,
      cooking_focus: true,
      user_type: 'cooking_enthusiast',
      domain: 'culinary',
      preferences: {
        ...user_preferences,
        focus_areas: ['recipes', 'ingredients', 'techniques', 'safety', 'tips']
      }
    }

    // Forward request to local Ethos-AI with cooking context
    const response = await fetch(`${ETHOS_AI_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `You are a specialized cooking assistant. Please help with this cooking-related question: ${message}`,
        conversation_id: context?.conversation_id || 'cooking_session',
        model_override: 'llama3.2-3b', // Use local model
        use_tools: true
      })
    })

    if (!response.ok) {
      console.error('Ethos-AI API error:', response.status, response.statusText)
      // Fallback to local cooking knowledge if Ethos-AI is not available
      return NextResponse.json({
        success: true,
        response: generateLocalCookingResponse(message),
        suggestions: getCookingSuggestions(message),
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        source: 'cooking_with',
        mode: 'cooking_specialist'
      })
    }

    const data = await response.json()
    
    // Transform Ethos-AI response to match cooking chat format
    return NextResponse.json({
      success: true,
      response: data.content,
      suggestions: getCookingSuggestions(message),
      confidence: 0.9,
      timestamp: data.timestamp,
      source: 'cooking_with',
      mode: 'cooking_specialist',
      model_used: data.model_used
    })

  } catch (error) {
    console.error('Cooking chat API error:', error)
    // Fallback to local cooking knowledge
    return NextResponse.json({
      success: true,
      response: generateLocalCookingResponse(message),
      suggestions: getCookingSuggestions(message),
      confidence: 0.7,
      timestamp: new Date().toISOString(),
      source: 'cooking_with',
      mode: 'cooking_specialist'
    })
  }
}

// Local cooking knowledge as fallback
function generateLocalCookingResponse(message: string): string {
  const messageLower = message.toLowerCase()
  
  if (messageLower.includes('chicken') && messageLower.includes('cook')) {
    return "To cook chicken breast properly, preheat your oven to 400°F (200°C). Season the chicken with salt, pepper, and your favorite herbs. Place it in a baking dish and cook for 20-25 minutes until the internal temperature reaches 165°F (74°C). Let it rest for 5 minutes before slicing."
  }
  
  if (messageLower.includes('pasta') && messageLower.includes('make')) {
    return "To make pasta, bring a large pot of salted water to a boil. Add your pasta and cook according to package directions (usually 8-12 minutes). Drain and serve with your favorite sauce. Remember: the water should taste like seawater for proper seasoning!"
  }
  
  if (messageLower.includes('substitute') || messageLower.includes('alternative')) {
    return "Here are some common cooking substitutions: Butter can be replaced with olive oil, coconut oil, or applesauce in baking. Eggs can be substituted with flax seeds, chia seeds, or commercial egg replacers. Milk can be replaced with almond milk, soy milk, or oat milk."
  }
  
  if (messageLower.includes('temperature') && messageLower.includes('safe')) {
    return "Safe cooking temperatures: Chicken and turkey (165°F/74°C), Ground beef (160°F/71°C), Fish (145°F/63°C), Pork (145°F/63°C), Beef steaks (145°F/63°C for medium-rare). Always use a food thermometer for accuracy!"
  }
  
  if (messageLower.includes('what can i do with') || messageLower.includes('what to make with')) {
    return "I can help you find recipes and cooking ideas! What specific ingredients are you working with? I can suggest dishes, cooking methods, and recipe modifications based on what you have."
  }
  
  return "🍳 I'm your specialized cooking assistant! I can help with recipes, cooking techniques, ingredient substitutions, food safety, and more. What would you like to know about cooking?"
}

function getCookingSuggestions(message: string): string[] {
  const messageLower = message.toLowerCase()
  
  if (messageLower.includes('chicken')) {
    return ["How to make chicken marinade", "Chicken cooking techniques", "Safe cooking temperatures"]
  }
  
  if (messageLower.includes('pasta')) {
    return ["Pasta sauce recipes", "Al dente cooking tips", "Pasta types and uses"]
  }
  
  if (messageLower.includes('substitute')) {
    return ["Baking substitutions", "Dairy alternatives", "Gluten-free options"]
  }
  
  if (messageLower.includes('temperature')) {
    return ["Food safety guidelines", "Cooking temperature charts", "Kitchen safety tips"]
  }
  
  return ["How to cook chicken breast", "Pasta cooking tips", "Ingredient substitutions", "Safe cooking temperatures"]
}

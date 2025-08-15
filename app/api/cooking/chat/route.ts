import { NextRequest, NextResponse } from 'next/server'

// Temporarily use local Ethos-AI since Railway is down
const ETHOS_AI_URL = process.env.ETHOS_AI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  let message = ''
  
  try {
    const { message: requestMessage, context, user_preferences } = await request.json()
    message = requestMessage

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log(`🍳 Cooking chat request: "${message}"`)
    console.log(`🔗 Attempting to connect to: ${ETHOS_AI_URL}`)

    // Forward request to working Railway Ethos-AI with cooking context
    const response = await fetch(`${ETHOS_AI_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `You are a specialized cooking assistant. Please help with this cooking-related question: ${message}`,
        conversation_id: context?.conversation_id || 'cooking_session',
        use_tools: true
      })
    })

    console.log(`📡 Railway response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Railway API error: ${response.status} - ${errorText}`)
      
      // Fallback to local cooking knowledge if Ethos-AI is not available
      const fallbackResponse = generateLocalCookingResponse(message)
      console.log(`🔄 Using fallback response: ${fallbackResponse.substring(0, 100)}...`)
      
      return NextResponse.json({
        success: true,
        response: fallbackResponse,
        suggestions: getCookingSuggestions(message),
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        source: 'cooking_with',
        mode: 'cooking_specialist',
        fallback_used: true,
        railway_error: `${response.status}: ${errorText}`
      })
    }

    const data = await response.json()
    console.log(`✅ Railway response received: ${data.content?.substring(0, 100)}...`)
    
    // Transform Ethos-AI response to match cooking chat format
    return NextResponse.json({
      success: true,
      response: data.content,
      suggestions: getCookingSuggestions(message),
      confidence: 0.9,
      timestamp: data.timestamp,
      source: 'cooking_with',
      mode: 'cooking_specialist',
      model_used: data.model_used,
      railway_success: true
    })

  } catch (error) {
    console.error('❌ Cooking chat API error:', error)
    
    // Fallback to local cooking knowledge
    const fallbackResponse = generateLocalCookingResponse(message)
    console.log(`🔄 Using fallback response due to error: ${fallbackResponse.substring(0, 100)}...`)
    
    return NextResponse.json({
      success: true,
      response: fallbackResponse,
      suggestions: getCookingSuggestions(message),
      confidence: 0.7,
      timestamp: new Date().toISOString(),
      source: 'cooking_with',
      mode: 'cooking_specialist',
      fallback_used: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Local cooking knowledge as fallback
function generateLocalCookingResponse(message: string): string {
  const messageLower = message.toLowerCase()
  
  // Specific food questions
  if (messageLower.includes('enchilada')) {
    return "Enchiladas are a traditional Mexican dish made with corn tortillas that are filled with various ingredients (like meat, cheese, beans, or vegetables), rolled up, and covered with a chili sauce. They're typically baked and served with toppings like sour cream, cheese, and fresh cilantro. The name 'enchilada' comes from the Spanish word 'enchilar' meaning 'to season with chili.'"
  }
  
  if (messageLower.includes('taco')) {
    return "Tacos are a traditional Mexican dish consisting of a corn or wheat tortilla folded or rolled around a filling. Common fillings include beef, chicken, pork, fish, beans, vegetables, and cheese. Tacos are typically served with toppings like salsa, guacamole, sour cream, lettuce, and tomatoes. They can be soft (folded tortillas) or hard (crispy shells)."
  }
  
  if (messageLower.includes('burrito')) {
    return "A burrito is a Mexican dish consisting of a flour tortilla wrapped around various ingredients, typically beans, rice, meat, and vegetables. Unlike tacos, burritos are completely wrapped, making them portable and easy to eat. They originated in northern Mexico and are popular in Mexican-American cuisine."
  }
  
  if (messageLower.includes('quesadilla')) {
    return "A quesadilla is a Mexican dish made with a tortilla filled primarily with cheese, and sometimes meats, spices, and other fillings, then cooked on a griddle or stove. The name comes from the Spanish word 'queso' meaning cheese. Quesadillas can be made with corn or flour tortillas and are often served with salsa, guacamole, or sour cream."
  }
  
  // Cooking technique questions
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
  
  // General cooking questions
  if (messageLower.includes('what is') || messageLower.includes('what are')) {
    return "I'd be happy to explain that! Could you provide more details about what you're asking about? I can help with ingredients, cooking techniques, recipes, food safety, and more."
  }
  
  if (messageLower.includes('how to') || messageLower.includes('how do i')) {
    return "I can help you with cooking techniques and methods! What specific cooking task are you trying to accomplish? I can provide step-by-step instructions for various cooking processes."
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

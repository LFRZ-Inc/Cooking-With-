import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production-6bfd.up.railway.app'

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
      console.error('Railway API error:', response.status, response.statusText)
      throw new Error(`Cooking AI service error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Cooking chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

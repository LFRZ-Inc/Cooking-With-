import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production-6bfd.up.railway.app'

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

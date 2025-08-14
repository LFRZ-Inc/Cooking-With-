import { NextRequest, NextResponse } from 'next/server'

// Cooking Ethos AI - Railway Integration
const COOKING_ETHOS_AI_URL = process.env.COOKING_ETHOS_AI_URL || 'https://cooking-ethos-ai-production-6bfd.up.railway.app'

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

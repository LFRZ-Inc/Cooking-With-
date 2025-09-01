import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'published'
    const author_id = searchParams.get('author_id')

    let query = supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (author_id) {
      query = query.eq('author_id', author_id)
    }

    const { data: recipes, error } = await query

    if (error) {
      console.error('Error fetching recipes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      recipes: recipes || [],
      pagination: {
        limit,
        offset,
        total: recipes?.length || 0
      }
    })

  } catch (error) {
    console.error('Recipes API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()
    const {
      title,
      description,
      author_id,
      difficulty = 'medium',
      prep_time_minutes = 0,
      cook_time_minutes = 0,
      servings = 4,
      instructions = [],
      tips,
      image_url,
      ingredients = [],
      categories = []
    } = await request.json()

    if (!title || !author_id || !instructions || instructions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create recipe
    const recipeData = {
      title,
      description: description || '',
      author_id,
      difficulty,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      instructions,
      tips,
      image_url,
      status: 'draft',
      rating: 0,
      rating_count: 0,
      view_count: 0,
      version_number: 1,
      parent_recipe_id: null,
      is_original: true,
      branch_name: null
    }

    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([recipeData])
      .select()
      .single()

    if (recipeError) {
      console.error('Error creating recipe:', recipeError)
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: 500 }
      )
    }

    // Create ingredients
    if (ingredients.length > 0) {
      const ingredientsData = ingredients.map((ingredient: any, index: number) => ({
        recipe_id: recipe.id,
        name: ingredient.name || ingredient,
        amount: ingredient.amount || null,
        unit: ingredient.unit || null,
        notes: ingredient.notes || null,
        order_index: index
      }))

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsData)

      if (ingredientsError) {
        console.error('Error creating ingredients:', ingredientsError)
        // Don't fail the whole creation for ingredient errors
      }
    }

    // Create category associations
    if (categories.length > 0) {
      const categoryData = categories.map((categoryId: string) => ({
        recipe_id: recipe.id,
        category_id: categoryId
      }))

      const { error: categoryError } = await supabase
        .from('recipe_categories')
        .insert(categoryData)

      if (categoryError) {
        console.error('Error creating category associations:', categoryError)
        // Don't fail the whole creation for category errors
      }
    }

    return NextResponse.json({
      success: true,
      recipe: {
        ...recipe,
        ingredients: ingredients,
        categories: categories
      }
    })

  } catch (error) {
    console.error('Recipe creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

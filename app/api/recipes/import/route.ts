import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseRecipe, ParsingResult } from '@/lib/recipeParser'
import { TranslationService } from '@/lib/translationService'

export async function POST(request: NextRequest) {
  try {
    const {
      import_type,
      source_data,
      user_id,
      auto_translate = false,
      target_language = 'en',
      use_ethos_ai = true // Enable Ethos AI by default
    } = await request.json()

    if (!source_data || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: source_data and user_id' },
        { status: 400 }
      )
    }

    // Parse the recipe based on import type
    let parsedRecipe: ParsingResult

    if (import_type === 'text') {
      // Handle both raw text and JSON stringified recipes
      let textToParse = source_data
      
      try {
        // Check if it's a JSON stringified recipe (from editing)
        const parsed = JSON.parse(source_data)
        if (parsed.title && (parsed.ingredients || parsed.instructions)) {
          // It's already a parsed recipe, use it directly
          parsedRecipe = {
            recipe: parsed,
            success: true
          }
        } else {
          // It's just text, parse it with Ethos AI if available
          parsedRecipe = await parseRecipe(source_data, use_ethos_ai)
        }
      } catch {
        // Not JSON, treat as raw text
        parsedRecipe = await parseRecipe(source_data, use_ethos_ai)
      }
    } else if (import_type === 'webpage') {
      // For webpage imports, we'd need to fetch and parse the HTML
      // For now, treat as text
      parsedRecipe = await parseRecipe(source_data, use_ethos_ai)
    } else if (import_type === 'image') {
      // For image imports, the OCR text should already be in source_data
      // Use Ethos AI for better parsing of garbled OCR text
      parsedRecipe = await parseRecipe(source_data, use_ethos_ai)
    } else {
      return NextResponse.json(
        { error: 'Invalid import_type. Must be "text", "webpage", or "image"' },
        { status: 400 }
      )
    }

    if (!parsedRecipe.success) {
      return NextResponse.json(
        { 
          error: 'Failed to parse recipe',
          details: parsedRecipe.errors,
          warnings: parsedRecipe.warnings
        },
        { status: 400 }
      )
    }

    const recipe = parsedRecipe.recipe

    // Validate required fields
    if (!recipe.title || recipe.title === 'Untitled Recipe') {
      return NextResponse.json(
        { error: 'Could not extract recipe title' },
        { status: 400 }
      )
    }

    if (recipe.ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients were detected in the recipe' },
        { status: 400 }
      )
    }

    if (recipe.instructions.length === 0) {
      return NextResponse.json(
        { error: 'No instructions were detected in the recipe' },
        { status: 400 }
      )
    }

    // Create recipe in database
    const recipeData = {
      title: recipe.title,
      description: recipe.description || '',
      author_id: user_id,
      difficulty: recipe.difficulty || 'medium',
      prep_time_minutes: recipe.prep_time_minutes || 0,
      cook_time_minutes: recipe.cook_time_minutes || 0,
      servings: recipe.servings || 4,
      instructions: recipe.instructions,
      tips: recipe.parsing_notes?.join('\n') || '',
      image_url: recipe.image_url,
      status: 'draft',
      rating: 0,
      rating_count: 0,
      view_count: 0,
      version_number: 1,
      parent_recipe_id: null,
      is_original: true,
      branch_name: null
    }

    const { data: createdRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([recipeData])
      .select()
      .single()

    if (recipeError) {
      console.error('Error creating recipe:', recipeError)
      return NextResponse.json(
        { error: 'Failed to create recipe in database' },
        { status: 500 }
      )
    }

    // Create ingredients
    const ingredientsData = recipe.ingredients.map((ingredient, index) => ({
      recipe_id: createdRecipe.id,
      name: ingredient,
      amount: '',
      unit: '',
      notes: '',
      order_index: index
    }))

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientsData)

    if (ingredientsError) {
      console.error('Error creating ingredients:', ingredientsError)
      // Don't fail the whole request if ingredients fail
    }

    // Handle translation if requested
    if (auto_translate && target_language !== 'en') {
      try {
        const translationService = new TranslationService()
        
        // Create translation job
        const { data: translationJob, error: translationError } = await supabase
          .from('translation_jobs')
          .insert({
            recipe_id: createdRecipe.id,
            source_language: 'en',
            target_language: target_language,
            status: 'pending',
            created_by: user_id
          })
          .select()
          .single()

        if (translationError) {
          console.error('Error creating translation job:', translationError)
        } else {
          // Start translation in background
          translationService.translateRecipe(createdRecipe.id, target_language).catch(error => {
            console.error('Translation failed:', error)
          })
        }
      } catch (error) {
        console.error('Translation setup failed:', error)
        // Don't fail the import if translation fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      recipe: {
        id: createdRecipe.id,
        title: createdRecipe.title,
        description: createdRecipe.description,
        ingredients: ingredientsData,
        instructions: createdRecipe.instructions,
        prep_time_minutes: createdRecipe.prep_time_minutes,
        cook_time_minutes: createdRecipe.cook_time_minutes,
        servings: createdRecipe.servings,
        difficulty: createdRecipe.difficulty,
        status: createdRecipe.status,
        created_at: createdRecipe.created_at,
        parsing_notes: recipe.parsing_notes,
        provider: recipe.provider
      },
      message: 'Recipe imported successfully'
    })

  } catch (error) {
    console.error('Recipe import error:', error)
    return NextResponse.json(
      { error: 'Internal server error during recipe import' },
      { status: 500 }
    )
  }
}
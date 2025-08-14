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
      target_language = 'en'
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
          // It's just text, parse it
          parsedRecipe = parseRecipe(source_data)
        }
      } catch {
        // Not JSON, treat as raw text
        parsedRecipe = parseRecipe(source_data)
      }
    } else if (import_type === 'webpage') {
      // For webpage imports, we'd need to fetch and parse the HTML
      // For now, treat as text
      parsedRecipe = parseRecipe(source_data)
    } else if (import_type === 'image') {
      // For image imports, the OCR text should already be in source_data
      parsedRecipe = parseRecipe(source_data)
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
      amount: null,
      unit: null,
      notes: null,
      order_index: index
    }))

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientsData)

    if (ingredientsError) {
      console.error('Error creating ingredients:', ingredientsError)
      // Don't fail the whole creation for ingredient errors
    }

    // Create import record
    const importData = {
      recipe_id: createdRecipe.id,
      user_id: user_id,
      source_url: recipe.source_url,
      source_domain: recipe.source_url ? new URL(recipe.source_url).hostname : null,
      import_method: import_type,
      original_content: source_data,
      import_metadata: {
        confidence_score: recipe.confidence_score,
        parsing_notes: recipe.parsing_notes,
        warnings: parsedRecipe.warnings,
        errors: parsedRecipe.errors
      },
      import_status: 'completed',
      confidence_score: recipe.confidence_score,
      field_mapping: {
        title: recipe.title,
        ingredients_count: recipe.ingredients.length,
        instructions_count: recipe.instructions.length,
        has_times: !!(recipe.prep_time_minutes || recipe.cook_time_minutes),
        has_servings: !!recipe.servings
      }
    }

    const { error: importError } = await supabase
      .from('recipe_imports')
      .insert([importData])

    if (importError) {
      console.error('Error creating import record:', importError)
      // Don't fail the whole creation for import record errors
    }

    // Handle translation if requested
    if (auto_translate && target_language !== 'en') {
      try {
        const translationService = TranslationService.getInstance()
        
        // Queue translation jobs for the recipe
        const fieldsToTranslate = ['title', 'description']
        if (recipe.description) {
          fieldsToTranslate.push('description')
        }

        for (const field of fieldsToTranslate) {
          const textToTranslate = recipe[field as keyof typeof recipe]
          if (textToTranslate && typeof textToTranslate === 'string') {
            const translatedText = await translationService.translateText(
              textToTranslate,
              target_language,
              'en'
            )

            if (translatedText) {
              // Store translation in database
              await supabase
                .from('translations')
                .insert({
                  content_type: 'recipe',
                  content_id: createdRecipe.id,
                  field_name: field,
                  original_text: textToTranslate,
                  translated_text: translatedText,
                  source_language: 'en',
                  target_language: target_language,
                  translation_status: 'completed',
                  translation_provider: 'libretranslate',
                  confidence_score: 0.9
                })
            }
          }
        }

        // Queue ingredient and instruction translations
        const ingredientTranslations = await Promise.all(
          recipe.ingredients.map(async (ingredient, index) => {
            const translated = await translationService.translateText(ingredient, target_language, 'en')
            return {
              recipe_id: createdRecipe.id,
              name: translated || ingredient,
              amount: null,
              unit: null,
              notes: null,
              order_index: index
            }
          })
        )

        const instructionTranslations = await Promise.all(
          recipe.instructions.map(async (instruction, index) => {
            const translated = await translationService.translateText(instruction, target_language, 'en')
            return translated || instruction
          })
        )

        // Update recipe with translations
        await supabase
          .from('recipes')
          .update({
            title: await translationService.translateText(recipe.title, target_language, 'en') || recipe.title,
            instructions: instructionTranslations
          })
          .eq('id', createdRecipe.id)

        // Update ingredients with translations
        await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', createdRecipe.id)

        await supabase
          .from('recipe_ingredients')
          .insert(ingredientTranslations)

      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Don't fail the import for translation errors
      }
    }

    // Return the created recipe with additional metadata
    const result = {
      recipe: {
        ...createdRecipe,
        ingredients: recipe.ingredients,
        confidence_score: recipe.confidence_score,
        parsing_notes: recipe.parsing_notes,
        warnings: parsedRecipe.warnings,
        errors: parsedRecipe.errors
      },
      import_metadata: {
        method: import_type,
        confidence: recipe.confidence_score,
        ingredients_count: recipe.ingredients.length,
        instructions_count: recipe.instructions.length,
        translation_applied: auto_translate && target_language !== 'en'
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Recipe import error:', error)
    return NextResponse.json(
      { error: 'Internal server error during recipe import' },
      { status: 500 }
    )
  }
}
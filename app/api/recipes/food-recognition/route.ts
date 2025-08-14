import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeFoodImage, validateFoodImage, FoodRecognitionResult } from '@/lib/foodRecognitionService'

export async function POST(request: NextRequest) {
  try {
    const {
      image_url,
      user_id,
      user_preferences,
      auto_save = false
    } = await request.json()

    if (!image_url || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: image_url and user_id' },
        { status: 400 }
      )
    }

    // First, validate that the image contains food
    const isValidFoodImage = await validateFoodImage(image_url)
    
    if (!isValidFoodImage) {
      return NextResponse.json(
        { error: 'The uploaded image does not appear to contain food. Please upload a photo of a cooked dish.' },
        { status: 400 }
      )
    }

    // Analyze the food image and generate recipe
    const foodRecognitionResult = await analyzeFoodImage(image_url, user_preferences)

    // Convert the food recognition result to our recipe format
    const recipeData = {
      title: foodRecognitionResult.dish_name,
      description: foodRecognitionResult.description,
      author_id: user_id,
      difficulty: foodRecognitionResult.difficulty,
      prep_time_minutes: foodRecognitionResult.estimated_prep_time,
      cook_time_minutes: foodRecognitionResult.estimated_cook_time,
      servings: 4, // Default servings
      instructions: foodRecognitionResult.cooking_methods,
      tips: foodRecognitionResult.tips.join('\n'),
      image_url: image_url,
      status: 'draft',
      rating: 0,
      rating_count: 0,
      view_count: 0,
      version_number: 1,
      parent_recipe_id: null,
      is_original: true,
      branch_name: null
    }

    let createdRecipe = null

    // Save to database if auto_save is enabled
    if (auto_save) {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single()

      if (recipeError) {
        console.error('Error creating recipe:', recipeError)
        return NextResponse.json(
          { error: 'Failed to save recipe to database' },
          { status: 500 }
        )
      }

      createdRecipe = recipe

      // Create ingredients
      const ingredientsData = foodRecognitionResult.ingredients.map((ingredient, index) => ({
        recipe_id: recipe.id,
        name: ingredient.name,
        amount: null,
        unit: null,
        notes: ingredient.estimated_amount,
        order_index: index
      }))

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsData)

      if (ingredientsError) {
        console.error('Error creating ingredients:', ingredientsError)
        // Don't fail the whole creation for ingredient errors
      }

      // Create food recognition record
      const recognitionData = {
        recipe_id: recipe.id,
        user_id: user_id,
        source_image_url: image_url,
        recognition_method: 'ai_vision',
        recognition_metadata: {
          confidence_score: foodRecognitionResult.confidence,
          visual_analysis: foodRecognitionResult.visual_analysis,
          cuisine_type: foodRecognitionResult.cuisine_type,
          meal_type: foodRecognitionResult.meal_type,
          user_preferences: user_preferences
        },
        recognition_status: 'completed',
        confidence_score: foodRecognitionResult.confidence,
        field_mapping: {
          title: foodRecognitionResult.dish_name,
          ingredients_count: foodRecognitionResult.ingredients.length,
          instructions_count: foodRecognitionResult.cooking_methods.length,
          has_times: !!(foodRecognitionResult.estimated_prep_time || foodRecognitionResult.estimated_cook_time),
          has_servings: true
        }
      }

      const { error: recognitionError } = await supabase
        .from('recipe_imports')
        .insert([recognitionData])

      if (recognitionError) {
        console.error('Error creating recognition record:', recognitionError)
        // Don't fail the whole creation for recognition record errors
      }
    }

    // Return the food recognition result
    const result = {
      success: true,
      food_recognition: foodRecognitionResult,
      recipe: createdRecipe || recipeData,
      metadata: {
        method: 'ai_food_recognition',
        confidence: foodRecognitionResult.confidence,
        ingredients_count: foodRecognitionResult.ingredients.length,
        instructions_count: foodRecognitionResult.cooking_methods.length,
        auto_saved: auto_save,
        visual_analysis: foodRecognitionResult.visual_analysis
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Food recognition error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const image_url = searchParams.get('image_url')

    if (!image_url) {
      return NextResponse.json(
        { error: 'Missing image_url parameter' },
        { status: 400 }
      )
    }

    // Validate if the image contains food
    const isValidFoodImage = await validateFoodImage(image_url)

    return NextResponse.json({
      is_food_image: isValidFoodImage,
      message: isValidFoodImage 
        ? 'Image appears to contain food and can be analyzed' 
        : 'Image does not appear to contain food'
    })

  } catch (error) {
    console.error('Food validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate food image' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { EthosFoodRecognitionService } from '@/lib/ethosFoodRecognitionService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userPreferences, saveToDatabase = false } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    console.log('Starting Ethos AI food recognition for:', imageUrl)

    // Initialize Ethos AI service
    const ethosService = new EthosFoodRecognitionService()

    // Analyze the food image
    const result = await ethosService.analyzeFoodImage({
      imageUrl,
      userPreferences
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to analyze food image' },
        { status: 400 }
      )
    }

    // Convert to our app's recipe format
    const recipe = {
      title: result.recipe.title,
      description: result.recipe.description,
      ingredients: result.recipe.ingredients.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        notes: ing.notes || ''
      })),
      instructions: result.recipe.instructions,
      prepTime: result.recipe.prepTime,
      cookTime: result.recipe.cookTime,
      servings: result.recipe.servings,
      difficulty: result.recipe.difficulty,
      cuisine: result.recipe.cuisine,
      mealType: result.recipe.mealType,
      tags: result.recipe.tags,
      confidence: result.analysis.confidence
    }

    let savedRecipeId = null

    // Save to database if requested
    if (saveToDatabase) {
      try {
        // Insert recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .insert({
            title: recipe.title,
            description: recipe.description,
            instructions: recipe.instructions,
            prep_time: recipe.prepTime,
            cook_time: recipe.cookTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            cuisine: recipe.cuisine,
            meal_type: recipe.mealType,
            tags: recipe.tags,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (recipeError) {
          console.error('Error saving recipe:', recipeError)
        } else {
          savedRecipeId = recipeData.id

          // Insert ingredients
          const ingredientsToInsert = recipe.ingredients.map(ing => ({
            recipe_id: savedRecipeId,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            notes: ing.notes
          }))

          const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsToInsert)

          if (ingredientsError) {
            console.error('Error saving ingredients:', ingredientsError)
          }
        }

        // Record the recognition event
        await supabase
          .from('recipe_imports')
          .insert({
            recipe_id: savedRecipeId,
            import_type: 'ethos_food_recognition',
            source_data: JSON.stringify({
              imageUrl,
              analysis: result.analysis,
              userPreferences
            }),
            confidence_score: result.analysis.confidence,
            created_at: new Date().toISOString()
          })

      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue without saving if database fails
      }
    }

    return NextResponse.json({
      success: true,
      recipe: {
        ...recipe,
        id: savedRecipeId
      },
      analysis: result.analysis,
      savedToDatabase: !!savedRecipeId
    })

  } catch (error) {
    console.error('Ethos food recognition error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('imageUrl')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL parameter is required' },
        { status: 400 }
      )
    }

    // Initialize Ethos AI service
    const ethosService = new EthosFoodRecognitionService()

    // Validate if image contains food
    const validationResult = await ethosService['validateFoodImage'](imageUrl)

    return NextResponse.json({
      isFood: validationResult.isFood,
      foodItems: validationResult.foodItems || [],
      confidence: validationResult.confidence || 0
    })

  } catch (error) {
    console.error('Food validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { recipeParser, ParsedRecipe } from '@/lib/recipeParser'

export async function POST(request: NextRequest) {
  try {
    const { 
      import_type, 
      source_data, 
      user_id,
      auto_translate = false,
      target_language = 'en'
    } = await request.json()

    if (!import_type || !source_data || !user_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Validate import type
    if (!['webpage', 'image', 'text'].includes(import_type)) {
      return NextResponse.json(
        { error: 'Invalid import type' },
        { status: 400 }
      )
    }

    // Parse recipe based on import type
    let parsedRecipe: ParsedRecipe | null = null

    try {
      switch (import_type) {
        case 'webpage':
          // Ensure import sources are loaded before parsing
          try { await recipeParser.loadImportSources() } catch (e) {
            console.warn('Failed to load import sources:', e)
          }
          parsedRecipe = await recipeParser.parseFromWebpage(source_data)
          break
        case 'image':
          parsedRecipe = await recipeParser.parseFromImage(source_data)
          break
        case 'text':
          // Accept either raw text or a JSON-encoded ParsedRecipe from the editor
          try {
            const maybeParsed = JSON.parse(source_data)
            if (maybeParsed && typeof maybeParsed === 'object' && Array.isArray(maybeParsed.ingredients) && Array.isArray(maybeParsed.instructions)) {
              parsedRecipe = {
                title: maybeParsed.title || 'Untitled Recipe',
                description: maybeParsed.description || '',
                ingredients: maybeParsed.ingredients,
                instructions: maybeParsed.instructions,
                prep_time_minutes: maybeParsed.prep_time_minutes || 0,
                cook_time_minutes: maybeParsed.cook_time_minutes || 0,
                servings: maybeParsed.servings || 4,
                difficulty: maybeParsed.difficulty || 'medium',
                image_url: maybeParsed.image_url,
                source_url: maybeParsed.source_url,
                confidence_score: maybeParsed.confidence_score ?? 0.9,
              }
            } else {
              parsedRecipe = await recipeParser.parseFromText(source_data)
            }
          } catch (parseError) {
            console.log('Not JSON, parsing as raw text')
            parsedRecipe = await recipeParser.parseFromText(source_data)
          }
          break
        default:
          return NextResponse.json(
            { error: 'Unsupported import type' },
            { status: 400 }
          )
      }
    } catch (parseError) {
      console.error('Recipe parsing error:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse recipe content' },
        { status: 422 }
      )
    }

    if (!parsedRecipe) {
      return NextResponse.json(
        { error: 'Failed to parse recipe' },
        { status: 422 }
      )
    }

    // Create recipe in database
    const recipeData = {
      title: parsedRecipe.title,
      description: parsedRecipe.description || '',
      author_id: user_id,
      difficulty: parsedRecipe.difficulty || 'medium',
      prep_time_minutes: parsedRecipe.prep_time_minutes || 0,
      cook_time_minutes: parsedRecipe.cook_time_minutes || 0,
      servings: parsedRecipe.servings || 4,
      instructions: parsedRecipe.instructions,
      tips: null,
      image_url: parsedRecipe.image_url,
      status: 'draft',
      rating: 0,
      rating_count: 0,
      view_count: 0,
      version_number: 1,
      parent_recipe_id: null,
      is_original: true,
      branch_name: null
    }

    // Insert recipe
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

    // Insert ingredients
    if (parsedRecipe.ingredients.length > 0) {
      const ingredientsData = parsedRecipe.ingredients.map((ingredient, index) => ({
        recipe_id: recipe.id,
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
        // Don't fail the whole import for ingredient errors
      }
    }

    // Create import record
    const importData = {
      recipe_id: recipe.id,
      user_id: user_id,
      source_url: parsedRecipe.source_url,
      source_domain: parsedRecipe.source_url ? extractDomain(parsedRecipe.source_url) : null,
      import_method: import_type,
      original_content: source_data,
      import_metadata: {
        confidence_score: parsedRecipe.confidence_score,
        cuisine_type: parsedRecipe.cuisine_type,
        meal_type: parsedRecipe.meal_type,
        tags: parsedRecipe.tags
      },
      import_status: 'completed',
      confidence_score: parsedRecipe.confidence_score,
      field_mapping: {
        title: parsedRecipe.title,
        ingredients_count: parsedRecipe.ingredients.length,
        instructions_count: parsedRecipe.instructions.length
      }
    }

    const { error: importError } = await supabase
      .from('recipe_imports')
      .insert([importData])

    if (importError) {
      console.error('Error creating import record:', importError)
      // Don't fail the whole import for record errors
    }

    // Queue translation if requested
    if (auto_translate && target_language !== 'en') {
      try {
        await queueTranslation(recipe.id, target_language, 'normal')
      } catch (error) {
        console.error('Error queuing translation:', error)
        // Don't fail the import for translation errors
      }
    }

    // Update import source analytics
    if (parsedRecipe.source_url) {
      await updateImportAnalytics(extractDomain(parsedRecipe.source_url), import_type, true)
    }

    return NextResponse.json({
      success: true,
      recipe: {
        ...recipe,
        ingredients: parsedRecipe.ingredients,
        import_info: {
          method: import_type,
          confidence: parsedRecipe.confidence_score,
          source_url: parsedRecipe.source_url
        }
      }
    })

  } catch (error) {
    console.error('Recipe import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return ''
  }
}

// Helper function to queue translation
async function queueTranslation(recipeId: string, targetLanguage: string, priority: 'low' | 'normal' | 'high' | 'urgent') {
  const { data, error } = await supabase
    .from('translation_jobs')
    .insert({
      content_type: 'recipe',
      content_id: recipeId,
      target_language: targetLanguage,
      priority: priority,
      status: 'pending',
      retry_count: 0,
      max_retries: 3
    })
    .select('*')
    .single()

  if (error) throw error

  // Trigger processing in the background
  if (data?.id) {
    try {
      const base = getBaseUrl()
      await fetch(`${base}/api/translate/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: data.id })
      })
    } catch {}
  }
}

// Helper function to update import analytics
async function updateImportAnalytics(domain: string, importMethod: string, success: boolean) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Get existing analytics record
    const { data: existing } = await supabase
      .from('import_analytics')
      .select('*')
      .eq('date', today)
      .eq('import_method', importMethod)
      .eq('source_domain', domain)
      .single()

    if (existing) {
      // Update existing record
      const updates = {
        total_imports: existing.total_imports + 1,
        successful_imports: existing.successful_imports + (success ? 1 : 0),
        failed_imports: existing.failed_imports + (success ? 0 : 1)
      }

      await supabase
        .from('import_analytics')
        .update(updates)
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase
        .from('import_analytics')
        .insert({
          date: today,
          import_method: importMethod,
          source_domain: domain,
          total_imports: 1,
          successful_imports: success ? 1 : 0,
          failed_imports: success ? 0 : 1,
          average_confidence: 0.8
        })
    }
  } catch (error) {
    console.error('Error updating import analytics:', error)
  }
} 

// Build an absolute base URL for server-side fetches
function getBaseUrl() {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const vercel = process.env.VERCEL_URL
  if (site) return site
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}
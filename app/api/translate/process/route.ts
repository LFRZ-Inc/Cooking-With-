import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Build an absolute base URL for server-side fetches
function getBaseUrl() {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const vercel = process.env.VERCEL_URL
  if (site) return site
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Get the translation job
    const { data: job, error: jobError } = await supabase
      .from('translation_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Translation job not found' },
        { status: 404 }
      )
    }

    // Update job status to processing
    await supabase
      .from('translation_jobs')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)

    try {
      // Get the content to translate
      const content = await getContentForTranslation(job.content_type, job.content_id)
      
      if (!content) {
        throw new Error('Content not found')
      }

      // Extract translatable fields
      const translatableFields = extractTranslatableFields(job.content_type, content)
      
      // Translate each field
      const translationResults = await translateFields(
        translatableFields,
        job.target_language,
        'en'
      )

      // Save translations to database
      await saveTranslations(
        job.content_type,
        job.content_id,
        translationResults,
        job.target_language
      )

      // Update job status to completed
      await supabase
        .from('translation_jobs')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      return NextResponse.json({
        success: true,
        message: 'Translation completed successfully',
        translatedFields: translationResults.length
      })

    } catch (error) {
      console.error('Translation processing error:', error)
      
      // Update job status to failed
      await supabase
        .from('translation_jobs')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      return NextResponse.json(
        { error: 'Translation processing failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Translation job processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getContentForTranslation(contentType: string, contentId: string) {
  try {
    let query = supabase.from(contentType === 'recipe' ? 'recipes' : 'newsletters')
    
    if (contentType === 'recipe') {
      const { data: recipe, error } = await query
        .select(`
          *,
          recipe_ingredients (*)
        `)
        .eq('id', contentId)
        .single()

      if (error) throw error
      return recipe
    } else {
      const { data: newsletter, error } = await query
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) throw error
      return newsletter
    }
  } catch (error) {
    console.error('Error fetching content for translation:', error)
    return null
  }
}

function extractTranslatableFields(contentType: string, content: any) {
  const fields: { name: string; text: string }[] = []

  if (contentType === 'recipe') {
    // Recipe translatable fields
    if (content.title) {
      fields.push({ name: 'title', text: content.title })
    }
    if (content.description) {
      fields.push({ name: 'description', text: content.description })
    }
    if (content.tips) {
      fields.push({ name: 'tips', text: content.tips })
    }
    if (content.instructions && Array.isArray(content.instructions)) {
      content.instructions.forEach((instruction: string, index: number) => {
        if (instruction) {
          fields.push({ name: `instructions_${index}`, text: instruction })
        }
      })
    }
    if (content.recipe_ingredients && Array.isArray(content.recipe_ingredients)) {
      content.recipe_ingredients.forEach((ingredient: any, index: number) => {
        if (ingredient.name) {
          fields.push({ name: `ingredients_${index}`, text: ingredient.name })
        }
        if (ingredient.notes) {
          fields.push({ name: `ingredient_notes_${index}`, text: ingredient.notes })
        }
      })
    }
  } else if (contentType === 'newsletter') {
    // Newsletter translatable fields
    if (content.title) {
      fields.push({ name: 'title', text: content.title })
    }
    if (content.excerpt) {
      fields.push({ name: 'excerpt', text: content.excerpt })
    }
    if (content.content) {
      fields.push({ name: 'content', text: content.content })
    }
  }

  return fields
}

async function translateFields(fields: { name: string; text: string }[], targetLanguage: string, sourceLanguage: string) {
  const results: { name: string; originalText: string; translatedText: string }[] = []

  // Batch translate all texts
  const texts = fields.map(field => field.text)
  
  try {
    const response = await fetch(`${getBaseUrl()}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        batch: true,
        texts,
        targetLanguage,
        sourceLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error('Translation API failed')
    }

    const data = await response.json()
    
    // Map results back to field names
    fields.forEach((field, index) => {
      if (data.translations && data.translations[index]) {
        results.push({
          name: field.name,
          originalText: field.text,
          translatedText: data.translations[index].translatedText
        })
      }
    })

  } catch (error) {
    console.error('Batch translation error:', error)
    
    // Fallback to individual translations
    for (const field of fields) {
      try {
        const response = await fetch(`${getBaseUrl()}/api/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: field.text,
            targetLanguage,
            sourceLanguage,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          results.push({
            name: field.name,
            originalText: field.text,
            translatedText: data.translatedText
          })
        }
      } catch (individualError) {
        console.error(`Error translating field ${field.name}:`, individualError)
      }
    }
  }

  return results
}

async function saveTranslations(contentType: string, contentId: string, translations: any[], targetLanguage: string) {
  try {
    const translationRecords = translations.map(translation => ({
      content_type: contentType as 'recipe' | 'newsletter',
      content_id: contentId,
      field_name: translation.name,
      original_text: translation.originalText,
      translated_text: translation.translatedText,
      source_language: 'en',
      target_language: targetLanguage,
      translation_status: 'completed',
      translation_provider: 'google_translate',
      confidence_score: 0.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('translations')
      .upsert(translationRecords)

    if (error) throw error

  } catch (error) {
    console.error('Error saving translations:', error)
    throw error
  }
} 
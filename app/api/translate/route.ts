import { NextRequest, NextResponse } from 'next/server'

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en', batch = false, texts = [] } = await request.json()

    // Handle batch translation
    if (batch && Array.isArray(texts) && texts.length > 0) {
      return await handleBatchTranslation(texts, targetLanguage, sourceLanguage)
    }

    // Handle single translation
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    return await handleSingleTranslation(text, targetLanguage, sourceLanguage)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}

async function handleSingleTranslation(text: string, targetLanguage: string, sourceLanguage: string) {
  // If no API key, return a mock translation for development
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not found. Using mock translation.')
    return NextResponse.json({
      translatedText: `[${targetLanguage.toUpperCase()}] ${text}`,
      sourceLanguage,
      targetLanguage,
      confidence: 0.8
    })
  }

  try {
    // Call Google Translate API
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      }),
    })

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.9
    })
  } catch (error) {
    console.error('Google Translate API error:', error)
    return NextResponse.json(
      { error: 'Translation service unavailable' },
      { status: 503 }
    )
  }
}

async function handleBatchTranslation(texts: string[], targetLanguage: string, sourceLanguage: string) {
  // If no API key, return mock translations for development
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not found. Using mock batch translation.')
    const mockTranslations = texts.map(text => ({
      originalText: text,
      translatedText: `[${targetLanguage.toUpperCase()}] ${text}`,
      confidence: 0.8
    }))
    
    return NextResponse.json({
      translations: mockTranslations,
      sourceLanguage,
      targetLanguage
    })
  }

  try {
    // Call Google Translate API for batch translation
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      }),
    })

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()
    const translations = data.data.translations.map((translation: any, index: number) => ({
      originalText: texts[index],
      translatedText: translation.translatedText,
      confidence: 0.9
    }))

    return NextResponse.json({
      translations,
      sourceLanguage,
      targetLanguage
    })
  } catch (error) {
    console.error('Google Translate API batch error:', error)
    return NextResponse.json(
      { error: 'Batch translation service unavailable' },
      { status: 503 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'

// LibreTranslate configuration (self-host or public instance)
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com'
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY

// Fallback translation service (MyMemory API - no key required)
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en', batch = false, texts = [] } = await request.json()

    if (!targetLanguage) {
      return NextResponse.json({ error: 'Missing targetLanguage' }, { status: 400 })
    }

    if (batch) {
      if (!Array.isArray(texts) || texts.length === 0) {
        return NextResponse.json({ error: 'texts must be a non-empty array for batch translation' }, { status: 400 })
      }
      return await handleBatchTranslation(texts, targetLanguage, sourceLanguage)
    }

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    return await handleSingleTranslation(text, targetLanguage, sourceLanguage)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}

async function handleSingleTranslation(text: string, targetLanguage: string, sourceLanguage: string) {
  // Try LibreTranslate first
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
        api_key: LIBRETRANSLATE_API_KEY,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const translatedText = data.translatedText || data.translation || data?.[0]?.translatedText

      if (translatedText) {
        return NextResponse.json({
          translatedText,
          sourceLanguage,
          targetLanguage,
          confidence: 0.8,
        })
      }
    }
  } catch (error) {
    console.error('LibreTranslate error:', error)
  }

  // Fallback to MyMemory API
  try {
    const response = await fetch(`${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`)
    
    if (response.ok) {
      const data = await response.json()
      const translatedText = data.responseData?.translatedText

      if (translatedText) {
        return NextResponse.json({
          translatedText,
          sourceLanguage,
          targetLanguage,
          confidence: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('MyMemory API error:', error)
  }

  // Final fallback - return original text with warning
  console.warn('All translation services failed, returning original text')
  return NextResponse.json({
    translatedText: text,
    sourceLanguage,
    targetLanguage,
    confidence: 0.0,
    warning: 'Translation service unavailable, showing original text'
  })
}

async function handleBatchTranslation(texts: string[], targetLanguage: string, sourceLanguage: string) {
  // Try LibreTranslate first
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
        api_key: LIBRETRANSLATE_API_KEY,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const normalized = Array.isArray(data)
        ? data.map((t: any, i: number) => ({ originalText: texts[i], translatedText: t.translatedText || t.translation, confidence: 0.8 }))
        : (data.translations || []).map((t: any, i: number) => ({ originalText: texts[i], translatedText: t.translatedText || t.translation, confidence: 0.8 }))

      if (normalized.length > 0) {
        return NextResponse.json({ translations: normalized, sourceLanguage, targetLanguage })
      }
    }
  } catch (error) {
    console.error('LibreTranslate batch error:', error)
  }

  // Fallback to MyMemory API (translate one by one)
  try {
    const translations = []
    for (const text of texts) {
      const response = await fetch(`${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`)
      
      if (response.ok) {
        const data = await response.json()
        const translatedText = data.responseData?.translatedText || text
        translations.push({ originalText: text, translatedText, confidence: 0.6 })
      } else {
        translations.push({ originalText: text, translatedText: text, confidence: 0.0 })
      }
    }

    if (translations.length > 0) {
      return NextResponse.json({ 
        translations, 
        sourceLanguage, 
        targetLanguage,
        warning: 'Using fallback translation service'
      })
    }
  } catch (error) {
    console.error('MyMemory batch API error:', error)
  }

  // Final fallback - return original texts
  const fallbackTranslations = texts.map(text => ({ 
    originalText: text, 
    translatedText: text, 
    confidence: 0.0 
  }))

  return NextResponse.json({ 
    translations: fallbackTranslations, 
    sourceLanguage, 
    targetLanguage,
    warning: 'Translation service unavailable, showing original text'
  })
}
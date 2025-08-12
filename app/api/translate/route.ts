import { NextRequest, NextResponse } from 'next/server'

// LibreTranslate configuration (self-host or public instance)
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com'
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY

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

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`LibreTranslate error: ${response.status} ${body}`)
    }

    const data = await response.json()
    const translatedText = data.translatedText || data.translation || data?.[0]?.translatedText

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.8,
    })
  } catch (error) {
    console.error('LibreTranslate single error:', error)
    return NextResponse.json({ error: 'Translation service unavailable' }, { status: 503 })
  }
}

async function handleBatchTranslation(texts: string[], targetLanguage: string, sourceLanguage: string) {
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

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`LibreTranslate batch error: ${response.status} ${body}`)
    }

    const data = await response.json()
    const normalized = Array.isArray(data)
      ? data.map((t: any, i: number) => ({ originalText: texts[i], translatedText: t.translatedText || t.translation, confidence: 0.8 }))
      : (data.translations || []).map((t: any, i: number) => ({ originalText: texts[i], translatedText: t.translatedText || t.translation, confidence: 0.8 }))

    return NextResponse.json({ translations: normalized, sourceLanguage, targetLanguage })
  } catch (error) {
    console.error('LibreTranslate batch error:', error)
    return NextResponse.json({ error: 'Batch translation service unavailable' }, { status: 503 })
  }
}
'use client'

import { useTranslation } from './useTranslation'
import { supabase } from './supabase'

// Build an absolute base URL for server-side fetches (used by API calls invoked from client as well)
function getBaseUrl() {
  const site = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000') : ''
  return site
}

// Translation service for database content
export class TranslationService {
  private static instance: TranslationService
  private cache: Map<string, string> = new Map()
  private supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar']

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService()
    }
    return TranslationService.instance
  }

  // Get user language preferences
  async getUserLanguagePreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data || {
        preferred_language: 'en',
        fallback_language: 'en',
        auto_translate: true,
        translation_quality: 'balanced'
      }
    } catch (error) {
      console.error('Error fetching user language preferences:', error)
      return {
        preferred_language: 'en',
        fallback_language: 'en',
        auto_translate: true,
        translation_quality: 'balanced'
      }
    }
  }

  // Save user language preferences
  async saveUserLanguagePreferences(userId: string, preferences: {
    preferred_language: string
    fallback_language?: string
    auto_translate?: boolean
    translation_quality?: 'fast' | 'balanced' | 'high'
  }) {
    try {
      const { data, error } = await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving user language preferences:', error)
      throw error
    }
  }

  // Get existing translation from database
  async getTranslation(contentType: string, contentId: string, fieldName: string, targetLanguage: string) {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('field_name', fieldName)
        .eq('target_language', targetLanguage)
        .eq('translation_status', 'completed')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching translation:', error)
      return null
    }
  }

  // Save translation to database
  async saveTranslation(translation: {
    content_type: 'recipe' | 'newsletter' | 'category' | 'tag'
    content_id: string
    field_name: string
    original_text: string
    translated_text: string
    source_language: string
    target_language: string
    translation_provider?: string
    confidence_score?: number
  }) {
    try {
      const { data, error } = await supabase
        .from('translations')
        .upsert({
          ...translation,
          translation_status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving translation:', error)
      throw error
    }
  }

  // Create translation job
  async createTranslationJob(contentType: string, contentId: string, targetLanguage: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
    try {
      const { data, error } = await supabase
        .from('translation_jobs')
        .insert({
          content_type: contentType as 'recipe' | 'newsletter' | 'category' | 'tag',
          content_id: contentId,
          target_language: targetLanguage,
          priority,
          status: 'pending',
          retry_count: 0,
          max_retries: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating translation job:', error)
      throw error
    }
  }

  // Translate text content with database caching
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'en', contentType?: string, contentId?: string, fieldName?: string): Promise<string> {
    if (targetLanguage === sourceLanguage) {
      return text
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Check database for existing translation
    if (contentType && contentId && fieldName) {
      const existingTranslation = await this.getTranslation(contentType, contentId, fieldName, targetLanguage)
      if (existingTranslation && existingTranslation.original_text === text) {
        this.cache.set(cacheKey, existingTranslation.translated_text)
        return existingTranslation.translated_text
      }
    }

    try {
      // Use translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()
      const translatedText = result.translatedText

      // Cache the result
      this.cache.set(cacheKey, translatedText)

      // Save to database if we have content info
      if (contentType && contentId && fieldName) {
        try {
          await this.saveTranslation({
            content_type: contentType as 'recipe' | 'newsletter' | 'category' | 'tag',
            content_id: contentId,
            field_name: fieldName,
            original_text: text,
            translated_text: translatedText,
            source_language: sourceLanguage,
            target_language: targetLanguage,
            translation_provider: 'google_translate',
            confidence_score: 0.9
          })
        } catch (error) {
          console.error('Error saving translation to database:', error)
        }
      }

      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text // Fallback to original text
    }
  }

  // Translate recipe content with database integration
  async translateRecipe(recipe: any, targetLanguage: string): Promise<any> {
    const translatedRecipe = { ...recipe }

    // Translate title
    if (recipe.title) {
      translatedRecipe.title = await this.translateText(
        recipe.title, 
        targetLanguage, 
        'en', 
        'recipe', 
        recipe.id, 
        'title'
      )
    }

    // Translate description
    if (recipe.description) {
      translatedRecipe.description = await this.translateText(
        recipe.description, 
        targetLanguage, 
        'en', 
        'recipe', 
        recipe.id, 
        'description'
      )
    }

    // Translate instructions
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
      translatedRecipe.instructions = await Promise.all(
        recipe.instructions.map(async (instruction: string, index: number) => 
          this.translateText(
            instruction, 
            targetLanguage, 
            'en', 
            'recipe', 
            recipe.id, 
            `instructions_${index}`
          )
        )
      )
    }

    // Translate ingredients
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      translatedRecipe.ingredients = await Promise.all(
        recipe.ingredients.map(async (ingredient: string, index: number) => 
          this.translateText(
            ingredient, 
            targetLanguage, 
            'en', 
            'recipe', 
            recipe.id, 
            `ingredients_${index}`
          )
        )
      )
    }

    // Translate tips
    if (recipe.tips) {
      translatedRecipe.tips = await this.translateText(
        recipe.tips, 
        targetLanguage, 
        'en', 
        'recipe', 
        recipe.id, 
        'tips'
      )
    }

    return translatedRecipe
  }

  // Translate newsletter content with database integration
  async translateNewsletter(newsletter: any, targetLanguage: string): Promise<any> {
    const translatedNewsletter = { ...newsletter }

    // Translate title
    if (newsletter.title) {
      translatedNewsletter.title = await this.translateText(
        newsletter.title, 
        targetLanguage, 
        'en', 
        'newsletter', 
        newsletter.id, 
        'title'
      )
    }

    // Translate excerpt
    if (newsletter.excerpt) {
      translatedNewsletter.excerpt = await this.translateText(
        newsletter.excerpt, 
        targetLanguage, 
        'en', 
        'newsletter', 
        newsletter.id, 
        'excerpt'
      )
    }

    // Translate content
    if (newsletter.content) {
      translatedNewsletter.content = await this.translateText(
        newsletter.content, 
        targetLanguage, 
        'en', 
        'newsletter', 
        newsletter.id, 
        'content'
      )
    }

    return translatedNewsletter
  }

  // Get translation status for content
  async getTranslationStatus(contentType: string, contentId: string, targetLanguage: string) {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('target_language', targetLanguage)

      if (error) throw error

      const completedTranslations = data?.filter(t => t.translation_status === 'completed') || []
      const pendingTranslations = data?.filter(t => t.translation_status === 'pending') || []
      const failedTranslations = data?.filter(t => t.translation_status === 'failed') || []

      return {
        completed: completedTranslations.length,
        pending: pendingTranslations.length,
        failed: failedTranslations.length,
        total: data?.length || 0,
        isComplete: completedTranslations.length > 0 && pendingTranslations.length === 0,
        hasErrors: failedTranslations.length > 0
      }
    } catch (error) {
      console.error('Error getting translation status:', error)
      return {
        completed: 0,
        pending: 0,
        failed: 0,
        total: 0,
        isComplete: false,
        hasErrors: false
      }
    }
  }

  // Queue content for translation
  async queueContentForTranslation(contentType: string, contentId: string, targetLanguage: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
    try {
      // Check if job already exists
      const { data: existingJob } = await supabase
        .from('translation_jobs')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('target_language', targetLanguage)
        .eq('status', 'pending')
        .single()

      if (existingJob) {
        return existingJob
      }

      // Create new job and immediately trigger processing
      const job = await this.createTranslationJob(contentType, contentId, targetLanguage, priority)

      // Fire-and-forget processing call
      if (job && job.id) {
        fetch('/api/translate/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job.id })
        }).catch(() => {})
      }

      return job
    } catch (error) {
      console.error('Error queuing content for translation:', error)
      throw error
    }
  }

  // Get pending translation jobs
  async getPendingTranslationJobs(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('translation_jobs')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pending translation jobs:', error)
      return []
    }
  }

  // Update translation job status
  async updateTranslationJobStatus(jobId: string, status: 'processing' | 'completed' | 'failed' | 'cancelled', errorMessage?: string) {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed' || status === 'failed') {
        updateData.processed_at = new Date().toISOString()
      }

      if (errorMessage) {
        updateData.error_message = errorMessage
      }

      const { data, error } = await supabase
        .from('translation_jobs')
        .update(updateData)
        .eq('id', jobId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating translation job status:', error)
      throw error
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return this.supportedLanguages
  }

  // Get language name from code
  getLanguageName(code: string): string {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ja': '日本語',
      'ko': '한국어',
      'zh': '中文',
      'ar': 'العربية'
    }
    return languageNames[code] || code.toUpperCase()
  }
}

// React hook for using translation service
export function useTranslationService() {
  const { language } = useTranslation()
  const translationService = TranslationService.getInstance()

  const translateContent = async (content: any, contentType: 'recipe' | 'newsletter'): Promise<any> => {
    if (language === 'en') {
      return content // No translation needed for English
    }

    try {
      if (contentType === 'recipe') {
        return await translationService.translateRecipe(content, language)
      } else if (contentType === 'newsletter') {
        return await translationService.translateNewsletter(content, language)
      }
    } catch (error) {
      console.error('Translation error:', error)
      return content // Fallback to original content
    }

    return content
  }

  const queueTranslation = async (contentType: string, contentId: string, targetLanguage: string, priority?: 'low' | 'normal' | 'high' | 'urgent') => {
    return await translationService.queueContentForTranslation(contentType, contentId, targetLanguage, priority)
  }

  const getTranslationStatus = async (contentType: string, contentId: string, targetLanguage: string) => {
    return await translationService.getTranslationStatus(contentType, contentId, targetLanguage)
  }

  const getUserLanguagePreferences = async (userId: string) => {
    return await translationService.getUserLanguagePreferences(userId)
  }

  const saveUserLanguagePreferences = async (userId: string, preferences: any) => {
    return await translationService.saveUserLanguagePreferences(userId, preferences)
  }

  return {
    translateContent,
    queueTranslation,
    getTranslationStatus,
    getUserLanguagePreferences,
    saveUserLanguagePreferences,
    currentLanguage: language,
    supportedLanguages: translationService.getSupportedLanguages(),
    getLanguageName: translationService.getLanguageName.bind(translationService),
  }
} 
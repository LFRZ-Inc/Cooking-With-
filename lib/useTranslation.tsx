'use client'
import { useState, useEffect } from 'react'

type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh' | 'ar'

interface Translations {
  [key: string]: any
}

let translationsCache: { [key in Language]?: Translations } = {}
let currentLanguage: Language = 'en'

// Safe translation hook that prevents hydration errors
export function useTranslation() {
  const [translations, setTranslations] = useState<Translations>({})
  const [language, setLanguageState] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load saved language preference
    try {
      const savedLanguage = localStorage.getItem('language') as Language
      const browserLanguage = navigator.language.split('-')[0] as Language
      const initialLanguage = savedLanguage || (browserLanguage === 'es' ? 'es' : 'en')
      
      currentLanguage = initialLanguage
      setLanguageState(initialLanguage)
      loadTranslations(initialLanguage)
    } catch (error) {
      console.error('Error initializing language:', error)
      loadTranslations('en')
    }
  }, [])

  const loadTranslations = async (lang: Language) => {
    // Check cache first
    if (translationsCache[lang]) {
      setTranslations(translationsCache[lang]!)
      return
    }

    try {
      const response = await fetch(`/locales/${lang}/common.json`)
      const data = await response.json()
      translationsCache[lang] = data
      setTranslations(data)
    } catch (error) {
      console.error('Error loading translations:', error)
      // Fallback to English
      if (lang !== 'en') {
        try {
          const response = await fetch('/locales/en/common.json')
          const data = await response.json()
          translationsCache['en'] = data
          setTranslations(data)
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError)
        }
      }
    }
  }

  const setLanguage = (lang: Language) => {
    if (!isClient) return
    
    try {
      currentLanguage = lang
      setLanguageState(lang)
      localStorage.setItem('language', lang)
      loadTranslations(lang)
    } catch (error) {
      console.error('Error setting language:', error)
      setLanguageState(lang)
      loadTranslations(lang)
    }
  }

  const t = (key: string, fallback?: string): string => {
    if (!isClient) {
      // Return English fallback for SSR
      return fallback || key
    }

    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key)
  }

  return {
    language,
    setLanguage,
    t,
    isClient
  }
}

// Export a function to get current language for components that need it
export function getCurrentLanguage(): Language {
  return currentLanguage
}

// Export a function to check if translations are loaded
export function areTranslationsLoaded(): boolean {
  return Object.keys(translationsCache).length > 0
}
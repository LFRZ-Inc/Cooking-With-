'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'es'

interface Translations {
  [key: string]: any
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  loading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [translations, setTranslations] = useState<Translations>({})
  const [loading, setLoading] = useState(true)

  // Load translations for the current language
  const loadTranslations = async (lang: Language) => {
    try {
      setLoading(true)
      const response = await fetch(`/locales/${lang}/common.json`)
      const data = await response.json()
      setTranslations(data)
    } catch (error) {
      console.error('Error loading translations:', error)
      // Fallback to English if loading fails
      if (lang !== 'en') {
        try {
          const response = await fetch('/locales/en/common.json')
          const data = await response.json()
          setTranslations(data)
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Set language and persist to localStorage
  const setLanguage = (lang: Language) => {
    try {
      setLanguageState(lang)
      localStorage.setItem('language', lang)
      loadTranslations(lang)
    } catch (error) {
      console.error('Error setting language:', error)
      // Still set the language state even if localStorage fails
      setLanguageState(lang)
      loadTranslations(lang)
    }
  }

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language
      const browserLanguage = navigator.language.split('-')[0] as Language
      
      const initialLanguage = savedLanguage || (browserLanguage === 'es' ? 'es' : 'en')
      setLanguageState(initialLanguage)
      loadTranslations(initialLanguage)
    } catch (error) {
      console.error('Error initializing language:', error)
      // Fallback to English if there's an error
      setLanguageState('en')
      loadTranslations('en')
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
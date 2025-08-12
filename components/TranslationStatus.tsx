'use client'
import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Languages, 
  Settings, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  XCircle,
  Download,
  Upload,
  Eye,
  EyeOff,
  Zap,
  BarChart3,
  Info
} from 'lucide-react'
import { useTranslationService } from '@/lib/translationService'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

interface TranslationStatusProps {
  contentType: 'recipe' | 'newsletter'
  contentId: string
  originalLanguage?: string
  translatedLanguage?: string
  showAdvanced?: boolean
}

interface TranslationStats {
  completed: number
  pending: number
  failed: number
  total: number
  isComplete: boolean
  hasErrors: boolean
}

export default function TranslationStatus({ 
  contentType, 
  contentId, 
  originalLanguage = 'en',
  translatedLanguage,
  showAdvanced = false
}: TranslationStatusProps) {
  const { currentLanguage, supportedLanguages, getTranslationStatus, queueTranslation, getLanguageName } = useTranslationService()
  const { user } = useAuth()
  const [showSettings, setShowSettings] = useState(showAdvanced)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStats, setTranslationStats] = useState<TranslationStats | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [translationQuality, setTranslationQuality] = useState<'fast' | 'balanced' | 'high'>('balanced')

  const isTranslated = translatedLanguage && translatedLanguage !== originalLanguage
  const needsTranslation = currentLanguage !== originalLanguage && !isTranslated

  // Fetch translation status
  useEffect(() => {
    const fetchTranslationStatus = async () => {
      if (currentLanguage !== originalLanguage) {
        try {
          const stats = await getTranslationStatus(contentType, contentId, currentLanguage)
          setTranslationStats(stats)
        } catch (error) {
          console.error('Error fetching translation status:', error)
        }
      }
    }

    fetchTranslationStatus()
  }, [contentType, contentId, currentLanguage, originalLanguage, getTranslationStatus])

  const handleRetranslate = async () => {
    if (!user) {
      toast.error('Please log in to manage translations')
      return
    }

    setIsTranslating(true)
    try {
      // Queue content for translation
      await queueTranslation(contentType, contentId, currentLanguage, 'high')
      
      // Refresh translation status
      const stats = await getTranslationStatus(contentType, contentId, currentLanguage)
      setTranslationStats(stats)
      
      toast.success('Translation queued successfully!')
    } catch (error) {
      console.error('Translation error:', error)
      toast.error('Failed to queue translation')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleAutoTranslate = async () => {
    if (!user) {
      toast.error('Please log in to manage translations')
      return
    }

    setIsTranslating(true)
    try {
      // Queue translation for all supported languages
      const languagesToTranslate = supportedLanguages.filter(lang => lang !== originalLanguage)
      
      await Promise.all(
        languagesToTranslate.map(lang => 
          queueTranslation(contentType, contentId, lang, 'normal')
        )
      )
      
      toast.success(`Queued translation for ${languagesToTranslate.length} languages`)
    } catch (error) {
      console.error('Auto-translate error:', error)
      toast.error('Failed to queue auto-translation')
    } finally {
      setIsTranslating(false)
    }
  }

  const getStatusIcon = () => {
    if (!translationStats) {
      return needsTranslation ? <AlertCircle className="h-4 w-4 text-yellow-600" /> : <Check className="h-4 w-4 text-green-600" />
    }

    if (translationStats.hasErrors) {
      return <XCircle className="h-4 w-4 text-red-600" />
    }

    if (translationStats.isComplete) {
      return <Check className="h-4 w-4 text-green-600" />
    }

    if (translationStats.pending > 0) {
      return <Clock className="h-4 w-4 text-blue-600" />
    }

    return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }

  const getStatusText = () => {
    if (!translationStats) {
      if (isTranslated) {
        return `Translated from ${originalLanguage.toUpperCase()} to ${translatedLanguage?.toUpperCase()}`
      }
      if (needsTranslation) {
        return `Available in ${originalLanguage.toUpperCase()}, needs translation to ${currentLanguage.toUpperCase()}`
      }
      return `Original content in ${originalLanguage.toUpperCase()}`
    }

    if (translationStats.hasErrors) {
      return `${translationStats.failed} translation(s) failed`
    }

    if (translationStats.isComplete) {
      return `Fully translated to ${getLanguageName(currentLanguage)}`
    }

    if (translationStats.pending > 0) {
      return `${translationStats.pending} translation(s) in progress`
    }

    if (translationStats.completed > 0) {
      return `Partially translated (${translationStats.completed}/${translationStats.total})`
    }

    return 'No translations available'
  }

  const getProgressPercentage = () => {
    if (!translationStats || translationStats.total === 0) return 0
    return Math.round((translationStats.completed / translationStats.total) * 100)
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              Translation Status
            </h3>
            <p className="text-xs text-blue-700 flex items-center space-x-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {needsTranslation && (
            <button
              onClick={handleRetranslate}
              disabled={isTranslating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${isTranslating ? 'animate-spin' : ''}`} />
              <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
            </button>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {translationStats && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-blue-600 mb-1">
            <span>Translation Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-600 mt-1">
            <span>{translationStats.completed} completed</span>
            <span>{translationStats.pending} pending</span>
            {translationStats.failed > 0 && (
              <span className="text-red-600">{translationStats.failed} failed</span>
            )}
          </div>
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Translation Stats */}
            <div className="bg-white rounded-lg p-3 border">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                Translation Statistics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Content Type:</span>
                  <span className="font-medium capitalize">{contentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Language:</span>
                  <span className="font-medium">{getLanguageName(originalLanguage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Language:</span>
                  <span className="font-medium">{getLanguageName(currentLanguage)}</span>
                </div>
                {translationStats && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fields:</span>
                      <span className="font-medium">{translationStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium">
                        {translationStats.total > 0 
                          ? Math.round((translationStats.completed / translationStats.total) * 100)
                          : 0}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-3 border">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={handleRetranslate}
                  disabled={isTranslating}
                  className="w-full flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>Retranslate</span>
                </button>
                <button
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="w-full flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>Auto-Translate All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-3">
            Translation Settings
          </h4>
          
          <div className="space-y-4">
            {/* Auto-Translate Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Auto-Translate</label>
                <p className="text-xs text-gray-500">Automatically translate new content</p>
              </div>
              <button
                onClick={() => setAutoTranslate(!autoTranslate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoTranslate ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoTranslate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Translation Quality */}
            <div>
              <label className="text-sm font-medium text-gray-700">Translation Quality</label>
              <select
                value={translationQuality}
                onChange={(e) => setTranslationQuality(e.target.value as 'fast' | 'balanced' | 'high')}
                className="mt-1 block w-full text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fast">Fast (Basic)</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="high">High Quality (Slower)</option>
              </select>
            </div>

            {/* Language Information */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">💡 Translation Tips</p>
                  <ul className="space-y-1">
                    <li>• Content is automatically translated based on your language preference</li>
                    <li>• Higher quality settings may take longer but provide better results</li>
                    <li>• You can manually retranslate content if needed</li>
                    <li>• Translation progress is saved and cached for faster loading</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
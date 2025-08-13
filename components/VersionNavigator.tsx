'use client'
import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, UserIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language'

interface RecipeVersion {
  id: string
  recipe_id: string
  version_number: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  instructions: any[]
  tips: string | null
  image_url: string | null
  ingredients: any[]
  change_summary: string | null
  created_at: string
}

interface Recipe {
  id: string | number
  title: string
  version_number?: number
  author_id?: string | null
  created_at: string
}

interface VersionNavigatorProps {
  recipe: Recipe
  currentVersion: number
  onVersionChange: (version: RecipeVersion | null) => void
}

export default function VersionNavigator({ 
  recipe, 
  currentVersion, 
  onVersionChange 
}: VersionNavigatorProps) {
  const { t } = useLanguage()
  const [versions, setVersions] = useState<RecipeVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState(currentVersion)

  // Fetch all versions for this recipe
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('recipe_versions')
          .select('*')
          .eq('recipe_id', recipe.id)
          .order('version_number', { ascending: true })

        if (error) {
          console.error('Error fetching versions:', error)
          return
        }

        setVersions(data || [])
      } catch (error) {
        console.error('Error fetching versions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [recipe.id])

  // Handle version selection
  const handleVersionChange = (versionNumber: number) => {
    setSelectedVersion(versionNumber)
    
    if (versionNumber === currentVersion) {
      // Current version - pass null to use main recipe data
      onVersionChange(null)
    } else {
      // Historical version - find and pass the version data
      const version = versions.find(v => v.version_number === versionNumber)
      onVersionChange(version || null)
    }
  }

  // Navigation functions
  const goToPreviousVersion = () => {
    if (selectedVersion > 1) {
      handleVersionChange(selectedVersion - 1)
    }
  }

  const goToNextVersion = () => {
    if (selectedVersion < currentVersion) {
      handleVersionChange(selectedVersion + 1)
    }
  }

  // Don't show navigator if there's only one version
  if (loading || currentVersion <= 1) {
    return null
  }

  const selectedVersionData = selectedVersion === currentVersion 
    ? null 
    : versions.find(v => v.version_number === selectedVersion)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">{t('versionNavigator.recipeVersions')}</h3>
          <span className="text-sm text-blue-700">
            ({currentVersion} {t('versionNavigator.versionsAvailable')})
          </span>
        </div>
        
        {/* Version Counter */}
        <div className="text-sm font-medium text-blue-800">
          {t('versionNavigator.versionOf').replace('{current}', selectedVersion.toString()).replace('{total}', currentVersion.toString())}
        </div>
      </div>

      {/* Version Navigation */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Previous Button */}
        <button
          onClick={goToPreviousVersion}
          disabled={selectedVersion <= 1}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-blue-700" />
        </button>

        {/* Version Slider */}
        <div className="flex-1 px-4">
          <input
            type="range"
            min="1"
            max={currentVersion}
            value={selectedVersion}
            onChange={(e) => handleVersionChange(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((selectedVersion - 1) / (currentVersion - 1)) * 100}%, #cbd5e1 ${((selectedVersion - 1) / (currentVersion - 1)) * 100}%, #cbd5e1 100%)`
            }}
          />
          
          {/* Version Markers */}
          <div className="flex justify-between mt-2 px-1">
            {Array.from({ length: currentVersion }, (_, i) => i + 1).map(version => (
              <button
                key={version}
                onClick={() => handleVersionChange(version)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  version === selectedVersion
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                v{version}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNextVersion}
          disabled={selectedVersion >= currentVersion}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-blue-700" />
        </button>
      </div>

      {/* Version Info */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-blue-700">
            <strong>{t('versionNavigator.viewing')}</strong> {selectedVersion === currentVersion ? t('versionNavigator.currentVersion') : t('versionNavigator.version').replace('{number}', selectedVersion.toString())}
          </p>
          {selectedVersionData?.change_summary && (
            <p className="text-blue-600 mt-1">
              <strong>{t('versionNavigator.changes')}</strong> {selectedVersionData.change_summary}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-blue-700">
            <strong>{t('versionNavigator.created')}</strong> {selectedVersion === currentVersion 
              ? new Date(recipe.created_at).toLocaleDateString()
              : selectedVersionData 
                ? new Date(selectedVersionData.created_at).toLocaleDateString()
                : 'Unknown'
            }
          </p>
          {selectedVersion !== currentVersion && (
            <p className="text-blue-600 mt-1 text-xs">
              {t('versionNavigator.historicalVersion')}
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200">
        <button
          onClick={() => handleVersionChange(1)}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          {t('versionNavigator.goToOriginal')}
        </button>
        
        {selectedVersion !== currentVersion && (
          <button
            onClick={() => handleVersionChange(currentVersion)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            {t('versionNavigator.backToCurrentVersion')}
          </button>
        )}
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
} 
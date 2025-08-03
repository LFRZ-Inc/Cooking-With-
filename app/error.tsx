'use client'
import React from 'react'
import Link from 'next/link'
import { AlertTriangleIcon, HomeIcon, RefreshCwIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useLanguage()
  
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('errors.clientSideError')}
          </h1>
          <p className="text-gray-600">
            {t('errors.loadingError')}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCwIcon className="h-4 w-4" />
            <span>{t('errors.tryAgain')}</span>
          </button>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
            <span>{t('errors.goHome')}</span>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
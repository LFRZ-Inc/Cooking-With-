'use client'
import React from 'react'
import Link from 'next/link'
import { ShieldIcon, FileTextIcon, HeartIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Cooking With</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('footer.communityDescription')}
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <ShieldIcon className="h-4 w-4 text-green-400" />
              <span className="text-green-400">{t('footer.privacyProtectedUploads')}</span>
            </div>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <FileTextIcon className="h-4 w-4" />
                  <span>{t('footer.termsOfService')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <ShieldIcon className="h-4 w-4" />
                  <span>{t('footer.privacyPolicy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.accessibility')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/community-guidelines" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.communityGuidelines')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.connect')}</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://tiktok.com/@earthtoluis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span className="text-lg">📱</span>
                  <span>{t('footer.tiktokHandle')}</span>
                </a>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.aboutCookingWith')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/feedback" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.sendFeedback')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>{t('footer.copyright')}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <HeartIcon className="h-4 w-4 text-red-400" />
                <span>{t('footer.preservingHeritage')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldIcon className="h-4 w-4 text-green-400" />
                <span>{t('footer.privacyFirst')}</span>
              </div>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              🔒 {t('footer.privacyNotice')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 
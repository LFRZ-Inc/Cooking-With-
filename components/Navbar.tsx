'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ChefHatIcon, 
  BookOpenIcon, 
  NewspaperIcon, 
  UserIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  LogOutIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/language'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, loading, isAuthenticated } = useAuth()
  const { t } = useLanguage()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHatIcon className="h-8 w-8 text-primary-500" />
              <span className="font-serif text-2xl font-bold text-gray-900">
                Cooking With!
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/recipes" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>{t('navigation.recipes')}</span>
            </Link>
            <Link 
              href="/newsletters" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <NewspaperIcon className="h-5 w-5" />
              <span>{t('navigation.newsletters')}</span>
            </Link>
            <Link 
              href="/create" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span>{t('navigation.create')}</span>
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span>{t('navigation.admin')}</span>
            </Link>
            
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('navigation.search')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>
                      {user?.user_metadata?.name || user?.email || t('navigation.account')}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    disabled={loading}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors disabled:opacity-50"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-primary"
                  >
                    {t('navigation.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/recipes" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
              >
                <BookOpenIcon className="h-5 w-5" />
                <span>{t('navigation.recipes')}</span>
              </Link>
              <Link 
                href="/newsletters" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
              >
                <NewspaperIcon className="h-5 w-5" />
                <span>{t('navigation.newsletters')}</span>
              </Link>
              <Link 
                href="/create" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span>{t('navigation.create')}</span>
              </Link>
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder={t('navigation.search')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>
                      {user?.user_metadata?.name || user?.email || t('navigation.account')}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 w-full"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block mx-3 my-2 text-center btn-primary"
                  >
                    {t('navigation.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
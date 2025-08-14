'use client'
import React, { useState } from 'react'
import { MessageCircleIcon, XIcon, ChefHatIcon, SparklesIcon } from 'lucide-react'
import CookingChat from './CookingChat'

export default function FloatingCookingChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Open Cooking Assistant"
      >
        <div className="relative">
          <MessageCircleIcon className="h-6 w-6" />
          <SparklesIcon className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Cooking Assistant
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <ChefHatIcon className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold text-lg">Cooking Assistant</h3>
                  <p className="text-sm opacity-90">Your AI cooking companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chat"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <CookingChat />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

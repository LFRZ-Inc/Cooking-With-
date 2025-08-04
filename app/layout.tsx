import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth'
import { LanguageProvider } from '@/lib/language'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cooking With! - Recipe Book & Culinary Newsletter',
  description: 'Discover amazing recipes and culinary newsletters from passionate cooks and chefs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 
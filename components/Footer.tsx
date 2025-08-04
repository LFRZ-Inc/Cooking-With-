import React from 'react'
import Link from 'next/link'
import { ShieldIcon, FileTextIcon, HeartIcon } from 'lucide-react'

export default function Footer() {
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
              A community-driven platform for sharing, discovering, and preserving culinary heritage. 
              Built with privacy first and respect for food traditions worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <ShieldIcon className="h-4 w-4 text-green-400" />
              <span className="text-green-400">Privacy-protected image uploads</span>
            </div>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <FileTextIcon className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <ShieldIcon className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link 
                  href="/community-guidelines" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://tiktok.com/@earthtoluis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span className="text-lg">📱</span>
                  <span>@earthtoluis on TikTok</span>
                </a>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Cooking With
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/feedback" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Cooking With. Built with ❤️ for food lovers worldwide.</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <HeartIcon className="h-4 w-4 text-red-400" />
                <span>Preserving culinary heritage</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldIcon className="h-4 w-4 text-green-400" />
                <span>Privacy-first platform</span>
              </div>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              🔒 All uploaded images are automatically processed to remove location data and metadata to protect your privacy. 
              <Link href="/privacy" className="text-green-400 hover:text-green-300 ml-1">
                Learn more about our privacy protections
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 
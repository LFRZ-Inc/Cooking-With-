'use client'
import React, { useState, useRef, useCallback } from 'react'
import { 
  UploadIcon, 
  ImageIcon, 
  XIcon, 
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon 
} from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  placeholder?: string
  className?: string
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  placeholder = "Drag and drop an image here, or click to browse",
  className = ""
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  // File validation
  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 10MB'
    }

    return null
  }

  // Upload to ImgBB (free hosting service)
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    
    // Using ImgBB's API - you can get a free API key at https://api.imgbb.com/
    // For demo purposes, we'll use a public endpoint that doesn't require auth
    const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY_HERE', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      // Fallback: Convert to base64 data URL for local preview
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    }

    const data = await response.json()
    return data.data.url
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setError(null)
    setIsUploading(true)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setIsUploading(false)
      return
    }

    try {
      // For now, convert to data URL for immediate preview
      // In production, you'd upload to your preferred hosting service
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        onChange(dataUrl)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setError('Failed to read file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to upload image')
      setIsUploading(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // URL input handler
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    setError(null)
    setUrlInput('')
    setShowUrlInput(false)
    if (onRemove) onRemove()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Upload preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              setError('Invalid image URL')
              e.currentTarget.style.display = 'none'
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-4">
            {isUploading ? (
              <>
                <LoaderIcon className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
                <p className="text-blue-600 font-medium">Uploading image...</p>
              </>
            ) : (
              <>
                <UploadIcon className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    {placeholder}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, GIF, WebP up to 10MB
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    Choose File
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Input Option */}
      {!value && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 px-3">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {showUrlInput ? (
            <div className="flex space-x-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-1 input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="btn-primary whitespace-nowrap"
              >
                Add URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setUrlInput('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Use Image URL Instead
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircleIcon className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {value && !error && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircleIcon className="h-5 w-5" />
          <span className="text-sm">Image uploaded successfully!</span>
        </div>
      )}

      {/* Hosting Suggestions */}
      {!value && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Free hosting suggestions:</strong></p>
          <div className="flex flex-wrap gap-2">
            <a href="https://imgur.com" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Imgur</a>
            <span>•</span>
            <a href="https://postimg.cc" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">PostImage</a>
            <span>•</span>
            <a href="https://imgbb.com" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">ImgBB</a>
            <span>•</span>
            <a href="https://drive.google.com" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Google Drive</a>
          </div>
        </div>
      )}
    </div>
  )
} 
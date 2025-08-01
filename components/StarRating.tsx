'use client'
import React, { useState, useEffect } from 'react'
import { StarIcon } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  showValue?: boolean
  label?: string
  disabled?: boolean
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = true,
  label,
  disabled = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [currentRating, setCurrentRating] = useState(rating)

  useEffect(() => {
    setCurrentRating(rating)
  }, [rating])

  const handleMouseEnter = (starIndex: number) => {
    if (interactive && !disabled) {
      setHoverRating(starIndex)
    }
  }

  const handleMouseLeave = () => {
    if (interactive && !disabled) {
      setHoverRating(0)
    }
  }

  const handleClick = (starIndex: number) => {
    if (interactive && !disabled && onRatingChange) {
      const newRating = starIndex === currentRating ? 0 : starIndex
      setCurrentRating(newRating)
      onRatingChange(newRating)
    }
  }

  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4'
      case 'lg': return 'h-6 w-6'
      default: return 'h-5 w-5'
    }
  }

  const getStarColor = (starIndex: number) => {
    const displayRating = hoverRating || currentRating
    
    if (starIndex <= displayRating) {
      if (hoverRating > 0) {
        return 'text-yellow-400 fill-current'
      }
      return 'text-yellow-400 fill-current'
    }
    return 'text-gray-300'
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm'
      case 'lg': return 'text-lg'
      default: return 'text-base'
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {label && (
        <span className={`font-medium text-gray-700 ${getTextSize()}`}>
          {label}:
        </span>
      )}
      
      <div className="flex items-center space-x-1">
        {/* Stars */}
        <div 
          className={`flex space-x-1 ${interactive && !disabled ? 'cursor-pointer' : ''}`}
          onMouseLeave={handleMouseLeave}
        >
          {Array.from({ length: maxRating }, (_, index) => {
            const starIndex = index + 1
            return (
              <button
                key={starIndex}
                type="button"
                className={`transition-all duration-200 ${
                  interactive && !disabled 
                    ? 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded'
                    : 'cursor-default'
                } ${disabled ? 'opacity-50' : ''}`}
                onMouseEnter={() => handleMouseEnter(starIndex)}
                onClick={() => handleClick(starIndex)}
                disabled={!interactive || disabled}
                aria-label={`Rate ${starIndex} out of ${maxRating} stars`}
              >
                <StarIcon 
                  className={`${getStarSize()} ${getStarColor(starIndex)} transition-colors duration-200`}
                />
              </button>
            )
          })}
        </div>

        {/* Rating Value */}
        {showValue && (
          <span className={`text-gray-600 font-medium ${getTextSize()}`}>
            {currentRating > 0 ? currentRating.toFixed(1) : '—'}
          </span>
        )}

        {/* Rating Count (if provided via props) */}
        {showValue && currentRating > 0 && (
          <span className={`text-gray-500 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            / {maxRating}
          </span>
        )}
      </div>

      {/* Interactive Help Text */}
      {interactive && !disabled && (
        <span className="text-xs text-gray-500">
          {hoverRating > 0 ? `Rate ${hoverRating} star${hoverRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </span>
      )}
    </div>
  )
}

// Separate component for displaying dual ratings (self + community)
interface DualRatingDisplayProps {
  selfRating: number
  communityRating: number
  communityCount: number
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

export function DualRatingDisplay({
  selfRating,
  communityRating,
  communityCount,
  size = 'md',
  showLabels = true
}: DualRatingDisplayProps) {
  return (
    <div className="space-y-2">
      {/* Self Rating */}
      {selfRating > 0 && (
        <div className="flex items-center space-x-2">
          {showLabels && (
            <span className={`text-blue-700 font-medium ${
              size === 'sm' ? 'text-sm' : 'text-base'
            }`}>
              Your Rating:
            </span>
          )}
          <StarRating
            rating={selfRating}
            size={size}
            interactive={false}
            showValue={true}
          />
        </div>
      )}

      {/* Community Rating */}
      <div className="flex items-center space-x-2">
        {showLabels && (
          <span className={`text-gray-700 font-medium ${
            size === 'sm' ? 'text-sm' : 'text-base'
          }`}>
            Community:
          </span>
        )}
        <StarRating
          rating={communityRating}
          size={size}
          interactive={false}
          showValue={true}
        />
        {communityCount > 0 && (
          <span className={`text-gray-500 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            ({communityCount} rating{communityCount !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  )
} 
import React from 'react'

interface EcolyLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function EcolyLogo({ size = 'md', className = '' }: EcolyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-green-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={iconSizes[size]}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* E - Forme principale */}
        <path
          d="M25 25 L25 75 L40 75 L40 55 L50 55 L50 40 L40 40 L40 40 L25 40 Z"
          fill="white"
        />

        {/* C - Forme courbe */}
        <path
          d="M75 75 Q55 75 55 55 Q55 35 75 35"
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* L - Petite barre verticale */}
        <rect x="68" y="25" width="6" height="25" fill="white" />

        {/* Point d'accentuation */}
        <circle cx="85" cy="20" r="3" fill="white" opacity="0.8" />

        {/* Livre/Éducation symbol */}
        <rect x="30" y="50" width="25" height="3" fill="white" opacity="0.6" />
        <rect x="30" y="56" width="20" height="3" fill="white" opacity="0.6" />
        <rect x="30" y="62" width="22" height="3" fill="white" opacity="0.6" />
      </svg>
    </div>
  )
}

export default EcolyLogo
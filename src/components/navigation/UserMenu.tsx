'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react'
import { EcolyLogo } from '@/components/ui/ecoly-logo'

interface UserMenuProps {
  onSettingsClick?: () => void
}

export default function UserMenu({ onSettingsClick }: UserMenuProps) {
  const { user, loading, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    logout()
    window.location.href = '/auth/signin'
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Ici vous pouvez implémenter la logique pour basculer le thème
    document.documentElement.classList.toggle('dark')
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button onClick={() => window.location.href = '/auth/signin'}>
          Se connecter
        </Button>
      </div>
    )
  }

  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 p-2 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
          {userInitials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="py-2">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false)
                onSettingsClick?.()
              }}
            >
              <Settings className="h-4 w-4 mr-3" />
              Paramètres
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false)
                // Navigation vers le profil
              }}
            >
              <User className="h-4 w-4 mr-3" />
              Mon profil
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 mr-3" />
              ) : (
                <Moon className="h-4 w-4 mr-3" />
              )}
              {isDarkMode ? 'Mode clair' : 'Mode sombre'}
            </Button>

            <hr className="my-2" />

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false)
                // Navigation vers l'aide
              }}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Aide
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Déconnexion
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
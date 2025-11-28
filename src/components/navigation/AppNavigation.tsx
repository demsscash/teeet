'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/lib/permissions'
import { ConditionalRender } from '@/components/auth/ProtectedRoute'
import { EcolyLogo } from '@/components/ui/ecoly-logo'
import UserMenu from '@/components/navigation/UserMenu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  GraduationCap,
  UserCheck,
  Settings,
  FileText,
  TrendingUp,
  Award,
  Eye,
  MessageSquare,
  Building,
  UserPlus,
  LogOut
} from 'lucide-react'

interface NavigationItem {
  title: string
  href: string
  icon: any
  permission?: string
  module?: string
  badge?: string
  children?: NavigationItem[]
}

export default function AppNavigation({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showSettings, setShowSettings] = useState(false)

  if (!session) {
    return <>{children}</>
  }

  const userRole = session.user.role as any
  const { checkModuleAccess } = usePermissions(userRole)

  // Menu de navigation basé sur les permissions
  const navigationItems: NavigationItem[] = [
    {
      title: 'Accueil',
      href: '/',
      icon: LayoutDashboard,
      permission: 'dashboard.view'
    },
    {
      title: 'Gestion des Classes',
      href: '/classes',
      icon: GraduationCap,
      module: 'classes'
    },
    {
      title: 'Gestion des Étudiants',
      href: '/students',
      icon: Users,
      module: 'students'
    },
    {
      title: 'Gestion des Enseignants',
      href: '/teachers',
      icon: UserCheck,
      module: 'teachers'
    },
    {
      title: 'Gestion de la Présence',
      href: '/attendance',
      icon: Calendar,
      module: 'attendance'
    },
    {
      title: 'Notes et Évaluations',
      href: '/grades',
      icon: Award,
      module: 'grades'
    },
    {
      title: 'Observations',
      href: '/observations',
      icon: MessageSquare,
      module: 'observations'
    },
    {
      title: 'Matières',
      href: '/subjects',
      icon: BookOpen,
      module: 'subjects'
    }
  ]

  // Menu financier (accès restreint)
  const financeItems: NavigationItem[] = [
    {
      title: 'Gestion Financière',
      href: '/finance',
      icon: DollarSign,
      module: 'finance'
    }
  ]

  // Menu rapports
  const reportsItems: NavigationItem[] = [
    {
      title: 'Rapports',
      href: '/reports',
      icon: FileText,
      module: 'reports'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const renderMenuItem = (item: NavigationItem) => (
    <ConditionalRender
      key={item.href}
      permission={item.permission}
      module={item.module}
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive(item.href)}
          tooltip={item.title}
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.badge && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </ConditionalRender>
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center space-x-2 p-2">
              <EcolyLogo size="sm" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Ecoly</h2>
                <p className="text-xs text-gray-500">
                  {session.user.role === 'DIRECTOR' && 'Directeur'}
                  {session.user.role === 'SECRETARY' && 'Secrétaire'}
                  {session.user.role === 'TEACHER' && 'Enseignant'}
                  {session.user.role === 'PARENT' && 'Parent'}
                </p>
              </div>
              <SidebarTrigger className="md:hidden" />
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1">
            <SidebarMenu>
              {navigationItems.map(renderMenuItem)}

              {/* Section finance avec accès conditionnel */}
              {(checkModuleAccess('finance') || userRole === 'DIRECTOR') && (
                <>
                  <SidebarMenuItem>
                    <div className="px-2 py-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Finance
                      </div>
                    </div>
                  </SidebarMenuItem>
                  {financeItems.map(renderMenuItem)}
                </>
              )}

              {/* Section rapports */}
              {(checkModuleAccess('reports') || userRole === 'DIRECTOR') && (
                <>
                  <SidebarMenuItem>
                    <div className="px-2 py-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rapports
                      </div>
                    </div>
                  </SidebarMenuItem>
                  {reportsItems.map(renderMenuItem)}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="p-2">
              <UserMenu onSettingsClick={() => setShowSettings(true)} />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {navigationItems.find(item => isActive(item.href))?.title || 'Accueil'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ConditionalRender module="reports">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Eye className="h-5 w-5" />
                  </button>
                </ConditionalRender>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>

      {/* Settings Modal/Dialog */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Paramètres</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p>Contenu des paramètres à implémenter...</p>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
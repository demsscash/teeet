'use client'

import { useSession } from 'next-auth/react'
import { usePermissions } from '@/lib/permissions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: string
  module?: string
  action?: string
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  permission,
  module,
  action,
  fallback,
  requireAuth = true
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()

  // En attente de chargement de la session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Vérification de l'authentification
  if (requireAuth && !session) {
    return (
      fallback || (
        <Alert className="max-w-md mx-auto mt-8">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour accéder à cette page.
          </AlertDescription>
        </Alert>
      )
    )
  }

  // Si l'utilisateur est connecté, vérifier les permissions
  if (session) {
    const userRole = session.user.role as any
    const { checkPermission, checkModuleAccess, canPerform } = usePermissions(userRole)

    let hasAccess = true

    // Vérifier une permission spécifique
    if (permission) {
      hasAccess = checkPermission(permission)
    }
    // Vérifier l'accès à un module
    else if (module && !action) {
      hasAccess = checkModuleAccess(module)
    }
    // Vérifier une action spécifique sur un module
    else if (module && action) {
      hasAccess = canPerform(action, module)
    }

    if (!hasAccess) {
      return (
        fallback || (
          <Alert className="max-w-md mx-auto mt-8" variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
            </AlertDescription>
          </Alert>
        )
      )
    }
  }

  return <>{children}</>
}

// Composant pour conditionner l'affichage d'éléments UI
interface ConditionalRenderProps {
  children: React.ReactNode
  permission?: string
  module?: string
  action?: string
  fallback?: React.ReactNode
}

export function ConditionalRender({
  children,
  permission,
  module,
  action,
  fallback = null
}: ConditionalRenderProps) {
  const { data: session } = useSession()

  if (!session) {
    return <>{fallback}</>
  }

  const userRole = session.user.role as any
  const { checkPermission, checkModuleAccess, canPerform } = usePermissions(userRole)

  let hasAccess = true

  if (permission) {
    hasAccess = checkPermission(permission)
  } else if (module && !action) {
    hasAccess = checkModuleAccess(module)
  } else if (module && action) {
    hasAccess = canPerform(action, module)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Hook personnalisé pour utiliser la protection dans les composants
export function useProtectedRoute() {
  const { data: session, status } = useSession()

  const userRole = session?.user.role as any
  const { checkPermission, checkModuleAccess, canPerform } = usePermissions(userRole)

  const canAccess = (permission?: string, module?: string, action?: string) => {
    if (!session) return false

    if (permission) {
      return checkPermission(permission)
    } else if (module && !action) {
      return checkModuleAccess(module)
    } else if (module && action) {
      return canPerform(action, module)
    }

    return true
  }

  return {
    session,
    isLoading: status === 'loading',
    canAccess,
    userRole
  }
}
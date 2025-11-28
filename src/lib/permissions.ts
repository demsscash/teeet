// Définition des rôles et permissions pour l'application Ecoly

export type UserRole = 'DIRECTOR' | 'SECRETARY' | 'TEACHER' | 'PARENT'

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface RolePermissions {
  DIRECTOR: Permission[]
  SECRETARY: Permission[]
  TEACHER: Permission[]
  PARENT: Permission[]
}

// Liste des permissions disponibles
export const PERMISSIONS: Permission[] = [
  // Gestion des classes
  {
    id: 'classes.view',
    name: 'Voir les classes',
    description: 'Peut voir la liste des classes',
    module: 'classes'
  },
  {
    id: 'classes.create',
    name: 'Créer des classes',
    description: 'Peut créer de nouvelles classes',
    module: 'classes'
  },
  {
    id: 'classes.edit',
    name: 'Modifier les classes',
    description: 'Peut modifier les informations des classes',
    module: 'classes'
  },
  {
    id: 'classes.delete',
    name: 'Supprimer des classes',
    description: 'Peut supprimer des classes',
    module: 'classes'
  },

  // Gestion des étudiants
  {
    id: 'students.view',
    name: 'Voir les étudiants',
    description: 'Peut voir la liste des étudiants',
    module: 'students'
  },
  {
    id: 'students.create',
    name: 'Créer des étudiants',
    description: 'Peut ajouter de nouveaux étudiants',
    module: 'students'
  },
  {
    id: 'students.edit',
    name: 'Modifier les étudiants',
    description: 'Peut modifier les informations des étudiants',
    module: 'students'
  },
  {
    id: 'students.delete',
    name: 'Supprimer des étudiants',
    description: 'Peut supprimer des étudiants',
    module: 'students'
  },

  // Gestion des enseignants
  {
    id: 'teachers.view',
    name: 'Voir les enseignants',
    description: 'Peut voir la liste des enseignants',
    module: 'teachers'
  },
  {
    id: 'teachers.create',
    name: 'Créer des enseignants',
    description: 'Peut ajouter de nouveaux enseignants',
    module: 'teachers'
  },
  {
    id: 'teachers.edit',
    name: 'Modifier les enseignants',
    description: 'Peut modifier les informations des enseignants',
    module: 'teachers'
  },
  {
    id: 'teachers.delete',
    name: 'Supprimer des enseignants',
    description: 'Peut supprimer des enseignants',
    module: 'teachers'
  },

  // Gestion de la présence
  {
    id: 'attendance.view',
    name: 'Voir la présence',
    description: 'Peut voir les registres de présence',
    module: 'attendance'
  },
  {
    id: 'attendance.manage',
    name: 'Gérer la présence',
    description: 'Peut marquer la présence des étudiants',
    module: 'attendance'
  },
  {
    id: 'attendance.edit',
    name: 'Modifier la présence',
    description: 'Peut modifier les enregistrements de présence',
    module: 'attendance'
  },

  // Gestion des notes
  {
    id: 'grades.view',
    name: 'Voir les notes',
    description: 'Peut voir les notes des étudiants',
    module: 'grades'
  },
  {
    id: 'grades.create',
    name: 'Créer des notes',
    description: 'Peut ajouter de nouvelles notes',
    module: 'grades'
  },
  {
    id: 'grades.edit',
    name: 'Modifier les notes',
    description: 'Peut modifier les notes existantes',
    module: 'grades'
  },

  // Gestion des observations
  {
    id: 'observations.view',
    name: 'Voir les observations',
    description: 'Peut voir les observations des étudiants',
    module: 'observations'
  },
  {
    id: 'observations.create',
    name: 'Créer des observations',
    description: 'Peut créer de nouvelles observations',
    module: 'observations'
  },
  {
    id: 'observations.edit',
    name: 'Modifier les observations',
    description: 'Peut modifier les observations existantes',
    module: 'observations'
  },

  // Gestion financière
  {
    id: 'finance.view',
    name: 'Voir les finances',
    description: 'Peut voir les informations financières',
    module: 'finance'
  },
  {
    id: 'finance.manage',
    name: 'Gérer les finances',
    description: 'Peut gérer les paiements et la facturation',
    module: 'finance'
  },

  // Gestion des matières
  {
    id: 'subjects.view',
    name: 'Voir les matières',
    description: 'Peut voir la liste des matières',
    module: 'subjects'
  },
  {
    id: 'subjects.create',
    name: 'Créer des matières',
    description: 'Peut créer de nouvelles matières',
    module: 'subjects'
  },
  {
    id: 'subjects.edit',
    name: 'Modifier les matières',
    description: 'Peut modifier les matières existantes',
    module: 'subjects'
  },
  {
    id: 'subjects.delete',
    name: 'Supprimer des matières',
    description: 'Peut supprimer des matières',
    module: 'subjects'
  },

  // Paramètres et administration
  {
    id: 'settings.view',
    name: 'Voir les paramètres',
    description: 'Peut voir les paramètres de l\'application',
    module: 'settings'
  },
  {
    id: 'settings.manage',
    name: 'Gérer les paramètres',
    description: 'Peut modifier les paramètres de l\'application',
    module: 'settings'
  },
  {
    id: 'users.manage',
    name: 'Gérer les utilisateurs',
    description: 'Peut gérer les comptes utilisateurs',
    module: 'users'
  },

  // Rapports
  {
    id: 'reports.view',
    name: 'Voir les rapports',
    description: 'Peut voir les rapports et statistiques',
    module: 'reports'
  },
  {
    id: 'reports.export',
    name: 'Exporter des rapports',
    description: 'Peut exporter des rapports',
    module: 'reports'
  }
]

// Définition des permissions par rôle
export const ROLE_PERMISSIONS: RolePermissions = {
  DIRECTOR: [
    // Le directeur a accès à tout
    ...PERMISSIONS
  ],

  SECRETARY: [
    // Permissions de la secrétaire selon la demande
    // Gestion des classes
    'classes.view',
    'classes.create',
    'classes.edit',

    // Gestion des étudiants
    'students.view',
    'students.create',
    'students.edit',

    // Gestion des enseignants
    'teachers.view',
    'teachers.create',
    'teachers.edit',

    // Gestion de la présence
    'attendance.view',
    'attendance.manage',
    'attendance.edit',

    // Gestion des notes (vue seulement)
    'grades.view',

    // Gestion des observations
    'observations.view',
    'observations.create',

    // Gestion des matières
    'subjects.view',
    'subjects.create',
    'subjects.edit',

    // Paramètres limités
    'settings.view',

    // Rapports
    'reports.view',
    'reports.export'
  ].map(id => PERMISSIONS.find(p => p.id === id)!).filter(Boolean),

  TEACHER: [
    // L'enseignant peut gérer ses classes et ses étudiants
    'classes.view',
    'students.view',
    'students.edit',
    'attendance.manage',
    'grades.create',
    'grades.edit',
    'grades.view',
    'observations.create',
    'observations.view',
    'observations.edit',
    'subjects.view'
  ].map(id => PERMISSIONS.find(p => p.id === id)!).filter(Boolean),

  PARENT: [
    // Le parent peut voir les informations de ses enfants
    'students.view',
    'grades.view',
    'observations.view',
    'attendance.view'
  ].map(id => PERMISSIONS.find(p => p.id === id)!).filter(Boolean)
}

// Helper functions
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  const permissions = getRolePermissions(userRole)
  return permissions.some(p => p.id === permissionId)
}

export function hasModuleAccess(userRole: UserRole, module: string): boolean {
  const permissions = getRolePermissions(userRole)
  return permissions.some(p => p.module === module)
}

export function canPerformAction(userRole: UserRole, action: string, module: string): boolean {
  const permissionId = `${module}.${action}`
  return hasPermission(userRole, permissionId)
}

// Hook React pour utiliser les permissions
export function usePermissions(role?: UserRole) {
  const checkPermission = (permissionId: string) => {
    if (!role) return false
    return hasPermission(role, permissionId)
  }

  const checkModuleAccess = (module: string) => {
    if (!role) return false
    return hasModuleAccess(role, module)
  }

  const canPerform = (action: string, module: string) => {
    if (!role) return false
    return canPerformAction(role, action, module)
  }

  return {
    checkPermission,
    checkModuleAccess,
    canPerform,
    permissions: role ? getRolePermissions(role) : []
  }
}
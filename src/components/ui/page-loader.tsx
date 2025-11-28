import { GraduationCap, Users, BookOpen, DollarSign } from 'lucide-react'

interface PageLoaderProps {
  title: string
  description?: string
  icon?: 'users' | 'book' | 'graduation' | 'finance'
}

export function PageLoader({ title, description, icon = 'graduation' }: PageLoaderProps) {
  const icons = {
    users: Users,
    book: BookOpen,
    graduation: GraduationCap,
    finance: DollarSign
  }

  const Icon = icons[icon]

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-pulse-soft">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gradient mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">
        {description || 'Veuillez patienter pendant que nous récupérons les données...'}
      </p>
      <div className="mt-6 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span className="text-sm text-gray-500">Chargement en cours...</span>
      </div>
    </div>
  )
}
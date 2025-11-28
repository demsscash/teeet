import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  title: string
  message?: string
  onRetry?: () => void
  retryText?: string
}

export function ErrorMessage({ title, message, onRetry, retryText = 'Réessayer' }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {message || 'Une erreur est survenue. Veuillez réessayer.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryText}
        </Button>
      )}
    </div>
  )
}
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: 'DIRECTOR' | 'SECRETARY' | 'TEACHER' | 'PARENT'
    schoolId: string
  }
}

export async function authenticate(request: NextRequest): Promise<AuthenticatedRequest> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token manquant')
  }

  const token = authHeader.substring(7)

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded || !decoded.userId) {
      throw new Error('Token invalide')
    }

    // Récupérer l'utilisateur fraîchement depuis la base
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        school: true
      }
    })

    if (!user || !user.isActive) {
      throw new Error('Utilisateur non trouvé ou désactivé')
    }

    // Ajouter l'utilisateur à la requête
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      id: user.id,
      email: user.email,
      role: user.role as any,
      schoolId: user.schoolId
    }

    return authenticatedRequest
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide')
    }
    throw error
  }
}

export async function checkAuth(request: NextRequest): Promise<AuthenticatedRequest['user']> {
  try {
    const authRequest = await authenticate(request)
    return authRequest.user!
  } catch (error) {
    throw error
  }
}
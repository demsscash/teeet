import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Récupérer l'utilisateur fraîchement depuis la base
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        school: true
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou désactivé' },
        { status: 401 }
      )
    }

    // Retourner les informations utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return NextResponse.json(
      { error: 'Token invalide' },
      { status: 401 }
    )
  }
}
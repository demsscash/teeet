import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les classes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const classes = await prisma.schoolClass.findMany({
      where: {
        schoolId: session.user.schoolId
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            students: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle classe
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, level, capacity, teacherId } = body

    // Validation
    if (!name || !level) {
      return NextResponse.json(
        { error: 'Name and level are required' },
        { status: 400 }
      )
    }

    // Vérifier si le nom de la classe existe déjà pour cette école
    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        name,
        schoolId: session.user.schoolId
      }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'A class with this name already exists' },
        { status: 409 }
      )
    }

    // Si un teacherId est fourni, vérifier qu'il existe et appartient à la même école
    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: {
          id: teacherId,
          schoolId: session.user.schoolId,
          role: 'TEACHER',
          isActive: true
        }
      })

      if (!teacher) {
        return NextResponse.json(
          { error: 'Invalid teacher' },
          { status: 400 }
        )
      }
    }

    const newClass = await prisma.schoolClass.create({
      data: {
        name,
        level,
        capacity: capacity || 40,
        teacherId: teacherId || null,
        schoolId: session.user.schoolId
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            students: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
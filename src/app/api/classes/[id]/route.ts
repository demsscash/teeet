import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour une classe
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { name, level, capacity, teacherId } = body

    // Validation
    if (!name || !level) {
      return NextResponse.json(
        { error: 'Name and level are required' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe et appartient à l'école
    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId
      }
    })

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau nom est déjà utilisé par une autre classe
    const duplicateClass = await prisma.schoolClass.findFirst({
      where: {
        name,
        schoolId: session.user.schoolId,
        id: { not: id }
      }
    })

    if (duplicateClass) {
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

    const updatedClass = await prisma.schoolClass.update({
      where: { id },
      data: {
        name,
        level,
        capacity: capacity || 40,
        teacherId: teacherId || null
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

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une classe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Vérifier si la classe existe et appartient à l'école
    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId
      },
      include: {
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

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Vérifier si la classe a des étudiants actifs
    if (existingClass._count.students > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete class with active students. Please reassign or deactivate students first.',
          studentCount: existingClass._count.students
        },
        { status: 400 }
      )
    }

    // Supprimer la classe
    await prisma.schoolClass.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Class deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
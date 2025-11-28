import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les matières
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subjects = await prisma.subject.findMany({
      where: {
        schoolId: session.user.schoolId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            grades: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle matière
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
    const { name, nameAr, maxScore, coefficient, classId, teacherId } = body

    // Validation
    if (!name || !maxScore || !classId) {
      return NextResponse.json(
        { error: 'Name, max score and class are required' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe et appartient à l'école
    const classExists = await prisma.schoolClass.findFirst({
      where: {
        id: classId,
        schoolId: session.user.schoolId
      }
    })

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 400 }
      )
    }

    // Vérifier si le professeur existe et appartient à l'école
    if (teacherId) {
      const teacherExists = await prisma.user.findFirst({
        where: {
          id: teacherId,
          schoolId: session.user.schoolId,
          role: 'TEACHER'
        }
      })

      if (!teacherExists) {
        return NextResponse.json(
          { error: 'Teacher not found' },
          { status: 400 }
        )
      }
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        nameAr: nameAr || '',
        maxScore: parseInt(maxScore),
        coefficient: coefficient ? parseInt(coefficient) : 1,
        classId,
        teacherId: teacherId || null,
        schoolId: session.user.schoolId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            grades: true
          }
        }
      }
    })

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
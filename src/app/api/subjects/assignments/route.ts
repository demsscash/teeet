import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const teacherId = searchParams.get('teacherId')

    let whereClause: any = {
      schoolId,
      include: {
        subject: true,
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
        }
      }
    }

    if (classId) {
      whereClause.classId = classId
    }

    if (teacherId) {
      whereClause.teacherId = teacherId
    }

    const assignments = await prisma.classSubject.findMany({
      where: whereClause,
      orderBy: {
        subject: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(assignments)

  } catch (error) {
    console.error('Error fetching class subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'

    const data = await request.json()
    const {
      classId,
      teacherId,
      subjectId,
      maxScore,
      coefficient
    } = data

    // Validation
    if (!classId || !subjectId) {
      return NextResponse.json(
        { error: 'La classe et la matière sont obligatoires' },
        { status: 400 }
      )
    }

    // Vérifier si cette affectation existe déjà
    const existingAssignment = await prisma.classSubject.findFirst({
      where: {
        classId,
        subjectId,
        schoolId
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Cette matière est déjà affectée à cette classe' },
        { status: 400 }
      )
    }

    // Vérifier que la classe, la matière et le professeur existent
    const [classExists, subjectExists, teacherExists] = await Promise.all([
      prisma.schoolClass.findFirst({
        where: { id: classId, schoolId }
      }),
      prisma.subjectTemplate.findFirst({
        where: { id: subjectId, schoolId }
      }),
      teacherId ? prisma.user.findFirst({
        where: { id: teacherId, schoolId, role: 'TEACHER' }
      }) : Promise.resolve(true)
    ])

    if (!classExists) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    if (!subjectExists) {
      return NextResponse.json(
        { error: 'Matière non trouvée' },
        { status: 404 }
      )
    }

    if (teacherId && !teacherExists) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    const assignment = await prisma.classSubject.create({
      data: {
        classId,
        teacherId,
        subjectId,
        maxScore: maxScore || subjectExists.maxScore,
        coefficient: coefficient || subjectExists.coefficient,
        schoolId
      },
      include: {
        subject: true,
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
        }
      }
    })

    return NextResponse.json(assignment, { status: 201 })

  } catch (error) {
    console.error('Error creating class subject assignment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where = {
      schoolId,
      role: 'TEACHER',
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [teachers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          teacherClasses: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  level: true
                }
              }
            }
          },
          taughtSubjects: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  level: true
                }
              }
            }
          }
        },
        orderBy: { lastName: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching teachers:', error)
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

    const requestData = await request.json()
    console.log('Teacher creation request data:', requestData)

    const {
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      email,
      phone,
      password,
      classes,
      subjects
    } = requestData

    // Validation des champs requis (le mot de passe n'est plus requis pour les enseignants)
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          error: 'Required fields missing',
          received: { firstName, lastName, email }
        },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already used' },
        { status: 409 }
      )
    }

    // Les enseignants n'ont pas besoin de mot de passe, on génère un mot de passe par défaut
    const defaultPassword = 'teacher123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Créer l'enseignant
    const teacher = await prisma.user.create({
      data: {
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        email,
        phone,
        password: hashedPassword,
        role: 'TEACHER',
        schoolId,
        isActive: true
      },
      include: {
        teacherClasses: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                level: true
              }
            }
          }
        },
        taughtSubjects: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                level: true
              }
            }
          }
        }
      }
    })

    // Associer les classes si spécifiées
    if (classes && classes.length > 0) {
      await Promise.all(
        classes.map((classId: string) =>
          prisma.teacherClass.create({
            data: {
              teacherId: teacher.id,
              classId,
              role: 'TEACHER'
            }
          })
        )
      )
    }

    // Associer les matières si spécifiées
    if (subjects && subjects.length > 0) {
      await Promise.all(
        subjects.map((subjectData: any) =>
          prisma.subject.create({
            data: {
              name: subjectData.name,
              nameAr: subjectData.nameAr,
              maxScore: subjectData.maxScore || 20,
              coefficient: subjectData.coefficient || 1,
              classId: subjectData.classId,
              teacherId: teacher.id,
              schoolId
            }
          })
        )
      )
    }

    return NextResponse.json(teacher, { status: 201 })

  } catch (error) {
    console.error('Error creating teacher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
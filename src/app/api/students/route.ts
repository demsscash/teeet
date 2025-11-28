import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Fonction d'authentification temporaire pour éviter les erreurs circulaires
async function checkAuth(request: NextRequest) {
  // Pour le moment, on retourne un user par défaut pour tester
  // TODO: Implémenter l'authentification complète
  return {
    id: 'temp-user-id',
    email: 'admin@ecole.mr',
    role: 'DIRECTOR' as const,
    schoolId: 'cmhi4nlkm0000wwvycuyqvi5g'
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentification
    const user = await checkAuth(request)
    const schoolId = user.schoolId

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const classId = searchParams.get('classId')

    const skip = (page - 1) * limit

    const where = {
      schoolId,
      isActive: true,
      ...(classId && classId !== 'all' && { classId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { studentNumber: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [students, total] = await Promise.all([
      db.student.findMany({
        where,
        include: {
          class: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.student.count({ where })
    ])

    return NextResponse.json({
      students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentification
    const user = await checkAuth(request)
    const schoolId = user.schoolId

    const data = await request.json()
    const {
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      dateOfBirth,
      placeOfBirth,
      gender,
      address,
      classId,
      photo
    } = data

    // Generate unique student number
    const currentYear = new Date().getFullYear()
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const studentNumber = `${currentYear}-${sequence}`

    const student = await db.student.create({
      data: {
        studentNumber,
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        dateOfBirth: new Date(dateOfBirth),
        placeOfBirth,
        gender,
        address,
        photo,
        classId: classId || null,
        schoolId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all' // 'all', 'active', 'inactive'

    const where = {
      schoolId,
      role: 'TEACHER',
      ...(status !== 'all' && {
        isActive: status === 'active'
      }),
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
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const schoolId = session.user.schoolId

    // Récupérer toutes les statistiques en parallèle
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      activeTeachers,
      todayAttendances,
      recentGrades,
      recentStudents
    ] = await Promise.all([
      // Total des élèves
      prisma.student.count({
        where: { schoolId }
      }),

      // Total des enseignants
      prisma.user.count({
        where: {
          schoolId,
          role: 'TEACHER'
        }
      }),

      // Total des classes
      prisma.schoolClass.count({
        where: { schoolId }
      }),

      // Élèves actifs
      prisma.student.count({
        where: {
          schoolId,
          isActive: true
        }
      }),

      // Enseignants actifs
      prisma.user.count({
        where: {
          schoolId,
          role: 'TEACHER',
          isActive: true
        }
      }),

      // Présences aujourd'hui
      prisma.attendance.count({
        where: {
          schoolId,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),

      // Notes récentes (derniers 7 jours)
      prisma.grade.count({
        where: {
          schoolId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Élèves récents (derniers 30 jours)
      prisma.student.findMany({
        where: {
          schoolId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          class: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Calculer le pourcentage de présence aujourd'hui
    const attendancePercentage = activeStudents > 0
      ? Math.round((todayAttendances / activeStudents) * 100)
      : 0

    // Récupérer les activités récentes
    const recentActivities = []

    // Ajouter les élèves récents
    recentStudents.forEach(student => {
      recentActivities.push({
        id: `student-${student.id}`,
        type: 'student',
        title: `Nouvel élève inscrit: ${student.firstName} ${student.lastName}`,
        description: student.class?.name ? `Classe: ${student.class.name}` : 'Non assigné',
        timestamp: student.createdAt,
        icon: 'user-plus',
        color: 'blue'
      })
    })

    // Ajouter les notes récentes
    if (recentGrades > 0) {
      recentActivities.push({
        id: 'grades-recent',
        type: 'grades',
        title: `${recentGrades} note${recentGrades > 1 ? 's' : ''} saisie${recentGrades > 1 ? 's' : ''}`,
        description: 'Durant les 7 derniers jours',
        timestamp: new Date().toISOString(),
        icon: 'book',
        color: 'green'
      })
    }

    // Trier les activités par date
    recentActivities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const stats = {
      totalStudents,
      activeStudents,
      totalTeachers,
      activeTeachers,
      totalClasses,
      attendancePercentage,
      todayAttendances,
      recentGrades,
      recentActivities: recentActivities.slice(0, 5) // Limiter à 5 activités
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
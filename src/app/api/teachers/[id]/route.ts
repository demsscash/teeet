import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'
    const { id } = await params

    const data = await request.json()
    const {
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      email,
      phone,
      isActive,
      classes,
      subjects
    } = data

    const teacher = await prisma.user.update({
      where: {
        id,
        schoolId,
        role: 'TEACHER'
      },
      data: {
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        email,
        phone,
        isActive: isActive !== undefined ? isActive : true
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

    // Mettre à jour les associations de classes si spécifiées
    if (classes && Array.isArray(classes)) {
      // Supprimer les anciennes associations
      await prisma.teacherClass.deleteMany({
        where: { teacherId: id }
      })

      // Ajouter les nouvelles associations
      if (classes.length > 0) {
        await Promise.all(
          classes.map((classId: string) =>
            prisma.teacherClass.create({
              data: {
                teacherId: id,
                classId,
                role: 'TEACHER'
              }
            })
          )
        )
      }
    }

    // Mettre à jour les matières si spécifiées
    if (subjects && Array.isArray(subjects)) {
      // Supprimer les anciennes matières
      await prisma.subject.deleteMany({
        where: { teacherId: id }
      })

      // Ajouter les nouvelles matières
      if (subjects.length > 0) {
        await Promise.all(
          subjects.map((subjectData: any) =>
            prisma.subject.create({
              data: {
                name: subjectData.name,
                nameAr: subjectData.nameAr || '',
                maxScore: subjectData.maxScore || 20,
                coefficient: subjectData.coefficient || 1,
                classId: subjectData.classId,
                teacherId: id,
                schoolId
              }
            })
          )
        )
      }
    }

    // Récupérer l'enseignant mis à jour avec ses nouvelles associations
    const updatedTeacher = await prisma.user.findUnique({
      where: { id },
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

    return NextResponse.json(updatedTeacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'
    const { id } = await params

    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findFirst({
      where: {
        id,
        schoolId,
        role: 'TEACHER'
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Hard delete: supprimer réellement l'enseignant de la base de données
    await prisma.user.delete({
      where: {
        id,
        schoolId,
        role: 'TEACHER'
      }
    })

    return NextResponse.json({
      message: 'Teacher deleted successfully',
      teacherId: id
    })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
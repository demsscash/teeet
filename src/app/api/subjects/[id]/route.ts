import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour une matière
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
    const { name, description, code, color } = body

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      )
    }

    // Vérifier si la matière existe et appartient à l'école
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId
      }
    })

    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau code est déjà utilisé par une autre matière
    const duplicateCode = await prisma.subject.findFirst({
      where: {
        code: code.toUpperCase(),
        schoolId: session.user.schoolId,
        id: { not: id }
      }
    })

    if (duplicateCode) {
      return NextResponse.json(
        { error: 'A subject with this code already exists' },
        { status: 409 }
      )
    }

    // Vérifier si le nouveau nom est déjà utilisé par une autre matière
    const duplicateName = await prisma.subject.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        schoolId: session.user.schoolId,
        id: { not: id }
      }
    })

    if (duplicateName) {
      return NextResponse.json(
        { error: 'A subject with this name already exists' },
        { status: 409 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        description: description || '',
        code: code.toUpperCase(),
        color: color || '#22c55e'
      },
      include: {
        _count: {
          select: {
            classes: true,
            grades: true
          }
        }
      }
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une matière
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

    // Vérifier si la matière existe et appartient à l'école
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId
      },
      include: {
        _count: {
          select: {
            classes: true,
            grades: true
          }
        }
      }
    })

    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    // Vérifier si la matière est utilisée par des classes ou des notes
    if (existingSubject._count.classes > 0 || existingSubject._count.grades > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete subject that is in use',
          details: {
            classesCount: existingSubject._count.classes,
            gradesCount: existingSubject._count.grades
          }
        },
        { status: 400 }
      )
    }

    // Supprimer la matière
    await prisma.subject.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Subject deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
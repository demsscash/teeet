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
      dateOfBirth,
      placeOfBirth,
      gender,
      address,
      classId,
      photo,
      isActive
    } = data

    const student = await prisma.student.update({
      where: {
        id,
        schoolId
      },
      data: {
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        placeOfBirth,
        gender,
        address,
        photo,
        classId: classId || null,
        isActive: isActive !== undefined ? isActive : true
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

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
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

    // Soft delete by setting isActive to false
    await prisma.student.update({
      where: {
        id,
        schoolId
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporairement: utiliser l'ID de l'école directement pour tester
    // TODO: Remettre l'authentification plus tard
    const schoolId = 'cmhi4nlkm0000wwvycuyqvi5g'

    const subjects = await prisma.subjectTemplate.findMany({
      where: {
        schoolId,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(subjects)

  } catch (error) {
    console.error('Error fetching subject templates:', error)
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
      name,
      nameAr,
      code,
      description,
      maxScore = 20,
      coefficient = 1,
      color = '#6366f1'
    } = data

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Le nom et le code sont obligatoires' },
        { status: 400 }
      )
    }

    // Vérifier si le code existe déjà
    const existingSubject = await prisma.subjectTemplate.findFirst({
      where: {
        schoolId,
        code: code.toLowerCase()
      }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Une matière avec ce code existe déjà' },
        { status: 400 }
      )
    }

    const subject = await prisma.subjectTemplate.create({
      data: {
        name: name.trim(),
        nameAr: nameAr?.trim(),
        code: code.toLowerCase().trim(),
        description: description?.trim(),
        maxScore,
        coefficient,
        color,
        schoolId
      }
    })

    return NextResponse.json(subject, { status: 201 })

  } catch (error) {
    console.error('Error creating subject template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
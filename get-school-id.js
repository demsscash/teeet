const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getSchoolId() {
  try {
    const school = await prisma.school.findFirst()
    if (school) {
      console.log('School ID:', school.id)
      console.log('School Name:', school.name)
    } else {
      console.log('No school found')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getSchoolId()
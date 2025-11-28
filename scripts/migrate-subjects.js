const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateSubjects() {
  try {
    console.log('Migration des matières...')

    // Récupérer l'école existante
    const school = await prisma.school.findFirst()
    if (!school) {
      console.error('Aucune école trouvée')
      return
    }

    console.log(`École trouvée: ${school.name}`)

    // Récupérer toutes les anciennes matières
    const oldSubjects = await prisma.subject.findMany({
      include: {
        class: true,
        teacher: true
      }
    })

    console.log(`Trouvé ${oldSubjects.length} matières à migrer`)

    // Créer les templates de matières uniques
    const uniqueSubjects = [...new Map(oldSubjects.map(s => [s.name.toLowerCase(), s])).values()]

    console.log(`${uniqueSubjects.length} matières uniques à créer`)

    // Créer les templates de matières
    for (const subject of uniqueSubjects) {
      const code = subject.name.toLowerCase().replace(/\s+/g, '_')

      // Vérifier si le template existe déjà
      const existing = await prisma.subjectTemplate.findFirst({
        where: {
          schoolId: school.id,
          code: code
        }
      })

      if (!existing) {
        await prisma.subjectTemplate.create({
          data: {
            name: subject.name,
            nameAr: subject.nameAr,
            code: code,
            maxScore: subject.maxScore,
            coefficient: subject.coefficient,
            schoolId: school.id,
            color: '#' + Math.floor(Math.random()*16777215).toString(16)
          }
        })
      }
    }

    console.log('Templates de matières créés')

    // Maintenant récupérer les templates créés et créer les affectations aux classes
    const createdTemplates = await prisma.subjectTemplate.findMany({
      where: { schoolId: school.id }
    })

    for (const oldSubject of oldSubjects) {
      const template = createdTemplates.find(t => t.name.toLowerCase() === oldSubject.name.toLowerCase())

      if (template) {
        await prisma.classSubject.create({
          data: {
            classId: oldSubject.classId,
            teacherId: oldSubject.teacherId,
            subjectId: template.id,
            schoolId: school.id,
            maxScore: oldSubject.maxScore,
            coefficient: oldSubject.coefficient
          }
        })
      }
    }

    console.log('Affectations aux classes créées')
    console.log('Migration terminée avec succès!')

  } catch (error) {
    console.error('Erreur lors de la migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateSubjects()
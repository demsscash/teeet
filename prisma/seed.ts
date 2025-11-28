import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Début du seeding de la base de données...')

  // Créer l'école
  const school = await prisma.school.create({
    data: {
      name: 'Ecoly',
      nameAr: 'مدرسة نواكشوط النموذجية',
      address: 'Avenue Gamal Abdel Nasser, Mauritanie, Mauritanie',
      phone: '+222 45 25 00 00',
      email: 'contact@ecolepilotte.mr'
    }
  })
  console.log('École créée:', school.name)

  // Créer les utilisateurs
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const director = await prisma.user.create({
    data: {
      email: 'director@ecolepilotte.mr',
      password: hashedPassword,
      firstName: 'Mohamed',
      lastName: 'Ould Cheikh',
      firstNameAr: 'محمد',
      lastNameAr: 'ولد الشيخ',
      phone: '+222 22 34 56 78',
      role: 'DIRECTOR',
      schoolId: school.id
    }
  })
  console.log('Directeur créé:', director.firstName, director.lastName)

  const secretary = await prisma.user.create({
    data: {
      email: 'secretary@ecolepilotte.mr',
      password: hashedPassword,
      firstName: 'Fatima',
      lastName: 'Mint Ahmed',
      firstNameAr: 'فاطمة',
      lastNameAr: 'منت أحمد',
      phone: '+222 22 34 56 79',
      role: 'SECRETARY',
      schoolId: school.id
    }
  })
  console.log('Secrétaire créée:', secretary.firstName, secretary.lastName)

  const teacher1 = await prisma.user.create({
    data: {
      email: 'teacher1@ecolepilotte.mr',
      password: hashedPassword,
      firstName: 'Abdallahi',
      lastName: 'Ould Mohamed',
      firstNameAr: 'عبدالله',
      lastNameAr: 'ولد محمد',
      phone: '+222 22 34 56 80',
      role: 'TEACHER',
      schoolId: school.id
    }
  })
  console.log('Enseignant 1 créé:', teacher1.firstName, teacher1.lastName)

  const teacher2 = await prisma.user.create({
    data: {
      email: 'teacher2@ecolepilotte.mr',
      password: hashedPassword,
      firstName: 'Mariam',
      lastName: 'Mint Salem',
      firstNameAr: 'مريم',
      lastNameAr: 'منت سالم',
      phone: '+222 22 34 56 81',
      role: 'TEACHER',
      schoolId: school.id
    }
  })
  console.log('Enseignant 2 créée:', teacher2.firstName, teacher2.lastName)

  // Créer les classes
  const classes = [
    { name: 'CP1', level: 'Primaire', capacity: 40 },
    { name: 'CP2', level: 'Primaire', capacity: 40 },
    { name: 'CE1', level: 'Primaire', capacity: 40 },
    { name: 'CE2', level: 'Primaire', capacity: 40 },
    { name: 'CM1', level: 'Primaire', capacity: 40 },
    { name: 'CM2', level: 'Primaire', capacity: 40 }
  ]

  const createdClasses = []
  for (const classData of classes) {
    const newClass = await prisma.schoolClass.create({
      data: {
        name: classData.name,
        level: classData.level,
        capacity: classData.capacity,
        schoolId: school.id
      }
    })
    createdClasses.push(newClass)
    console.log('Classe créée:', newClass.name)
  }

  // Créer les matières pour chaque classe
  const subjects = [
    { name: 'Mathématiques', nameAr: 'الرياضيات', maxScore: 20, coefficient: 3 },
    { name: 'Arabe', nameAr: 'اللغة العربية', maxScore: 20, coefficient: 4 },
    { name: 'Français', nameAr: 'اللغة الفرنسية', maxScore: 20, coefficient: 3 },
    { name: 'Histoire-Géographie', nameAr: 'التاريخ والجغرافيا', maxScore: 20, coefficient: 2 },
    { name: 'Sciences', nameAr: 'العلوم', maxScore: 20, coefficient: 2 },
    { name: 'Anglais', nameAr: 'اللغة الإنجليزية', maxScore: 20, coefficient: 2 },
    { name: 'Éducation Islamique', nameAr: 'التربية الإسلامية', maxScore: 20, coefficient: 2 },
    { name: 'Éducation Civique', nameAr: 'التربية المدنية', maxScore: 20, coefficient: 1 }
  ]

  for (const classObj of createdClasses) {
    for (const subjectData of subjects) {
      const subject = await prisma.subject.create({
        data: {
          name: subjectData.name,
          nameAr: subjectData.nameAr,
          maxScore: subjectData.maxScore,
          coefficient: subjectData.coefficient,
          schoolId: school.id,
          classId: classObj.id,
          teacherId: Math.random() > 0.5 ? teacher1.id : teacher2.id
        }
      })
      console.log(`Matière créée: ${subject.name} pour la classe ${classObj.name}`)
    }
  }

  // Créer quelques élèves exemples
  const students = [
    {
      firstName: 'Ahmed',
      lastName: 'Ould Brahim',
      firstNameAr: 'أحمد',
      lastNameAr: 'ولد إبراهيم',
      dateOfBirth: new Date('2010-03-15'),
      placeOfBirth: 'Mauritanie',
      gender: 'MALE' as const,
      address: 'Tevragh Zeina, Mauritanie',
      classId: createdClasses[5].id // CM2
    },
    {
      firstName: 'Aicha',
      lastName: 'Mint Ali',
      firstNameAr: 'عائشة',
      lastNameAr: 'منت علي',
      dateOfBirth: new Date('2011-06-22'),
      placeOfBirth: 'Mauritanie',
      gender: 'FEMALE' as const,
      address: 'Ain Taya, Mauritanie',
      classId: createdClasses[3].id // CE2
    },
    {
      firstName: 'Mohamed',
      lastName: 'Ould Ahmed',
      firstNameAr: 'محمد',
      lastNameAr: 'ولد أحمد',
      dateOfBirth: new Date('2012-09-10'),
      placeOfBirth: 'Mauritanie',
      gender: 'MALE' as const,
      address: 'Sélibabi, Mauritanie',
      classId: createdClasses[2].id // CE1
    },
    {
      firstName: 'Fatoumata',
      lastName: 'Mint Sidi',
      firstNameAr: 'فاطمة',
      lastNameAr: 'منت سيدي',
      dateOfBirth: new Date('2013-12-05'),
      placeOfBirth: 'Mauritanie',
      gender: 'FEMALE' as const,
      address: 'Dar Naim, Mauritanie',
      classId: createdClasses[0].id // CP1
    }
  ]

  for (const studentData of students) {
    // Generate unique student number
    const currentYear = new Date().getFullYear()
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const studentNumber = `${currentYear}-${sequence}`

    const student = await prisma.student.create({
      data: {
        studentNumber,
        ...studentData,
        schoolId: school.id
      }
    })
    console.log('Élève créé:', student.firstName, student.lastName, '(', student.studentNumber, ')')
  }

  console.log('Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
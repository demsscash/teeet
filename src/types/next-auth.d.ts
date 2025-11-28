import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      schoolId: string
      schoolName: string
    }
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    schoolId: string
    schoolName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    schoolId: string
    schoolName: string
    firstName: string
    lastName: string
  }
}
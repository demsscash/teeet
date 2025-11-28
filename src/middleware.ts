import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/students/:path*',
    '/grades/:path*',
    '/teachers/:path*',
    '/finance/:path*',
    '/observations/:path*',
    '/attendance/:path*',
    '/reports/:path*',
    '/settings/:path*'
  ]
}
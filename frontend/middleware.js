import { NextResponse }   from 'next/server'

const logOutPath = '/logout'


export async function middleware(request) {
  const {nextUrl: {pathname}} = request;

  if (pathname.startsWith(logOutPath)) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }
}

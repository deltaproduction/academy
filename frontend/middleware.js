import { NextResponse }   from 'next/server'
import { getProfileData } from "@/lib/api";


const authInPathMasks = [
  '/login', '/register'
]

const checkPath = (pathname, masks) => {
  return !!masks.filter(_ => pathname.startsWith(_)).length
}


export async function middleware(request) {
  const {nextUrl: {pathname}} = request;

  const url = new URL(request.url)

  if (pathname.startsWith('/logout')) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  } else if (checkPath(pathname, authInPathMasks)) {
    const profileRes = await getProfileData()
    if (profileRes.ok && profileRes.headers.getSetCookie()) {
      const response = NextResponse.redirect(new URL(url.searchParams.get('next') || '/', request.url))
      profileRes.headers.getSetCookie().forEach(cookie => response.headers.set('Set-Cookie', cookie))
      return response
    }
  } else {
    const profileRes = await getProfileData()
    if (profileRes.ok) {
      if (profileRes.headers.getSetCookie()) {
        const response = NextResponse.next()
        profileRes.headers.getSetCookie().forEach(cookie => response.headers.set('Set-Cookie', cookie))
        return response
      }
    } else {
      return NextResponse.redirect(new URL('/login' + '?next=' + url.pathname, request.url))
    }
  }
}

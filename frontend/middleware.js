import { NextResponse } from 'next/server'
import { headers }      from "next/headers";
import { fetchApi }     from "@/lib/api";


const loginRequiredPathMasks = [
  '/classes', '/courses'
]

const authInPathMasks = [
  '/login', '/register'
]

const logOutPath = '/logout'

const signInRedirectPath = '/classes'

const checkPath = (pathname, masks) => {
  return !!masks.filter(_ => pathname.startsWith(_)).length
}


export async function middleware(request) {
  const {nextUrl: {pathname}} = request;

  const url = new URL(request.url)

  if (checkPath(pathname, [logOutPath])) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  if (checkPath(pathname, loginRequiredPathMasks)) {
    const profileRes = await fetchApi('/api/profile', {headers: headers()})

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

  if (checkPath(pathname, authInPathMasks)) {
    const profileRes = await fetchApi('/api/profile', {headers: headers()})
    if (profileRes.ok) {
      const response = NextResponse.redirect(new URL(url.searchParams.get('next') || signInRedirectPath, request.url))
      if (profileRes.headers.getSetCookie()) {
        profileRes.headers.getSetCookie().forEach(cookie => response.headers.set('Set-Cookie', cookie))
        return response
      }
    }
  }
}

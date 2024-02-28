import { NextResponse } from 'next/server'
import { headers }      from "next/headers";
import { API_HOST }     from "@/lib/constants";


const loginRequiredPathMasks = [
  '/test_page'
]

const authPathMasks = [
  '/sign_in', '/sign_up'
]

const checkPath = (pathname, masks) => {
  return !!masks.filter(_ => pathname.startsWith(_)).length
}


export async function middleware(request) {
  const {nextUrl: {pathname}} = request;

  const url = new URL(request.url)

  if (checkPath(pathname, loginRequiredPathMasks)) {
    const profileRes = await fetch(API_HOST + '/api/profile', {headers: headers()})

    if (profileRes.ok) {
      if (profileRes.headers.getSetCookie()) {
        const response = NextResponse.next()
        profileRes.headers.getSetCookie().forEach(cookie => response.headers.set('Set-Cookie', cookie))
        return response
      }
    } else {
      return NextResponse.redirect(new URL('/sign_in' + '?next=' + url.pathname, request.url))
    }
  }

  if (checkPath(pathname, authPathMasks)) {
    const profileRes = await fetch(API_HOST + '/api/profile', {headers: headers()})
    if (profileRes.ok) {
      const response = NextResponse.redirect(new URL(url.searchParams.get('next') || '/', request.url))
      if (profileRes.headers.getSetCookie()) {
        profileRes.headers.getSetCookie().forEach(cookie => response.headers.set('Set-Cookie', cookie))
        return response
      }
    }
  }
}

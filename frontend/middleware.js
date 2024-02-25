import { NextResponse } from 'next/server'
import { headers }      from "next/headers";
import { API_HOST }     from "@/lib/constants";


const loginRequiredPathMasks = [
  '/test_page'
]

const authPathMasks = [
  '/sign_in', '/sign_up'
]

const checkPath = (pathname, masks, request) => {
  return !!masks.filter(_ => pathname.startsWith(_)).length
}

export async function middleware(request) {
  const {nextUrl: {pathname}} = request;

  const url = new URL(request.url)

  if (checkPath(pathname, loginRequiredPathMasks, request)) {
    const response = await fetch(API_HOST + '/api/profile', {headers: headers()})
    if (!response.ok) {
      return NextResponse.redirect(new URL('/sign_in' + '?next=' + url.pathname, request.url))
    }
  }
  if (checkPath(pathname, authPathMasks)) {
    const response = await fetch(API_HOST + '/api/profile', {headers: headers()})
    if (response.ok) {
      return NextResponse.redirect(new URL(url.searchParams.get('next') || '/', request.url))
    }
  }
}

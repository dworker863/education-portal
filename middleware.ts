import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from './app/libs/routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLogegdIn = req.auth;
  if (pathname.startsWith('/api/auth')) {
    return;
  }
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    console.log('Middleware auth check');
    if (isLogegdIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (!isLogegdIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin?modalopen=true', nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

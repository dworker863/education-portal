import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from './app/libs/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  //   }
  // } else if (!isPublicRoute && !isApiAuthRoute && !isLoggedIn) {

  //   return Response.redirect(new URL('/signin', req.nextUrl));
  // }

  if (
    (pathname === '/signin' ||
      pathname === '/signup' ||
      pathname === '/reset-password') &&
    !req.headers.get('referer')
  ) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

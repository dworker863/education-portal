import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { apiAuthRoutes, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from './app/libs/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // const session = req.auth;
  // const pathname = req.nextUrl.pathname;
  // const isApiAuthRoute = apiAuthRoutes.includes(pathname);
  // const isPublicRoute = publicRoutes.includes(pathname);
  // if (
  //   (pathname === '/signin' ||
  //     pathname === '/signup' ||
  //     pathname === '/reset-password') &&
  //   !req.headers.get('referer')
  // ) {
  //   return Response.redirect(new URL('/', req.nextUrl));
  // }
  // if (!isPublicRoute && !isApiAuthRoute && !session) {
  //   return Response.redirect(new URL('/', req.nextUrl));
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

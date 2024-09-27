import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { prisma } from './prisma/prisma';
import { loginSchema } from './app/libs/validation';
import { getUserByEmail } from './app/libs/utils';
import authConfig from './auth.config';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: 'ADMIN' | 'USER';
      password: string;
      firstName: string;
      lastName: string;
      birthDate: string;
      rating: string;
      rank: string;
      moneyUSD: number;
      meta: string[];
    } & DefaultSession['user'];

    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
  }
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  callbacks: {
    signIn: async () => {
      const isLoggedIn = await auth();

      if (isLoggedIn) {
        throw new Error('You are already signed in!');
      }

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token = { ...token, user: { ...user } };
      }

      return token;
    },
    session: async ({ token, session }) => {
      if (token.user) {
        session = { ...session, user: { ...session.user, ...token.user } };
      }
      return session;
    },
  },
  ...authConfig,
});

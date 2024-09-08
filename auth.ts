import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { prisma } from './prisma/prisma';

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
  providers: [
    Google,
    Github,
    Credentials({
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (
          credentials?.email === user?.email &&
          credentials?.password === user?.password
        ) {
          const { password, ...userWithoutPassword } = user!;
          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const isLoggedIn = await auth();

      if (isLoggedIn) {
        throw new Error('You are already signed in!');
      }

      return true;
    },
    jwt: async ({ token, account, user }) => {
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

  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
});

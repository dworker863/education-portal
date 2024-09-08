import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { prisma } from './prisma/prisma';

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
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      console.log('SIGNN: ', { user });

      const isLoggedIn = await auth();

      if (isLoggedIn) {
        throw new Error('You are already signed in!');
      }

      return true;
    },
    // jwt: ({ token, account, user }) => {
    //   console.log({ user });

    //   return token;
    // },
    // session: ({ token, session }) => {
    //   return session;
    // },
  },

  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
});

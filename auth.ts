import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { AuthError, DefaultSession } from 'next-auth';
import { prisma } from './prisma/prisma';
import authConfig from './auth.config';
import { generateVerificationToken, getUserById } from './app/libs/utils';
import { VerificationError } from './app/libs/errors';
import { sendVerificationEmail } from './app/libs/mail';

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
  events: {
    linkAccount: async ({ user }) => {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== 'credentials') return true;

      if (user.id && user.email) {
        const existingUser = await getUserById(user.id);

        if (!existingUser?.emailVerified) {
          const verificationToken = await generateVerificationToken(user.email);
          await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
          );
          throw new VerificationError('Confirmation email sent');
        }
      }

      const isLoggedIn = await auth();

      if (isLoggedIn) {
        throw new Error('You are already signed in!', {});
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

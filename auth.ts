import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { DefaultSession } from 'next-auth';
import { prisma } from './prisma/prisma';
import authConfig from './auth.config';
import { VerificationError } from './app/libs/errors';
import { sendVerificationEmail } from './app/libs/utils/mail';
import {
  getTwoFactorConfirmationByUserId,
  getUserById,
} from './app/libs/utils/auth';
import { generateVerificationToken } from './app/libs/utils/tokens';

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
      try {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: { emailVerified: new Date() },
        });
      } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
      }
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== 'credentials') return true;

      const isLoggedIn = await auth();

      if (isLoggedIn) {
        throw new Error('Вы уже авторизованы');
      }

      if (user.id && user.email) {
        const existingUser = await getUserById(user.id);

        if (!existingUser?.emailVerified) {
          const verificationToken = await generateVerificationToken(user.email);

          await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
          );

          throw new VerificationError(
            'Ссылка подтверждения отправлена на указанный email',
          );
        }

        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
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

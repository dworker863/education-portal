import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './app/libs/utils';
import { loginSchema } from './app/libs/validation';
import bcrypt from 'bcryptjs';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google,
    GitHub,
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }

          return null;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

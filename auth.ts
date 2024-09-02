import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const user = { id: '100', email: 'test@test.com', password: 'test' };

        if (
          credentials?.email === user.email &&
          credentials?.password === user.password
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
});

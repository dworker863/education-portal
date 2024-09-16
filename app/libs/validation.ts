import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Incorrect email address' }),
  password: z.string().min(1, { message: 'Passwrod is required' }),
});

export const registrationSchema = z
  .object({
    email: z.string().email({ message: 'Incorrect email address' }),
    username: z.optional(z.string()),
    password: z
      .string({ required_error: 'Name is required' })
      .min(6, { message: 'Password must contain at least 6 symbols' })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
        'Пароль должен содержать как буквы, так и цифры',
      ),
    confirmPassword: z.string(),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    birthDate: z.optional(z.string().date()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'],
  });

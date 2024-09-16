import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Incorrect email address' }),
  password: z.string(),
});

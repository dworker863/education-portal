import bcrypt from 'bcryptjs';
import { fileUpload, getUserByEmail } from '@/app/libs/utils';
import { registrationSchema } from '@/app/libs/validation';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const values = Object.fromEntries(formData.entries());

  const { data, ...parsedValues } = await registrationSchema.safeParse(values);

  if (parsedValues.success && data) {
    try {
      const isUserExists = await getUserByEmail(data.email);

      if (isUserExists) {
        return NextResponse.json({
          error: 'User with this email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const birthDate = new Date(values.birthDate as string).toISOString();
      const uploadResult = await fileUpload(data.file);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message });
      }

      await prisma.user.create({
        data: {
          email: data.email,
          name: data.username,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate,
          image: uploadResult,
        },
      });

      return NextResponse.json({ success: 'You successfully registred' });
    } catch (error) {
      return NextResponse.json({ error: 'Something went wrong' });
    }
  }

  return NextResponse.json({ error: parsedValues.error?.issues[0].message });
}

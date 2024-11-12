import bcrypt from 'bcryptjs';
import { registrationSchema } from '@/app/libs/validation';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { fileUpload, getUserByEmail } from '@/app/libs/utils/auth';
import { generateVerificationToken } from '@/app/libs/utils/tokens';
import { sendVerificationEmail } from '@/app/libs/utils/mail';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  console.log('SIGNUP ROUTE: ');

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

      let birthDate;
      let uploadResult;

      if (data.birthDate) {
        birthDate = new Date(values.birthDate as string).toISOString();
      }

      if (data.file) {
        uploadResult = await fileUpload(data.file);

        if (uploadResult instanceof Error) {
          return NextResponse.json({ error: uploadResult.message });
        }
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

      const verificationToken = await generateVerificationToken(data.email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return NextResponse.json({
        success: 'Confirmation email sent',
      });
    } catch (error) {
      return NextResponse.json({ error: 'Something went wrong' });
    }
  }

  return NextResponse.json({ error: parsedValues.error?.issues[0].message });
}

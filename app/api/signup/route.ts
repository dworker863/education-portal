import bcrypt from 'bcryptjs';
import { registrationSchema } from '@/app/libs/validation';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { fileUpload, getUserByEmail } from '@/app/libs/utils/auth';
import { generateVerificationToken } from '@/app/libs/utils/tokens';
import { sendVerificationEmail } from '@/app/libs/utils/mail';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData.entries());

  const valuesToParse = {
    ...values,
    birthDate: values.birthDate
      ? new Date(values.birthDate as string)
      : undefined,
  };

  const { data, ...parsedValues } = await registrationSchema.safeParse(
    valuesToParse,
  );

  if (parsedValues.success && data) {
    try {
      const isUserExists = await getUserByEmail(data.email);

      if (isUserExists) {
        return NextResponse.json({
          error: 'Пользователь с данным email уже существует',
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      let uploadResult;

      if (data.image) {
        uploadResult = await fileUpload(data.image);

        if (uploadResult instanceof Error) {
          return NextResponse.json({ error: uploadResult.message });
        }
      }

      await prisma.user.create({
        data: {
          email: data.email,
          name: data.username || null,
          password: hashedPassword,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          birthDate: data.birthDate || null,
          image: uploadResult || null,
        },
      });

      const verificationToken = await generateVerificationToken(data.email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return NextResponse.json({
        success: 'Ссылка подтверждения отправлена на указанный email',
      });
    } catch (error) {
      return NextResponse.json({ error: 'Что-то пошло не так' });
    }
  }

  return NextResponse.json({ error: parsedValues.error?.issues[0].message });
}

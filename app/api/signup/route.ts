import bcrypt from 'bcryptjs';
import { registrationSchema } from '@/app/libs/validation';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { fileUpload, getUserByEmail } from '@/app/libs/utils/auth';
import { generateVerificationToken } from '@/app/libs/utils/tokens';
import { sendVerificationEmail } from '@/app/libs/utils/mail';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const valuesToParse = {
      ...values,
      birthDate: values.birthDate
        ? new Date(values.birthDate as string)
        : undefined,
    };

    const existingUser = await getUserByEmail(values.email as string);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с данным email уже существует' },
        { status: 409 },
      );
    }

    const { data, ...parsedResult } = await registrationSchema.safeParse(
      valuesToParse,
    );

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues[0].message },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let uploadResult;

    if (data.image) {
      uploadResult = await fileUpload(data.image);

      if (uploadResult instanceof Error) {
        return NextResponse.json(
          { error: uploadResult.message },
          { status: 400 },
        );
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

    return NextResponse.json(
      {
        success: 'Ссылка подтверждения отправлена на указанный email',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

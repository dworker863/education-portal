import { fileUpload, getUserById } from '@/app/libs/utils/auth';
import { editProfileSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    const userId = values.id;

    if (!userId) {
      return NextResponse.json({ error: 'Не указан ID пользователя' }, { status: 400 });
    }

    const existingUser = await getUserById(userId as string);

    if (!existingUser) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 400 });
    }

    const { data, ...parsedResult } = await editProfileSchema.safeParse(values);

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.issues[0].message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const fieldsToCheck = ['username', 'firstName', 'lastName', 'birthDate'] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingUser[field]) {
        updatedData[field] = data[field];
      }
    });

    if (data.image) {
      const uploadResult = await fileUpload(data.image);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message }, { status: 400 });
      }

      updatedData.image = uploadResult;
    }

    await prisma.user.update({
      where: { id: userId as string },
      data: updatedData,
    });

    return NextResponse.json({ success: 'Профиль успешно изменен' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении профиля пользователя: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

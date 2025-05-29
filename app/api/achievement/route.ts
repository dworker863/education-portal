import { getAchievementById, getAchievementByName, getInvalidNames } from '@/app/libs/utils/achievements';
import { fileUpload } from '@/app/libs/utils/auth';
import { createAchievementSchema, editAchievementSchema } from '@/app/libs/validation';
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const values: Record<string, any> = {};

    if (formData.has('reward')) {
      try {
        const rewardData = JSON.parse(formData.get('reward') as string);
        const rewardIcon = formData.get('reward.icon');

        if (rewardIcon instanceof File) {
          rewardData.icon = rewardIcon;
        }

        values.reward = rewardData;
      } catch (error) {
        console.error('Ошибка парсинга reward:', error);
        return NextResponse.json({ error: 'Некорректный формат reward' }, { status: 400 });
      }
    }

    if (formData.has('criteria')) {
      try {
        values.criteria = JSON.parse(formData.get('criteria') as string);
      } catch (error) {
        console.error('Ошибка парсинга criteria:', error);
        return NextResponse.json({ error: 'Некорректный формат criteria' }, { status: 400 });
      }
    }

    for (const [key, value] of formData.entries()) {
      if (key !== 'reward' && key !== 'criteria' && key !== 'reward.icon') {
        if (key === 'startDate' || key === 'endDate') {
          values[key] = new Date(value as string);
        } else {
          values[key] = value;
        }
      }
    }

    const existingAchievement = await getAchievementByName(values.name as string);

    if (existingAchievement) {
      return NextResponse.json({ error: 'Достижение с таким названием уже существует' }, { status: 409 });
    }

    const { data, ...parsedResult } = await createAchievementSchema.safeParse(values);

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.issues[0].message }, { status: 400 });
    }

    if (
      (data?.criteria.type === 'COURSE_COMPLETION' || data?.criteria.type === 'COURSE_REGISTRATION') &&
      data?.criteria.courseNames &&
      data?.criteria.courseNames.length > 0
    ) {
      const invalidIds = await getInvalidNames('courses', data?.criteria.courseNames);

      if (invalidIds.length > 0) {
        return NextResponse.json(
          {
            error: `Курсов с ID ${invalidIds.join(', ')} не существует`,
            invalidCourseIds: invalidIds,
          },
          { status: 404 },
        );
      }
    }

    if (data?.criteria.type === 'COMBINATION') {
      for (const condition of data.criteria.conditions) {
        if (
          (condition.type === 'COURSE_COMPLETION' || condition.type === 'COURSE_REGISTRATION') &&
          condition.courseNames &&
          condition.courseNames.length > 0
        ) {
          const invalidIds = await getInvalidNames('courses', condition.courseNames);

          if (invalidIds.length > 0) {
            return NextResponse.json(
              {
                error: `Курсов с ID ${invalidIds.join(', ')} не существует`,
                invalidCourseIds: invalidIds,
              },
              { status: 404 },
            );
          }
        }
      }
    }

    let uploadIconResult;

    if (data.icon) {
      uploadIconResult = await fileUpload(data.icon);

      if (uploadIconResult instanceof Error) {
        return NextResponse.json({ error: uploadIconResult.message }, { status: 400 });
      }
    }

    let uploadRewardIconResult;

    if (data.reward.icon) {
      uploadRewardIconResult = await fileUpload(data.icon);
      console.log('ACHIEVEMENT POST DATA: ', data);

      if (uploadRewardIconResult instanceof Error) {
        return NextResponse.json({ error: uploadRewardIconResult.message }, { status: 400 });
      }
    }

    await prisma.achievement.create({
      data: {
        name: data.name,
        description: data.description,
        icon: uploadIconResult as string,
        criteria: data.criteria,
        reward: { ...data.reward, icon: uploadRewardIconResult },
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return NextResponse.json({ success: 'Достижение успешно добавлено' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при создании достижения: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.body;
    const formData = await request.formData();
    console.log('ACHIEVEMENT POST FORMDATA: ', formData);

    const values: Record<string, any> = {};

    if (formData.has('reward')) {
      try {
        const rewardData = JSON.parse(formData.get('reward') as string);
        const rewardIcon = formData.get('reward.icon');

        if (rewardIcon instanceof File) {
          rewardData.icon = rewardIcon;
        }

        values.reward = rewardData;
      } catch (error) {
        console.error('Ошибка парсинга reward:', error);
        return NextResponse.json({ error: 'Некорректный формат reward' }, { status: 400 });
      }
    }

    if (formData.has('criteria')) {
      try {
        values.criteria = JSON.parse(formData.get('criteria') as string);
      } catch (error) {
        console.error('Ошибка парсинга criteria:', error);
        return NextResponse.json({ error: 'Некорректный формат criteria' }, { status: 400 });
      }
    }

    for (const [key, value] of formData.entries()) {
      if (key !== 'reward' && key !== 'criteria' && key !== 'reward.icon') {
        if (key === 'startDate' || key === 'endDate') {
          values[key] = new Date(value as string);
        } else {
          values[key] = value;
        }
      }
    }

    const achievementId = values.id;

    console.log('ACHIEVEMENT POST DATA: ', values);

    if (!achievementId) {
      return NextResponse.json({ error: 'Не указан ID достижения' }, { status: 400 });
    }

    const existingAchievement = await getAchievementById(values.id as string);

    if (!existingAchievement) {
      return NextResponse.json({ error: 'Достижение не найдено' }, { status: 404 });
    }

    const { data, ...parsedResult } = editAchievementSchema.safeParse(values);

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error.issues[0].message }, { status: 400 });
    }

    if (
      (data?.criteria?.type === 'COURSE_COMPLETION' || data?.criteria?.type === 'COURSE_REGISTRATION') &&
      data?.criteria.courseNames &&
      data?.criteria.courseNames.length > 0
    ) {
      const invalidIds = await getInvalidNames('courses', data?.criteria.courseNames);

      if (invalidIds.length > 0) {
        return NextResponse.json(
          {
            error: `Курсов с ID ${invalidIds.join(', ')} не существует`,
            invalidCourseIds: invalidIds,
          },
          { status: 404 },
        );
      }
    }

    if (data?.criteria?.type === 'COMBINATION' && data.criteria.conditions) {
      for (const condition of data.criteria.conditions) {
        if (
          (condition.type === 'COURSE_COMPLETION' || condition.type === 'COURSE_REGISTRATION') &&
          condition.courseNames &&
          condition.courseNames.length > 0
        ) {
          const invalidIds = await getInvalidNames('courses', condition.courseNames);

          if (invalidIds.length > 0) {
            return NextResponse.json(
              {
                error: `Курсов с ID ${invalidIds.join(', ')} не существует`,
                invalidCourseIds: invalidIds,
              },
              { status: 404 },
            );
          }
        }
      }
    }

    const fieldsToCheck = ['name', 'description', 'criteria', 'reward', 'startDate', 'endDate'] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingAchievement[field]) {
        updatedData[field] = data[field];
      }
    });

    if (updatedData.name) {
      const achievement = await getAchievementByName(updatedData.name);

      if (achievement && achievementId !== achievement.id) {
        return NextResponse.json({ error: 'Достижение с таким названием уже существует' }, { status: 409 });
      }
    }

    if (data.icon) {
      const uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message }, { status: 400 });
      }

      updatedData.icon = uploadResult;
    }

    if (data.reward?.icon) {
      const uploadResult = await fileUpload(data.reward?.icon);
      // console.log('ACHIEVEMENT POST DATA: ', data);

      if (uploadResult instanceof Error) {
        return NextResponse.json({ error: uploadResult.message }, { status: 400 });
      }

      updatedData.reward.icon = uploadResult;
    }

    await prisma.achievement.update({
      where: { id: achievementId as string },
      data: updatedData,
    });

    return NextResponse.json({ success: 'Достижение успешно обновлено' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении достижения: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

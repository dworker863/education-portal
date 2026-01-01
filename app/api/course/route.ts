import { indexCourse } from '@/app/libs/search-engine/collections';
import { fileUpload } from '@/app/libs/server-actions/file-actions';
import { getCourseById, getCourseByName } from '@/app/libs/utils/courses';
import { createCourseSchema, editCourseSchema } from '@/app/libs/validation';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values: Record<string, any> = {};

    if (formData.has('sections')) {
      try {
        const sectionsData = JSON.parse(formData.get('sections') as string);
        console.log('Parsed sections data:', sectionsData);
        values.sections = sectionsData;
      } catch (error) {
        console.error('Ошибка парсинга sections:', error);
        return NextResponse.json(
          { error: 'Некорректный формат sections' },
          { status: 400 },
        );
      }
    }

    for (const [key, value] of formData.entries()) {
      if (key !== 'sections') {
        values[key] = value;
      }
    }

    const existingCourse = await getCourseByName(values.name as string);

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Курс с таким названием уже существует' },
        { status: 409 },
      );
    }

    const { data, ...parsedResult } = await createCourseSchema.safeParse({
      ...values,
      priceUSD: values.priceUSD ? Number(values.priceUSD) : null,
    });

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues[0].message },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let uploadResult;

    if (data.icon) {
      uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json(
          { error: uploadResult.message },
          { status: 400 },
        );
      }
    }

    const createdCourse = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        icon: uploadResult as string,
        priceUSD: data.priceUSD,
        certificateId: 'test',
        category: data.category,
      },
    });

    console.log('Received form data:', data.sections);

    if (data.sections && data.sections.length > 0) {
      const createdSections = await Promise.all(
        data.sections.map(async (section, index) => {
          return await prisma.courseSection.create({
            data: {
              title: section.name,
              order: section.order,
              courseId: createdCourse.id,
            },
          });
        }),
      );
    }

    await indexCourse(createdCourse);

    return NextResponse.json(
      { success: 'Курс успешно добавлен' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при создании курса: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values: Record<string, any> = {};

    if (formData.has('sections')) {
      try {
        const sectionsData = JSON.parse(formData.get('sections') as string);
        values.sections = sectionsData;
      } catch (error) {
        console.error('Ошибка парсинга sections:', error);
        return NextResponse.json(
          { error: 'Некорректный формат sections' },
          { status: 400 },
        );
      }
    }

    for (const [key, value] of formData.entries()) {
      if (key !== 'sections') {
        values[key] = value;
      }
    }

    const courseId = values.id;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Не указан ID курса' },
        { status: 400 },
      );
    }

    const existingCourse = await getCourseById(courseId as string);

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    const { data, ...parsedResult } = await editCourseSchema.safeParse({
      ...values,
      priceUSD: values.priceUSD ? Number(values.priceUSD) : null,
    });

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.issues[0].message },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const fieldsToCheck = [
      'name',
      'description',
      'priceUSD',
      'category',
    ] as const;

    const updatedData: Record<string, any> = {};

    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== existingCourse[field]) {
        updatedData[field] = data[field];
      }
    });

    if (updatedData.name) {
      const course = await getCourseByName(updatedData.name);

      if (course && courseId !== course.id) {
        return NextResponse.json(
          { error: 'Курс с таким названием уже существует' },
          { status: 409 },
        );
      }
    }

    if (data.icon) {
      const uploadResult = await fileUpload(data.icon);

      if (uploadResult instanceof Error) {
        return NextResponse.json(
          { error: uploadResult.message },
          { status: 400 },
        );
      }

      updatedData.icon = uploadResult;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId as string },
      data: updatedData,
    });

    if (data.sections && data.sections.length > 0) {
      const createdSections = await Promise.all(
        data.sections.map(async (section, index) => {
          return await prisma.courseSection.create({
            data: {
              title: section.name,
              order: section.order,
              courseId: updatedCourse.id,
            },
          });
        }),
      );
    }

    await indexCourse(updatedCourse);

    return NextResponse.json(
      { success: 'Курс успешно изменен' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при обновлении курса: ', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

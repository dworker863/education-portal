import { ICourse, IExercise } from '../interfaces/interfaces';
import { typesense } from './typesense';

export async function indexCourse(course: ICourse) {
  try {
    await typesense.collections('courses').documents().upsert({
      id: course.id,
      name: course.name,
      description: course.description,
      tags: course.tags,
    });

    console.log(`Курс ${course.id} добавлен в Typesense`);
  } catch (error) {
    console.error('Ошибка при добавлении курса в Typesense:', error);
  }
}

export async function deleteIndexCourse(courseId: string) {
  try {
    await typesense.collections('courses').documents(courseId).delete();
    console.log(`Курс ${courseId} удалён из Typesense`);
  } catch (error) {
    console.error('Ошибка при удалении курса из Typesense:', error);
  }
}

export async function indexExercise(exercise: IExercise) {
  try {
    await typesense.collections('exercises').documents().upsert({
      id: exercise.id,
      name: exercise.name,
      task: exercise.task,
      language: exercise.language,
      tags: exercise.tags,
    });
    console.log(`Упражнение ${exercise.id} добавлено в Typesense`);
  } catch (error) {
    console.error('Ошибка при добавлении упражнения в Typesense:', error);
  }
}

export async function deleteIndexExercise(exerciseId: string) {
  try {
    await typesense.collections('exercises').documents(exerciseId).delete();
    console.log(`Упражнение ${exerciseId} удалено из Typesense`);
  } catch (error) {
    console.error('Ошибка при удалении упражнения из Typesense:', error);
  }
}

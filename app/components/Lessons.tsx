'use client';

import React, { FC, memo, useContext, useEffect, useState } from 'react';
import LessonForm from './lesson-form';
import { ILessonPartial } from '../libs/interfaces/interfaces';
import Link from 'next/link';
import LessonFormWrapper from './lesson-form-wrapper';
import slugify from 'slugify';
import { ConfirmationContext } from './app-wrapper';
import { deleteLesson } from '../libs/server-actions/lessons-actions';
import { useRouter } from 'next/navigation';
import Spinner from './spinner';

type TLessonsProps = {
  courseId?: string;
  lessons?: ILessonPartial[];
  name: string;
};

const Lessons: FC<TLessonsProps> = ({ courseId, lessons, name }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDeleteLessonConfirm = async () => {
      try {
        if (
          confirmationContext?.modalType === 'confirmation' &&
          confirmationContext.confirmation &&
          confirmationContext?.confirmModalText ===
            'Вы уверены, что хотите удалить этот урок?'
        ) {
          if (!lessonId) {
            throw new Error('Не выбран урок для удаления');
          }

          setIsPending(true);

          await deleteLesson(lessonId);

          setIsPending(false);

          confirmationContext.setConfirmation(false);
          confirmationContext.setIsModalOpen(false);

          if (!mounted) return;

          router.refresh();
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        confirmationContext?.setConfirmation(false);
      }
    };

    loadDeleteLessonConfirm();
  }, [lessonId, confirmationContext, router]);

  const deleteLessonHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText(
      'Вы уверены, что хотите удалить этот урок?',
    );
  };

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <section>
          <LessonForm courseId={courseId} mode="create" />
          <ol className="px-5 list-decimal">
            {lessons &&
              lessons.length > 0 &&
              lessons.map((lesson) => {
                const lessonName = slugify(lesson.name, { locale: 'ru' });
                return (
                  <li key={lesson.id + lesson.name}>
                    <div className="mb-5">
                      <Link href={`/courses/${name}/${lessonName}`}>
                        {lesson.name}
                      </Link>
                      <LessonFormWrapper
                        lessonId={lesson.id}
                        deleteLessonHandler={deleteLessonHandler}
                        setLessonId={setLessonId}
                      />
                    </div>
                  </li>
                );
              })}
          </ol>
        </section>
      )}
    </>
  );
};

export default memo(Lessons);

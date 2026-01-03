'use client';

import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import {
  IExercise,
  ILesson,
  ILessonPartial,
  ITest,
} from '../libs/interfaces/interfaces';
import Video from './video';
import Exercise from './exercise';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Базовая тема
import 'prismjs/plugins/line-numbers/prism-line-numbers'; // Плагин для нумерации строк
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Стили для нумерации строк
import Test from './test';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import TestFormWrapper from './test-form-wrapper';
import ExerciseFormWrapper from './exercise-form-wrapper';
import { Button } from './button';
import { GoIssueClosed } from 'react-icons/go';
import { SlClose } from 'react-icons/sl';
import ErrorMessage from './error-message';
import { checkLessonCompletion } from '../libs/utils/lessons';
import { useSession } from 'next-auth/react';
import { checkCompletedExercises } from '../libs/utils/exercises';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { ConfirmationContext } from './app-wrapper';
import { checkLesson } from '../libs/server-actions/lessons-actions';
import { deleteExercise } from '../libs/server-actions/exercises-actions';
import Spinner from './spinner';
import { deleteTest } from '../libs/server-actions/tests-actions';
import { cn } from '../libs/cn';
import Image from 'next/image';

type TLessonCardProps = {
  lesson: ILesson;
  lessons: ILessonPartial[];
  exercises: IExercise[];
  tests: ITest[];
};

const LessonCard: FC<TLessonCardProps> = ({
  lesson,
  lessons,
  exercises,
  tests,
}) => {
  const confirmationContext = useContext(ConfirmationContext);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  console.log('Rendering LessonCard for lesson:', lesson.name);

  const content = useMemo(() => {
    if (!lesson?.content) return null;

    const cleanHTML = DOMPurify.sanitize(lesson.content, {
      ALLOWED_TAGS: [
        'div',
        'p',
        'img',
        'h1',
        'h2',
        'h3',
        'pre',
        'code',
        'ul',
        'li',
        'span',
        'br',
      ],
      ALLOWED_ATTR: ['alt', 'data-image-index', 'class'],
    });

    return parse(cleanHTML, {
      replace(domNode) {
        if (
          domNode.type === 'tag' &&
          domNode.name === 'img' &&
          domNode.attribs?.['data-image-index']
        ) {
          const index = Number(domNode.attribs['data-image-index']);
          const src = lesson.images?.[index]?.replaceAll('\\', '/');

          if (!src) return null;

          console.log('Rendering image with src:', domNode.attribs);

          return (
            <Image
              src={src}
              alt={domNode.attribs.alt || ''}
              width={Number(domNode.attribs['data-image-width'])}
              height={Number(domNode.attribs['data-image-height'])}
            />
          );
        }
      },
    });
  }, [lesson.content, lesson.images]);

  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const userId = session?.data?.user.id as string;

  const [isPassed, setIsPassed] = useState<'default' | 'success' | 'failed'>(
    'default',
  );
  const [passedTasks, setPassedTasks] = useState<string[]>([]);

  const tasks = useMemo(() => [...exercises, ...tests], [exercises, tests]);
  const completedTasks = useMemo(
    () => [
      ...(session?.data?.user.completedExercises || []),
      ...(session?.data?.user.completedTests || []),
    ],
    [
      session?.data?.user.completedExercises,
      session?.data?.user.completedTests,
    ],
  );
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const lessonIndex = lessons.findIndex(
    (partialLesson) => partialLesson.name === lesson.name,
  );

  console.log('Lesson index:', lesson, lessons);

  const nextLessonName =
    lessonIndex !== lessons.length - 1 &&
    slugify(lessons[lessonIndex + 1].name, { locale: 'ru' }) +
      '-' +
      lessons[lessonIndex + 1].id;

  const prevLessonName =
    lessonIndex !== 0 &&
    slugify(lessons[lessonIndex - 1].name, { locale: 'ru' }) +
      '-' +
      lessons[lessonIndex - 1].id;

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  useEffect(() => {
    const lessonCompletedExercises = checkCompletedExercises(
      completedTasks,
      tasks,
    );

    setPassedTasks(lessonCompletedExercises);
  }, [tasks, completedTasks]);

  useEffect(() => {
    let mounted = true;

    const loadDeleteExerciseConfirm = async () => {
      try {
        if (
          confirmationContext?.modalType === 'confirmation' &&
          confirmationContext.confirmation &&
          confirmationContext?.confirmModalText ===
            'Вы уверены, что хотите удалить это упражнение?'
        ) {
          if (!exerciseId) {
            throw new Error('Не выбрано упражнение для удаления');
          }

          setIsLoading(true);

          await deleteExercise(exerciseId);

          setIsLoading(false);

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

    loadDeleteExerciseConfirm();
  }, [exerciseId, confirmationContext, router]);

  useEffect(() => {
    let mounted = true;

    const loadDeleteTestConfirm = async () => {
      try {
        if (
          confirmationContext?.modalType === 'confirmation' &&
          confirmationContext.confirmation &&
          confirmationContext?.confirmModalText ===
            'Вы уверены, что хотите удалить этот тест?'
        ) {
          if (!testId) {
            throw new Error('Не выбран тест для удаления');
          }

          setIsLoading(true);

          await deleteTest(testId);
          confirmationContext.setConfirmation(false);
          confirmationContext.setIsModalOpen(false);

          setIsLoading(false);

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

    loadDeleteTestConfirm();
  }, [testId, confirmationContext, router]);

  const deleteExerciseHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText(
      'Вы уверены, что хотите удалить это упражнение?',
    );
  };

  const deleteTestHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText(
      'Вы уверены, что хотите удалить этот тест?',
    );
  };

  const checkLessonHandler = async () => {
    startTransition(async () => {
      try {
        const result = checkLessonCompletion(passedTasks, tasksIds);

        if (!result) {
          setIsPassed('failed');
          return;
        }

        await checkLesson(userId, lesson.courseId, lesson.id);

        setIsPassed('success');

        if (nextLessonName) {
          router.push(`./${nextLessonName}`);
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        setIsPassed('failed');
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex w-full gap-10 p-10 bg-customBlock text-primary-foreground rounded-lg">
          <div className={cn('w-2/4', tasks.length === 0 && 'w-full')}>
            <h2 className="mb-5 text-center">Теория</h2>
            <div className="mb-10">{content}</div>
            {lesson?.video && <Video src={lesson?.video} />}
            <div className="flex justify-between">
              {prevLessonName && (
                <Button
                  variant="custom"
                  onClick={() => router.push(`./${prevLessonName}`)}
                >
                  Предыдущий урок
                </Button>
              )}
              <Button
                variant={
                  isPassed === 'success'
                    ? 'customSuccess'
                    : isPassed === 'default'
                    ? 'custom'
                    : 'customFail'
                }
                onClick={() => checkLessonHandler()}
                disabled={isPending}
              >
                {isPassed === 'success' && (
                  <>
                    <GoIssueClosed className="mr-2" size={20} />
                    Пройдено
                  </>
                )}
                {isPassed === 'failed' && (
                  <>
                    <SlClose className="mr-2" size={20} />
                    Не Пройдено
                  </>
                )}
                {isPassed === 'default' &&
                  (nextLessonName ? 'Следующий урок' : 'Завершить курс')}
              </Button>
            </div>
            {isPassed === 'failed' && (
              <div className="mt-4">
                <ErrorMessage message="Чтобы перейти к следующему уроку Вы должны успешно выполнить 75% упражнений" />
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="w-2/4 pr-10">
              <h2 className="mb-5 text-center">Практика</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {tasks.length > 0 &&
                    tasks.map((task, index) => (
                      <CarouselItem key={task.id}>
                        <div className="p-1">
                          {'variants' in task ? (
                            <Test
                              key={index + task.name}
                              test={task}
                              passedTasks={passedTasks}
                              setPassedTasks={setPassedTasks}
                            />
                          ) : (
                            <Exercise
                              key={index + task.name}
                              exercise={task}
                              passedTasks={passedTasks}
                              setPassedTasks={setPassedTasks}
                            />
                          )}
                          <div className="flex justify-center mt-20">
                            {'variants' in task ? (
                              <TestFormWrapper
                                testId={task.id}
                                deleteTestHandler={deleteTestHandler}
                                setTestId={setTestId}
                              />
                            ) : (
                              <ExerciseFormWrapper
                                exerciseId={task?.id}
                                deleteExerciseHandler={deleteExerciseHandler}
                                setExerciseId={setExerciseId}
                              />
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                {tasks.length > 1 && (
                  <CarouselPrevious variant="customCircle" />
                )}
                {tasks.length > 1 && <CarouselNext variant="customCircle" />}
              </Carousel>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LessonCard;

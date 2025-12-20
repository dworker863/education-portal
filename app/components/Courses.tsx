'use client';

import { FC, useContext, useEffect, useState } from 'react';
import CourseForm from './course-form';
import { ICourse } from '../libs/interfaces/interfaces';
import CourseCard from './course-card';
import CourseFormWrapper from './course-form-wrapper';
import { ConfirmationContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import { deleteCourse } from '../libs/server-actions/courses-actions';
import Spinner from './spinner';

type TCoursesProps = {
  courses: ICourse[];
};

const Courses: FC<TCoursesProps> = ({ courses }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDeleteCourseConfirm = async () => {
      try {
        if (
          confirmationContext?.modalType === 'confirmation' &&
          confirmationContext.confirmation &&
          confirmationContext.confirmModalText ===
            'Вы уверены, что хотите удалить этот курс?'
        ) {
          if (!courseId) {
            throw new Error('Не выбран курс для удаления');
          }

          setIsPending(true);

          await deleteCourse(courseId);

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

    loadDeleteCourseConfirm();
  }, [courseId, confirmationContext, router]);

  const deleteCourseHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText(
      'Вы уверены, что хотите удалить этот курс?',
    );
  };

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <section className="py-5">
          <h1 className="text-center mb-10">Courses</h1>
          <CourseForm mode="create" />
          {courses.length > 0 &&
            courses.map((course) => (
              <div key={course.id}>
                <CourseCard key={course.id + course.name} course={course} />
                <CourseFormWrapper
                  courseId={course.id}
                  setCourseId={setCourseId}
                  deleteCourseHandler={deleteCourseHandler}
                />
              </div>
            ))}
          <br />
        </section>
      )}
    </>
  );
};

export default Courses;

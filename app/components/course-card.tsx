'use client';

import React, { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { ICourse } from '../libs/interfaces/interfaces';
import Image from 'next/image';
import { createCourseProgress } from '../libs/server-actions/progress-action';
import { useSession } from 'next-auth/react';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../libs/server-actions/achievements-actions';
import { ConfirmationContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import Spinner from './spinner';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const context = useContext(ConfirmationContext);
  const [isPending, setIsPending] = useState(false);
  const discounts = session?.data?.user.prizeTickets?.filter((ticket) => ticket.type === 'DISCOUNT');

  const courseCardClickHandler = useCallback(async () => {
    if (discounts && discounts.length > 0 && !context?.confirmation) {
      context?.setConfirmationModalType(true);
      context?.setIsModalOpen(true);
      return;
    }

    try {
      if (!user) {
        throw new Error('Пользователь не аутентифицирован');
      }

      await createCourseProgress(user.id, course.id);

      const achievements = await getAchievementByCriteriaType('COURSE_REGISTRATION');
      console.log('Achievements fetched:', achievements);

      await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, user.id);
        }),
      );

      router.push(`/courses/${course.name}`);
      setIsPending(false);
      context?.setConfirmation(false);
    } catch (error) {
      console.error('Ошибка при выполнении запроса: ', error);
    }
  }, [user, course.id, course.name, router, context, discounts]);

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <div
          className="flex flex-col w-full mb-5 p-5 rounded-lg bg-primary cursor-pointer"
          onClick={courseCardClickHandler}
        >
          <h2 className="mb-5 text-center text-xl uppercase">{course.name}</h2>
          <div className="flex gap-10 mb-8">
            <div className="w-[300px] flex-shrink-0">
              {course.icon && <Image src={course.icon.replace(/\\/gi, '/')} alt="avatar" width={300} height={300} />}
            </div>
            <div className="flex-grow">{course.description}</div>
          </div>
          <div className="flex justify-end">
            <span className="text-customSecondary text-lg font-semibold">
              {context?.confirmation && context.discount
                ? (course.priceUSD * context.discount) / 100 + '$'
                : course.priceUSD + '$'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CourseCard);

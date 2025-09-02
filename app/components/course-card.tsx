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
import { calculatePrizeWithDiscount } from '../libs/utils/prize';
import { updateUserMoney } from '../libs/server-actions/users-actions';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const context = useContext(ConfirmationContext);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const loadCourseWithDiscount = async () => {
      if (context?.confirmation) {
        setIsPending(true);

        try {
          if (!user) {
            throw new Error('Пользователь не аутентифицирован');
          }

          await createCourseProgress(user.id, course.id);

          const achievements = await getAchievementByCriteriaType('COURSE_REGISTRATION');

          await Promise.all(
            achievements.map((achievement) => {
              updateAchievementProgress(achievement.id, user.id);
            }),
          );

          const amountMoney = calculatePrizeWithDiscount(course.priceUSD, context.discount);

          await updateUserMoney(user.id, amountMoney);

          setIsPending(false);
          context?.setConfirmation(false);

          router.push(`/courses/${course.name}`);
        } catch (error) {
          console.error('Ошибка при выполнении запроса: ', error);
        }
      }
    };

    loadCourseWithDiscount();
  }, [user, course, router, context, context?.confirmation]);

  const courseCardClickHandler = useCallback(async () => {
    if (context?.discountTickets && context.discountTickets.length > 0 && !context?.confirmation) {
      context?.setConfirmationModalType(true);
      context?.setIsModalOpen(true);
      return;
    }

    try {
      setIsPending(true);

      if (!user) {
        throw new Error('Пользователь не аутентифицирован');
      }

      await createCourseProgress(user.id, course.id);

      const achievements = await getAchievementByCriteriaType('COURSE_REGISTRATION');

      await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, user.id);
        }),
      );

      await updateUserMoney(user.id, course.priceUSD);

      router.push(`/courses/${course.name}`);
      setIsPending(false);
    } catch (error) {
      console.error('Ошибка при выполнении запроса: ', error);
    }
  }, [user, course, router, context]);

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
            <span className="text-customSecondary text-lg font-semibold">{course.priceUSD + '$'}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CourseCard);

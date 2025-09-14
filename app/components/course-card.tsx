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
import { updateUserMoney } from '../libs/server-actions/users-actions';
import { calculatePrizeWithDiscount } from '../libs/utils/prize';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const confirmationContext = useContext(ConfirmationContext);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const loadCourseWithDiscount = async () => {
      try {
        if (user) {
          if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
            console.log('Course confirmed without discount', confirmationContext);

            if (user.moneyUSD < course.priceUSD) {
              throw new Error('Недостаточно средств на балансе');
            }

            setIsPending(true);

            const courseProgress = await createCourseProgress(user.id, course.id);

            const achievements = await getAchievementByCriteriaType('COURSE_REGISTRATION');

            const achievementProgress = await Promise.all(
              achievements.map((achievement) => {
                return updateAchievementProgress(achievement.id, user.id);
              }),
            );

            const achievementPrizeTickets = achievementProgress.filter((progress) => progress?.prizeTicket);

            const { moneyUSD } = await updateUserMoney(user.id, course.priceUSD);

            await session.update({
              ...session.data?.user,
              moneyUSD,
              coursesProgress: user.coursesProgress?.some((progress) => progress.courseId === course.id)
                ? user.coursesProgress
                : [...(user.coursesProgress ?? []), courseProgress],
              prizeTickets: [
                ...(user.prizeTickets ?? []),
                ...achievementPrizeTickets.map((progress) => progress?.prizeTicket),
              ],
            });

            router.push(`/courses/${course.name}`);
            setIsPending(false);
            confirmationContext?.setModalType(null);
            confirmationContext?.setConfirmation(false);
            return;
          }

          if (confirmationContext?.modalType === 'usage' && confirmationContext.confirmation) {
            setIsPending(true);

            const priceWithDiscount = calculatePrizeWithDiscount(course.priceUSD, confirmationContext?.discount);

            if (user.moneyUSD < priceWithDiscount) {
              throw new Error('Недостаточно средств на балансе');
            }

            const courseProgress = await createCourseProgress(user.id, course.id);

            const achievements = await getAchievementByCriteriaType('COURSE_REGISTRATION');

            await Promise.all(
              achievements.map((achievement) => {
                return updateAchievementProgress(achievement.id, user.id);
              }),
            );

            const { moneyUSD } = await updateUserMoney(user.id, priceWithDiscount);

            await session.update({
              ...session.data?.user,
              moneyUSD,
              coursesProgress: user.coursesProgress?.some((progress) => progress.courseId === course.id)
                ? user.coursesProgress
                : [...(user.coursesProgress ?? []), courseProgress],
            });

            router.push(`/courses/${course.name}`);
            setIsPending(false);
            confirmationContext?.setConfirmation(false);
            confirmationContext?.setModalType(null);
          }
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса: ', error);
      }
    };

    loadCourseWithDiscount();
  }, [course, confirmationContext, user]);

  const courseCardClickHandler = useCallback(async () => {
    console.log('Course Card Click Handler Invoked', user);
    // if (user && user?.coursesProgress?.some((progress) => progress.courseId === course.id)) {
    //   router.push(`/courses/${course.name}`);
    //   return;
    // }

    if (user?.prizeTickets && user?.prizeTickets.length > 0) {
      console.log('Course Card Clicked', user?.prizeTickets);
      confirmationContext?.setModalType('usage');
      confirmationContext?.setIsModalOpen(true);
      return;
    }

    if (!confirmationContext?.confirmation) {
      confirmationContext?.setModalType('confirmation');
      confirmationContext?.setIsModalOpen(true);
      return;
    }
  }, [confirmationContext, user, course, router]);

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

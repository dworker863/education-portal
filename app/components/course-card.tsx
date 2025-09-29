'use client';

import React, { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { ICourse } from '../libs/interfaces/interfaces';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ConfirmationContext } from './app-wrapper';
import { useRouter } from 'next/navigation';
import Spinner from './spinner';
import { calculatePrizeWithDiscount } from '../libs/utils/prize';
import { registerForCourse } from '../libs/server-actions/courses-actions';

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

            const { achievementProgress, courseProgress, moneyUSD } = await registerForCourse(user.id, course);

            const achievementPrizeTickets = achievementProgress.filter((progress) => progress?.prizeTicket);

            await session.update({
              ...session.data?.user,
              moneyUSD,
              coursesProgress: user.coursesProgress?.some((progress) => progress.courseId === course.id)
                ? user.coursesProgress
                : [...(user.coursesProgress ?? []), courseProgress],
              prizeTickets: [...(user.prizeTickets ?? []), ...achievementPrizeTickets],
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

            const { achievementProgress, courseProgress, moneyUSD } = await registerForCourse(
              user.id,
              course,
              priceWithDiscount,
            );

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
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        setIsPending(false);
        confirmationContext?.setConfirmation(false);
      }
    };

    loadCourseWithDiscount();
  }, [course, confirmationContext, user]);

  const courseCardClickHandler = useCallback(async () => {
    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }
    // if (user && user?.coursesProgress?.some((progress) => progress.courseId === course.id)) {
    //   router.push(`/courses/${course.name}`);
    //   return;
    // }

    if (user?.prizeTickets && user?.prizeTickets.length > 0) {
      confirmationContext?.setModalType('usage');
      confirmationContext?.setUsageModalTicketType('DISCOUNT');
      confirmationContext?.setUsageModalText(
        'Если вы хотите использовать призовой билет, выберите билет из списка и подтвердите действие.',
      );
      confirmationContext?.setIsModalOpen(true);
      return;
    }

    if (!confirmationContext?.confirmation) {
      confirmationContext?.setModalType('confirmation');
      confirmationContext?.setConfirmModalText(
        'Вы уверены, что хотите записаться на этот курс? С вашего баланса будет списана соответствующая сумма.',
      );
      confirmationContext?.setIsModalOpen(true);
      return;
    }
  }, [confirmationContext, user]);

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <div
          className="flex flex-col w-full mb-5 p-5 rounded-lg bg-customBlock cursor-pointer"
          onClick={courseCardClickHandler}
        >
          <h2 className="mb-5 text-center text-xl text-customAccent uppercase">{course.name}</h2>
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

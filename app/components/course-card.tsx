'use client';

import React, { FC } from 'react';
import { ICourse } from '../libs/interfaces/interfaces';
import Link from 'next/link';
import Image from 'next/image';
import { createCourseProgress } from '../libs/server-actions/progress-action';
import { useSession } from 'next-auth/react';
import { getAchievementByCriteriaType, updateAchievementProgress } from '../libs/server-actions/achievements-actions';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const handleClick = async () => {
    try {
      if (!user) {
        throw new Error('Пользователь не аутентифицирован');
      }

      await createCourseProgress(user.id, course.id);

      const achievements = await getAchievementByCriteriaType(['COURSE_REGISTRATION', 'COMBINATION']);

      await Promise.all(
        achievements.map((achievement) => {
          updateAchievementProgress(achievement.id, user.id);
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link href={`/courses/${course.name}`}>
      <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-primary" onClick={handleClick}>
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
    </Link>
  );
};

export default CourseCard;

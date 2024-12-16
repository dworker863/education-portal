import React, { FC } from 'react';
import { ICourse } from '../interfaces/interfaces';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import Image from 'next/image';
import { deleteCourse } from '../libs/server-actions/courses-actions';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  return (
    <Link href={`/course/${course.name}`}>
      <div className="flex flex-col w-full mb-5 p-5 rounded-lg bg-white text-black ">
        <h2 className="mb-5 text-center text-xl uppercase">{course.name}</h2>
        <div className="flex gap-10 mb-8">
          <div>
            {course.icon && (
              <Image
                src={course.icon.replace(/\\/gi, '/')}
                alt="avatar"
                width={300}
                height={300}
              />
            )}
          </div>
          <div>{course.description}</div>
        </div>
        <div className="flex justify-end">
          <span className="text-rose-600 text-lg font-bold">
            {course.priceUSD + '$'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

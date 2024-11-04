import React, { FC } from 'react';
import { ICourse } from '../interfaces/interfaces';
import Link from 'next/link';
import { deleteCourse } from '../libs/server-actions';
import { Button } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';

type TCourseCardProps = {
  course: ICourse;
};

const CourseCard: FC<TCourseCardProps> = ({ course }) => {
  return (
    <Link href={`/course/${course.name}`}>
      <div className="flex flex-col w-full">
        <h2>{course.name}</h2>
        <div className="flex">
          <div>
            {course.icon && (
              <Image
                src={course.icon.replace(/\\/gi, '/')}
                alt="avatar"
                width={100}
                height={100}
              />
            )}
          </div>
          <div>{course.description}</div>
        </div>
        <div className="flex justify-between">
          <Button
            className="ml-4"
            variant="secondary"
            onClick={async () => await deleteCourse(course.id)}
          >
            <FaTrash size={16} color="#c2410c" />
            <span className="ml-2">Delete</span>
          </Button>
          {course.priceUSD + '$'}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

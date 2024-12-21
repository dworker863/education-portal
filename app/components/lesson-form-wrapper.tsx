'use client';

import React, { FC, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteLesson } from '../libs/server-actions/lessons-actions';
import LessonForm from './lesson-form';
import { useRouter } from 'next/navigation';

type TLessonFormWrapperProps = {
  lessonId: string;
};

const LessonFormWrapper: FC<TLessonFormWrapperProps> = ({ lessonId }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
        <FaEdit size={22} color="#c2410c" />
        <span className="ml-2 text-">Редактировать</span>
      </Button>
      <Button
        className="ml-4"
        onClick={async () => {
          await deleteLesson(lessonId);
          router.refresh();
        }}
      >
        <FaTrash size={16} color="#c2410c" />
        <span className="ml-2 text-">Удалить</span>
      </Button>
      <div className="mt-5">
        {showEditForm && <LessonForm mode="edit" lessonId={lessonId} />}
      </div>
    </>
  );
};

export default LessonFormWrapper;

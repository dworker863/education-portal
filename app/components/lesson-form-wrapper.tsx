'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import LessonForm from './lesson-form';

type TLessonFormWrapperProps = {
  lessonId: string;
  deleteLessonHandler: () => void;
  setLessonId: Dispatch<SetStateAction<string | null>>;
};

const LessonFormWrapper: FC<TLessonFormWrapperProps> = ({ lessonId, deleteLessonHandler, setLessonId }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
        <FaEdit size={22} />
        <span className="ml-2">Редактировать</span>
      </Button>
      <Button
        variant="custom"
        className="ml-4"
        onClick={() => {
          setLessonId(lessonId);
          deleteLessonHandler();
        }}
      >
        <FaTrash size={16} />
        <span className="ml-2">Удалить</span>
      </Button>
      <div className="mt-5">{showEditForm && <LessonForm mode="edit" lessonId={lessonId} />}</div>
    </>
  );
};

export default LessonFormWrapper;

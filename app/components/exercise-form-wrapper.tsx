'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import { Button } from './button';

type TExerciseFormWrapperProps = {
  exerciseId: string;
  deleteExerciseHandler: () => void;
  setExerciseId: Dispatch<SetStateAction<string | null>>;
};

const ExerciseFormWrapper: FC<TExerciseFormWrapperProps> = ({ exerciseId, deleteExerciseHandler, setExerciseId }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div>
      <div className="flex mb-5">
        <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
          <FaEdit size={22} />
          <span className="ml-2">Редактировать</span>
        </Button>
        <Button
          variant="custom"
          className="ml-4"
          onClick={() => {
            setExerciseId(exerciseId);
            deleteExerciseHandler();
          }}
        >
          <FaTrash size={16} />
          <span className="ml-2">Удалить</span>
        </Button>
      </div>
      {showEditForm && <ExerciseForm mode="edit" exerciseId={exerciseId} />}
    </div>
  );
};

export default ExerciseFormWrapper;

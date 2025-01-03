'use client';

import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ExerciseForm from './exercise-form';
import { Button } from './button';

type TExerciseFormWrapperProps = {
  exerciseId: string;
};

const ExerciseFormWrapper: FC<TExerciseFormWrapperProps> = ({ exerciseId }) => {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div>
      <div className="flex mb-5">
        <Button className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
          <FaEdit size={22} color="#c2410c" />
          <span className="ml-2 text-">Редактировать</span>
        </Button>
        <Button
          className="ml-4"
          onClick={async () => {
            router.refresh();
          }}
        >
          <FaTrash size={16} color="#c2410c" />
          <span className="ml-2 text-">Удалить</span>
        </Button>
      </div>
      {showEditForm && <ExerciseForm mode="edit" exerciseId={exerciseId} />}
    </div>
  );
};

export default ExerciseFormWrapper;

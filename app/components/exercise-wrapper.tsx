'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
import { checkCompletedExercises } from '../libs/utils/exercises';
import { useSession } from 'next-auth/react';
import { IExercise } from '../libs/interfaces/interfaces';
import Exercise from './exercise';

type TExerciseWrapperProps = {
  exercise: IExercise;
};

const ExerciseWrapper: FC<TExerciseWrapperProps> = ({ exercise }) => {
  const session = useSession();

  const [passedTasks, setPassedTasks] = useState<string[]>([]);
  const completedTasks = useMemo(
    () => [...(session?.data?.user.completedExercises || []), ...(session?.data?.user.completedTests || [])],
    [session?.data?.user.completedExercises, session?.data?.user.completedTests],
  );

  useEffect(() => {
    const completedExercisesIds = checkCompletedExercises(completedTasks);

    setPassedTasks(completedExercisesIds);
  }, [completedTasks]);

  return (
    <div>
      <Exercise exercise={exercise} passedTasks={passedTasks} setPassedTasks={setPassedTasks} />
    </div>
  );
};

export default ExerciseWrapper;

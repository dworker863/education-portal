'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import { cn } from '../libs/cn';
import ExercisesTable from './exercises-table';
import { Button } from './button';
import ExercisesFilters from './exercises-filters';
import { IExercise } from '../libs/interfaces/interfaces';

type TExercisesProps = {
  exercises: IExercise[];
  mode: 'component' | 'page';
  showExercises?: boolean;
  setShowExercises?: Dispatch<SetStateAction<boolean>>;
};

const Exercises: FC<TExercisesProps> = ({ exercises, mode, showExercises, setShowExercises }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<IExercise[]>(exercises);

  return (
    <div
      className={cn(
        'flex flex-col w-svw h-svh ',
        {
          'absolute top-0 left-full -z-10 px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform':
            mode === 'component',
        },
        { '-translate-x-full': showExercises },
      )}
    >
      <h2 className="text-customSecondary">Exercises</h2>
      {filteredExercises && filteredExercises.length > 0 ? (
        <>
          <Button className="mr-auto my-4" variant="custom" onClick={() => setShowFilters(!showFilters)}>
            {!showFilters ? 'Фильтр' : 'Скрыть'}
          </Button>
          {showFilters && <ExercisesFilters exercises={exercises} filterExercises={setFilteredExercises} />}
          <ExercisesTable data={filteredExercises} setShowExercises={setShowExercises} />
        </>
      ) : (
        <>
          <p>Подходящих упражнений не найдено</p>
          <Button className="mr-auto my-4" variant="custom" onClick={() => setFilteredExercises(exercises)}>
            Сбросить фильтр
          </Button>
        </>
      )}
    </div>
  );
};

export default Exercises;

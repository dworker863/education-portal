'use client';

import { FC, useState } from 'react';
import { cn } from '../libs/cn';
import ExercisesTable from './exercises-table';
import { Button } from './button';
import ExercisesFilters from './exercises-filters';
import { IExercise } from '../libs/interfaces/interfaces';

type TExercisesProps = {
  exercises: IExercise[];
  showExercises: boolean;
};

const Exercises: FC<TExercisesProps> = ({ showExercises, exercises }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<IExercise[]>(exercises);

  return (
    <div
      className={cn(
        'absolute top-0 left-full -z-10 flex flex-col w-svw h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showExercises },
      )}
    >
      <h2 className="text-rose-600">Exercises</h2>
      {filteredExercises && filteredExercises.length > 0 ? (
        <>
          <Button className="mr-auto my-4 bg-orange-700" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            {!showFilters ? 'Фильтр' : 'Скрыть'}
          </Button>
          {showFilters && <ExercisesFilters exercises={exercises} filterExercises={setFilteredExercises} />}
          <ExercisesTable data={filteredExercises} />
        </>
      ) : (
        <>
          <p>Подходящих упражнений не найдено</p>
          <Button
            className="mr-auto my-4 bg-orange-700"
            variant="outline"
            onClick={() => setFilteredExercises(exercises)}
          >
            Сбросить фильтр
          </Button>
        </>
      )}
    </div>
  );
};

export default Exercises;

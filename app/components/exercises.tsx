import { FC, useState } from 'react';
import { cn } from '../libs/cn';
import ExercisesTable from './exercises-table';
import { Button } from './button';
import ExercisesFilters from './exercises-filters';
import { payments } from '../libs/utils/static-data';

type TExercisesProps = {
  showExercises: boolean;
};

const Exercises: FC<TExercisesProps> = ({ showExercises }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div
      className={cn(
        'absolute top-0 left-full -z-10 flex flex-col w-svw h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-full': showExercises },
      )}
    >
      <h2>Exercises</h2>
      <Button
        className="mr-auto my-4 bg-orange-700"
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
      >
        Фильтр
      </Button>
      {showFilters && <ExercisesFilters />}
      <ExercisesTable data={payments} />
    </div>
  );
};

export default Exercises;

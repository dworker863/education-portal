import { FC } from 'react';
import { cn } from '../libs/cn';

type TExercisesProps = {
  showExercises: boolean;
};

const Exercises: FC<TExercisesProps> = ({ showExercises }) => {
  return (
    <div
      className={cn(
        'absolute top-0 right-[-400px] -z-10 flex flex-col w-[400px] h-svh px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform',
        { '-translate-x-[400px]': showExercises },
      )}
    >
      Exercises
    </div>
  );
};

export default Exercises;

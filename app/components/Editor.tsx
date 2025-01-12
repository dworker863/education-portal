'use client';

import { FC, useEffect, useState } from 'react';
import { VM } from '@stackblitz/sdk';
import { IExercise } from '../interfaces/interfaces';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
  exercise: IExercise;
  vm: VM;
};

const Editor: FC<TEditorProps> = ({ userId, mode, exercise, vm }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    const exerciseFileName = exercise.name.split(' ').join('');
    const exercisePath = `${userId}/${exerciseFileName}.js`;
    const solutionPath = 'solution.js';
    const testPath = 'test.js';

    const runEmbed = async () => {
      try {
        if (isFirstLoad) {
          setTimeout(() => {
            vm.applyFsDiff({
              create: {
                [exercisePath]: exercise.code || '',
                [solutionPath]: exercise.solution,
                [testPath]: `import {solution} from '/${exercisePath}' ${exercise.test}`,
              },
              destroy: [],
            });

            setIsFirstLoad(false);
          }, 2000);
        }

        if (mode === 'exercise') {
          if (!isFirstLoad) {
            vm.editor.openFile(exercisePath);
          }

          if (isFirstLoad) {
            setTimeout(() => {
              vm.editor.openFile(exercisePath);
            }, 2000);
          }
        }

        if (mode === 'solution') {
          vm.editor.openFile(solutionPath);
        }
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();
  }, [userId, mode, exercise, vm, isFirstLoad]);
  return <></>;
};

export default Editor;

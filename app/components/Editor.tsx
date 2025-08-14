'use client';

import { FC, useEffect, useState } from 'react';
import { VM } from '@stackblitz/sdk';
import { IExercise } from '../libs/interfaces/interfaces';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
  exercise: IExercise;
  vm: VM;
};

const Editor: FC<TEditorProps> = ({ userId, mode, exercise, vm }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timers: any[] = [];
    const exerciseFileName = exercise.name.split(' ').join('');
    const exercisePath = `${userId}/${exerciseFileName}.js`;
    const solutionPath = 'solution.js';
    const testPath = `test.js`;

    const loadEmbedProject = async () => {
      try {
        if (isFirstLoad) {
          const id = setTimeout(() => {
            if (!mounted) return;
            vm.applyFsDiff({
              create: {
                [exercisePath]: exercise.code || '',
                [solutionPath]: exercise.solution,
                [testPath]: `import {solution} from '/${exercisePath}';
                import { assert } from 'chai';

                const exerciseName = '${exercise.name}';
                const userId = '${userId}';
                ${exercise.test}`,
              },
              destroy: [],
            });

            setIsFirstLoad(false);
          }, 2000);

          timers.push(id);
        }

        if (mode === 'exercise') {
          if (!isFirstLoad) {
            if (!mounted) return;
            vm.editor.openFile(exercisePath);
          }

          if (isFirstLoad) {
            const id = setTimeout(() => {
              if (!mounted) return;
              vm.editor.openFile(exercisePath);
            }, 2000);
            timers.push(id);
          }
        }

        if (mode === 'solution') {
          const id = setTimeout(() => {
            vm.editor.openFile(solutionPath);
          }, 2000);
          timers.push(id);
        }
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    loadEmbedProject();

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [userId, mode, exercise, vm, isFirstLoad]);
  return <></>;
};

export default Editor;

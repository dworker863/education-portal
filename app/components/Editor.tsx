'use client';

import { FC, useEffect } from 'react';
import sdk, { VM } from '@stackblitz/sdk';
import { IExercise } from '../interfaces/interfaces';
import { Button } from './button';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
  exercise: IExercise;
  vm: VM;
};

const Editor: FC<TEditorProps> = ({ userId, mode, exercise, vm }) => {
  useEffect(() => {
    const exercisePath = `${userId}/lesson1.js`;
    const solutionPath = 'solution.js';

    const runEmbed = async () => {
      try {
        // Встраиваем проект

        if (mode === 'exercise') {
          setTimeout(() => {
            // Then update the VM's file system :)
            vm.applyFsDiff({
              create: {
                [exercisePath]: exercise.code || '',
              },
              destroy: [],
            });

            vm.editor.openFile(exercisePath);
          }, 2000);
        }

        if (mode === 'solution') {
          vm.applyFsDiff({
            create: {
              [solutionPath]: exercise.solution,
            },
            destroy: [],
          });

          setTimeout(() => {
            vm.editor.openFile(solutionPath);
          }, 2000);
        }
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();
  }, [userId, mode, exercise]);
  return <></>;
};

export default Editor;

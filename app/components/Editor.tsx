'use client';

import { FC, useEffect } from 'react';
import sdk from '@stackblitz/sdk';
import { IExercise } from '../interfaces/interfaces';
import { Button } from './button';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
  exercise: IExercise;
};

const Editor: FC<TEditorProps> = ({ userId, mode, exercise }) => {
  useEffect(() => {
    const exercisePath = `${userId}/lesson1.js`;
    const solutionPath = 'solution.js';

    const runEmbed = async () => {
      try {
        // Встраиваем проект

        if (mode === 'exercise') {
          sdk
            .embedProjectId('test', 'education-portal-lesson-test')
            .then((vm) => {
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
            });
        }

        if (mode === 'solution') {
          console.log('SOLUTION: ', solutionPath);

          sdk
            .embedProjectId('test', 'education-portal-lesson-test')
            .then((vm) => {
              setTimeout(() => {
                vm.editor.openFile(solutionPath);
              }, 2000);
            });
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

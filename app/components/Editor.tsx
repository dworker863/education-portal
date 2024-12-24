'use client';

import { FC, useEffect } from 'react';
import sdk from '@stackblitz/sdk';
import { IExercise } from '../interfaces/interfaces';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
  exercise: IExercise;
};

const Editor: FC<TEditorProps> = ({ userId, mode, exercise }) => {
  useEffect(() => {
    const runEmbed = async () => {
      try {
        // Встраиваем проект
        const path = `${userId}/lesson.ts`;

        if (mode === 'exercise') {
          sdk
            .embedProjectId('test', 'dworker-exercise')
            .then((vm) => {
              setTimeout(() => {
                // Then update the VM's file system :)
                vm.applyFsDiff({
                  create: {
                    [path]: exercise.code || '',
                  },
                  destroy: [],
                });

                vm.editor.openFile(path);
              }, 2000);
            })
            .then((vm) => {});
        }

        if (mode === 'solution') {
          const path = '/solution.ts';

          sdk.embedProjectId('test', 'dworker-solution').then((vm) => {
            vm.editor.openFile(path);
          });
        }
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();

    const simulateCtrlS = () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 's', // Буква "S"
        code: 'KeyS', // Код клавиши "S"
        ctrlKey: true, // Удержание Ctrl
        bubbles: true, // Чтобы событие распространялось
        cancelable: true, // Чтобы событие можно было предотвратить
      });

      const keyupEvent = new KeyboardEvent('keyup', {
        key: 's',
        code: 'KeyS',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });

      // Отправляем события
      document.dispatchEvent(keydownEvent);
      document.dispatchEvent(keyupEvent);
      console.log('EVENT SIMULATION DONE');
    };

    // Эмулируем Ctrl+S через 2 секунды
    const timer = setTimeout(simulateCtrlS, 2000);

    return () => clearTimeout(timer);
  }, [userId, mode, exercise]);
  return <div></div>;
};

export default Editor;

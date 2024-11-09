'use client';

import { FC, useEffect } from 'react';
import sdk from '@stackblitz/sdk';

type TEditorProps = {
  userId: string;
  mode: 'exercise' | 'solution';
};

const Editor: FC<TEditorProps> = ({ userId, mode }) => {
  console.log(mode);

  useEffect(() => {
    const runEmbed = async () => {
      try {
        // Встраиваем проект

        if (mode === 'exercise') {
          const vm = await sdk.embedProjectId('test', 'dworker-exercise');
          const path = `${userId}/lesson.ts`;

          // Получаем зависимости проекта
          // const deps = await vm.getDependencies();

          // Применяем изменения к файловой системе
          await vm.applyFsDiff({
            create: {
              [path]: 'console.log("Exercise!")',
            },
            destroy: [],
          });

          // await vm.editor.setCurrentFile(path);
          await vm.editor.openFile(path);
          await vm.editor.setView('preview');
        }

        if (mode === 'solution') {
          const vm = await sdk.embedProjectId('test', 'dworker-solution');
          const path = '/solution.ts';

          // await vm.editor.setCurrentFile(path);
          await vm.editor.openFile(path);
        }
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();
  }, [userId, mode]);
  return <div></div>;
};

export default Editor;

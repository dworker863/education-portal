'use client';

import { FC, useEffect } from 'react';
import sdk from '@stackblitz/sdk';

type TEditorProps = {
  userId: string;
};

const Editor: FC<TEditorProps> = ({ userId }) => {
  useEffect(() => {
    const runEmbed = async () => {
      try {
        // Встраиваем проект
        const vm = await sdk.embedProjectId('test', 'dworker-test');
        const path = `${userId}/lesson.tsx`;

        // Получаем зависимости проекта
        // const deps = await vm.getDependencies();

        // Применяем изменения к файловой системе
        await vm.applyFsDiff({
          create: {
            [path]: 'console.log("Hello!")',
            // 'deps.txt': JSON.stringify(deps, null, 2),
          },
          destroy: [],
        });

        await vm.editor.setCurrentFile(path);

        await vm.editor.openFile(path);
      } catch (error) {
        console.error('Error embedding project:', error);
      }
    };

    runEmbed();
  }, [userId]);
  return <div></div>;
};

export default Editor;

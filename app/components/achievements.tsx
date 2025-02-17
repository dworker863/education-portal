'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import { cn } from '../libs/cn';
import { IAchievement } from '../libs/interfaces/interfaces';
import DataTable from './data-table';
import { Button } from './button';
import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import AchievementsFilters from './achievements-filters';

type TAchievementsProps = {
  mode: 'component' | 'page';
  showAchievements?: boolean;
  setShowAchievements?: Dispatch<SetStateAction<boolean>>;
  achievements: IAchievement[];
};

const Achievements: FC<TAchievementsProps> = ({ mode, showAchievements, setShowAchievements, achievements }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredAchievements, setFilteredAchievements] = useState<IAchievement[]>(achievements);

  const columns: ColumnDef<IAchievement>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button variant="custom" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Название
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'task',
      header: ({ column }) => {
        return (
          <Button variant="custom" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Задание
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'language',
      header: ({ column }) => {
        return (
          <Button variant="custom" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Язык программирования
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'requiredRank',
      header: ({ column }) => {
        return (
          <Button variant="custom" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Уровень
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => {
        return (
          <Button variant="custom" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Баллы
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col w-svw h-svh ',
        {
          'absolute top-0 left-full -z-10 px-12 py-5 bg-primary transition-transform duration-500 ease-in-out transform':
            mode === 'component',
        },
        { '-translate-x-full': showAchievements },
      )}
    >
      {mode === 'component' && <h2 className="text-customSecondary">Achievements</h2>}
      {filteredAchievements && filteredAchievements.length > 0 ? (
        <>
          <Button className="mr-auto my-4" variant="custom" onClick={() => setShowFilters(!showFilters)}>
            {!showFilters ? 'Фильтр' : 'Скрыть'}
          </Button>
          {showFilters && (
            <AchievementsFilters achievements={achievements} filterAchievements={setFilteredAchievements} />
          )}
          <DataTable
            mode="achievements"
            data={filteredAchievements}
            setShowComponent={setShowAchievements}
            columns={columns}
          />
        </>
      ) : (
        <>
          <p>Подходящих достижений не найдено</p>
          <Button className="mr-auto my-4" variant="custom" onClick={() => setFilteredAchievements(achievements)}>
            Сбросить фильтр
          </Button>
        </>
      )}
    </div>
  );
};

export default Achievements;

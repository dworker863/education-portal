'use client';

import { FC, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteAchievement } from '../libs/server-actions/achievements-actions';
import { useRouter } from 'next/navigation';
import AchievementsForm from './achievement-form';

type TAchievementFormWrapperProps = {
  achievementId: string;
};

const AchievementFormWrapper: FC<TAchievementFormWrapperProps> = ({ achievementId }) => {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
          <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
            <FaEdit size={22} />
            <span className="ml-2">Редактировать</span>
          </Button>
          <Button
            variant="custom"
            className="ml-4"
            onClick={async () => {
              await deleteAchievement(achievementId);
              router.refresh();
            }}
          >
            <FaTrash size={16} />
            <span className="ml-2">Удалить</span>
          </Button>
        </div>
      </div>
      {showEditForm && <AchievementsForm mode="edit" achievementId={achievementId} />}
    </>
  );
};

export default AchievementFormWrapper;

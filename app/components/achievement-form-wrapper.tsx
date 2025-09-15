'use client';

import { FC, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteAchievement } from '../libs/server-actions/achievements-actions';
import { useRouter } from 'next/navigation';
import AchievementsForm from './achievement-form';
import { ConfirmationContext } from './app-wrapper';

type TAchievementFormWrapperProps = {
  achievementId: string;
};

const AchievementFormWrapper: FC<TAchievementFormWrapperProps> = ({ achievementId }) => {
  const confirmationContext = useContext(ConfirmationContext);
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDeleteAchievementConfirm = async () => {
      try {
        if (confirmationContext?.modalType === 'confirmation' && confirmationContext.confirmation) {
          await deleteAchievement(achievementId);
          confirmationContext.setConfirmation(false);
          confirmationContext.setIsModalOpen(false);

          if (!mounted) return;

          router.refresh();
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        confirmationContext?.setModalType('notification');
        confirmationContext?.setNotificationModalText((error as Error).message);
        confirmationContext?.setIsModalOpen(true);
        confirmationContext?.setConfirmation(false);
      }
    };

    loadDeleteAchievementConfirm();
  }, [achievementId, confirmationContext]);

  const deleteAchievementHandler = async () => {
    confirmationContext?.setModalType('confirmation');
    confirmationContext?.setIsModalOpen(true);
    confirmationContext?.setConfirmModalText('Вы уверены, что хотите удалить это достижение?');
  };

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
          <Button variant="custom" onClick={() => setShowEditForm(!showEditForm)}>
            <FaEdit size={22} />
            <span className="ml-2">Редактировать</span>
          </Button>
          <Button variant="custom" className="ml-4" onClick={deleteAchievementHandler}>
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

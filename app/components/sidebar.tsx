'use client';

import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Button } from './button';
import { TfiPencilAlt } from 'react-icons/tfi';
import { GrAchievement } from 'react-icons/gr';
import Profile from './profile';
import Achievements from './achievements';
import Exercises from './exercises';
import { IExercise } from '../libs/interfaces/interfaces';
import { getAllExercises } from '../libs/server-actions/exercises-actions';

const Sidebar = () => {
  const [exercises, setExercises] = useState<IExercise[] | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    getAllExercises()
      .then((data) => {
        setExercises(data);
      })
      .catch((error) => {
        console.log('Что-то пошло не так');
        console.log(error);
      });
  }, []);

  const showProfileHandler = () => {
    setShowProfile(!showProfile);
    setShowExercises(false);
    setShowAchievements(false);
  };

  const showExercisesHandler = () => {
    setShowExercises(!showExercises);
    setShowProfile(false);
    setShowAchievements(false);
  };

  const showAchievementsHandler = () => {
    setShowAchievements(!showAchievements);
    setShowExercises(false);
    setShowProfile(false);
  };

  return (
    <div className="fixed right-0">
      <Profile showProfile={showProfile} />
      {exercises && exercises?.length > 0 && <Exercises exercises={exercises} showExercises={showExercises} />}
      <Achievements showAchievements={showAchievements} />
      <div className="flex flex-col items-center w-18 h-svh py-2 bg-primary">
        <Button className="mb-1" onClick={showProfileHandler}>
          <FaUser className="hover:scale-125" size={22} color="#E11D48" />
        </Button>
        <Button className="mb-2" onClick={showExercisesHandler}>
          <TfiPencilAlt className="hover:scale-125" size={22} color="#E11D48" />
        </Button>
        <Button className="mb-1" onClick={showAchievementsHandler}>
          <GrAchievement className="hover:scale-125" size={22} color="#E11D48" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

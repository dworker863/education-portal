'use client';

import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Button } from './button';
import { TfiPencilAlt } from 'react-icons/tfi';
import { GrAchievement } from 'react-icons/gr';
import Profile from './profile';
import Achievements from './achievements';
import Exercises from './exercises';

const Sidebar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

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
      <Exercises showExercises={showExercises} />
      <Achievements showAchievements={showAchievements} />
      <div className="flex flex-col items-center w-18 h-svh py-2 bg-primary">
        <Button className="mb-1" onClick={showProfileHandler}>
          <FaUser className="hover:scale-125" size={22} color="#E11D48" />
        </Button>
        <Button className="mb-2" onClick={showExercisesHandler}>
          <TfiPencilAlt className="hover:scale-125" size={22} color="#E11D48" />
        </Button>
        <Button className="mb-1" onClick={showAchievementsHandler}>
          <GrAchievement
            className="hover:scale-125"
            size={22}
            color="#E11D48"
          />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

'use client';

import { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Button } from './button';
import { TfiPencilAlt } from 'react-icons/tfi';
import { GrAchievement } from 'react-icons/gr';
import Profile from './profile';
import Achievements from './achievements';
import Exercises from './exercises';
import { AchievementsContext, ExercisesContext } from './app-wrapper';

const Sidebar = () => {
  const exercises = useContext(ExercisesContext);
  const achievements = useContext(AchievementsContext);

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
    <div className="fixed right-0 z-50">
      <Profile mode="component" showProfile={showProfile} />
      {exercises && exercises?.length > 0 && (
        <Exercises
          exercises={exercises}
          mode="component"
          showExercises={showExercises}
          setShowExercises={setShowExercises}
        />
      )}
      {achievements && achievements.length > 0 && (
        <Achievements
          achievements={achievements}
          mode="component"
          showAchievements={showAchievements}
          setShowAchievements={setShowAchievements}
        />
      )}
      <div className="flex flex-col items-center w-18 h-svh py-2 bg-primary">
        <Button className="mb-1" onClick={showProfileHandler}>
          <FaUser className="text-customSecondary hover:scale-125" size={22} />
        </Button>

        <Button className="mb-2" onClick={showExercisesHandler}>
          <TfiPencilAlt className="text-customSecondary hover:scale-125" size={22} />
        </Button>
        <Button className="mb-1" onClick={showAchievementsHandler}>
          <GrAchievement className="text-customSecondary hover:scale-125" size={22} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

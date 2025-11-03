'use client';

import { useContext, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Button } from './button';
import { TfiPencilAlt } from 'react-icons/tfi';
import { GrAchievement } from 'react-icons/gr';
import { IoChatboxEllipses } from 'react-icons/io5';
import Profile from './profile';
import Achievements from './achievements';
import Exercises from './exercises';
import { AchievementsContext, ExercisesContext } from './app-wrapper';
import Chat from './chat';

const Sidebar = () => {
  const exercises = useContext(ExercisesContext);
  const achievements = useContext(AchievementsContext);

  const [showProfile, setShowProfile] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  const showChatHandler = () => {
    setShowChat(!showChat);
    setShowExercises(false);
    setShowProfile(false);
    setShowAchievements(false);
  };

  return (
    <div className="fixed right-0 z-50 h-full">
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
      <Chat showChat={showChat} />
      <div className="flex flex-col items-center w-18 h-full py-2 bg-primary">
        <Button className="mb-1" onClick={showProfileHandler}>
          <FaUser className="text-customSecondary hover:scale-125" size={22} />
        </Button>

        <Button className="mb-2" onClick={showExercisesHandler}>
          <TfiPencilAlt className="text-customSecondary hover:scale-125" size={22} />
        </Button>
        <Button className="mb-1" onClick={showAchievementsHandler}>
          <GrAchievement className="text-customSecondary hover:scale-125" size={22} />
        </Button>
        <Button className="fixed bottom-5 mb-1" onClick={showChatHandler}>
          <IoChatboxEllipses className="text-customSecondary hover:scale-125" size={22} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

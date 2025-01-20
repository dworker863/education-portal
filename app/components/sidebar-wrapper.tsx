'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Profile from './profile';

const SidebarWrapper = () => {
  const [showProfile, setShowProfile] = useState(false);

  const showProfileHandler = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="fixed right-0 z-20">
      <Profile showProfile={showProfile} />
      <Sidebar clickHandler={showProfileHandler} />
    </div>
  );
};

export default SidebarWrapper;

import React, { useState } from 'react';
import Icon, { IconName } from './Icon';
import Tooltip from './Tooltip';
import { User } from '../types';
import NotificationIcon from './NotificationIcon';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: 'feed' | 'leaderboard' | 'duel') => void;
  onProfileClick: (user: User) => void;
  activeView: 'feed' | 'leaderboard' | 'profile' | 'duel';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onProfileClick, activeView, theme, toggleTheme, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const NavButton: React.FC<{ view: 'feed' | 'leaderboard' | 'duel', icon: IconName, text: string }> = ({ view, icon, text }) => (
    <Tooltip text={text}>
      <button
        onClick={() => onNavigate(view)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 font-semibold text-sm ${
          activeView === view
            ? 'bg-brand-500 text-gray-900'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        <Icon name={icon} className="w-5 h-5 flex-shrink-0" />
        <span>{text}</span>
      </button>
    </Tooltip>
  );

  const MobileNavButton: React.FC<{ onClick: () => void, icon: IconName, text: string, isActive?: boolean }> = ({ onClick, icon, text, isActive }) => {
    const handleClick = () => {
      onClick();
      setIsMenuOpen(false);
    };

    return (
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 font-semibold text-base ${
          isActive
            ? 'bg-brand-500/20 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
            : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <Icon name={icon} className="w-6 h-6 flex-shrink-0" />
        <span>{text}</span>
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#F8F7F4]/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('feed')}>
              <img src="/humor.png" alt="Humor Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter">
                Humor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden sm:flex items-center gap-2">
                <NavButton view="feed" icon="home" text="Feed" />
                <NavButton view="leaderboard" icon="leaderboard" text="Leaderboard" />
                <NavButton view="duel" icon="swords" text="Roast Battle" />
              </nav>
              <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex items-center gap-4">
                  <Tooltip text={`Toggle to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Toggle theme"
                    >
                      <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
                    </button>
                  </Tooltip>
                  <NotificationIcon 
                    onClick={() => setIsNotificationPanelOpen(true)}
                    className="hidden sm:block"
                  />
                  <div className="relative">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="block rounded-full transition-opacity hover:opacity-80">
                       <img src={currentUser.profilePicUrl || `https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Your profile" className="w-9 h-9 rounded-full"/>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-100 py-1 z-30">
                        <button onClick={() => { onProfileClick(currentUser); setIsProfileOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Icon name="user" className="w-4 h-4"/> My Profile
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Icon name="log-out" className="w-4 h-4"/> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:hidden flex items-center gap-2">
                <NotificationIcon 
                  onClick={() => setIsNotificationPanelOpen(true)}
                />
                <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Open menu">
                  <Icon name="menu" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-30" aria-modal="true">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[#F8F7F4] dark:bg-gray-900 p-4 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <img src={currentUser.profilePicUrl || `https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Your profile" className="w-9 h-9 rounded-full"/>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{currentUser.handle}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close menu">
                <Icon name="x" className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 pt-4 flex-grow">
              <MobileNavButton onClick={() => onNavigate('feed')} icon="home" text="Feed" isActive={activeView==='feed'} />
              <MobileNavButton onClick={() => onProfileClick(currentUser)} icon="user" text="My Profile" isActive={activeView==='profile'} />
              <MobileNavButton onClick={() => onNavigate('leaderboard')} icon="leaderboard" text="Leaderboard" isActive={activeView==='leaderboard'} />
              <MobileNavButton onClick={() => onNavigate('duel')} icon="swords" text="Roast Battle" isActive={activeView==='duel'} />
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-300 pl-2">Toggle Theme</span>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
                  <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
                </button>
              </div>
              <button onClick={onLogout} className="w-full flex items-center gap-2 p-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg font-bold">
                <Icon name="log-out" className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
};

export default Header;
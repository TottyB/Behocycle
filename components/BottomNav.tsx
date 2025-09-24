
import React from 'react';
import type { AppState } from '../types';
import { AppState as AppStateEnum } from '../types';
import { CalendarIcon, ChartIcon, CogIcon, SparklesIcon, UserIcon } from './common/Icons';

interface BottomNavProps {
  activeView: AppState;
  setActiveView: (view: AppState) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-primary-600 dark:text-primary-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: AppStateEnum.Calendar, label: 'Calendar', icon: <CalendarIcon className="w-6 h-6" /> },
    { id: AppStateEnum.Analytics, label: 'Analytics', icon: <ChartIcon className="w-6 h-6" /> },
    { id: AppStateEnum.Insights, label: 'Insights', icon: <SparklesIcon className="w-6 h-6" /> },
    { id: AppStateEnum.Profile, label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
    { id: AppStateEnum.Settings, label: 'Settings', icon: <CogIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-t-lg">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

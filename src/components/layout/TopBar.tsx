import React, { useState } from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Screen } from '../../types';

interface TopBarProps {
  title: string;
  onNavigate: (screen: Screen) => void;
}

import { Logo } from '../ui/Logo';

export const TopBar: React.FC<TopBarProps> = ({ title, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="absolute top-0 left-0 right-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title === 'Smart Lecture Notes' ? 'Cornelius' : title}
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={() => onNavigate('notifications')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
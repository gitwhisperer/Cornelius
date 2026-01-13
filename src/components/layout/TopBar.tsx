import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Screen } from '../../types';
import { motion } from 'motion/react';

interface TopBarProps {
  title: string;
  onNavigate: (screen: Screen) => void;
}

import { Logo } from '../ui/Logo';

export const TopBar: React.FC<TopBarProps> = ({ title, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [notificationCount] = React.useState(3);

  return (
    <header className="flex-shrink-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Logo className="w-7 h-7" />
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md -z-10" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              {title === 'Smart Lecture Notes' ? 'Cornelius' : title}
            </h1>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
              aria-label="Toggle theme"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-[18px] h-[18px] text-amber-400" />
                )}
              </motion.div>
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => onNavigate('notifications')}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
              aria-label="Notifications"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile */}
            <motion.button
              onClick={() => onNavigate('profile')}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
              aria-label="Profile"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <User className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
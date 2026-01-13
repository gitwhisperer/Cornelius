import React from 'react';
import { Home, BookOpen, FileText, Calendar, MessageCircle, User } from 'lucide-react';
import type { Screen } from '../../types';
import { motion } from 'motion/react';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { id: 'home' as Screen, icon: Home, label: 'Home' },
  { id: 'lectures' as Screen, icon: BookOpen, label: 'Lectures' },
  { id: 'tasks' as Screen, icon: Calendar, label: 'Tasks' },
  { id: 'chat' as Screen, icon: MessageCircle, label: 'AI' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav
      className="flex-shrink-0 w-full z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-[440px] mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                aria-label={item.label}
                whileTap={{ scale: 0.9 }}
              >
                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon with scale animation */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'
                      }`}
                  />
                </motion.div>

                {/* Label */}
                <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-70'
                  }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
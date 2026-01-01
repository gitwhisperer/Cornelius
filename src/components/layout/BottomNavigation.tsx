import React from 'react';
import { Home, BookOpen, FileText, Calendar, MessageCircle, User } from 'lucide-react';
import type { Screen } from '../../types';

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
    // Fixed on small screens; static/relative flow on large screens to clamp to bottom of content
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-50 lg:relative lg:bottom-auto lg:left-0 lg:right-0 lg:shadow-none">
      <div className="max-w-[440px] mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label={item.label}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
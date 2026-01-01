import React, { useState } from 'react';
import { Bell, Check, Clock, Calendar, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Screen } from '../../types';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'reminder' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  onNavigate: (screen: Screen) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  // Mock notifications - In a real app, this would come from a context or API
  // Intentionally leaving it empty by default to show empty state as requested, 
  // or I can toggle it. Let's provide a way to "simulate" notifications or start with empty.
  // The user asked "show as empty if no notifications", implying they want to see the empty state.
  // I'll start with an empty array but provide a button to "Load Demo Notifications" for testing.
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadDemoNotifications = () => {
    setNotifications([
      {
        id: '1',
        type: 'alert',
        title: 'Exam Tomorrow',
        message: 'Advanced Graph Algorithms Midterm is tomorrow at 10:00 AM.',
        time: '2 hours ago',
        read: false,
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Assignment Due Soon',
        message: 'Graph Theory Problem Set 3 is due in 4 hours.',
        time: '5 hours ago',
        read: false,
      },
      {
        id: '3',
        type: 'success',
        title: 'Grade Posted',
        message: 'Your grade for Midterm 1 has been updated: 92/100',
        time: '1 day ago',
        read: true,
      },
      {
        id: '4',
        type: 'info',
        title: 'Lecture Canceled',
        message: 'Professor Smith canceled tomorrow\'s office hours.',
        time: '2 days ago',
        read: true,
      }
    ]);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success': return <Check className="w-5 h-5 text-green-500" />;
      case 'reminder': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'info': return <Calendar className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-full space-y-6 px-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Notifications</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
            You're all caught up! Check back later for updates on your assignments and exams.
          </p>
          <button
            onClick={loadDemoNotifications}
            className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Simulate Notifications
          </button>
        </div>
      ) : (
        // List
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`relative group p-4 rounded-2xl border transition-all ${
                  notification.read
                    ? 'bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 opacity-70'
                    : 'bg-white dark:bg-[#171717] border-blue-100 dark:border-blue-900/30 shadow-sm'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-full ${
                    notification.read 
                      ? 'bg-gray-100 dark:bg-gray-800' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-sm ${
                        notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
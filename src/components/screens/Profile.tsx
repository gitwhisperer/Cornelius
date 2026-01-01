import React, { useState } from 'react';
import { User as UserIcon, Bell, Globe, Shield, HelpCircle, LogOut, ChevronRight, Camera, Mail, Lock, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { User } from '../../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    // In a real app, this would make an API call
    setIsEditing(false);
    // updateUser(editedUser);
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-[#171717]">
              {editedUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3 max-w-md">
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Email Address"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{editedUser.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-3">{editedUser.email}</p>
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30">
                  Student
                </span>
              </>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`w-full px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
            isEditing 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Academic Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {user.statistics.lecturesAttended}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Lectures</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {user.statistics.assignmentsCompleted}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {user.statistics.examPerformance}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
            </div>
            <select className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-400">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Email Preferences</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Change Password</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Help & Support</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Privacy Policy</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors font-medium">
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-2">
        Smart Lecture Notes v1.2.0
      </div>
    </div>
  );
};
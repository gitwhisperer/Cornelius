import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', text }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin`} />
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

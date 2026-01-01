import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  color = 'blue',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'orange':
        return 'bg-orange-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColorClasses()} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

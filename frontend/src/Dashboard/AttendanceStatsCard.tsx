import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

const AttendanceStatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} p-4 rounded-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="p-2 rounded-full bg-white dark:bg-gray-700">{icon}</div>}
      </div>
      {change !== undefined && (
        <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from yesterday
        </p>
      )}
    </div>
  );
};

export default AttendanceStatsCard;
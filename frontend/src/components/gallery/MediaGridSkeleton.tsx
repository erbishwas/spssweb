import React from 'react';

const MediaGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGridSkeleton;
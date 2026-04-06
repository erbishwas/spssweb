import React from 'react';

const AlbumSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-600" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
      </div>
    </div>
  );
};

export default AlbumSkeleton;
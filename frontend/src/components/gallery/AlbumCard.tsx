import React, { useState } from 'react';

export interface Album {
  id: number;
  title: string;
  description: string;
  coverPhoto: string;
  created_date: string;
  is_published: boolean;
  media_count: number;
}

const AlbumCard: React.FC<{ album: Album; onClick: () => void }> = ({ album, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://via.placeholder.com/400x250?text=No+Image';
  
  return (
    <div
      className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={!imageError ? album.coverPhoto : fallbackImage}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {album.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {album.media_count} {album.media_count === 1 ? 'media item' : 'media items'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date(album.created_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;

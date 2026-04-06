import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MediaModal from '../components/gallery/MediaModal';
import AlbumCard from '../components/gallery/AlbumCard';
import AlbumSkeleton from '../components/gallery/AlbumSkeleton';
import MediaGridSkeleton from '../components/gallery/MediaGridSkeleton';

interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  image?: string;
  video_file?: string;
  caption: string;
  uploaded_date: string;
}

interface Album {
  id: number;
  title: string;
  description: string;
  coverPhoto: string;
  created_date: string;
  is_published: boolean;
  media_count: number;
}

interface AlbumDetail {
  album: Album;
  media: MediaItem[];
}

const ITEMS_PER_PAGE = 12;

const Gallery: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDetail | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    albums: true,
    albumDetails: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAlbums = filteredAlbums.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, albums: true }));
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/albums/`);
      
      // Transform the response to match our Album interface
      const albumsWithCount = response.data.albums.map((album: any) => ({
        id: album.id,
        title: album.title,
        description: album.description,
        coverPhoto: album.cover_photo_url || album.coverPhoto, // Use cover_photo_url if available
        created_date: album.created_date,
        is_published: album.is_published,
        media_count: album.media_count // Use the media_count from API
      }));
      
      setAlbums(albumsWithCount);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError('Failed to load albums. Please try again later.');
    } finally {
      setLoading(prev => ({ ...prev, albums: false }));
    }
  }, []);

  const fetchAlbumDetails = useCallback(async (albumId: number) => {
    try {
      setLoading(prev => ({ ...prev, albumDetails: true }));
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/album/${albumId}/`);
      
      // Validate response structure
      if (!response.data.album || !Array.isArray(response.data.media)) {
        throw new Error('Invalid API response structure');
      }

      const albumData: AlbumDetail = {
        album: {
          id: response.data.album.id,
          title: response.data.album.title,
          description: response.data.album.description,
          coverPhoto: response.data.album.cover_photo_url || response.data.album.coverPhoto,
          created_date: response.data.album.created_date,
          is_published: response.data.album.is_published,
          media_count: response.data.media.length
        },
        media: response.data.media.map((item: any) => ({
          id: item.id,
          type: item.type || (item.image ? 'photo' : 'video'),
          image: item.image_url || item.image,
          video_file: item.video_url || item.video_file,
          caption: item.caption,
          uploaded_date: item.uploaded_date
        }))
      };

      setSelectedAlbum(albumData);
    } catch (err) {
      console.error('Error fetching album details:', err);
      setError('Failed to load album details. Please try again later.');
    } finally {
      setLoading(prev => ({ ...prev, albumDetails: false }));
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleAlbumClick = (albumId: number) => {
    setCurrentPage(1);
    fetchAlbumDetails(albumId);
  };

  const handleMediaClick = (index: number) => {
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
  };

  const handleNextMedia = useCallback(() => {
    if (selectedAlbum) {
      setCurrentMediaIndex(prev => (prev + 1) % selectedAlbum.media.length);
    }
  }, [selectedAlbum]);

  const handlePrevMedia = useCallback(() => {
    if (selectedAlbum) {
      setCurrentMediaIndex(prev => (prev - 1 + selectedAlbum.media.length) % selectedAlbum.media.length);
    }
  }, [selectedAlbum]);

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setCurrentPage(1);
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-inter">
      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fadeIn">
        {!selectedAlbum ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                Gallery
              </h1>
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search albums..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {error ? (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={fetchAlbums}
                  className="ml-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {loading.albums ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <AlbumSkeleton key={i} />
                ))}
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {searchQuery ? 'No albums match your search.' : 'No albums available.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedAlbums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onClick={() => handleAlbumClick(album.id)}
                    />
                  ))}
                </div>

                {filteredAlbums.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE)}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="animate-fadeIn">
            <button
              onClick={handleBackToAlbums}
              className="flex items-center mb-6 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Albums
            </button>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {selectedAlbum.album.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {selectedAlbum.album.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-4">
                  Created: {new Date(selectedAlbum.album.created_date).toLocaleDateString()}
                </span>
                <span>
                  {selectedAlbum.album.media_count} {selectedAlbum.album.media_count === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {error ? (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
                {error}
              </div>
            ) : null}

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Media
            </h2>

            {loading.albumDetails ? (
              <MediaGridSkeleton />
            ) : selectedAlbum.media.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-300">No media available in this album.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedAlbum.media.map((media, index) => (
                  <div
                    key={`${media.id}-${index}`}
                    className="relative bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                    onClick={() => handleMediaClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleMediaClick(index)}
                  >
                    {media.type === 'photo' ? (
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                        <img
                          src={media.image}
                          alt={media.caption}
                          className="w-full h-48 object-cover block"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative">
                        <video
                          src={media.video_file}
                          className="w-full h-48 object-cover"
                          muted
                          disablePictureInPicture
                          disableRemotePlayback
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {media.caption || 'No caption'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(media.uploaded_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={selectedAlbum?.media[currentMediaIndex] ?? null}
        onNext={handleNextMedia}
        onPrev={handlePrevMedia}
        currentIndex={currentMediaIndex + 1}
        totalItems={selectedAlbum?.media.length || 0}
      />
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
        aria-label="Previous page"
      >
        &lt;
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${currentPage === page
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 dark:border-gray-700'
            }`}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Gallery;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

interface SchoolNotice {
  id: number;
  title: string;
  content: string;
  file_url: string;
  published_date: string;
  is_important?: boolean;
}

const NoticeBar: React.FC = () => {
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/notices/`);
        const noticesData = Array.isArray(response.data.results) ? response.data.results : [];

        const sortedNotices: SchoolNotice[] = noticesData
          .sort((a: SchoolNotice, b: SchoolNotice) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
          .slice(0, 15);

        setNotices(sortedNotices);
        setError(null);
      } catch (err) {
        console.error('Error fetching notices:', err);
        setError('Failed to load notices');
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Auto-rotate notices every 8 seconds
  useEffect(() => {
    if (notices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [notices.length]);

  if (isLoading) {
    return (
      <div className="notice-bar bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-2 text-white text-center">
          Loading notices...
        </div>
      </div>
    );
  }

  if (error || notices.length === 0) {
    return (
      <div className="notice-bar bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-2 text-white text-center">
          {error || 'No notices available'}
        </div>
      </div>
    );
  }

  return (
    <div className="notice-bar bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center">
        <div className="mr-3 font-bold text-white flex-shrink-0">
          <span className="bg-red-500 text-white px-2 py-1 rounded mr-2 text-sm">
            LATEST
          </span>
          Notices:
        </div>

        <div className="overflow-hidden flex-grow">
          <motion.div
            key={currentNoticeIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="whitespace-nowrap"
          >
            <Link
              to={`/notices/${notices[currentNoticeIndex].id}`}
              className="text-white hover:text-yellow-200 text-lg font-medium"
            >
              {notices[currentNoticeIndex].is_important && (
                <span className="text-yellow-300 mr-2">⚠️</span>
              )}
              {notices[currentNoticeIndex].title}
            </Link>
          </motion.div>
        </div>

        {notices.length > 1 && (
          <div className="flex-shrink-0 ml-4 flex space-x-2">
            {notices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentNoticeIndex(index)}
                className={`w-2 h-2 rounded-full ${currentNoticeIndex === index ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`View notice ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBar;

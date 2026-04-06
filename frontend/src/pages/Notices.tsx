import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

interface Notice {
  id: number;
  title: string;
  content: string;
  file: string | null;
  file_url: string | null;
  published_date: string;
  created_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
  updated_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
  updated_at: string;
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'title' | 'date'>('date');
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: prefersDarkMode ? '#60a5fa' : '#2563eb', // dark:text-blue-400 (#60a5fa), light:text-blue-600 (#2563eb)
      },
      background: {
        default: prefersDarkMode ? '#111827' : '#f5f5f5', // dark:bg-gray-950 (#111827), light:bg-gray-50 (#f5f5f5)
        paper: prefersDarkMode ? '#1f2937' : '#ffffff', // dark:bg-gray-800 (#1f2937), light:bg-white
      },
      text: {
        primary: prefersDarkMode ? '#d1d5db' : '#1f2937', // dark:text-gray-300 (#d1d5db), light:text-gray-800 (#1f2937)
        secondary: prefersDarkMode ? '#9ca3af' : '#6b7280', // dark:text-gray-400 (#9ca3af), light:text-gray-500 (#6b7280)
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DYNAMIC_URL}/api/notices/?page=${currentPage}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotices(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage]);

  useEffect(() => {
    let filtered = [...notices];

    if (searchQuery.trim()) {
      filtered = filtered.filter((notice) =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'date') {
      filtered.sort(
        (a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
      );
    }

    setFilteredNotices(filtered);
  }, [searchQuery, sortOption, notices]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="text-center py-8 text-lg text-gray-600 dark:text-gray-300">Loading notices...</div>;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="container mx-auto px-4 py-10 bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">Public Notices</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as 'title' | 'date')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No notices found</div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md p-6 cursor-pointer transition"
                onClick={() => navigate(`/notices/${notice.id}`)}
              >
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(notice.published_date).toLocaleDateString()}</span>
                  {notice.file_url && (
                    <a
                      href={notice.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-1">{notice.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{notice.content || 'No content available'}</p>
                {notice.created_by && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Posted by {notice.created_by.first_name} {notice.created_by.last_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  } hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
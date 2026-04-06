import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
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
    const fetchNotice = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DYNAMIC_URL}/api/notices/${id}/`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotice(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notice:', error);
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  // Function to determine file type
  const getFileType = (fileUrl: string | null): 'image' | 'pdf' | 'other' => {
    if (!fileUrl) return 'other';
    const extension = fileUrl.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  const fileType = getFileType(notice?.file_url ?? null);

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading notice details...</div>;
  }

  if (!notice) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Notice not found</div>;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-950">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
        >
          ← Back to notices
        </button>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-300">{notice.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>
              Published on {new Date(notice.published_date).toLocaleDateString()}
            </span>
            {notice.updated_by && (
              <span>
                Updated by {notice.updated_by.first_name} {notice.updated_by.last_name}
              </span>
            )}
          </div>

          <div className="prose max-w-none mb-8 text-gray-700 dark:text-gray-400">
            {notice.content && notice.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {notice.file_url && (
            <div className="mt-6">
              {fileType === 'image' ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-300">Attached Image</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={notice.file_url} 
                      alt="Notice attachment" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                  <a
                    href={notice.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </a>
                </div>
              ) : fileType === 'pdf' ? (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-300">Attached PDF</h3>
                  <a
                    href={notice.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              ) : (
                <div className="mb-4">
                  <a 
                    href={notice.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download attached file
                  </a>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </ThemeProvider>
  );
}
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MediaModal from '../components/gallery/MediaModal';
import { Button, createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Media {
  id: number;
  image?: string;
  video_file?: string;
  caption: string;
  uploaded_date: string;
  type: 'photo' | 'video';
}

interface GalleryAlbum {
  id: number;
  title: string;
  description: string;
  coverPhoto: string;
  created_date: string;
  is_published: boolean;
  media_count: number;
  media: Media[];
}

interface Event {
  id: number;
  title: string;
  details: string;
  cover_image: string;
  event_date_bs: string;
  event_date_ad: string;
  is_upcoming: boolean;
  is_past: boolean;
  gallery_album_details: GalleryAlbum | null;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
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
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_DYNAMIC_URL}/api/events/${id}/`);
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-800 dark:text-gray-300">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Event not found.</div>;
  }

  const mediaList = event.gallery_album_details?.media || [];

  const calculateDaysDifference = (targetDateStr: string, isUpcoming: boolean): number => {
    const today = new Date();
    const targetDate = new Date(targetDateStr);
    const diffMs = targetDate.getTime() - today.getTime();
    const days = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return isUpcoming ? days : -days;
  };

  const daysDiff = calculateDaysDifference(event.event_date_ad, event.is_upcoming);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="max-w-4xl mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-950">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: muiTheme.palette.text.primary }}
        >
          Back to Events
        </Button>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <img src={event.cover_image} alt={event.title} className="w-full h-96 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-3 text-gray-800 dark:text-gray-300">{event.title}</h1>
            <p className="text-gray-700 dark:text-gray-400 mb-4">{event.details}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Date (AD): {new Date(event.event_date_ad).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Date (BS): {event.event_date_bs}
            </p>

            {event.is_upcoming && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                {daysDiff} day{daysDiff !== 1 ? 's' : ''} remaining
              </p>
            )}

            {event.is_past && (
              <p className="text-red-500 dark:text-red-400 font-medium">
                {Math.abs(daysDiff)} day{Math.abs(daysDiff) !== 1 ? 's' : ''} ago
              </p>
            )}

            {event.is_past && event.gallery_album_details && (
              <div className="mt-6">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded hover:bg-blue-500 dark:hover:bg-blue-300"
                >
                  View Album ({mediaList.length} Photos)
                </button>
              </div>
            )}
          </div>
        </div>

        <MediaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          media={mediaList[selectedIndex] || null}
          onNext={() => setSelectedIndex((prev) => (prev + 1) % mediaList.length)}
          onPrev={() => setSelectedIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
          currentIndex={selectedIndex + 1}
          totalItems={mediaList.length}
        />
      </div>
    </ThemeProvider>
  );
};

export default EventDetails;
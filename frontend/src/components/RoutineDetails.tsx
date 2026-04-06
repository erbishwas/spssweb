import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useTheme from '../hooks/useTheme';

interface Routine {
    id: number;
    type: 'Class' | 'Exam';
    type_display: string;
    title: string;
    description: string;
    image: string;
    updated_by_username: string;
    updated_by_full_name: string;
    updated_at: string;
}

const RoutineDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [loading, setLoading] = useState(true);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const { theme } = useTheme();

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
        const fetchRoutine = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_DYNAMIC_URL}/api/routine/${id}/`);
                const data: Routine = await res.json();
                setRoutine(data);
            } catch (err) {
                console.error('Failed to fetch routine details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutine();
    }, [id]);

    if (loading) {
        return <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Loading routine details...</div>;
    }

    if (!routine) {
        return <div className={`p-6 text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>Routine not found.</div>;
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={`max-w-4xl mx-auto px-4 py-6 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, color: muiTheme.palette.text.primary }}
                >
                    Back to Routines
                </Button>

                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
                    <img src={routine.image} alt={routine.title} className="w-full h-96 object-contain" />
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                {routine.title}
                            </h1>
                            <span className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                {routine.type_display}
                            </span>
                        </div>
                        
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-6 whitespace-pre-line`}>
                            {routine.description}
                        </p>

                        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Last updated: {new Date(routine.updated_at).toLocaleDateString()} by {routine.updated_by_full_name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default RoutineDetails;
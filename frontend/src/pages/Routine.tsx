import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

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

const Routines: React.FC = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'Class' | 'Exam'>('Class');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Detect system theme preference
    useEffect(() => {
        const systemThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                setResolvedTheme(e.matches ? 'dark' : 'light');
            }
        };

        systemThemeMatcher.addEventListener('change', handleSystemThemeChange);
        
        return () => {
            systemThemeMatcher.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme]);

    // Resolve the current theme based on preference
    useEffect(() => {
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setResolvedTheme(systemDark ? 'dark' : 'light');
        } else {
            setResolvedTheme(theme);
        }

        // Update the data-theme attribute
        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, [theme, resolvedTheme]);

    // Fetch routines
    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/routines/`);
                setRoutines(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch routines. Please try again later.');
                console.error('Error fetching routines:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    // Filter routines based on active tab
    const filteredRoutines = routines.filter(r => r.type === activeTab);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    const getThemeIcon = () => {
        if (theme === 'system') return '🌓';
        return resolvedTheme === 'dark' ? '🌙' : '☀️';
    };

    return (
        <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gray-950' : 'bg-white'} transition-colors duration-300 font-inter`}>
            <main className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-4xl md:text-5xl font-bold ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        School Routines
                    </h1>
                    {/* <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        <span className="text-xl">{getThemeIcon()}</span>
                    </button> */}
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setActiveTab('Class')}
                            className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                                activeTab === 'Class'
                                    ? 'bg-blue-600 text-white'
                                    : resolvedTheme === 'dark' 
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Class Routines
                        </button>
                        <button
                            onClick={() => setActiveTab('Exam')}
                            className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                                activeTab === 'Exam'
                                    ? 'bg-blue-600 text-white'
                                    : resolvedTheme === 'dark' 
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Exam Routines
                        </button>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className={`mt-4 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading routines...</p>
                    </div>
                )}

                {error && (
                    <div className={`${resolvedTheme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-100 border-red-500'} border-l-4 p-4 mb-6 rounded`} role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {/* Routines Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRoutines.map((routine) => (
                            <div
                                key={routine.id}
                                className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl overflow-hidden shadow-md transition-all duration-300`}
                            >
                                {routine.image && (
                                    <img
                                        src={routine.image}
                                        alt={routine.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {routine.title}
                                        </h2>
                                        <span className={`text-xs px-2 py-1 rounded-full ${resolvedTheme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                            {routine.type_display}
                                        </span>
                                    </div>

                                    <p className={`${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
                                        {routine.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Updated by: {routine.updated_by_full_name}
                                        </span>
                                        <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {new Date(routine.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/routine/${routine.id}`}
                                        className={`mt-4 inline-block text-sm font-medium ${
                                            resolvedTheme === 'dark'
                                                ? 'text-blue-400 hover:text-blue-300'
                                                : 'text-blue-600 hover:text-blue-500'
                                        }`}
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredRoutines.length === 0 && (
                    <div className="text-center py-16">
                        <svg
                            className={`mx-auto h-12 w-12 ${resolvedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h3 className={`mt-2 text-lg font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            No {activeTab} routines found
                        </h3>
                        <p className={`mt-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activeTab === 'Class'
                                ? 'No class routines available at the moment.'
                                : 'No exam routines available at the moment.'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Routines;
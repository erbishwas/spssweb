import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

interface Event {
    id: number;
    title: string;
    details: string;
    event_date_bs: string;
    event_date_ad: string;
    cover_image: string;
    is_past: boolean;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/events/`, {
                    params: { type: activeTab }
                });
                setEvents(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch events. Please try again later.');
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [activeTab]);

    const calculateRemainingDays = (eventDate: string) => {
        const today = new Date();
        const eventDay = new Date(eventDate);
        const diffTime = eventDay.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-inter">
            <main className="container mx-auto px-6 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center">
                    School Events
                </h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                                activeTab === 'upcoming'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                                activeTab === 'past'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            Past Events
                        </button>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading events...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {/* Events Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const remainingDays = !event.is_past ? calculateRemainingDays(event.event_date_ad) : null;

                            return (
                                <Link
                                    to={`/events/${event.id}`}
                                    key={event.id}
                                    className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {event.cover_image && (
                                        <img
                                            src={event.cover_image}
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {event.title}
                                            </h2>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full mb-1">
                                                    {event.event_date_bs}
                                                </span>
                                                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full">
                                                    {new Date(event.event_date_ad).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                            {event.details}
                                        </p>

                                        {remainingDays !== null && (
                                            <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                                                {remainingDays > 0
                                                    ? `In ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`
                                                    : 'Today'}
                                            </span>
                                        )}

                                        
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && events.length === 0 && (
                    <div className="text-center py-16">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            No {activeTab} events found
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {activeTab === 'upcoming'
                                ? 'Check back later for upcoming events.'
                                : 'No past events available at the moment.'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Events;
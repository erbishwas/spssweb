import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        return savedTheme || 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    useEffect(() => {
        // Apply the theme preference
        const applyTheme = () => {
            if (theme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedTheme(systemDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
            } else {
                setResolvedTheme(theme);
                document.documentElement.setAttribute('data-theme', theme);
            }
        };

        applyTheme();

        // Listen for system theme changes
        const systemThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                setResolvedTheme(e.matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        };

        systemThemeMatcher.addEventListener('change', handleSystemThemeChange);

        // Save theme preference
        localStorage.setItem('theme', theme);

        return () => {
            systemThemeMatcher.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    return { 
        theme, 
        resolvedTheme,
        toggleTheme,
        setTheme // Optional: if you want direct control
    };
};

export default useTheme;
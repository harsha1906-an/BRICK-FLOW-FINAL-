import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = window.localStorage.getItem('isDarkMode');
        // Default to true as the app was hardcoded to dark mode
        return savedTheme !== null ? JSON.parse(savedTheme) : true;
    });

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            window.localStorage.setItem('isDarkMode', JSON.stringify(newTheme));
            return newTheme;
        });
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    useEffect(() => {
        // Sync with localStorage in case it changes in other tabs
        const handleStorageChange = (e) => {
            if (e.key === 'isDarkMode') {
                setIsDarkMode(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
}

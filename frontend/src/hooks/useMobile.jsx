import { useState, useEffect } from 'react';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(max-width: 992px)');

        // Set initial value
        setIsMobile(mediaQuery.matches);

        const handleResize = (e) => setIsMobile(e.matches);

        // Safely add listener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleResize);
            return () => mediaQuery.removeEventListener('change', handleResize);
        } else {
            // Fallback for older browsers (Safari < 14)
            mediaQuery.addListener(handleResize);
            return () => mediaQuery.removeListener(handleResize);
        }
    }, []);

    return isMobile;
};

export default useMobile;

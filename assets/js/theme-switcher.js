(function() {
    'use strict';
    
    // Helper function to get a cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Get the saved theme from cookie
    const savedTheme = getCookie('theme');
    
    let theme;
    
    if (savedTheme) {
        // Use saved theme if it exists
        theme = savedTheme;
    } else {
        // Check browser preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    // Set the data-theme attribute on the <html> element
    document.documentElement.setAttribute('data-theme', theme);
})();

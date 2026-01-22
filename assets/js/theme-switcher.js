(function() {
    'use strict';
    
    // Get the saved theme from localStorage
    const savedTheme = localStorage.getItem('bartr-theme');
    
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


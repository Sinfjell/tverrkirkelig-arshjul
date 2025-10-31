// Navigation highlighting for Lenker page
document.addEventListener('DOMContentLoaded', () => {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check if current path matches the link href
        // Handle various path formats: /, /index.html, /src/pages/index.html for Lenker
        // and /arshjul.html, /src/pages/arshjul.html for Årshjul
        const isLenkerPage = (currentPath === '/' || currentPath === '/index.html' || currentPath === '/src/pages/index.html') && href === '/';
        const isArshjulPage = (currentPath === '/arshjul.html' || currentPath === '/src/pages/arshjul.html' || currentPath === '/arshjul') && href === '/arshjul.html';
        
        if (isLenkerPage || isArshjulPage) {
            link.classList.add('active');
        }
    });
});

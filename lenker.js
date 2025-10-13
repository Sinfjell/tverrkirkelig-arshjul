// Navigation highlighting for Lenker page
document.addEventListener('DOMContentLoaded', () => {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check if current path matches the link href
        if ((currentPath === '/' && href === '/') || 
            (currentPath === '/arshjul.html' && href === '/arshjul.html') ||
            (currentPath === '/arshjul' && href === '/arshjul')) {
            link.classList.add('active');
        }
    });
});

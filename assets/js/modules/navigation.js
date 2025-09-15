document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const portfolioLink = document.getElementById('portfolio-link');
    const allLinks = document.querySelectorAll('.nav-links a');

    // 1. Mobile Menu Toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);
            this.setAttribute('aria-expanded', isActive);
        });
    }

    // 2. Mobile Dropdown Toggle (for Portfolio)
    if (portfolioLink) {
        portfolioLink.addEventListener('click', function(e) {
            // On mobile, prevent default link behavior and toggle dropdown
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentDropdown = this.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.toggle('active');
                }
            }
            // On desktop, the link will just navigate as usual.
        });
    }

    // 3. Close mobile menu when any link is clicked
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                // We only close if it's NOT the portfolio parent link being clicked
                // as that link's job is to toggle the dropdown.
                if (this.id !== 'portfolio-link') {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // 4. Set Active Link based on current page URL
    const currentPath = window.location.pathname;

    allLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        link.classList.remove('active'); // Reset all first

        // Handle portfolio case: highlight parent and specific child
        if (currentPath.startsWith('/portfolio')) {
            if (link.id === 'portfolio-link') {
                link.classList.add('active'); // Highlight parent "Portfolio" link
            }
            if (currentPath === linkPath) {
                link.classList.add('active'); // Highlight specific case study
            }
        } else {
            // Handle other pages
            if (currentPath === linkPath) {
                link.classList.add('active');
            }
        }
    });

    // Handle root path case ('/')
    if (currentPath === '/') {
        document.getElementById('home-link')?.classList.add('active');
    }

    // 5. Cleanup on resize
    // If the user resizes to a desktop view with the menu open, close it.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});
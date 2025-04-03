// Updated navigation.js for split portfolio navigation
document.addEventListener('DOMContentLoaded', function() {
  // Get navigation elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown a)');
  const portfolioToggle = document.querySelector('.portfolio-toggle');
  
  // Handle menu toggle for mobile
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });
  
  // Handle portfolio toggle specifically
  if (portfolioToggle) {
    portfolioToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const parentDropdown = this.closest('.dropdown');
      
      // Close other dropdowns first
      dropdowns.forEach(d => {
        if (d !== parentDropdown && d.classList.contains('active')) {
          d.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      parentDropdown.classList.toggle('active');
    });
  }
  
  // Mobile - handle other dropdown toggles
  dropdowns.forEach(dropdown => {
    const subLinks = dropdown.querySelectorAll('.dropdown-menu a');
    
    // Close menu when clicking on a submenu link
    subLinks.forEach(subLink => {
      subLink.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
          }, 150); // Small delay to allow the click to register
        }
      });
    });
  });
  
  // Set active link based on current page
  const currentPath = window.location.pathname;
  
  // Handle common paths
  let activePath = currentPath;
  
  // Special handling for portfolio case study pages
  if (currentPath.startsWith('/portfolio/')) {
    // For case study pages, highlight portfolio
    document.getElementById('portfolio-link')?.classList.add('active');
    
    // Also highlight the specific case study in the dropdown
    const casePath = currentPath.split('/').pop();
    const caseLink = document.getElementById(`${casePath}-link`);
    if (caseLink) {
      caseLink.classList.add('active');
      
      // Expand dropdown on desktop
      const parentDropdown = caseLink.closest('.dropdown');
      if (parentDropdown && window.innerWidth > 768) {
        parentDropdown.classList.add('active');
      }
    }
  } else {
    // For other pages, highlight the main section
    const mainPath = '/' + (currentPath.split('/')[1] || '');
    const mainLink = document.querySelector(`.nav-links a[href="${mainPath}"]`);
    if (mainLink) {
      mainLink.classList.add('active');
    }
  }
  
  // Handle ESC key to close menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset mobile-specific states when returning to desktop
      document.body.classList.remove('menu-open');
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});
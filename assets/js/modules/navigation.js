// Updated navigation.js for fullscreen mobile menu
document.addEventListener('DOMContentLoaded', function() {
  // Get navigation elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown a)');
  
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
  
  // Mobile - handle dropdown toggles
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    const subLinks = dropdown.querySelectorAll('.dropdown-menu a');
    
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          
          // Close other dropdowns first
          dropdowns.forEach(d => {
            if (d !== dropdown && d.classList.contains('active')) {
              d.classList.remove('active');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('active');
        }
      });
    }
    
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
  
  // Special handling for mobile view pages
  if (currentPath.startsWith('/view/mobile/')) {
    // For mobile wrapper pages, highlight portfolio
    activePath = '/portfolio';
    
    // Also highlight the specific app in the dropdown
    const appName = currentPath.split('/').pop();
    const appLink = document.querySelector(`.dropdown-menu a[href="/view/mobile/${appName}"]`);
    if (appLink) {
      appLink.classList.add('active');
      
      // Also activate parent dropdown in mobile
      const parentDropdown = appLink.closest('.dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
    }
  } else if (currentPath === '/') {
    // For homepage
    activePath = '/';
  } else {
    // For other pages, get the first path segment
    activePath = '/' + currentPath.split('/')[1];
  }
  
  // Find and activate the matching link
  const allLinks = document.querySelectorAll('.nav-links a');
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === activePath) {
      link.classList.add('active');
      
      // If it's in a dropdown, activate the dropdown
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
    }
  });
  
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
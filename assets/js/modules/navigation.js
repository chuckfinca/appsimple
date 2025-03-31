// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', function() {
  // Get navigation elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Handle menu toggle for mobile
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      if (menuOverlay) {
        menuOverlay.classList.toggle('active');
      }
      
      // Prevent body scrolling when menu is open
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Handle overlay click to close menu
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }
  
  // Mobile dropdown toggle
  if (window.innerWidth <= 768) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });
  }
  
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
    }
  } else if (currentPath === '/') {
    // For homepage
    activePath = '/';
  } else {
    // For other pages, get the first path segment
    activePath = '/' + currentPath.split('/')[1];
  }
  
  // Find and activate the matching link
  const navLinks = document.querySelectorAll('.nav-links > li > a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === activePath) {
      link.classList.add('active');
      
      // If it's in a dropdown, show it on mobile
      const parentLi = link.closest('li');
      if (parentLi && parentLi.classList.contains('dropdown') && window.innerWidth <= 768) {
        parentLi.classList.add('active');
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset mobile-specific states when returning to desktop
      document.body.classList.remove('menu-open');
      
      if (menuToggle) menuToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      if (menuOverlay) menuOverlay.classList.remove('active');
      
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
});

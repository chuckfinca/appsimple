// Mobile Menu JavaScript - Updated to work for all screen sizes
document.addEventListener('DOMContentLoaded', function() {
  // Add the mobile menu and toggle elements to the DOM
  const mobileMenuHTML = `
    <button class="menu-toggle" aria-label="Toggle menu">
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    </button>
    <div class="menu">
      <ul>
        <li><a href="/" id="home-link">Home</a></li>
        <li><a href="/services" id="services-link">Services</a></li>
        <li><a href="/process" id="process-link">Process</a></li>
        <li><a href="/about" id="about-link">About</a></li>
        <li><a href="/portfolio" id="portfolio-link">Portfolio</a></li>
        <li><a href="/contact" id="contact-link">Contact</a></li>
      </ul>
    </div>
  `;
  
  // Insert the mobile menu after the opening body tag to ensure it works on all pages
  document.body.insertAdjacentHTML('afterbegin', mobileMenuHTML);

  // Get references to the menu elements
  const mobileMenuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.menu');
  
  // Handle menu toggle click
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Close menu when a link is clicked
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
  
  // Set active class on current page link
  const currentPath = window.location.pathname;
  let currentPage = currentPath.split('/')[1] || 'home';
  
  // Handle root path
  if (currentPath === '/') {
    currentPage = 'home';
  }
  
  // Set active class on the appropriate link
  const activeLink = document.getElementById(`${currentPage}-link`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
});
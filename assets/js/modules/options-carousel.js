// Purpose: Manages a minimalist text carousel that appears after typing animation
const CarouselModule = (function() {
  // Private variables
  let config = {
    containerId: 'options-carousel',
    optionsData: [
      "Need to extend your reach through intelligent mobile experiences?",
      "Looking to reduce operational friction with mobile + AI solutions?",
      "Want a smarter mobile app that learns from user behavior?"
    ],
    showDelay: 500,         // Delay after typing before showing carousel
    cycleDelay: 4000,       // How long each option stays visible
    fadeTransition: 1200    // Transition duration between options
  };
  
  let currentIndex = 0;
  let intervalId = null;
  
  // Create carousel HTML
  function createCarouselHTML() {
    const container = document.getElementById(config.containerId);
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create carousel items directly in the container
    config.optionsData.forEach((text, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.textContent = text;
      
      // First item starts as active
      if (index === 0) {
        item.classList.add('active');
      }
      
      container.appendChild(item);
    });
    
    // Create the prompt container (for future interactivity)
    const promptContainer = document.createElement('div');
    promptContainer.className = 'carousel-prompt';
    container.appendChild(promptContainer);
  }
  
  // Cycle to the next item
  function cycleToNextItem() {
    const container = document.getElementById(config.containerId);
    if (!container) return;
    
    const items = container.querySelectorAll('.carousel-item');
    if (!items.length) return;
    
    // Remove active class from current item
    items[currentIndex].classList.remove('active');
    
    // Update index
    currentIndex = (currentIndex + 1) % items.length;
    
    // Add active class to new item
    items[currentIndex].classList.add('active');
  }
  
  // Start the carousel cycling
  function startCycling() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(cycleToNextItem, config.cycleDelay);
  }
  
  // Show carousel with animation
  function showCarousel() {
    const container = document.getElementById(config.containerId);
    if (!container) return;
    
    // Show container with delay
    setTimeout(() => {
      container.classList.add('visible');
      startCycling();
    }, config.showDelay);
  }
  
  // Future method for switching to interactive mode
  function enableInteractiveMode() {
    const container = document.getElementById(config.containerId);
    if (!container) return;
    
    // Stop automatic cycling
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    // Add class to enable prompt display
    container.classList.add('carousel-input-mode');
    
    // This would be expanded later to handle user input
    console.log("Interactive mode enabled - to be implemented");
  }
  
  // Initialize module
  function init(options = {}) {
    // Merge defaults with provided options
    config = { ...config, ...options };
    
    // Create the HTML structure
    createCarouselHTML();
    
    // Return public methods
    return {
      show: showCarousel,
      enableInteractive: enableInteractiveMode,
      next: cycleToNextItem
    };
  }
  
  // Public API
  return {
    init
  };
})();
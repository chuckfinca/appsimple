// Purpose: Manages a minimalist text carousel that appears after typing animation
const CarouselModule = (function() {
  // Private variables
  let config = {
    containerId: 'options-carousel',
    optionsData: [], // Data will be passed during init
    cycleDelay: 5000,       // How long each option stays visible (e.g., 5 seconds)
    itemFadeTransition: 800, // Item fade transition duration (ms) - Renamed for clarity
    linkFadeDelay: 700      // Delay AFTER item starts fading in BEFORE link starts fading in (ms)
  };

  let currentIndex = 0;
  let intervalId = null;
  let containerElement = null;
  let items = []; // Store item elements
  let isTransitioning = false;

  // Create carousel HTML structure
  function createCarouselHTML() {
    if (!containerElement) return;

    // Clear any existing content
    containerElement.innerHTML = '';
    items = []; // Reset items array

    // Create each carousel item (prompt + link pair)
    config.optionsData.forEach((data, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      // Apply item transition duration via style - safer than relying solely on CSS class timing
      item.style.transition = `opacity ${config.itemFadeTransition}ms ease-in-out`;

      const prompt = document.createElement('p');
      prompt.className = 'carousel-prompt';
      prompt.textContent = data.prompt;

      const link = document.createElement('a');
      link.className = 'carousel-link';
      link.href = data.link;
      link.textContent = data.linkText + ' →'; // Add arrow visually

      item.appendChild(prompt);
      item.appendChild(link);
      containerElement.appendChild(item);
      items.push(item); // Store the element

      // First item starts as active
      if (index === 0) {
        item.classList.add('active');
      }
    });
  }

  function controlLinkVisibility(itemElement, shouldShow) {
      const link = itemElement.querySelector('.carousel-link');
      if (link) {
          if (shouldShow) {
              // Use setTimeout to delay adding the class
              setTimeout(() => {
                  // Check if the parent item is still active before showing link
                  if (itemElement.classList.contains('active')) {
                      link.classList.add('link-visible');
                  }
              }, config.linkFadeDelay); // Delay the link fade-in
          } else {
              link.classList.remove('link-visible');
          }
      }
  }

  // Cycle to the next item with proper transitions
  function cycleToNextItem() {
    if (!items.length || items.length < 2 || isTransitioning) return;

    isTransitioning = true;

    const currentItem = items[currentIndex];
    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex];

    // 1. Reset and hide link of the CURRENT item immediately
    controlLinkVisibility(currentItem, false);

    // 2. Start fade out CURRENT item
    currentItem.classList.remove('active');

    // 3. Use setTimeout based on item fade duration before showing the NEXT item
    setTimeout(() => {
        // 4. Make NEXT item active (starts its fade-in)
        nextItem.classList.add('active');

        // 5. Trigger the delayed visibility for the link within the NEXT item
        controlLinkVisibility(nextItem, true);

        // 6. Update index
        currentIndex = nextIndex;

        // 7. Allow new transitions only after the NEXT item's fade-in is likely complete
        //    (Could also use transitionend event listener for more robustness)
        setTimeout(() => {
            isTransitioning = false;
        }, config.itemFadeTransition); // Wait for item fade-in to finish

    }, config.itemFadeTransition); // Wait for current item fade-out
}


  // Start the carousel cycling
  function startCycling() {
    if (intervalId) clearInterval(intervalId);
    // Initial display is handled in showCarousel, start cycling after the first delay
    intervalId = setInterval(cycleToNextItem, config.cycleDelay);
  }

  // Show carousel (called after typing animation)
  function showCarousel() {
    if (!containerElement) return;

    // Ensure first item exists
    if (items.length > 0) {
        const firstItem = items[0];
        // Make sure it's marked active (should be by default)
        firstItem.classList.add('active');
        // Trigger its link fade-in after container fades in + link delay
        setTimeout(() => {
            controlLinkVisibility(firstItem, true);
        }, 500 + config.linkFadeDelay); // 500ms container fade + link delay
    }

    // Make container visible (triggers CSS transition)
    containerElement.classList.add('visible');

    // Start cycling after the container is visible and first item shown
    setTimeout(() => {
        startCycling();
    }, 1000); // Matches the transition delay in CSS for the container
  }

  // Initialize module
  function init(options = {}) {
    // Merge defaults with provided options
    config = { ...config, ...options };
    containerElement = document.getElementById(config.containerId);

    if (!containerElement) {
        console.error(`Carousel container with ID "${config.containerId}" not found.`);
        return null;
    }

    // Create the HTML structure
    createCarouselHTML();

    // Return public methods
    return {
      show: showCarousel,
    };
  }

  // Public API
  return {
    init
  };
})();
// Purpose: Creates and manages a typing animation effect
const TypingModule = (function () {
  // Private variables
  let config = {
    text: "",
    targetElement: null,
    speed: 100,
    initialDelay: 2000, // 1 second delay before typing starts
  };

  // Function to create typing animation
  function typeWriter(element, text, speed, index = 0) {
    // Reset element content first to prevent duplications
    if (index === 0) {
      element.textContent = '';
    }
    
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(() => typeWriter(element, text, speed, index), speed);
    }
  }

  // Initialize module
  function init(options) {
    // Merge passed options with defaults
    config = { ...config, ...options };

    // Get DOM element
    const typingElement = document.getElementById(config.targetElement);

    // Start typing animation only if element exists
    if (typingElement) {
      // Ensure element is empty before starting
      typingElement.textContent = '';
      
      // Add the initial delay before starting the typing animation
      setTimeout(() => {
        typeWriter(typingElement, config.text, config.speed);
      }, config.initialDelay); // 1 second delay to show blinking cursor first
    }

    // Return public methods
    return {
      restart: function () {
        if (typingElement) {
          typingElement.textContent = "";
          // Also apply the delay when restarting
          setTimeout(() => {
            typeWriter(typingElement, config.text, config.speed);
          }, config.initialDelay);
        }
      },
    };
  }

  // Public API
  return {
    init,
  };
})();
// Purpose: Creates and manages a typing animation effect
const TypingModule = (function () {
  // Private variables
  let config = {
    text: "",
    targetElement: null,
    speed: 100,
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
      setTimeout(() => {
        typeWriter(typingElement, config.text, config.speed);
      }, 50); // Small delay to ensure DOM is ready
    }

    // Return public methods
    return {
      restart: function () {
        if (typingElement) {
          typingElement.textContent = "";
          typeWriter(typingElement, config.text, config.speed);
        }
      },
    };
  }

  // Public API
  return {
    init,
  };
})();
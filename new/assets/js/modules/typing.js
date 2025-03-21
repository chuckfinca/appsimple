// Purpose: Creates a typing animation effect
const TypingModule = (function() {
  // Private variables
  let config = {
    text: "",
    targetElement: null,
    baseSpeed: 70,
    speedVariation: 0.3,
    initialDelay: 1000
  };
  
  // Type a single character
  function typeNextChar(element, text, index, callback) {
    if (index >= text.length) {
      if (callback) callback();
      return;
    }
    
    // Get current character
    const char = text.charAt(index);
    
    // Add character to element
    element.textContent += char;
    
    // Calculate variable speed
    let speed = config.baseSpeed;
    
    // Slow down for punctuation
    if ('.,:;!?'.includes(char)) {
      speed = config.baseSpeed * 1.5;
    } else if (char === ' ') {
      // Normal speed for spaces
      speed = config.baseSpeed;
    } else {
      // Random variation for letters
      const variation = 1 - config.speedVariation/2 + Math.random() * config.speedVariation;
      speed *= variation;
    }
    
    // Type next character after delay
    setTimeout(() => {
      typeNextChar(element, text, index + 1, callback);
    }, speed);
  }
  
  // Initialize module
  function init(options) {
    // Merge options with defaults
    config = {...config, ...options};
    
    // Get target element
    const element = document.getElementById(config.targetElement);
    if (!element) return;
    
    // Clear element
    element.textContent = "";
    
    // Start typing after delay
    setTimeout(() => {
      typeNextChar(element, config.text, 0);
    }, config.initialDelay);
    
    // Return public methods
    return {
      restart: function() {
        element.textContent = "";
        setTimeout(() => {
          typeNextChar(element, config.text, 0);
        }, config.initialDelay);
      }
    };
  }
  
  // Public API
  return {
    init
  };
})();
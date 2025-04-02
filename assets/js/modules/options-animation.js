// Purpose: Manages animated options that appear after typing animation
const OptionsModule = (function() {
    // Private variables
    let config = {
      containerId: 'options-container',
      optionsData: [
        "Need to extend your reach through intelligent mobile experiences?",
        "Looking to reduce operational friction with mobile + AI solutions?",
        "Want a smarter mobile app that learns from user behavior?"
      ],
      showDelay: 500, // Delay after typing before showing options
      staggerDelay: 150 // Delay between each option appearing
    };
  
    // Create options HTML
    function createOptionsHTML() {
      const container = document.getElementById(config.containerId);
      if (!container) return;
  
      // Clear any existing content
      container.innerHTML = '';
  
      // Create option items
      config.optionsData.forEach(text => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        
        const optionText = document.createElement('p');
        optionText.className = 'option-text';
        optionText.textContent = text;
        
        optionItem.appendChild(optionText);
        container.appendChild(optionItem);
      });
    }
  
    // Show options with animation
    function showOptions() {
      const container = document.getElementById(config.containerId);
      if (!container) return;
  
      // Show container first
      setTimeout(() => {
        container.classList.add('visible');
        
        // Then show each option with staggered timing
        const options = container.querySelectorAll('.option-item');
        options.forEach((option, index) => {
          setTimeout(() => {
            option.classList.add('visible');
          }, config.staggerDelay * index);
        });
      }, config.showDelay);
    }
  
    // Initialize module
    function init(options = {}) {
      // Merge defaults with provided options
      config = { ...config, ...options };
      
      // Create the HTML structure
      createOptionsHTML();
      
      // Return public methods
      return {
        show: showOptions
      };
    }
  
    // Public API
    return {
      init
    };
  })();
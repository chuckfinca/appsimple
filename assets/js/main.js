// Purpose: Main application initialization
document.addEventListener("DOMContentLoaded", function() {
  // Get typing element
  const typingElement = document.getElementById("typing-text");
  
  // Only initialize typing if the element exists
  if (typingElement) {
    // Get configuration from window.PAGE_CONFIG or use defaults
    const config = window.PAGE_CONFIG || {};
    
    // Initialize typing effect with enhanced features
    TypingModule.init({
      text: config.typingText || "Hi there. What can AppSimple do for you?",
      targetElement: "typing-text",
      baseSpeed: config.typingSpeed || 70,
      speedVariation: config.speedVariation || 0.3,
      initialDelay: config.initialDelay || 1000,
      longPauseDuration: config.longPauseDuration || 1200, // Pause after sentences
      shortPauseDuration: config.shortPauseDuration || 400, // Pause before/after company name
      wordPauseProbability: config.wordPauseProbability || 0.15, // Chance of a pause after words
      thinkingDuration: config.thinkingDuration || [200, 500] // Range for thinking pauses
    });
    
    // Initialize options animation if the container exists
    const optionsContainer = document.getElementById("options-container");
    if (optionsContainer) {
      // Store instance globally so typing module can access it on completion
      window.optionsInstance = OptionsModule.init({
        containerId: "options-container",
        optionsData: [
          "Need to extend your reach through intelligent mobile experiences?",
          "Looking to reduce operational friction with mobile + AI solutions?",
          "Want a smarter mobile app that learns from user behavior?"
        ],
        showDelay: 800 // Slightly longer delay for better timing after typing
      });
    }

    // Initialize options carousel if the container exists
    const carouselContainer = document.getElementById("options-carousel");
    if (carouselContainer) {
      // Store instance globally so typing module can access it on completion
      window.carouselInstance = CarouselModule.init({
        containerId: "options-carousel",
        optionsData: [
          "Need to extend your reach through intelligent mobile experiences?",
          "Looking to reduce operational friction with mobile + AI solutions?",
          "Want a smarter mobile app that learns from user behavior?"
        ],
        showDelay: 800,     // Delay after typing completes
        cycleDelay: 4000,   // Each message displays for 4 seconds
        fadeTransition: 1200 // Smooth fade between messages
      });
    }
  }
});
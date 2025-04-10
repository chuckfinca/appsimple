// assets/js/main.js
document.addEventListener("DOMContentLoaded", function() {
  const typingElement = document.getElementById("typing-text");

  if (typingElement) {
      const config = window.PAGE_CONFIG || {};

      // Function to initialize and reveal the interactive carousel
      function initializeAndRevealCarousel() {
          console.log("Typing complete! Initializing interactive carousel...");
          const carouselInstance = InteractiveCarouselModule.init({
              containerId: 'interactive-options-container',
              // Options data isn't strictly needed by the module anymore
              // as items are already in the HTML, but keep structure if useful elsewhere
          });

          if (carouselInstance) {
              carouselInstance.reveal(); // Make the carousel visible
          } else {
              console.error("Failed to initialize InteractiveCarouselModule.");
          }
      }

      // Initialize typing effect with the callback
      TypingModule.init({
          text: config.typingText,
          targetElement: "typing-text",
          baseSpeed: config.typingSpeed,
          speedVariation: config.speedVariation,
          initialDelay: config.initialDelay,
          longPauseDuration: config.longPauseDuration,
          shortPauseDuration: config.shortPauseDuration,
          wordPauseProbability: config.wordPauseProbability,
          thinkingDuration: config.thinkingDuration,
          onComplete: initializeAndRevealCarousel // Use the new callback
      });

  } else {
      console.log("Typing text element not found. Typing animation not initialized.");
  }
});
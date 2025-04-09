// Purpose: Main application initialization
document.addEventListener("DOMContentLoaded", function() {
  // Get typing element
  const typingElement = document.getElementById("typing-text");
  
  // Only initialize typing if the element exists
  if (typingElement) {
    // Get configuration from window.PAGE_CONFIG or use defaults
    const config = window.PAGE_CONFIG || {};

    // Function to reveal options one by one
    function revealOptionsSequentially() {
      console.log("Typing complete! Revealing options..."); // LOGGING
      const optionsContainer = document.getElementById('options-carousel');
      const optionItems = optionsContainer.querySelectorAll('.carousel-item');
      const staggerDelay = 1500; // ms delay between each item reveal

      if (optionsContainer && optionItems.length > 0) {
        console.log("Found container and items."); // LOGGING

        // 1. Make the container visible first.
        //    This triggers its own CSS fade-in based on options-carousel.css
        optionsContainer.classList.add('visible');
        console.log("Container visibility triggered."); // LOGGING

        // 2. Use setTimeout to ensure the container starts its transition
        //    before we try animating the children. A tiny delay is usually enough.
        setTimeout(() => {
            console.log("Starting staggered item reveal..."); // LOGGING
            optionItems.forEach((item, index) => {
                // Calculate the delay for this specific item
                const itemDelay = index * staggerDelay;

                // Set timeout for this specific item
                setTimeout(() => {
                    console.log(`Revealing item ${index} after ${itemDelay}ms`); // LOGGING
                    // Add .visible class to trigger this item's fade-in
                    item.classList.add('visible');
                }, itemDelay);
            });
        }, 50); // Small delay (e.g., 50ms) - adjust if needed

      } else {
          console.error("Options container or items not found for sequential reveal."); // ERROR LOG
      }
    }

    // Initialize typing effect with enhanced features
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
      onComplete: revealOptionsSequentially
    });

  } else {
    console.log("Typing text element not found. Typing animation not initialized."); // Optional debug log
    }
});
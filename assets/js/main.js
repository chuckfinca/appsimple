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
    
    const carouselContainer = document.getElementById("options-carousel");
    if (carouselContainer) {
      // Define the prompt and link data
      const carouselOptions = [
        { prompt: "I need a custom mobile app for my business", link: "/portfolio", linkText: "View Portfolio" },
        { prompt: "I want to implement AI in my existing workflow", link: "/process", linkText: "See My Process" },
        { prompt: "I need help reducing operational costs with smart automation", link: "/services", linkText: "Explore Services" },
        { prompt: "I want a mobile solution that grows with my business", link: "/about", linkText: "Learn About Me" },
        { prompt: "I'm trying to determine if AI is right for my company", link: "/contact", linkText: "Let's Talk" }
      ];

      // Store instance globally so typing module can access it on completion
      window.carouselInstance = CarouselModule.init({
        containerId: "options-carousel",
        optionsData: carouselOptions, // Pass the data here
        cycleDelay: 5500,   // Each message + link displays for 5.5 seconds
        fadeTransition: 800 // Smooth fade between messages
      });

      if (!window.carouselInstance) {
          console.error("Failed to initialize CarouselModule.");
      }
    } else {
        console.log("Options carousel container not found. Carousel not initialized."); // Optional debug log
    }
  } else {
    console.log("Typing text element not found. Typing animation not initialized."); // Optional debug log
    }
});
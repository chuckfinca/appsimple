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
  }
});
// Simplified main.js - only initializes typing module
document.addEventListener("DOMContentLoaded", function() {
  // Get typing element
  const typingElement = document.getElementById("typing-text");
  
  // Only initialize typing if the element exists
  if (typingElement) {
    // Initialize typing effect
    const config = window.PAGE_CONFIG || {};
    
    TypingModule.init({
      text: config.typingText || "Integrating AI into your business processes.",
      targetElement: "typing-text",
      baseSpeed: config.typingSpeed || 70,
      speedVariation: 0.3,
      initialDelay: 1000
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Get page-specific configuration (defined in each HTML file)
  const config = window.PAGE_CONFIG || {};
  
  // Check if we're on the main page (has hero element)
  const heroElement = document.getElementById("hero");
  const isMainPage = !!heroElement;

  // Only initialize typing module if we're on the main page
  if (isMainPage) {
    // Initialize typing module with enhanced options
    const typingEffect = TypingModule.init({
      text: config.typingText || "Hi there. What can AppSimple do for you?",
      targetElement: "typing-text",
      baseSpeed: config.typingSpeed || 70, // Slightly faster base speed for natural feel
      speedVariation: 0.3, // 30% variation in typing speed for natural feel
      initialDelay: 1500, // 1.5 second initial delay
    });

    // Initialize scroll behavior module
    const scrollHandler = ScrollModule.init({
      contentSelector: "#content",
      heroSelector: "#hero",
      arrowSelector: "#arrow",
      returnToTopSelector: "#return-to-top"
    });

    // Initialize mobile event handlers if on mobile device
    if (MobileModule.isMobile()) {
      window.mobileModuleInstance = MobileModule.init({
        contentElement: document.querySelector("#content"),
        heroElement: document.querySelector("#hero"),
        returnToTopElement: document.querySelector("#return-to-top"),
        // Pass the scroll handler to allow mobile events to trigger transitions
        scrollHandler: scrollHandler,
      });
    }
  } else {
    // For pages without a hero, just make content visible
    const contentElement = document.querySelector("#content");
    if (contentElement) {
      // Make content visible immediately
      contentElement.classList.add("visible");
      contentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      
      // Initialize return to top button if present
      const returnToTopElement = document.querySelector("#return-to-top");
      if (returnToTopElement) {
        returnToTopElement.addEventListener("click", function() {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        
        // Simple scroll handler for return to top button
        window.addEventListener("scroll", function() {
          if (window.scrollY > 500) {
            returnToTopElement.classList.add("visible");
          } else {
            returnToTopElement.classList.remove("visible");
          }
        });
      }
    }
  }
});
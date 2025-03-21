document.addEventListener("DOMContentLoaded", function() {
  // Check if we're on home page with hero section
  const heroElement = document.getElementById("hero");
  const contentElement = document.getElementById("content");
  
  if (heroElement && contentElement) {
    // We're on the home page with hero - initialize all modules
    const config = window.PAGE_CONFIG || {};
    
    // Initialize typing effect
    const typingEffect = TypingModule.init({
      text: config.typingText || "Hi there. What can I help you with?",
      targetElement: "typing-text",
      baseSpeed: config.typingSpeed || 70,
      speedVariation: 0.3,
      initialDelay: 1000
    });
    
    // Initialize scrolling behavior
    const scrollHandler = ScrollModule.init({
      contentSelector: "#content",
      heroSelector: "#hero",
      arrowSelector: "#arrow",
      returnToTopSelector: "#return-to-top"
    });
    
    // Initialize mobile behavior if on mobile
    if (MobileModule.isMobile()) {
      window.mobileModuleInstance = MobileModule.init({
        contentElement: contentElement,
        heroElement: heroElement,
        returnToTopElement: document.getElementById("return-to-top"),
        scrollHandler: scrollHandler
      });
    }
  } else if (contentElement) {
    // We're on a content page without hero - just enable standard scrolling
    document.body.style.overflow = "auto";
    contentElement.style.position = "static";
    contentElement.style.transform = "none";
    contentElement.style.top = "auto";
    contentElement.style.overflow = "visible";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Get page-specific configuration (defined in each HTML file)
  const config = window.PAGE_CONFIG || {};

  // Initialize typing module
  const typingEffect = TypingModule.init({
    text: config.typingText || "The quick brown fox jumps over the lazy dog.",
    targetElement: "typing-text",
    speed: config.typingSpeed || 100,
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
});
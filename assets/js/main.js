// assets/js/main.js
document.addEventListener("DOMContentLoaded", function() {
  const typingElement = document.getElementById("typing-text");

  if (typingElement) {
      const config = window.PAGE_CONFIG || {};

      function onTypingComplete() {
          var modeToggle = document.getElementById('mode-toggle');
          var chatContainer = document.getElementById('chat-container');
          var chatInput = document.getElementById('chat-input');

          // Reveal toggle and chat
          modeToggle.style.display = 'flex';
          modeToggle.style.opacity = '1';
          chatContainer.style.display = 'block';
          if (chatInput) chatInput.focus();

          // Initialize carousel for Browse mode
          try {
              InteractiveCarouselModule.init({
                  containerId: 'interactive-options-container',
              });
          } catch (e) {
              console.warn("Carousel init deferred:", e);
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
          onComplete: onTypingComplete
      });

  } else {
      console.log("Typing text element not found. Typing animation not initialized.");
  }
});
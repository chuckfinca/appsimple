// assets/js/main.js
document.addEventListener("DOMContentLoaded", function() {
  const typingElement = document.getElementById("typing-text");

  if (typingElement) {
      const config = window.PAGE_CONFIG || {};

      function onTypingComplete() {
          var hero = document.getElementById('hero');
          var typingWrapper = document.querySelector('.typing-wrapper');
          var modeToggle = document.getElementById('mode-toggle');
          var chatContainer = document.getElementById('chat-container');
          var chatInput = document.getElementById('chat-input');

          // Pin text at its current centered position
          var currentTop = typingWrapper.getBoundingClientRect().top
                         - hero.getBoundingClientRect().top;
          hero.style.justifyContent = 'flex-start';
          hero.style.paddingTop = currentTop + 'px';

          // Slide text up and fade in content below
          setTimeout(function() {
              hero.style.transition = 'padding-top 0.6s ease';
              hero.style.paddingTop = '80px';
              setTimeout(function() {
                  modeToggle.style.display = 'flex';
                  modeToggle.style.opacity = '1';
                  chatContainer.style.display = 'block';
                  if (chatInput) chatInput.focus();
              }, 350);
          }, 50);

          // Initialize carousel for Browse mode (store for toggle to reveal)
          try {
              window._carousel = InteractiveCarouselModule.init({
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
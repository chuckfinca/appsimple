// Purpose: Handles desktop scrolling behavior and transitions
const ScrollModule = (function () {
  // Private variables
  let contentElement, heroElement, arrowElement, returnToTopElement;
  let contentVisible = false;
  let lastScrollTop = 0;
  let scrollUpAttempts = 0;
  let buttonLockActive = false;

  // Variables for scroll tracking
  let isAtRest = true;
  let lastScrollTime = 0;
  let scrollRestThreshold = 250;
  let lastUserInteraction = 0;
  let userInteractionThreshold = 100;
  let scrollEndTimeout;
  let pendingButtonShow = null;
  let buttonDelay = 500;

  // Mobile detection
  let isMobile = false;
  let mobileModule = null;

  // Default configuration
  let config = {
    contentSelector: "#content",
    heroSelector: "#hero",
    arrowSelector: "#arrow",
    returnToTopSelector: "#return-to-top"
  };

  // Transition functions
  function showContent() {
    heroElement.classList.add("hidden");
    contentElement.classList.add("visible");
    contentVisible = true;

    setTimeout(() => {
      // Set both the container and the body to allow scrolling
      document.body.style.overflow = "auto";
      contentElement.style.overflow = "auto";
      
      // Ensure the container height is properly constrained
      contentElement.style.height = "100%";
      
      // Force a minimal scroll to activate scrolling behavior
      contentElement.scrollTo(0, 1);
      setTimeout(() => {
        if (contentElement.scrollTop <= 1) {
          contentElement.scrollTo(0, 0);
        }
      }, 100);
    }, 500);
  }

  function showHero() {
    heroElement.classList.remove("hidden");
    contentElement.classList.remove("visible");
    contentVisible = false;
    returnToTopElement.classList.remove("visible");
    scrollUpAttempts = 0;
    buttonLockActive = false;

    if (pendingButtonShow) {
      clearTimeout(pendingButtonShow);
      pendingButtonShow = null;
    }

    // Lock scrolling when returning to hero
    document.body.style.overflow = "hidden";
    contentElement.style.overflow = "hidden";

    setTimeout(() => {
      contentElement.scrollTop = 0;
    }, 500);
  }

  function scheduleButtonShow() {
    if (pendingButtonShow) {
      clearTimeout(pendingButtonShow);
    }

    // Use mobile-specific button delay if on mobile
    const delay = isMobile && mobileModule ? 
                  mobileModule.getMobileTimeouts().buttonShowDelay : 
                  buttonDelay;

    pendingButtonShow = setTimeout(() => {
      if (contentElement.scrollTop <= 3 && contentVisible) {
        returnToTopElement.classList.add("visible");
        buttonLockActive = true;
        lastUserInteraction = Date.now();
      }
      pendingButtonShow = null;
    }, delay);
  }

  // Main scroll event handler with improved mobile support
  function handleContentScroll() {
    if (!contentVisible) return;

    const now = Date.now();
    const currentScrollTop = contentElement.scrollTop;
    const timeSinceLastScroll = now - lastScrollTime;
    const scrollVelocity =
      Math.abs(currentScrollTop - lastScrollTop) / timeSinceLastScroll;

    // Use a more forgiving threshold for mobile
    isAtRest = timeSinceLastScroll > (isMobile ? 150 : scrollRestThreshold);

    // Get the appropriate scroll threshold based on device type
    const scrollThreshold = isMobile && mobileModule ? 
                            mobileModule.getScrollThreshold() : 
                            50;

    // Handle reaching bottom of content - prevent UI issues
    const isAtBottom = contentElement.scrollHeight - contentElement.scrollTop <= contentElement.clientHeight + 5;
    
    if (isAtBottom) {
      // Ensure we don't get odd behavior at the bottom boundary
      contentElement.style.overscrollBehavior = "none";
    } else {
      contentElement.style.overscrollBehavior = "auto";
    }

    if (currentScrollTop <= 3 && currentScrollTop < lastScrollTop) {
      // If there's a clear scroll attempt OR we appear to be at rest
      if (scrollUpAttempts === 0 || isAtRest || scrollVelocity > 0.2) {
        scrollUpAttempts++;

        // Schedule button to show if we have enough scroll attempts
        // Need fewer attempts on mobile
        if ((isMobile && scrollUpAttempts >= 1) || scrollUpAttempts >= 2) {
          if (
            !returnToTopElement.classList.contains("visible") &&
            !pendingButtonShow
          ) {
            scheduleButtonShow();
          }
        }
      }
    } else if (currentScrollTop > scrollThreshold && currentScrollTop > lastScrollTop) {
      if (pendingButtonShow) {
        clearTimeout(pendingButtonShow);
        pendingButtonShow = null;
      }

      // On mobile, respond more quickly to downward scrolls
      if (isMobile && scrollVelocity > 0.1) {
        returnToTopElement.classList.remove("visible");
        scrollUpAttempts = 0;
        buttonLockActive = false;
      }
      // On desktop, still use the smoother transition
      else if (
        isAtRest &&
        now - lastUserInteraction > userInteractionThreshold &&
        !buttonLockActive
      ) {
        returnToTopElement.classList.remove("visible");
        scrollUpAttempts = 0;
      }
    }

    lastScrollTop = currentScrollTop;
    lastScrollTime = now;

    clearTimeout(scrollEndTimeout);

    // Set timeout duration based on device type
    const timeoutDuration = isMobile && mobileModule ? 
                            mobileModule.getMobileTimeouts().scrollEndTimeout : 
                            300;

    scrollEndTimeout = setTimeout(() => {
      if (contentElement.scrollTop > scrollThreshold) {
        returnToTopElement.classList.remove("visible");
        buttonLockActive = false;
        scrollUpAttempts = 0;

        if (pendingButtonShow) {
          clearTimeout(pendingButtonShow);
          pendingButtonShow = null;
        }
      }
    }, timeoutDuration);
  }

  // Desktop-specific wheel event handler
  function setupWheelEvents() {
    window.addEventListener(
      "wheel",
      function (e) {
        // Only prevent default when we're actually handling the event
        // This allows other wheel events to propagate normally
        
        if (!contentVisible) {
          if (e.deltaY > 0) {
            e.preventDefault();
            showContent();
          }
        } else {
          if (contentElement.scrollTop <= 3 && e.deltaY < 0) {
            // Only prevent default here if we're actually transitioning
            if (Math.abs(e.deltaY) > 25) {
              e.preventDefault();
              showHero();
              returnToTopElement.classList.remove("visible");
              buttonLockActive = false;
              scrollUpAttempts = 0;
            } else {
              // Don't prevent default for small wheel movements
              // This allows natural scrolling behavior
              scrollUpAttempts++;
              if (scrollUpAttempts >= 1) {
                if (
                  !returnToTopElement.classList.contains("visible") &&
                  !pendingButtonShow
                ) {
                  scheduleButtonShow();
                }
              }
            }
          }
        }
      },
      { passive: false },
    );
  }    

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Escape key to return to hero
      if (e.key === 'Escape' && contentVisible) {
        showHero();
        returnToTopElement.classList.remove("visible");
        buttonLockActive = false;
        scrollUpAttempts = 0;
      }
    });
  }  

  // Initialize module
  function init(options) {
    // Merge passed options with defaults
    config = { ...config, ...options };

    // Get DOM elements
    contentElement = document.querySelector(config.contentSelector);
    heroElement = document.querySelector(config.heroSelector);
    arrowElement = document.querySelector(config.arrowSelector);
    returnToTopElement = document.querySelector(config.returnToTopSelector);

    // Exit if required elements don't exist
    if (!contentElement || !heroElement) {
      console.error("Required DOM elements not found");
      return;
    }

    // Set initial overflow properties
    document.body.style.overflow = "hidden";
    contentElement.style.overflow = "hidden";
    
    // Fix for content height
    contentElement.style.height = "100%";

    // Check if we're on mobile and save reference
    if (typeof MobileModule !== 'undefined') {
      isMobile = MobileModule.isMobile();

      // Initialize after everything is set up in main.js
      setTimeout(() => {
        if (window.mobileModuleInstance) {
          mobileModule = window.mobileModuleInstance;
        }
      }, 0);
    }

    // Set up arrow click event listener
    if (arrowElement) {
      arrowElement.addEventListener("click", function () {
        if (!contentVisible) {
          showContent();

          setTimeout(() => {
            contentElement.scrollTo(0, 1);
            setTimeout(() => {
              contentElement.scrollTo(0, 0);
            }, 100);
          }, 600);
        }
      });
    }

    // Set up return to top button click event listener
    if (returnToTopElement) {
      returnToTopElement.addEventListener("click", function () {
        showHero();
        returnToTopElement.classList.remove("visible");
        buttonLockActive = false;
        scrollUpAttempts = 0;
      });
    }

    // Set up content scroll event
    contentElement.addEventListener("scroll", handleContentScroll);

    // Set up wheel events (desktop)
    setupWheelEvents();

    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Add document-level scroll listener for better detection
    document.addEventListener("scroll", function(e) {
      if (contentVisible && window.scrollY === 0) {
        // We're at the very top of the document
        handleContentScroll();
      }
    });


    // Return public methods and properties for external use
    return {
      showContent,
      showHero,
      isContentVisible: () => contentVisible,
      getContentElement: () => contentElement,
      getHeroElement: () => heroElement,
      getReturnToTopElement: () => returnToTopElement,
      resetScrollAttempts: () => {
        scrollUpAttempts = 0;
      },
      setButtonLock: (lock) => {
        buttonLockActive = lock;
      },
      cancelPendingButtonShow: () => {
        if (pendingButtonShow) {
          clearTimeout(pendingButtonShow);
          pendingButtonShow = null;
        }
      },
      scheduleButtonShow,
    };
  }

  // Public API
  return {
    init,
  };
})();
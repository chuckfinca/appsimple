// Purpose: Handles touch events and mobile-specific behavior
const MobileModule = (function () {
  // Private variables
  let contentElement, heroElement, returnToTopElement;
  let scrollHandler;
  let scrollUpAttempts = 0;

  // Touch tracking variables
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;

  // Mobile detection
  function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  // Touch start handler
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }

  // Touch move handler with immediate transitions for better mobile UX
  function handleTouchMove(e) {
    const isContentVisible = scrollHandler.isContentVisible();

    if (isContentVisible && contentElement.scrollTop <= 1) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      const touchVelocity = deltaY / (Date.now() - touchStartTime);

      // If pulling down significantly at the top of content OR with high velocity
      if (deltaY > 40 || (deltaY > 20 && touchVelocity > 0.5)) {
        e.preventDefault();

        scrollHandler.cancelPendingButtonShow();
        scrollHandler.showHero();
        returnToTopElement.classList.remove("visible");
        scrollHandler.setButtonLock(false);
        scrollHandler.resetScrollAttempts();
      } else if (deltaY > 10) {
        if (!heroElement.classList.contains("hidden")) {
          scrollUpAttempts++;
          if (
            scrollUpAttempts >= 1 &&
            !returnToTopElement.classList.contains("visible")
          ) {
            scrollHandler.scheduleButtonShow();
          }
        }
      }
    } else if (contentElement.scrollTop > 20) { // Use lower threshold for mobile
      scrollHandler.cancelPendingButtonShow();
    }
  }

  // Touch end handler with improved velocity detection
  function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    const touchDuration = Date.now() - touchStartTime;
    const touchVelocity = Math.abs(touchDiff) / touchDuration;

    const isContentVisible = scrollHandler.isContentVisible();

    // If hero is visible and swiping up - fast swipe needs less distance
    if (
      !isContentVisible &&
      (touchDiff > 50 || (touchDiff > 20 && touchVelocity > 0.5))
    ) {
      scrollHandler.showContent();
    } 
    // If content is visible, at top, and swiping down
    else if (
      isContentVisible &&
      contentElement.scrollTop <= 3 &&
      touchDiff < -20
    ) {
      if (contentElement.classList.contains("visible")) {
        // For stronger pull-down gestures or fast swipes
        if (Math.abs(touchDiff) > 60 || touchVelocity > 0.5) {
          scrollHandler.cancelPendingButtonShow();

          scrollHandler.showHero();
          returnToTopElement.classList.remove("visible");
          scrollHandler.setButtonLock(false);
          scrollHandler.resetScrollAttempts();
        } else if (touchDuration > 100) {
          // For gentle pull-downs, show the button
          if (!returnToTopElement.classList.contains("visible")) {
            scrollHandler.scheduleButtonShow();
          }
        }
      }
    } else if (touchDiff > 10 && contentElement.scrollTop > 20) {
      scrollHandler.cancelPendingButtonShow();
    }
  }

  // Touch cancel handler
  function handleTouchCancel() {
    // If we're at the top and there were attempts, schedule the button
    if (
      scrollUpAttempts >= 1 &&
      contentElement.scrollTop <= 5 &&
      !returnToTopElement.classList.contains("visible")
    ) {
      scrollHandler.scheduleButtonShow();
    }
  }

  // Return if device is in mobile mode for different thresholds
  function getMobileTimeouts() {
    return {
      scrollEndTimeout: 150, // 300ms for desktop, 150ms for mobile
      buttonShowDelay: 400,  // 500ms for desktop, 400ms for mobile
      scrollThreshold: 20    // 50px for desktop, 20px for mobile
    };
  }

  // Initialize module
  function init(options) {
    // Save references to DOM elements and scroll handler
    contentElement = options.contentElement;
    heroElement = options.heroElement;
    returnToTopElement = options.returnToTopElement;
    scrollHandler = options.scrollHandler;

    // Exit if required elements don't exist
    if (
      !contentElement ||
      !heroElement ||
      !returnToTopElement ||
      !scrollHandler
    ) {
      console.error("Required elements or scroll handler not provided");
      return;
    }

    // Set up touch event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchCancel);

    // Return public methods
    return {
      isMobile: detectMobile,
      getMobileTimeouts,
      getScrollThreshold: () => 20 // 20px threshold for mobile
    };
  }

  // Public API
  return {
    init,
    isMobile: detectMobile,
  };
})();
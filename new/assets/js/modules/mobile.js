// Purpose: Handles touch events and mobile-specific behavior
const MobileModule = (function() {
  // Private variables
  let contentElement, heroElement, returnToTopElement;
  let scrollHandler;
  
  // Touch tracking variables
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  
  // Mobile detection
  function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Touch start handler
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }
  
  // Touch move handler
  function handleTouchMove(e) {
    const isContentVisible = scrollHandler.isContentVisible();
    
    // Only handle touch move at top of content
    if (isContentVisible && contentElement.scrollTop <= 1) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      const touchVelocity = deltaY / (Date.now() - touchStartTime);
      
      // If pulling down significantly with velocity
      if (deltaY > 40 || (deltaY > 20 && touchVelocity > 0.5)) {
        e.preventDefault();
        scrollHandler.cancelPendingButtonShow();
        scrollHandler.showHero();
        returnToTopElement.classList.remove("visible");
        scrollHandler.setButtonLock(false);
        scrollHandler.resetScrollAttempts();
      }
    }
  }
  
  // Touch end handler
  function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    const touchDuration = Date.now() - touchStartTime;
    const touchVelocity = Math.abs(touchDiff) / touchDuration;
    
    const isContentVisible = scrollHandler.isContentVisible();
    
    // If hero is visible and swiping up
    if (!isContentVisible && (touchDiff > 30 || (touchDiff > 20 && touchVelocity > 0.4))) {
      scrollHandler.showContent();
    }
    // If content is visible, at top, and swiping down
    else if (isContentVisible && contentElement.scrollTop <= 3 && touchDiff < -20) {
      // For stronger pull-down gestures or fast swipes
      if (Math.abs(touchDiff) > 60 || touchVelocity > 0.5) {
        scrollHandler.cancelPendingButtonShow();
        scrollHandler.showHero();
        returnToTopElement.classList.remove("visible");
        scrollHandler.setButtonLock(false);
        scrollHandler.resetScrollAttempts();
      }
    }
  }
  
  // Initialize module
  function init(options) {
    // Save references to DOM elements and scroll handler
    contentElement = options.contentElement;
    heroElement = options.heroElement;
    returnToTopElement = options.returnToTopElement;
    scrollHandler = options.scrollHandler;
    
    // Exit if required elements don't exist
    if (!contentElement || !heroElement || !returnToTopElement || !scrollHandler) {
      console.error("Required elements or scroll handler not provided");
      return;
    }
    
    // Set up touch event listeners
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    
    // Return public methods
    return {
      isMobile: detectMobile
    };
  }
  
  // Public API
  return {
    init,
    isMobile: detectMobile
  };
})();
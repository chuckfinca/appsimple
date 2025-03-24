// Purpose: Handles scrolling behavior and transitions
const ScrollModule = (function() {
  // Private variables
  let contentElement, heroElement, returnToTopElement;
  let contentVisible = false;
  let scrollUpAttempts = 0;
  let buttonLockActive = false;
  let pendingButtonShow = null;
  
  // Show content section
  function showContent() {
    heroElement.classList.add("hidden");
    contentElement.classList.add("visible");
    contentVisible = true;
    
    // Enable scrolling after transition
    setTimeout(() => {
      document.body.style.overflow = "auto";
      contentElement.style.overflowY = "auto";
    }, 500);
  }
  
  // Show hero section
  function showHero() {
    heroElement.classList.remove("hidden");
    contentElement.classList.remove("visible");
    contentVisible = false;
    returnToTopElement.classList.remove("visible");
    
    // Reset variables
    scrollUpAttempts = 0;
    buttonLockActive = false;
    
    // Cancel any pending button show
    if (pendingButtonShow) {
      clearTimeout(pendingButtonShow);
      pendingButtonShow = null;
    }
    
    // Lock scrolling
    document.body.style.overflow = "hidden";
    contentElement.style.overflowY = "hidden";
    
    // Reset scroll position
    setTimeout(() => {
      contentElement.scrollTop = 0;
    }, 500);
  }
  
  // Schedule "return to top" button to appear
  function scheduleButtonShow() {
    if (pendingButtonShow) {
      clearTimeout(pendingButtonShow);
    }
    
    pendingButtonShow = setTimeout(() => {
      if (contentElement.scrollTop <= 3 && contentVisible) {
        returnToTopElement.classList.add("visible");
        buttonLockActive = true;
      }
      pendingButtonShow = null;
    }, 400);
  }
  
  // Cancel pending button show
  function cancelPendingButtonShow() {
    if (pendingButtonShow) {
      clearTimeout(pendingButtonShow);
      pendingButtonShow = null;
    }
  }
  
  // Handle content scroll
  function handleContentScroll() {
    if (!contentVisible) return;
    
    const currentScrollTop = contentElement.scrollTop;
    
    // At the top of content - show return to top button on multiple scroll attempts
    if (currentScrollTop <= 3) {
      scrollUpAttempts++;
      
      if (scrollUpAttempts >= 2 && !returnToTopElement.classList.contains("visible") && !pendingButtonShow) {
        scheduleButtonShow();
      }
    } 
    // Scrolling down - hide button
    else if (currentScrollTop > 20) {
      returnToTopElement.classList.remove("visible");
      scrollUpAttempts = 0;
      buttonLockActive = false;
      cancelPendingButtonShow();
    }
  }
  
  // Initialize module
  function init(options) {
    // Get DOM elements
    contentElement = document.querySelector(options.contentSelector);
    heroElement = document.querySelector(options.heroSelector);
    returnToTopElement = document.querySelector(options.returnToTopSelector);
    
    // Exit if required elements don't exist
    if (!contentElement || !heroElement) {
      console.error("Required DOM elements not found");
      return;
    }
    
    // Set initial overflow properties
    document.body.style.overflow = "hidden";
    contentElement.style.overflowY = "hidden";
    
    // Set up return to top button click
    if (returnToTopElement) {
      returnToTopElement.addEventListener("click", () => {
        showHero();
      });
    }
    
    // Set up content scroll event
    contentElement.addEventListener("scroll", handleContentScroll);
    
    // Set up wheel event
    window.addEventListener("wheel", function(e) {
      if (!contentVisible) {
        // Wheel down on hero - show content
        if (e.deltaY > 0) {
          e.preventDefault();
          showContent();
        }
      } else {
        // Wheel up at top of content - return to hero
        if (contentElement.scrollTop <= 3 && e.deltaY < 0) {
          if (Math.abs(e.deltaY) > 25) {
            e.preventDefault();
            showHero();
          }
        }
      }
    }, { passive: false });
    
    // Set up keyboard shortcuts
    document.addEventListener("keydown", function(e) {
      // Escape key to return to hero
      if (e.key === "Escape" && contentVisible) {
        showHero();
      }
    });
    
    // Return public methods
    return {
      showContent,
      showHero,
      isContentVisible: () => contentVisible,
      cancelPendingButtonShow,
      scheduleButtonShow,
      setButtonLock: (lock) => { buttonLockActive = lock; },
      resetScrollAttempts: () => { scrollUpAttempts = 0; }
    };
  }
  
  // Public API
  return {
    init
  };
})();
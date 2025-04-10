// assets/js/modules/interactive-carousel.js
const InteractiveCarouselModule = (function () {
    let config = {
        containerId: 'interactive-options-container',
        itemSelector: '.carousel-item',
        controlsId: 'carousel-controls',
        prevBtnSelector: '.prev-btn',
        nextBtnSelector: '.next-btn',
        pausePlayBtnSelector: '.pause-play-btn',
        toggleBtnSelector: '.toggle-expand-btn',
        activeClass: 'active',
        expandedClass: 'expanded',
        pausedClass: 'paused',
        visibleClass: 'visible',
        cycleDelay: 5500,
        itemFadeOutDuration: 500,
        promptFadeInDuration: 600, // CSS prompt opacity/transform duration
        linkFadeInDuration: 600,   // CSS link opacity/transform duration
        linkFadeInDelay: 400     // CSS link transition-delay
    };

    // Calculate total time for one item's animation sequence (fade in prompt + link delay + link fade)
    // Used to better manage the isTransitioning flag
    const itemAnimationDuration = Math.max(config.promptFadeInDuration, config.linkFadeInDelay + config.linkFadeInDuration);


    let container = null;
    let itemsWrapper = null;
    let items = [];
    let controls = null;
    let prevBtn = null;
    let nextBtn = null;
    let pausePlayBtn = null;
    let toggleBtn = null;
    let expandIcon = null;
    let collapseIcon = null;
    let pauseIcon = null;
    let playIcon = null;

    let currentIndex = 0;
    let isExpanded = false;
    let isPlaying = true; // Start playing by default
    let intervalId = null;
    let isTransitioning = false; // Flag to prevent overlapping transitions

    // --- Core Function: Show Item ---
    function showItem(index) {
        if (!items || items.length === 0 || isTransitioning) return;

        isTransitioning = true; // Lock transitions

        const newIndex = (index + items.length) % items.length;
        const currentItem = items[currentIndex];
        const nextItem = items[newIndex];

        // 1. Fade Out Current Item (if it exists and is different)
        if (currentItem && currentItem !== nextItem) {
            currentItem.classList.remove(config.activeClass);
        }

        // 2. Wait for Fade Out + Small Buffer
        const fadeOutWait = (currentItem && currentItem !== nextItem) ? config.itemFadeOutDuration + 50 : 0; // Add buffer

        setTimeout(() => {
            // 3. Activate Next Item (triggers CSS prompt/link fade-in)
            if (nextItem) {
                // Ensure others are inactive before activating the next
                 items.forEach(item => item.classList.remove(config.activeClass));
                 nextItem.classList.add(config.activeClass);
                 currentIndex = newIndex;
            }

            // 4. Release Transition Lock *after* the next item's animation is expected to finish
            // This prevents rapid clicks during the fade-in phase
            setTimeout(() => {
                isTransitioning = false;
                // **Crucial:** If cycling was stopped *during* the transition (e.g., by arrow click),
                // ensure the button visually reflects the paused state *now*.
                updatePausePlayButtonState();
            }, itemAnimationDuration + 50); // Wait for prompt/link fade-in + buffer

        }, fadeOutWait);
    }

    // --- Cycling Logic ---
    function cycleToNextItem() {
         if (isExpanded || !isPlaying || isTransitioning) return;
         showItem(currentIndex + 1);
    }

    // Updates the button's class based on isPlaying state
    function updatePausePlayButtonState() {
        if (pausePlayBtn) {
            if (isPlaying && !isExpanded) {
                pausePlayBtn.classList.remove(config.pausedClass);
                pausePlayBtn.setAttribute('aria-label', 'Pause Cycling');
            } else {
                // Paused state visually applies if !isPlaying OR if expanded
                pausePlayBtn.classList.add(config.pausedClass);
                pausePlayBtn.setAttribute('aria-label', 'Play Cycling');
            }
        }
    }

    function startCycling() {
        // Set state first
        isPlaying = true;
        // Clear just in case
        clearInterval(intervalId);
        intervalId = null;

        // Update button visual state immediately
        updatePausePlayButtonState();

        // Start the interval only if conditions met
        if (!isExpanded && items.length > 1) {
            console.log("Starting cycling interval");
            intervalId = setInterval(cycleToNextItem, config.cycleDelay);
        } else {
             console.log("Conditions not met for starting interval (expanded or <= 1 item)");
        }
    }

    function stopCycling(calledManually = false) { // Add flag
         // Set state first
         isPlaying = false;
         // Clear interval if it exists
         if (intervalId) {
             console.log("Stopping cycling interval");
             clearInterval(intervalId);
             intervalId = null;
         }
         // Update button visual state
         // Defer visual update if called by arrows/expand *during* a transition
         if (!isTransitioning || calledManually) {
              updatePausePlayButtonState();
         }
    }

     // --- Event Handlers ---
    function handlePausePlayClick() {
        if (isExpanded || isTransitioning) return; // Ignore clicks during transition or when expanded

        if (isPlaying) {
            stopCycling(true); // Stop immediately, update button now
        } else {
            // Resume: Immediately show next, then start interval
            if (!isTransitioning) { // Check again before showing item
                 showItem(currentIndex + 1); // Show next NOW
            }
             // Start interval after a brief moment to allow showItem to kick off
             setTimeout(() => startCycling(), 50);
        }
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
        container.classList.toggle(config.expandedClass, isExpanded);

        // Always stop cycling and ensure button shows 'paused' when expanding/collapsing
        stopCycling(true); // Force immediate visual update

        // Update expand/collapse icon visibility
        if (expandIcon && collapseIcon) {
            expandIcon.style.display = isExpanded ? 'none' : 'inline-block';
            collapseIcon.style.display = isExpanded ? 'inline-block' : 'none';
        }
        toggleBtn.setAttribute('aria-label', isExpanded ? 'Collapse Options' : 'Expand Options');

        // Reset items when collapsing
        if (!isExpanded) {
            items.forEach((item) => item.classList.remove(config.activeClass));
            if (items[currentIndex]) {
                 items[currentIndex].classList.add(config.activeClass);
             } else if (items.length > 0) {
                 currentIndex = 0;
                 items[0].classList.add(config.activeClass);
            }
        } else {
           // Ensure all items visible when expanded (CSS should handle this mostly)
        }
    }

    function handlePrevClick() {
        if (isExpanded || isTransitioning) return;
        stopCycling(); // Stop state, defer visual update if needed via isTransitioning check later
        showItem(currentIndex - 1);
    }

    function handleNextClick() {
        if (isExpanded || isTransitioning) return;
        stopCycling(); // Stop state, defer visual update if needed via isTransitioning check later
        showItem(currentIndex + 1);
    }

     // --- Initialization ---
     function revealCarousel() {
         if (!container) return;
         container.classList.add(config.visibleClass);
         isTransitioning = false; // Ensure unlocked before first show
         showItem(0); // Show the first item (triggers animations)
         startCycling(); // Start automatic cycling
         updatePausePlayButtonState(); // Set initial button state
    }

    function init(userConfig = {}) {
        config = { ...config, ...userConfig };

        container = document.getElementById(config.containerId);
        controls = document.getElementById(config.controlsId);
        if (!container || !controls) {
            console.error("Carousel container or controls not found.");
            return null;
        }
        itemsWrapper = container.querySelector('.carousel-items-wrapper');
        if (!itemsWrapper) {
             console.error("Carousel items wrapper not found.");
             return null;
        }
        items = Array.from(itemsWrapper.querySelectorAll(config.itemSelector));

        // Get buttons & Icons
        prevBtn = controls.querySelector(config.prevBtnSelector);
        nextBtn = controls.querySelector(config.nextBtnSelector);
        pausePlayBtn = controls.querySelector(config.pausePlayBtnSelector);
        toggleBtn = controls.querySelector(config.toggleBtnSelector);
        if (toggleBtn) {
             expandIcon = toggleBtn.querySelector('.expand-icon');
             collapseIcon = toggleBtn.querySelector('.collapse-icon');
        }
        if (pausePlayBtn) {
            pauseIcon = pausePlayBtn.querySelector('.pause-icon');
            playIcon = pausePlayBtn.querySelector('.play-icon');
        }

        // Attach listeners if buttons exist
        if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);
        if (nextBtn) nextBtn.addEventListener('click', handleNextClick);
        if (pausePlayBtn) pausePlayBtn.addEventListener('click', handlePausePlayClick);
        if (toggleBtn) toggleBtn.addEventListener('click', toggleExpand);

        // Initial visual state setup
        isExpanded = false;
        isPlaying = true; // Default to playing
        isTransitioning = false;
        container.classList.remove(config.expandedClass);

        // Set initial ARIA labels
        if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Expand Options');
        // Initial button state set in revealCarousel

        // Hide all items initially
        items.forEach((item) => item.classList.remove(config.activeClass));

        console.log("Interactive Carousel Initialized (Call/Response Animation - Refined)");

        return {
            reveal: revealCarousel,
        };
    }

    return {
        init
    };
})();
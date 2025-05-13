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
        animateInClass: 'animate-item-in',
        cycleDelay: 5500,
        itemFadeOutDuration: 100,
        promptFadeInDuration: 600,
        linkFadeInDuration: 600,
        linkFadeInDelay: 400
    };

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
    let isPlaying = true;
    let intervalId = null;
    let isTransitioning = false;

    // --- Core Function: Show Item ---
    function showItem(index, animate = false) {
        if (!items || items.length === 0 || isTransitioning) return;

        isTransitioning = true; // Lock transitions

        const newIndex = (index + items.length) % items.length;
        const currentItem = items[currentIndex];
        const nextItem = items[newIndex];

        // 1. Fade Out Current Item (if it exists and is different)
        if (currentItem && currentItem !== nextItem) {
            currentItem.classList.remove(config.activeClass);
            currentItem.classList.remove(config.animateInClass); // <<< REMOVE animation class on fade out
        }

        // 2. Wait for Fade Out + Small Buffer
        const fadeOutWait = (currentItem && currentItem !== nextItem) ? config.itemFadeOutDuration + 50 : 0;

        setTimeout(() => {
            // 3. Activate Next Item
            if (nextItem) {
                 items.forEach(item => {
                     item.classList.remove(config.activeClass);
                     item.classList.remove(config.animateInClass); // Ensure others lose it too
                 });
                 nextItem.classList.add(config.activeClass);

                 // <<< ADD animation class ONLY if 'animate' is true >>>
                 if (animate && !isExpanded) {
                     // Use requestAnimationFrame to ensure the 'active' class is applied first
                     requestAnimationFrame(() => {
                         nextItem.classList.add(config.animateInClass);
                     });
                 }
                 currentIndex = newIndex;
            }

            // 4. Release Transition Lock after animation duration (if animating) or immediately (if not)
            const releaseDelay = animate ? (itemAnimationDuration + 50) : 50; // Longer delay if animating
            setTimeout(() => {
                isTransitioning = false;
                // Update button state if needed (especially if manually paused during transition)
                updatePausePlayButtonState();
            }, releaseDelay);

        }, fadeOutWait);
    }

    // --- Cycling Logic ---
    function cycleToNextItem() {
         if (isExpanded || !isPlaying || isTransitioning) return;
         showItem(currentIndex + 1, true); // <<< PASS true for animate flag
    }

    function updatePausePlayButtonState() {
        if (pausePlayBtn) {
            if (isPlaying && !isExpanded) {
                pausePlayBtn.classList.remove(config.pausedClass);
                pausePlayBtn.setAttribute('aria-label', 'Pause Cycling');
            } else {
                pausePlayBtn.classList.add(config.pausedClass);
                pausePlayBtn.setAttribute('aria-label', 'Play Cycling');
            }
        }
    }

    function startCycling() {
        isPlaying = true;
        clearInterval(intervalId);
        intervalId = null;
        updatePausePlayButtonState();
        if (!isExpanded && items.length > 1) {
            console.log("Starting cycling interval");
            intervalId = setInterval(cycleToNextItem, config.cycleDelay);
        } else {
             console.log("Conditions not met for starting interval (expanded or <= 1 item)");
        }
    }

     function stopCycling(calledManually = false) {
        isPlaying = false;
         if (intervalId) {
             console.log("Stopping cycling interval");
             clearInterval(intervalId);
             intervalId = null;
         }
         if (!isTransitioning || calledManually) {
              updatePausePlayButtonState();
         }
    }

     // --- Event Handlers---
    function handlePausePlayClick() {
        if (isExpanded || isTransitioning) return;

        if (isPlaying) {
            stopCycling(true);
        } else {
            // Resume: Immediately show next WITH animation, then start interval
            if (!isTransitioning) {
                 showItem(currentIndex + 1, true); // <<< PASS true for animate flag
            }
             setTimeout(() => startCycling(), 50);
        }
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
        container.classList.toggle(config.expandedClass, isExpanded);
        stopCycling(true);
        if (expandIcon && collapseIcon) {
            expandIcon.style.display = isExpanded ? 'none' : 'inline-block';
            collapseIcon.style.display = isExpanded ? 'inline-block' : 'none';
        }
        toggleBtn.setAttribute('aria-label', isExpanded ? 'Collapse Options' : 'Expand Options');
        if (!isExpanded) {
            items.forEach((item) => {
                item.classList.remove(config.activeClass);
                item.classList.remove(config.animateInClass); // Also remove animate class
            });
            if (items[currentIndex]) {
                 items[currentIndex].classList.add(config.activeClass);
             } else if (items.length > 0) {
                 currentIndex = 0;
                 items[0].classList.add(config.activeClass);
            }
            // Optionally restart cycling if it was playing before expand?
            // if (wasPlayingBeforeExpand) { startCycling(); }
        }
    }

    function handlePrevClick() {
        if (isExpanded || isTransitioning) return;
        stopCycling();
        showItem(currentIndex - 1, false); // <<< PASS false for animate flag
    }

    function handleNextClick() {
        if (isExpanded || isTransitioning) return;
        stopCycling();
        showItem(currentIndex + 1, false); // <<< PASS false for animate flag
    }

     // --- Initialization (Modified) ---
     function revealCarousel() {
         if (!container) return;
         container.classList.add(config.visibleClass);
         isTransitioning = false;
         showItem(0, true); // <<< Animate the first item on reveal
         startCycling();
         updatePausePlayButtonState();
    }

     function init(userConfig = {}) {
        config = { ...config, ...userConfig };
        container = document.getElementById(config.containerId);
        controls = document.getElementById(config.controlsId);
        if (!container || !controls) { return null; }
        itemsWrapper = container.querySelector('.carousel-items-wrapper');
        if (!itemsWrapper) { return null; }
        items = Array.from(itemsWrapper.querySelectorAll(config.itemSelector));

        prevBtn = controls.querySelector(config.prevBtnSelector);
        nextBtn = controls.querySelector(config.nextBtnSelector);
        pausePlayBtn = controls.querySelector(config.pausePlayBtnSelector);
        toggleBtn = controls.querySelector(config.toggleBtnSelector);

        if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);
        if (nextBtn) nextBtn.addEventListener('click', handleNextClick);
        if (pausePlayBtn) pausePlayBtn.addEventListener('click', handlePausePlayClick);
        if (toggleBtn) toggleBtn.addEventListener('click', toggleExpand);

        isExpanded = false;
        isPlaying = true;
        isTransitioning = false;
        container.classList.remove(config.expandedClass);
        if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Expand Options');
        items.forEach((item) => {
            item.classList.remove(config.activeClass);
            item.classList.remove(config.animateInClass); // Also remove animate class initially
        });

        console.log("Interactive Carousel Initialized (Conditional Animation)");

        return {
            reveal: revealCarousel,
        };
    }

    return {
        init
    };
})();
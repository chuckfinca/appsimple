// Purpose: Creates and manages a typing animation effect with variable speeds, pauses, and styling, with live linking.
const TypingModule = (function () {
  // --- Configuration and State ---
  let config = {
    text: "",
    targetElement: null,
    baseSpeed: 90,
    initialDelay: 1000,
    speedVariation: 0.3,
    longPauseDuration: 1500,
    shortPauseDuration: 40,
    wordPauseProbability: 0.15,
    thinkingDuration: [50, 100]
  };

  // Define link targets - used by typeWriter now
  const linkTargets = [
      { text: "Charles Feinn", href: "/about", style: "text-decoration: none;" }, // Let inner spans handle bold/color
      { text: "AppSimple", href: "mailto:charles@appsimple.io", style: "text-decoration: none;" }
  ];

  // --- processTextForTyping (Unchanged - keep the working version) ---
  function processTextForTyping(text) {
    const segments = [];
    const specialStrings = linkTargets.map(t => t.text); // Get special strings from linkTargets
    const escapedSpecialStrings = specialStrings.map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const specialRegex = new RegExp(escapedSpecialStrings.join('|'), 'g');
    const sentenceEndPunctuationRegex = /[.?!]/g;
    let currentIndex = 0;

    while (currentIndex < text.length) {
        specialRegex.lastIndex = currentIndex;
        const specialMatch = specialRegex.exec(text);
        const nextSpecialIndex = specialMatch ? specialMatch.index : Infinity;
        const matchedSpecialString = specialMatch ? specialMatch[0] : null;

        sentenceEndPunctuationRegex.lastIndex = currentIndex;
        const sentenceMatch = sentenceEndPunctuationRegex.exec(text);
        const nextSentenceEndIndex = sentenceMatch ? sentenceMatch.index : Infinity;

        if (nextSpecialIndex === Infinity && nextSentenceEndIndex === Infinity) {
            if (currentIndex < text.length) {
                segments.push({ text: text.substring(currentIndex), isSpecial: false, isEndOfSentence: false });
            }
            break;
        }

        if (nextSpecialIndex <= nextSentenceEndIndex) {
            if (nextSpecialIndex > currentIndex) {
                segments.push({ text: text.substring(currentIndex, nextSpecialIndex), isSpecial: false, isEndOfSentence: false });
            }
            segments.push({ text: matchedSpecialString, isSpecial: true, isEndOfSentence: false }); // Mark as special
            currentIndex = nextSpecialIndex + matchedSpecialString.length;
        } else {
            let segmentEndIndex = nextSentenceEndIndex + 1;
            if (segmentEndIndex < text.length && text[segmentEndIndex] === ' ') {
                 segmentEndIndex++;
            }
            const segmentText = text.substring(currentIndex, segmentEndIndex);
            segments.push({ text: segmentText, isSpecial: false, isEndOfSentence: true });
            currentIndex = segmentEndIndex;
        }
    }
    return segments.filter(segment => segment.text.length > 0);
  }

  // --- typeCharacter (Modified: Takes an optional parent element) ---
  // Appends the character/span to 'parentElement' if provided, otherwise to 'baseElement'
  function typeCharacter(baseElement, char, isSpecial, parentElement = null) {
    const targetContainer = parentElement || baseElement; // Append here

    if (isSpecial) {
      const span = document.createElement('span');
      // Apply visual styling to the inner span
      span.style.fontWeight = 'bold';
      span.style.color = '#4682B4'; // Primary color
      span.textContent = char;
      targetContainer.appendChild(span);
    } else {
      const textNode = document.createTextNode(char);
      targetContainer.appendChild(textNode);
    }
  }

  // --- typeWriter (Modified: Creates links on-the-fly) ---
  // Takes an additional 'currentLinkWrapper' argument
  function typeWriter(element, segments, baseSpeed, segmentIndex = 0, charIndex = 0, currentLinkWrapper = null) {
    // --- Base Case: All segments typed ---
    if (segmentIndex >= segments.length) {
      if (config.onComplete && typeof config.onComplete === 'function') {
        config.onComplete();
      }
      return;
    }

    // --- Get current segment ---
    const segment = segments[segmentIndex];
    let nextLinkWrapper = currentLinkWrapper; // Assume we continue in the current wrapper

    // --- Segment Transition Logic ---
    if (charIndex >= segment.text.length) {
      let delay = 0;
      // Calculate pause *before* moving to the next segment
      if (segment.isEndOfSentence) {
        delay = config.longPauseDuration;
      } else if (segment.isSpecial) {
        delay = config.shortPauseDuration;
      } else if (segments[segmentIndex + 1] && segments[segmentIndex + 1].isSpecial) {
        // Pause *before* typing the next special word
         delay = config.shortPauseDuration / 2; // Slightly longer pause before special
      }

      setTimeout(() => {
        // IMPORTANT: Reset link wrapper when moving to the next segment
        typeWriter(element, segments, baseSpeed, segmentIndex + 1, 0, null);
      }, delay);
      return;
    }

    // --- Character Typing Logic ---
    const currentChar = segment.text.charAt(charIndex);

    // --- Link Creation (at the start of a special segment) ---
    if (charIndex === 0 && segment.isSpecial) {
        // Find the config for this special text
        const targetConfig = linkTargets.find(t => t.text === segment.text);
        if (targetConfig) {
            const link = document.createElement('a');
            link.href = targetConfig.href;
            link.setAttribute('style', targetConfig.style);
            element.appendChild(link); // Append the link wrapper to the main element
            nextLinkWrapper = link; // Set this link as the parent for subsequent characters in *this* segment
        } else {
            // Fallback if somehow a special segment doesn't have a target
            nextLinkWrapper = null;
        }
    } else if (charIndex === 0 && !segment.isSpecial) {
        // Ensure we are not using a wrapper from a previous segment
        nextLinkWrapper = null;
    }

    // --- Type the character (potentially inside the link wrapper) ---
    typeCharacter(element, currentChar, segment.isSpecial, nextLinkWrapper);

    // --- Calculate Speed for Next Character ---
    let variableSpeed = baseSpeed;
    // (Speed calculation logic remains the same as before)
    if ('.,:;!?'.includes(currentChar)) {
      variableSpeed = baseSpeed * 1.2;
    } else if (currentChar === ' ') {
      variableSpeed = baseSpeed;
      if (Math.random() < config.wordPauseProbability) {
        const min = config.thinkingDuration[0];
        const max = config.thinkingDuration[1];
        const thinkingTime = min + Math.random() * (max - min);
        variableSpeed += thinkingTime;
      }
    } else {
      const variation = 1 - config.speedVariation/2 + Math.random() * config.speedVariation;
      variableSpeed *= variation;
      const remaining = segment.text.substring(charIndex).indexOf(' ');
      if (remaining > 3) {
        const posInWord = charIndex - segment.text.substring(0, charIndex).lastIndexOf(' ');
        if (posInWord > 2) {
          variableSpeed *= 0.85;
        }
      }
    }

    // --- Recursive Call for Next Character ---
    setTimeout(() => {
      // Pass the potentially updated 'nextLinkWrapper' down
      typeWriter(element, segments, baseSpeed, segmentIndex, charIndex + 1, nextLinkWrapper);
    }, variableSpeed);
  }

  // --- init (Modified: Uses updated linkTargets source) ---
   function init(options) {
    config = { ...config, ...options };
    const typingElement = document.getElementById(config.targetElement);

    if (typingElement) {
      // processTextForTyping now gets special strings from linkTargets
      const segments = processTextForTyping(config.text);
      typingElement.innerHTML = '';
      setTimeout(() => {
        // Initial call to typeWriter starts with no link wrapper (null)
        typeWriter(typingElement, segments, config.baseSpeed, 0, 0, null);
      }, config.initialDelay);
    }

    return {
      restart: function () {
        if (typingElement) {
          const segments = processTextForTyping(config.text);
          typingElement.innerHTML = "";
          setTimeout(() => {
            typeWriter(typingElement, segments, config.baseSpeed, 0, 0, null);
          }, config.initialDelay);
        }
      },
    };
  }

  // Public API
  return {
    init,
  };
})();
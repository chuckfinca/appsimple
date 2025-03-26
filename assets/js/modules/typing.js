// Purpose: Creates and manages a typing animation effect with variable speeds, pauses, and styling
const TypingModule = (function () {
  // Private variables
  let config = {
    text: "",
    targetElement: null,
    baseSpeed: 70,
    initialDelay: 1000,
    speedVariation: 0.3, // Speed variation factor (0.3 means 30% variation)
    longPauseDuration: 1200, // Pause after sentences
    shortPauseDuration: 400, // Pause before/after company name
    wordPauseProbability: 0.15, // Probability of a pause after regular words
    thinkingDuration: [200, 500] // Range for random "thinking" pauses
  };
  
  // Process text into segments for special handling and pauses
  function processTextForTyping(text) {
    const segments = [];
    const companyName = "AppSimple";
    
    // Simple approach: first handle the company name, then consider sentence pauses
    let remainingText = text;
    let position;
    
    // First pass: Process company name occurrences
    while ((position = remainingText.indexOf(companyName)) !== -1) {
      // Add text before company name
      if (position > 0) {
        segments.push({
          text: remainingText.substring(0, position),
          isSpecial: false,
          isEndOfSentence: false
        });
      }
      
      // Add company name as special segment
      segments.push({
        text: companyName,
        isSpecial: true,
        isEndOfSentence: false
      });
      
      // Update remaining text
      remainingText = remainingText.substring(position + companyName.length);
    }
    
    // Add any remaining text
    if (remainingText.length > 0) {
      segments.push({
        text: remainingText,
        isSpecial: false,
        isEndOfSentence: false
      });
    }
    
    // Second pass: Process sentence endings for pauses
    for (let i = 0; i < segments.length; i++) {
      // Skip special segments (company name)
      if (segments[i].isSpecial) continue;
      
      const text = segments[i].text;
      
      // Find periods in this segment
      for (let j = 0; j < text.length; j++) {
        if (text[j] === '.' && j < text.length - 1) {
          // Found a period that's not at the end
          
          // Split this segment
          const before = text.substring(0, j + 1); // Include the period
          const after = text.substring(j + 1);
          
          // Replace current segment with before part
          segments[i] = {
            text: before,
            isSpecial: false,
            isEndOfSentence: true
          };
          
          // Insert after part as new segment
          segments.splice(i + 1, 0, {
            text: after,
            isSpecial: false,
            isEndOfSentence: false
          });
          
          break; // Process one period at a time
        } else if (j === text.length - 1 && text[j] === '.') {
          // Period at the end of the segment
          segments[i].isEndOfSentence = true;
        }
      }
    }
    
    return segments;
  }

  // Type a single character with appropriate styling
  function typeCharacter(element, char, isSpecial) {
    // Create a text node or styled span based on character type
    if (isSpecial) {
      // For special text (company name), create a styled span
      const span = document.createElement('span');
      span.style.fontWeight = 'bold';
      span.style.color = '#4682B4'; // Primary color
      span.textContent = char;
      element.appendChild(span);
    } else {
      // For normal text, just append the character
      const textNode = document.createTextNode(char);
      element.appendChild(textNode);
    }
  }

  // Add clickable link functionality after typing completes
  function makeCompanyNameClickable(element) {
    // Find all spans (which should be our company name characters)
    const companySpans = element.querySelectorAll('span');
    if (companySpans.length === 0) return;
    
    // Get the text content of all spans to verify it's our company name
    const textContent = Array.from(companySpans).map(span => span.textContent).join('');
    if (textContent !== 'AppSimple') return;
    
    // Create a single link element
    const link = document.createElement('a');
    link.href = "mailto:hello@appsimple.io"; // Updated email address
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    
    // Clone the first span to use as our container
    const container = companySpans[0].cloneNode(false);
    container.textContent = textContent;
    
    // Replace all the individual character spans with our single container
    const parent = companySpans[0].parentNode;
    link.appendChild(container);
    
    // Replace the first span with our link and remove the rest
    parent.replaceChild(link, companySpans[0]);
    for (let i = 1; i < companySpans.length; i++) {
      if (companySpans[i].parentNode) {
        companySpans[i].parentNode.removeChild(companySpans[i]);
      }
    }
  }

  // Type writer that handles segmented text with natural pauses
  function typeWriter(element, segments, baseSpeed, segmentIndex = 0, charIndex = 0) {
    // If we've typed all segments, we're done
    if (segmentIndex >= segments.length) {
      // Apply final link functionality
      makeCompanyNameClickable(element);
      return;
    }
    
    // Get current segment
    const segment = segments[segmentIndex];
    
    // If we've typed all characters in this segment, move to next segment
    if (charIndex >= segment.text.length) {
      let delay = 0;
      
      // Add appropriate pause
      if (segment.isEndOfSentence) {
        // Long pause after end of sentences
        delay = config.longPauseDuration;
      } else if (segment.isSpecial) {
        // Short pause after company name
        delay = config.shortPauseDuration;
      } else if (segments[segmentIndex + 1] && segments[segmentIndex + 1].isSpecial) {
        // Short pause before company name
        delay = config.shortPauseDuration;
      }
      
      setTimeout(() => {
        typeWriter(element, segments, baseSpeed, segmentIndex + 1, 0);
      }, delay);
      return;
    }
    
    // Get current character
    const currentChar = segment.text.charAt(charIndex);
    
    // Type this character with appropriate styling
    typeCharacter(element, currentChar, segment.isSpecial);
    
    // Calculate variable speed for next character
    let variableSpeed = baseSpeed;
    
    // Slow down for punctuation - more subtle
    if ('.,:;!?'.includes(currentChar)) {
      variableSpeed = baseSpeed * 1.2; // Reduced from 1.5x to 1.2x
    } else if (currentChar === ' ') {
      // Normal speed for spaces
      variableSpeed = baseSpeed;
      
      // Add occasional "thinking" pauses after words
      if (Math.random() < config.wordPauseProbability) {
        const min = config.thinkingDuration[0];
        const max = config.thinkingDuration[1];
        const thinkingTime = min + Math.random() * (max - min);
        variableSpeed += thinkingTime;
      }
    } else {
      // Random variation for letters
      const variation = 1 - config.speedVariation/2 + Math.random() * config.speedVariation;
      variableSpeed *= variation;
      
      // Speed up typing in the middle of longer words
      const remaining = segment.text.substring(charIndex).indexOf(' ');
      if (remaining > 3) {
        // We're in a longer word, speed up a bit
        const posInWord = charIndex - segment.text.substring(0, charIndex).lastIndexOf(' ');
        if (posInWord > 2) {
          variableSpeed *= 0.85; // Speed up by 15%
        }
      }
    }
    
    // Move to next character after calculated delay
    setTimeout(() => {
      typeWriter(element, segments, baseSpeed, segmentIndex, charIndex + 1);
    }, variableSpeed);
  }

  // Initialize module
  function init(options) {
    // Merge passed options with defaults
    config = { ...config, ...options };

    // Get DOM element
    const typingElement = document.getElementById(config.targetElement);

    // Start typing animation only if element exists
    if (typingElement) {
      // Process text into segments
      const segments = processTextForTyping(config.text);
      
      // Ensure element is empty before starting
      typingElement.innerHTML = '';
      
      // Add the initial delay before starting the typing animation
      setTimeout(() => {
        typeWriter(typingElement, segments, config.baseSpeed);
      }, config.initialDelay);
    }

    // Return public methods
    return {
      restart: function () {
        if (typingElement) {
          // Process text into segments again
          const segments = processTextForTyping(config.text);
          
          // Clear the element
          typingElement.innerHTML = "";
          
          // Apply the delay when restarting
          setTimeout(() => {
            typeWriter(typingElement, segments, config.baseSpeed);
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
// Purpose: Creates and manages a typing animation effect with variable speeds and immediate styling
const TypingModule = (function () {
  // Private variables
  let config = {
    text: "",
    targetElement: null,
    baseSpeed: 100,
    initialDelay: 2000, // 2 second delay before typing starts
    speedVariation: 0.3 // Speed variation factor (0.3 means 30% variation)
  };
  
  // Process text into segments for special handling
  function processTextForTyping(text) {
    const segments = [];
    const companyName = "AppSimple";
    let remainingText = text;
    let position;
    
    // Process the text until we've handled all instances of the company name
    while ((position = remainingText.indexOf(companyName)) !== -1) {
      // Add text before company name
      if (position > 0) {
        segments.push({
          text: remainingText.substring(0, position),
          isSpecial: false
        });
      }
      
      // Add company name as special segment
      segments.push({
        text: companyName,
        isSpecial: true
      });
      
      // Update remaining text
      remainingText = remainingText.substring(position + companyName.length);
    }
    
    // Add any remaining text
    if (remainingText.length > 0) {
      segments.push({
        text: remainingText,
        isSpecial: false
      });
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
      span.style.color = '#4682B4';
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
    link.href = "mailto:support@appsimple.io";
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

  // Type writer that handles segmented text
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
      // Add pause after company name
      const delay = segment.isSpecial ? 400 : 0;
      
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
    
    // Slow down for punctuation
    if ('.,:;!?'.includes(currentChar)) {
      variableSpeed = baseSpeed * 1.5;
    } else if (currentChar === ' ') {
      // Normal speed for spaces
      variableSpeed = baseSpeed;
    } else {
      // Random variation for letters
      const variation = 1 - config.speedVariation/2 + Math.random() * config.speedVariation;
      variableSpeed *= variation;
    }
    
    // Add pause before company name
    if (segmentIndex + 1 < segments.length && charIndex === segment.text.length - 1 && segments[segmentIndex + 1].isSpecial) {
      variableSpeed += 400;
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
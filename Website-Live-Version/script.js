function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

document.addEventListener("DOMContentLoaded", () => {
  if (isIOS() && !window.navigator.standalone) {
    // The app is not launched in standalone mode, so show the prompt
    document.getElementById("addToHomeScreenPrompt").style.display = "flex";
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   const iframe = document.getElementById("godot-game");
//   const playGameBtn = document.getElementById("playGame");
//   let gameStarted = false;

//   // Function to update the iframe's visibility based on viewport width
//   function updateIframeVisibility() {
//     // Only update if the game hasn't started yet
//     if (!gameStarted) {
//       if (window.innerWidth <= 1023) {
//         iframe.style.display = "none";
//       } else {
//         iframe.style.display = "block";
//       }
//     }
//   }

//   // Run the check initially
//   updateIframeVisibility();

//   // Listen for window resize events
//   window.addEventListener("resize", updateIframeVisibility);

//   // When the Play Game button is clicked, reveal the iframe and set the game as started
//   playGameBtn.addEventListener("click", function () {
//     gameStarted = true;
//     iframe.style.display = "block";
//     goFullscreen();
//   });
// });


/************************************************
 * A. iOS Detection
 ************************************************/
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/************************************************
 * B. Fullscreen Handling
 ************************************************/
function goFullscreen() {
  const iframeContainer = document.querySelector(".iframe-container");
  const iframe = iframeContainer.querySelector("iframe");

  // Request fullscreen on iOS => container; others => iframe
  if (isIOS()) {
    requestFullscreen(iframeContainer);
  } else {
    requestFullscreen(iframe);
  }
  
  // Remove overlays immediately (so no blur or button remains)
  removeAllOverlays();
}

function exitFullscreen() {
  // Check if any element is currently in fullscreen mode
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// Toggle fullscreen based on current state.
function toggleFullscreen() {
  const fsElement =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (fsElement) {
    exitFullscreen();
  } else {
    goFullscreen();
  }
}

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

/************************************************
 * C. Overlays Creation & Removal
 ************************************************/
function createOverlayIfNeeded() {
  // Only add overlays if on mobile width
  if (window.innerWidth <= 1023) {
    // Create the game overlay (for blur effect) if not already present
    if (!document.querySelector(".game-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "game-overlay";
      document.querySelector(".iframe-container").appendChild(overlay);
    }
    
    // Create the play overlay (container for the Play Game button) if not already present
    if (!document.querySelector(".play-overlay")) {
      const playOverlay = document.createElement("div");
      playOverlay.className = "play-overlay";
      
      // Create the Play Game button and add it to the play overlay
      const playButton = document.createElement("button");
      playButton.className = "button-style";
      playButton.id = "playGame";
      playButton.textContent = "Play Game!";
      playButton.onclick = goFullscreen;
      
      playOverlay.appendChild(playButton);
      document.querySelector(".iframe-container").appendChild(playOverlay);
    }
  }
}

function removeAllOverlays() {
  document.querySelectorAll(".game-overlay").forEach(el => el.remove());
  document.querySelectorAll(".play-overlay").forEach(el => el.remove());
}

/************************************************
 * D. fullscreenchange Event: Re-add overlays 
 *    on exit for browsers that support it
 ************************************************/
function handleFullscreenChange() {
  const fsElement =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (!fsElement) {
    // Exited fullscreen – re-add overlays as needed
    createOverlayIfNeeded();
  }
}

// Listen for fullscreen change events
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("MSFullscreenChange", handleFullscreenChange);

/************************************************
 * E. On page load, create overlays if needed
 ************************************************/
document.addEventListener("DOMContentLoaded", () => {
  createOverlayIfNeeded();

  // Optional: If you have a button to toggle fullscreen (e.g., with id "fullscreen"),
  // attach the toggle function. This lets users exit fullscreen manually.
  const fsButton = document.getElementById("fullscreen");
  if (fsButton) {
    fsButton.addEventListener("click", toggleFullscreen);
  }
});

// Ensure the custom cursor persists across clicks on links
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.href) {
    e.preventDefault(); // Prevent immediate navigation
    setTimeout(() => {
      window.location.href = e.target.href;
    }, 50); // Add delay if needed
  }
});

// Get modal element
const modal = document.getElementById("howToPlayModal");

// Get the "How to Play" button
const howToPlayBtn = document.getElementById("howToPlayBtn");

// Get the <span> element that closes the modal
const closeBtn = document.querySelector(".close-button");

// Function to open the modal
function openModal(event) {
  event.stopPropagation(); // Prevent the click from bubbling up
  modal.style.display = "flex"; // Change from "block" to "flex"
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// When the user clicks the "How to Play" button, open the modal
if (howToPlayBtn) {
  howToPlayBtn.addEventListener("click", openModal);
}

// When the user clicks on <span> (x), close the modal
if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

// When the user clicks anywhere outside of the modal content, close it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Optional: Close modal on Esc key press
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "flex") {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Tolerance for when to skip auto-centering near the very top or bottom (in pixels)
  const EDGE_TOLERANCE = 5;
  // Tolerance for the distance (in pixels) from the viewport center at which auto-centering will trigger.
  const CENTER_TOLERANCE = 0;
  // Debounce delay (in ms) to wait after scrolling stops before checking auto-centering.
  const DEBOUNCE_DELAY = 150;
  
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    // Clear any pending timeout so we only run after scrolling stops.
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      const iframeContainer = document.querySelector('.iframe-container');
      if (!iframeContainer) {
        console.warn('No .iframe-container found');
        return;
      }
      
      // Get document and viewport dimensions.
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + viewportHeight;
      
      // Only auto-center if we're not too close to the top or bottom.
      if (scrollTop <= EDGE_TOLERANCE || scrollBottom >= (docHeight - EDGE_TOLERANCE)) {
        // We're near an edge—do not auto center.
        return;
      }
      
      // Get the iframe container's bounding rectangle relative to the viewport.
      const rect = iframeContainer.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);
      const viewportCenter = viewportHeight / 2;
      const diff = Math.abs(elementCenter - viewportCenter);
      
      // If the iframe's center is off by more than the tolerance, auto-center it.
      if (diff > CENTER_TOLERANCE) {
        iframeContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, DEBOUNCE_DELAY);
  });
});






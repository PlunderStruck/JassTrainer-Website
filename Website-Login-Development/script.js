// Get current page from the URL
const currentLocation = window.location.pathname.split('/').pop();
const menuLinks = document.querySelectorAll("nav ul li a");

// Track whether we found a matching link
let matched = false;

// Loop through links and add "active" class if the URL matches
menuLinks.forEach((link) => {
  const linkPage = link.getAttribute("href").split('/').pop(); // Extract filename from href

  // Make "Account" active if the user is on the account page
  if (currentLocation === "account.html" && linkPage === "account.html") {
    link.classList.add("active");
    matched = true;
  } 
  // Make "Login" active on login-related pages
  else if (["login.html", "forgot-password.html", "register.html", "reset-password.html"].includes(currentLocation) 
    && linkPage === "login.html") {
    link.classList.add("active");
    matched = true;
  } 
  // Otherwise, match the current page to the corresponding link
  else if (linkPage === currentLocation) {
    link.classList.add("active");
    matched = true;
  }
});

// If no specific link matched, default to "Trainer" being active
if (!matched) {
  const trainerLink = document.getElementById("trainer");
  if (trainerLink) {
    trainerLink.classList.add("active");
  }
}

// Fullscreen functionality
function goFullscreen() {
  const iframe = document.querySelector(".iframe-container iframe");
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) { /* Firefox */
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) { /* IE/Edge */
    iframe.msRequestFullscreen();
  }
}

// Ensure the custom cursor persists across clicks on links
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.href) {
    e.preventDefault(); // Prevent immediate navigation
    setTimeout(() => {
      window.location.href = e.target.href;
    }, 50); // Add delay if needed
  }
});

// New Modal Functionality

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

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header-container nav');
  
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    nav.classList.toggle('active');
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.header-container nav') && !e.target.closest('.hamburger')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });
});

// Login functionality
async function loginUser(email, password) {
  const response = await fetch('../api/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  const messageElement = document.getElementById('login-message');

  if (result.success) {
    messageElement.textContent = 'Login successful! Redirecting...';
    messageElement.style.color = 'green';

    // ✅ Store session marker in sessionStorage (ends on browser close)
    sessionStorage.setItem("session_active", "true");

    // ✅ Update navbar dynamically
    const loginNavItem = document.getElementById('login');
    loginNavItem.textContent = 'Account';
    loginNavItem.href = './account.html';

    // ✅ Redirect after 1 second
    setTimeout(() => {
      window.location.href = './account.html';
    }, 1000);
  } else {
    messageElement.textContent = result.error || 'An error occurred during login.';
    messageElement.style.color = 'red';
  }
}

// Attach login event
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginUser(email, password);
});


// Handle login submission
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginUser(email, password);
});

// Redirect to register page
document.getElementById('registerBtn')?.addEventListener('click', () => {
  window.location.href = './register.html';
});

// Redirect to forgot password page
document.getElementById('forgotPasswordBtn')?.addEventListener('click', () => {
  window.location.href = './forgot-password.html';
});


// Handle forgot password
async function forgotPassword(email) {
  const response = await fetch('../api/forgot-password.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const result = await response.json();

  const messageElement = document.getElementById('forgot-password-message');
  if (result.success) {
    messageElement.textContent = 'Password reset link sent! Please check your email.';
    messageElement.style.color = 'green';
  } else {
    messageElement.textContent = result.error || 'An error occurred.';
    messageElement.style.color = 'red';
  }
}

document.getElementById('forgot-password-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  forgotPassword(email);
});


// Handle user registration
async function registerUser(email, username, password) {
  const response = await fetch('../api/register.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  });
  const result = await response.json();

  const messageElement = document.getElementById('register-message');
  if (result.success) {
    messageElement.textContent = 'Registration successful! Please check your email to verify your account.';
    messageElement.style.color = 'green';
  } else {
    messageElement.textContent = result.error || 'An error occurred during registration.';
    messageElement.style.color = 'red';
  }
}

document.getElementById('register-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  registerUser(email, username, password);
});

// Function to handle password reset
async function handlePasswordReset(e) {
  e.preventDefault();

  const token = document.getElementById('token').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    displayResetMessage('Passwords do not match.', 'red');
    return;
  }

  // Send reset request to the backend
  console.log('Sending request to reset-password.php with data:', { token, newPassword });

  const response = await fetch('../api/reset-password.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  console.log('Response received from reset-password.php:', response);


  const result = await response.json();

  if (result.success) {
    displayResetMessage('Password reset successfully!', 'green');
  } else {
    displayResetMessage(result.error || 'An error occurred.', 'red');
  }
}

// Utility function to display messages
function displayResetMessage(message, color) {
  const messageElement = document.getElementById('reset-message');
  messageElement.textContent = message;
  messageElement.style.color = color;
}

// Initialize the reset password page
function initResetPasswordPage() {
    console.log('Initializing Reset Password Page...');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        displayResetMessage('Invalid or missing token.', 'red');
        document.getElementById('reset-password-form').style.display = 'none';
    } else {
        const tokenInput = document.getElementById('token');
        if (tokenInput) {
            tokenInput.value = token;
        } else {
            displayResetMessage('Error: Token input field not found.', 'red');
        }
    }

    const form = document.getElementById('reset-password-form');
    if (form) {
        form.addEventListener('submit', handlePasswordReset);
        console.log('Event listener attached to the form.');
    } else {
        console.error('Reset password form not found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
  initResetPasswordPage(); // Initialize the reset password page
});

async function checkSession() {
  try {
      // ✅ Correct API path logic
      const inPagesFolder = window.location.pathname.includes("/pages/");
      const apiPath = inPagesFolder ? "../api/check-session.php" : "./api/check-session.php";

      console.log(`Fetching session from: ${apiPath}`); // ✅ Debugging

      const response = await fetch(apiPath);
      
      if (!response.ok) {
          console.error(`API Error: ${response.status} - Failed to fetch ${apiPath}`);
          return;
      }

      const result = await response.json();
      const loginNavItem = document.getElementById("login");

      if (result.isLoggedIn) {
          loginNavItem.textContent = "Account";
          loginNavItem.href = inPagesFolder ? "../pages/account.html" : "./pages/account.html";

          // ✅ Ensure sessionStorage is updated
          sessionStorage.setItem("session_active", "true");

          // ✅ Update username if on account page
          const usernameElement = document.getElementById("username");
          if (usernameElement) {
              usernameElement.textContent = result.username;
          }
      } else {
          loginNavItem.textContent = "Login";
          loginNavItem.href = inPagesFolder ? "../pages/login.html" : "./pages/login.html";

          // ✅ Remove sessionStorage only if API call succeeded but no session exists
          sessionStorage.removeItem("session_active");

          // ✅ Only redirect to login if on account.html
          if (window.location.pathname.endsWith("account.html")) {
              window.location.href = inPagesFolder ? "../pages/login.html" : "./pages/login.html";
          }
      }
  } catch (error) {
      console.error("Error checking session:", error);
  }
}

// ✅ Run session check when page loads
document.addEventListener("DOMContentLoaded", async () => {
  await checkSession();
});



async function logoutUser() {
  try {
      await fetch("../api/logout.php"); // ✅ Call server-side logout

      // ✅ Clear sessionStorage to fully log out
      sessionStorage.removeItem("session_active");

      // ✅ Redirect to login page
      window.location.href = "./login.html";
  } catch (error) {
      console.error("Logout failed:", error);
  }
}

// ✅ Attach event listener to logout button
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
      logoutButton.addEventListener("click", logoutUser);
  }
});







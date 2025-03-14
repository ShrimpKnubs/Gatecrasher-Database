// Firebase configuration - Replace with your actual firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKhc_Nl4kMAUfd3Ze43jG6hM1nt9FCsIg",
  authDomain: "gatecrasher-database.firebaseapp.com",
  projectId: "gatecrasher-database",
  storageBucket: "gatecrasher-database.firebasestorage.app",
  messagingSenderId: "221759991275",
  appId: "1:221759991275:web:4b1a92d2647d9f48c8bdae",
  measurementId: "G-QH1TYL025K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const bootOverlay = document.getElementById('boot-overlay');
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const userIdInput = document.getElementById('user-id');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const continueAsGruntButton = document.getElementById('continue-as-grunt');
const errorMessage = document.getElementById('error-message');
const activateButton = document.getElementById('activate-button');
const terminalText = document.getElementById('terminal-text');
const logoScreen = document.getElementById('logo-screen');
const music = document.getElementById('background-music');
const activationSound = document.getElementById('activation-sound');
const tabSound = document.getElementById('tab-sound');
const missionSound = document.getElementById('mission-sound');
const intelSound = document.getElementById('intel-sound');
const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-sound');
const errorSound = document.getElementById('error-sound');
const dateTimeDisplay = document.getElementById('date-time');
const notification = document.getElementById('notification');
const volumeSlider = document.getElementById('volume-slider');
const globe = document.getElementById('globe');
const missionPanel = document.getElementById('mission-panel');
const closeMissionButton = document.getElementById('close-mission');
const intelPanel = document.getElementById('intel-panel');
const closeIntelButton = document.getElementById('close-intel');
const missionIntelButton = document.getElementById('mission-intel-button');
const lcdOverlay = document.getElementById('lcd-overlay');
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const hqButton = document.getElementById('hq-button');
const hqPanel = document.getElementById('hq-panel');
const closeHqButton = document.getElementById('close-hq');

// Add background image to logo screen and login overlay too
logoScreen.style.backgroundImage = "url('textures/background.png')";
logoScreen.style.backgroundSize = "cover";
logoScreen.style.backgroundRepeat = "no-repeat";

loginOverlay.style.backgroundImage = "url('textures/background.png')";
loginOverlay.style.backgroundSize = "cover";
loginOverlay.style.backgroundRepeat = "no-repeat";
loginOverlay.style.backgroundColor = "rgba(0, 31, 24, 0.85)"; // Semi-transparent overlay

// System State
let systemActive = false;
let activeMission = null;
let rotating = true;
let lastInteractionTime = 0;
let rotationTimeout = null;
let velocity = { x: 0, y: 0 };
const friction = 0.95;
let currentUser = null;
let userRole = null;
let missionMarkers = [];
let deploymentMarkers = [];
let scene = null; // Will be initialized with Three.js scene

// Logo Screen Handling (No fading, instant transition)
setTimeout(() => {
  logoScreen.style.display = 'none';
  loginOverlay.style.display = 'flex'; // Show login screen instead of boot screen
  
  // Initialize LCD overlay - fix for LCD not showing
  lcdOverlay.style.display = 'block';
}, 2000);

// Authentication state listener
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    currentUser = user;
    
    // Get user data from Firestore
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          userRole = userData.role;
          
          // Show appropriate features based on role
          showUserDashboard(userRole);
          
          // Hide login overlay
          loginOverlay.style.display = 'none';
          
          // Initialize appropriate systems based on role
          if (userRole === 'admin') {
            initializeAdminFeatures();
          } else if (userRole === 'squadLead') {
            initializeSquadLeadFeatures();
          } else {
            initializeGruntFeatures();
          }
          
          // Initialize common features
          initializeUIAfterLogin();
        }
      })
      .catch(error => {
        console.error('Error getting user data:', error);
      });
  } else {
    // User is signed out, show login screen
    currentUser = null;
    userRole = null;
    systemActive = false;
    loginOverlay.style.display = 'flex';
    
    // Hide panels
    leftPanel.style.opacity = '0';
    rightPanel.style.opacity = '0';
    
    // Stop music
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
  }
});

// Initialize UI Sounds
function initializeUISounds() {
  // Add hover sound to buttons and clickable elements
  document.querySelectorAll('button, .mission-point, .base-platform').forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (hoverSound && systemActive) {
        hoverSound.currentTime = 0;
        hoverSound.volume = 0.3;
        hoverSound.play().catch(error => console.error("Error playing hover sound:", error));
      }
    });
    
    element.addEventListener('click', () => {
      if (clickSound && systemActive) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.5;
        clickSound.play().catch(error => console.error("Error playing click sound:", error));
      }
    });
  });
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!userId || !password) {
    errorMessage.textContent = 'ID and password required';
    if (errorSound) {
      errorSound.currentTime = 0;
      errorSound.play().catch(error => console.error("Error playing error sound:", error));
    }
    return;
  }
  
  // Display loading message
  errorMessage.textContent = 'Authenticating...';
  errorMessage.style.color = 'var(--text-primary)';
  
  try {
    // This uses email auth format
    // Make sure email follows a valid format
    let email;
    if (userId.includes('@')) {
      email = userId; // User entered full email
    } else {
      email = `${userId}@yourarma3ops.com`;
    }
    
    console.log(`Attempting to sign in with email: ${email}`);
    
    await auth.signInWithEmailAndPassword(email, password);
    
    // Auth state listener will handle the rest
    console.log("Authentication successful");
    
    // Clear form and error message
    loginForm.reset();
    errorMessage.textContent = '';
    
    // Set system as active
    systemActive = true;
    
    // Play sounds
    try {
      if (activationSound) {
        activationSound.load();
        activationSound.play().catch(err => console.error("Error playing activation sound:", err));
      }
      
      if (music) {
        music.load();
        music.volume = volumeSlider ? volumeSlider.value : 0.5;
        music.play().catch(err => console.error("Error playing music:", err));
      }
    } catch (audioError) {
      console.error("Audio error:", audioError);
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = `Login failed: ${error.message}`;
    errorMessage.style.color = 'var(--alert-color)';
    
    // Play error sound
    if (errorSound) {
      errorSound.currentTime = 0;
      errorSound.play().catch(error => console.error("Error playing error sound:", error));
    }
  }
});

// Continue as grunt - FIX AUDIO
continueAsGruntButton.addEventListener('click', () => {
  userRole = 'grunt';
  showUserDashboard(userRole);
  loginOverlay.style.display = 'none';
  
  // Set system as active
  systemActive = true;
  
  // Initialize grunt-only features
  initializeGruntFeatures();
  
  // Play custom click sound first
  if (clickSound) {
    clickSound.play().catch(err => console.error("Error playing click sound:", err));
  }
  
  // The key is to create new Audio elements instead of reusing the existing ones
  // This bypasses browser restrictions on audio playback without user interaction
  const tempActivationSound = new Audio('sounds/activation-sound.mp3');
  tempActivationSound.volume = 1.0;
  
  // Play activation sound immediately
  tempActivationSound.play().then(() => {
    console.log("Activation sound played successfully!");
    
    // Then play background music after activation sound
    setTimeout(() => {
      if (music) {
        music.volume = volumeSlider ? volumeSlider.value : 0.5;
        music.loop = true;
        music.play().then(() => {
          console.log("Background music started successfully!");
        }).catch(error => {
          console.error("Failed to play background music:", error);
          
          // Try with a new Audio element as fallback
          const tempMusic = new Audio('music/background-music.mp3');
          tempMusic.volume = volumeSlider ? volumeSlider.value : 0.5;
          tempMusic.loop = true;
          tempMusic.play().catch(err => console.error("Fallback music also failed:", err));
        });
      }
    }, 1000); // Wait 1 second after activation sound finishes
    
  }).catch(error => {
    console.error("Failed to play activation sound:", error);
    
    // If that fails, try the original approach as fallback
    if (activationSound) {
      activationSound.load();
      activationSound.currentTime = 0;
      activationSound.volume = 1.0;
      setTimeout(() => {
        activationSound.play().catch(err => console.error("Fallback activation sound failed:", err));
      }, 100);
    }
    
    // Still try to play the music
    setTimeout(() => {
      if (music) {
        music.load();
        music.currentTime = 0;
        music.volume = volumeSlider ? volumeSlider.value : 0.5;
        music.loop = true;
        music.play().catch(err => console.error("Music still failed:", err));
      }
    }, 500);
  });
  
  // Initialize UI
  initializeUIAfterLogin();
});

// Initialize UI after successful login
function initializeUIAfterLogin() {
  // Set system as active
  systemActive = true;
  
  try {
    // Ensure audio elements are fully loaded before playing
    if (activationSound) {
      // Force reload the sound
      activationSound.load();
      
      // Play with delay to ensure loading completes
      setTimeout(() => {
        activationSound.currentTime = 0;
        activationSound.volume = 1.0;
        const playPromise = activationSound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Error playing activation sound:", err);
          });
        }
      }, 100);
    }
    
    // Music with delay after activation sound
    if (music) {
      music.load();
      
      setTimeout(() => {
        music.currentTime = 0;
        music.volume = volumeSlider ? volumeSlider.value : 0.5;
        const musicPromise = music.play();
        
        if (musicPromise !== undefined) {
          musicPromise.catch(err => {
            console.error("Error playing music:", err);
          });
        }
      }, 500);
    }
  } catch (error) {
    console.error("Audio playback error:", error);
  }
  
  // Apply LCD screen overlay
  lcdOverlay.style.display = 'block';
  
  // Show resource panel
  const resourcesPanel = document.getElementById('resources-panel');
  if (resourcesPanel) {
    resourcesPanel.style.display = 'block';
  }
  
  // Fade in side panels
  setTimeout(() => {
    leftPanel.style.transition = 'opacity 1s ease-in';
    rightPanel.style.transition = 'opacity 1s ease-in';
    leftPanel.style.opacity = '1';
    rightPanel.style.opacity = '1';
  }, 500);
  
  // Initialize updating features
  updateDateTime();
  // Ensure clock is updated every second - FIXED CLOCK ISSUE
  window.clockInterval = setInterval(updateDateTime, 1000);
  
  // Load missions from local JSON files - MAKE SURE THIS HAPPENS FIRST
  loadLocalMissions().then(missions => {
    console.log("Loaded local missions:", missions);
    if (missions && missions.length > 0) {
      missions.forEach(mission => {
        if (mission.coordinates) {
          addMissionMarker(mission);
        }
      });
    }
  }).catch(error => {
    console.error("Error loading local missions:", error);
  });
  
  // Load missions from Firestore
  loadMissions().then(missions => {
    console.log("Loaded Firestore missions:", missions);
    if (missions && missions.length > 0) {
      missions.forEach(mission => {
        if (mission.coordinates) {
          addMissionPoint(mission);
        }
      });
    }
  }).catch(error => {
    console.error("Error loading Firestore missions:", error);
  });
  
  // Update resources display
  updateResourceDisplay();
  
  // Setup upgrade check interval
  setInterval(checkUpgrades, 60000); // Check every minute
  
  // Setup healing interval
  initializeHealTimer();
  
  // Initialize UI sounds
  initializeUISounds();
}

// Function to load missions from local JSON files - FIXED to match old code
async function loadLocalMissions() {
  try {
    // Read missions.json file
    const missionsResponse = await window.fs.readFile('data/missions.json', { encoding: 'utf8' });
    const missions = JSON.parse(missionsResponse);
    
    console.log('Successfully loaded missions from data/missions.json:', missions);
    
    if (!missions || missions.length === 0) {
      console.error('No missions found in missions.json file');
      // Fallback to sample missions if file not found or empty
      return [
        {
          id: 'mission1',
          name: 'OPERATION BLACKOUT',
          location: 'ALTIS - COORDINATES: 38.9072N, 77.0369E',
          difficulty: 'HIGH',
          payment: '$15,000',
          duration: '2.5 HRS',
          teamSize: 'SQUAD (4-8)',
          coordinates: { lat: 38.9072, lon: -77.0369 }
        },
        {
          id: 'mission2',
          name: 'OPERATION RED STORM',
          location: 'TANOA - COORDINATES: 51.5074N, 0.1278E',
          difficulty: 'MEDIUM',
          payment: '$12,000',
          duration: '2 HRS',
          teamSize: 'FIRETEAM (4)',
          coordinates: { lat: 51.5074, lon: -0.1278 }
        }
      ];
    }
    
    // Read intel.json file for additional mission info
    try {
      const intelResponse = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
      const intel = JSON.parse(intelResponse);
      
      console.log('Successfully loaded intel from data/intel.json:', intel);
      
      // Merge mission data with intel data
      missions.forEach(mission => {
        if (intel[mission.id]) {
          mission.intel = intel[mission.id];
        }
      });
    } catch (intelError) {
      console.error('Error loading intel.json:', intelError);
    }
    
    return missions;
  } catch (error) {
    console.error('Error loading missions.json:', error);
    // Fallback to sample missions if file not found
    return [
      {
        id: 'mission1',
        name: 'OPERATION BLACKOUT',
        location: 'ALTIS - COORDINATES: 38.9072N, 77.0369E',
        difficulty: 'HIGH',
        payment: '$15,000',
        duration: '2.5 HRS',
        teamSize: 'SQUAD (4-8)',
        coordinates: { lat: 38.9072, lon: -77.0369 }
      },
      {
        id: 'mission2',
        name: 'OPERATION RED STORM',
        location: 'TANOA - COORDINATES: 51.5074N, 0.1278E',
        difficulty: 'MEDIUM',
        payment: '$12,000',
        duration: '2 HRS',
        teamSize: 'FIRETEAM (4)',
        coordinates: { lat: 51.5074, lon: -0.1278 }
      }
    ];
  }
}

// Show appropriate dashboard based on user role
function showUserDashboard(role) {
  // Set system as active
  systemActive = true;
  
  // Show HQ button for all users
  hqButton.style.display = 'block';
  
  if (role === 'admin') {
    // Show admin controls
    document.getElementById('admin-controls').style.display = 'block';
  } else if (role === 'squadLead') {
    // Show squad leader controls
    document.getElementById('squad-controls').style.display = 'block';
  }
  
  // HQ button handler
  hqButton.addEventListener('click', () => {
    toggleHqPanel(true);
  });
  
  closeHqButton.addEventListener('click', () => {
    toggleHqPanel(false);
  });
  
  // Make HQ tabs clickable
  document.querySelectorAll('.hq-tab-button').forEach(tabButton => {
    tabButton.addEventListener('click', () => {
      const tabId = tabButton.getAttribute('data-tab');
      
      // Remove active class from all buttons and content
      document.querySelectorAll('.hq-tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.hq-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to current button and content
      tabButton.classList.add('active');
      document.getElementById(`${tabId}-content`).classList.add('active');
      
      // Play tab sound
      tabSound.play().catch(console.error);
    });
  });
  
  // Initialize the admin panel drag functionality
  const adminPanel = document.getElementById('admin-controls');
  if (adminPanel) {
    makeDraggable(adminPanel);
  }
}

// Make an element draggable
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;
  
  // Get drag handle
  const dragHandle = element.querySelector('.drag-handle');
  if (!dragHandle) return;
  
  // Make only one minimize button visible
  const minimizeButtons = element.querySelectorAll('.minimize-btn');
  if (minimizeButtons.length > 1) {
    for (let i = 1; i < minimizeButtons.length; i++) {
      minimizeButtons[i].style.display = 'none';
    }
  }
  
  // Drag start
  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    
    // Add grab cursor
    dragHandle.style.cursor = 'grabbing';
    
    // Prevent text selection during drag
    e.preventDefault();
  });
  
  // Drag end
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      dragHandle.style.cursor = 'grab';
    }
  });
  
  // Drag
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = (e.clientX - offsetX) + 'px';
      element.style.top = (e.clientY - offsetY) + 'px';
      element.style.bottom = 'auto'; // Remove bottom positioning
      element.style.transform = 'none'; // Remove any transform
    }
  });
}

// Toggle HQ panel
function toggleHqPanel(show) {
  if (show) {
    // Show HQ panel
    hqPanel.style.display = 'block';
    
    // Close other panels
    if (missionPanel.classList.contains('active')) {
      missionPanel.classList.remove('active');
    }
    
    if (intelPanel.classList.contains('active')) {
      intelPanel.classList.remove('active');
    }
    
    // Load team data
    loadBaseTeams();
    
    // Play tab sound
    tabSound.play().catch(console.error);
  } else {
    // Hide HQ panel
    hqPanel.style.display = 'none';
  }
}

// Initialize features for different roles
function initializeAdminFeatures() {
  // Admin-specific features
  loadAllMissions(true); // true = admin mode
  initializeMissionCreationTools();
}

function initializeSquadLeadFeatures() {
  // Squad leader features
  loadAvailableMissions();
  initializeDeploymentSystem();
  initializeBaseManagement();
  initializeResourceManagement();
}

function initializeGruntFeatures() {
  // Grunt features - view only
  loadAvailableMissions();
  initializeViewOnlyMode();
}

// Initialize view-only mode for grunts
function initializeViewOnlyMode() {
  // Hide upgrade buttons and controls
  document.querySelectorAll('.upgrade-button, .deployment-button, .send-deployment-button').forEach(button => {
    button.style.display = 'none';
  });
}

// Initialize resource management for squad leaders
function initializeResourceManagement() {
  // Get user data regularly and update display
  updateResourceDisplay();
  setInterval(updateResourceDisplay, 60000); // Update every minute
}

// Update resource display
async function updateResourceDisplay() {
  if (!currentUser) {
    // For guests, show default resources
    updateBaseResourceDisplay({
      money: 100000,
      resources: {
        fuel: 500,
        ammo: 500,
        medicine: 500,
        food: 500,
        materials: 500
      }
    });
    return;
  }
  
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    if (!userData) {
      // If no user data found, show default resources
      updateBaseResourceDisplay({
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        }
      });
      return;
    }
    
    // Update both resource displays - in squad panel and base tab
    updateBaseResourceDisplay(userData);
    
    // Update squad panel resource display
    const resourceDisplay = document.getElementById('resource-display');
    if (!resourceDisplay) return;
    
    resourceDisplay.innerHTML = '';
    
    // Add money display
    const moneyDisplay = document.createElement('div');
    moneyDisplay.className = 'resource-item';
    moneyDisplay.innerHTML = `
      <div class="resource-name">MONEY:</div>
      <div class="resource-value">$${userData.money.toLocaleString()}</div>
    `;
    resourceDisplay.appendChild(moneyDisplay);
    
    // Add other resources
    if (userData.resources) {
      for (const [resource, amount] of Object.entries(userData.resources)) {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.innerHTML = `
          <div class="resource-name">${resource.toUpperCase()}:</div>
          <div class="resource-value">${amount}</div>
        `;
        resourceDisplay.appendChild(resourceItem);
      }
    }
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Update base resource display in the BASE tab
function updateBaseResourceDisplay(userData) {
  const baseResourcesDisplay = document.getElementById('base-resources');
  if (!baseResourcesDisplay) return;
  
  baseResourcesDisplay.innerHTML = '';
  
  // Add money display
  const moneyDisplay = document.createElement('div');
  moneyDisplay.className = 'resource-item';
  moneyDisplay.innerHTML = `
    <div class="resource-name">MONEY:</div>
    <div class="resource-value">$${userData.money.toLocaleString()}</div>
  `;
  baseResourcesDisplay.appendChild(moneyDisplay);
  
  // Add other resources
  if (userData.resources) {
    for (const [resource, amount] of Object.entries(userData.resources)) {
      const resourceItem = document.createElement('div');
      resourceItem.className = 'resource-item';
      resourceItem.innerHTML = `
        <div class="resource-name">${resource.toUpperCase()}:</div>
        <div class="resource-value">${amount}</div>
      `;
      baseResourcesDisplay.appendChild(resourceItem);
    }
  }
}

// Initialize decorative elements
function initializeDecorativeElements() {
  // Ensure side panels are visible
  leftPanel.style.opacity = '1';
  rightPanel.style.opacity = '1';
  
  // Create random radar blips
  setInterval(() => {
    if (!systemActive) return;
    
    const radarContainer = document.querySelector('.radar-container');
    if (!radarContainer) return;
    
    // Remove old dots that aren't the initial ones
    const oldDots = document.querySelectorAll('.radar-dot.temp');
    oldDots.forEach(dot => dot.remove());
    
    // Add 1-3 new random dots
    const numDots = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'radar-dot temp';
      
      // Random position within radar
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 75;
      const x = 75 + Math.cos(angle) * distance;
      const y = 75 + Math.sin(angle) * distance;
      
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      
      // Random color based on distance (closer = more likely to be alert color)
      const colorRandom = Math.random();
      if (distance < 25 || colorRandom < 0.3) {
        dot.style.background = 'var(--alert-color)';
        dot.style.width = '4px';
        dot.style.height = '4px';
      } else if (distance < 50 || colorRandom < 0.7) {
        dot.style.background = 'var(--warning-color)';
      } else {
        dot.style.background = 'var(--highlight-color)';
      }
      
      // Fade out effect
      dot.style.opacity = '1';
      dot.style.transition = 'opacity 3s';
      
      radarContainer.appendChild(dot);
      
      setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => dot.remove(), 3000);
      }, 2000);
    }
  }, 2000);
  
  // Animate waveform
  setInterval(() => {
    if (!systemActive) return;
    
    const wavePath = document.querySelector('.wave-svg path');
    if (!wavePath) return;
    
    // Generate a different waveform pattern
    const points = [];
    const segments = 8;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 200;
      const yOffset = Math.random() * 30 - 15;
      points.push([x, 25 + yOffset]);
    }
    
    // Create SVG path from points
    let pathData = `M${points[0][0]},${points[0][1]}`;
    
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i][0] + points[i-1][0]) / 2;
      const yc = (points[i][1] + points[i-1][1]) / 2;
      pathData += ` Q${points[i-1][0]},${points[i-1][1]} ${xc},${yc}`;
    }
    
    // Smooth transition to new path
    wavePath.style.transition = 'all 1s ease-in-out';
    wavePath.setAttribute('d', pathData);
  }, 2000);
  
  // Update system values periodically
  setInterval(() => {
    if (!systemActive) return;
    
    // Update random system values
    document.querySelectorAll('.system-fill').forEach(fill => {
      const currentWidth = parseInt(fill.style.width);
      // Small random fluctuation in system values
      const fluctuation = Math.random() * 6 - 3; // Range: -3 to +3
      const newWidth = Math.max(10, Math.min(99, currentWidth + fluctuation));
      fill.style.width = `${newWidth}%`;
      
      // Update percentage text if it exists
      const valueText = fill.closest('.system-item')?.querySelector('div:last-child');
      if (valueText) {
        valueText.textContent = `${Math.round(newWidth)}%`;
      }
      
      // Change color based on value
      if (newWidth < 30) {
        fill.style.background = 'var(--alert-color)';
        if (valueText) valueText.style.color = 'var(--alert-color)';
      } else if (newWidth < 65) {
        fill.style.background = 'var(--warning-color)';
        if (valueText) valueText.style.color = 'var(--warning-color)';
      } else if (!fill.hasAttribute('style') || fill.style.background.includes('var(--warning-color)')) {
        // Don't change color if it already has a custom background
      } else {
        fill.style.background = 'var(--highlight-color)';
        if (valueText) valueText.style.color = 'var(--text-primary)';
      }
    });
  }, 5000);
}

// Mission Panel System
function initializeMissionPanel() {
  closeMissionButton.addEventListener('click', () => {
    missionPanel.classList.remove('active');
    activeMission = null;
    
    // Resume auto-rotation when mission panel is closed
    resumeRotation();
  });
  
  // Intel button functionality
  missionIntelButton.addEventListener('click', () => {
    if (activeMission) {
      openIntelPanel(activeMission.id);
    }
  });
}

// Intel Panel System
function initializeIntelPanel() {
  closeIntelButton.addEventListener('click', () => {
    intelPanel.classList.remove('active');
  });
}

// Load mission intel
async function openIntelPanel(missionId) {
  try {
    // First try to get intel from Firestore
    const intelDoc = await db.collection('intel').doc(missionId).get();
    
    if (intelDoc.exists) {
      const missionIntel = intelDoc.data();
      displayIntelData(missionIntel);
      return;
    }
    
    // If not found in Firestore, try from local intel.json
    const intelResponse = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
    const intelData = JSON.parse(intelResponse);
    
    if (intelData[missionId]) {
      displayIntelData(intelData[missionId]);
      return;
    }
    
    // If still not found, log it (no notification)
    console.log('No intel available for this mission');
  } catch (error) {
    console.error('Error loading intel:', error);
  }
}

// Display intel data
function displayIntelData(missionIntel) {
  // Play intel sound
  if (intelSound && intelSound.readyState >= 2) {
    intelSound.currentTime = 0;
    intelSound.play().catch(console.error);
  }
  
  // Update intel panel content
  document.getElementById('intel-title').textContent = missionIntel.title || 'MISSION INTEL';
  
  // Create intel content container
  let intelContent = '';
  
  // Only add content paragraph if there's actual content
  if (missionIntel.content && missionIntel.content.trim() !== '') {
    intelContent += `<p>${missionIntel.content}</p>`;
  }
  
  // Add images if available
  if (missionIntel.images && missionIntel.images.length > 0) {
    missionIntel.images.forEach(imgSrc => {
      intelContent += `<img src="data/images/${imgSrc}" class="intel-image" alt="Mission Intel">`;
    });
  }
  
  // If there's no content and no images, show a placeholder message
  if (intelContent === '') {
    intelContent = '<p>No intel data available.</p>';
  }
  
  document.getElementById('intel-content').innerHTML = intelContent;
  
  // Show intel panel
  intelPanel.classList.add('active');
}

// Globe rotation control
function pauseRotation() {
  rotating = false;
  lastInteractionTime = Date.now();
  
  // Clear any existing timeout
  if (rotationTimeout) {
    clearTimeout(rotationTimeout);
  }
  
  // Set timeout to resume rotation after 3 seconds of inactivity
  rotationTimeout = setTimeout(resumeRotation, 3000);
}

function resumeRotation() {
  // Don't resume if a mission is active
  if (activeMission) return;
  
  rotating = true;
}

// Add HQ location in South Africa
const HQ_LOCATION = {
  lat: -30.5595, 
  lon: 22.9375,
  name: "MOTHER BASE - SOUTH AFRICA"
};

// Globe Visualization System (use your existing code with modifications for Firebase)
async function initializeGlobe() {
  // Add HQ marker and deployment paths
  
  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('globe'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Position and orientation
  camera.position.z = 20;
  scene.rotation.y = 0.5; // Initial rotation
  
  // Globe interaction
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  
  // Force enable systemActive for globe interaction
  systemActive = true;
  
  // Mouse control for globe - restored from original with debug
  document.addEventListener('mousedown', (e) => {
    console.log("Mouse down event captured, systemActive:", systemActive);
    
    // Always allow dragging regardless of systemActive state
    isDragging = true;
    previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Reset velocity when starting to drag
    velocity = { x: 0, y: 0 };
    
    // Pause rotation when user interacts with globe
    pauseRotation();
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  document.addEventListener('mousemove', (e) => {
    // Allow dragging regardless of systemActive state
    if (isDragging) {
      pauseRotation();
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      // Set velocity based on mouse movement
      velocity.x = deltaMove.x * 0.005;
      velocity.y = deltaMove.y * 0.005;
      
      scene.rotation.y += velocity.x;
      
      // Apply rotation limits to prevent going upside down
      const newXRotation = scene.rotation.x + velocity.y;
      const maxRotation = Math.PI / 2 * 0.95; // Slightly less than 90 degrees
      
      if (newXRotation <= maxRotation && newXRotation >= -maxRotation) {
        scene.rotation.x = newXRotation;
      }
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    }
  });
  
  // Create textured globe using earth.jpg
  function createTexturedGlobe() {
    // Create a texture loader
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('textures/earth.jpg');
    
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    
    // Create material with texture
    const material = new THREE.MeshBasicMaterial({
      map: earthTexture,
      transparent: true,
      opacity: 0.9
    });
    
    // Create mesh and add to scene
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    return sphere;
  }
  
  // Create the textured globe
  const earthGlobe = createTexturedGlobe();
  
  // Add HQ marker on the globe
  addHQMarker();
  
  // Handle clicking on mission points
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  globe.addEventListener('click', (event) => {
    // Always allow clicking regardless of systemActive state
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with mission points
    const intersects = raycaster.intersectObjects(missionMarkers);
    if (intersects.length > 0) {
      const missionId = intersects[0].object.userData.missionId;
      displayMissionDetails(missionId);
    }
    
    // Check for intersections with deployment points
    const deploymentIntersects = raycaster.intersectObjects(deploymentMarkers);
    if (deploymentIntersects.length > 0 && deploymentIntersects[0].object.userData.deploymentId) {
      const deploymentId = deploymentIntersects[0].object.userData.deploymentId;
      showDeploymentDetails(deploymentId);
    }
  });
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Apply momentum with friction if not dragging
    if (!isDragging && !rotating) {
      velocity.x *= friction;
      velocity.y *= friction;
      
      // Only apply velocity if it's significant
      if (Math.abs(velocity.x) > 0.0001) {
        scene.rotation.y += velocity.x;
      }
      
      if (Math.abs(velocity.y) > 0.0001) {
        // Apply rotation limits
        const newXRotation = scene.rotation.x + velocity.y;
        const maxRotation = Math.PI / 2 * 0.95;
        
        if (newXRotation <= maxRotation && newXRotation >= -maxRotation) {
          scene.rotation.x = newXRotation;
        } else {
          // If we hit the limits, stop the y velocity
          velocity.y = 0;
        }
      }
    }
    
    // Auto rotate globe if enabled - doubled speed
    if (rotating) {
      scene.rotation.y += 0.001; // Doubled from 0.0005
    }
    
    // Animate mission points
    if (missionMarkers.length > 0) {
      missionMarkers.forEach(point => {
        if (point.userData.ring) {
          const ring = point.userData.ring;
          ring.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.material.opacity = 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
          
          // Make ring face the camera
          ring.lookAt(camera.position);
        }
      });
    }
    
    // Animate deployment points
    if (deploymentMarkers.length > 0) {
      deploymentMarkers.forEach(point => {
        if (point.userData.ring) {
          const ring = point.userData.ring;
          ring.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.material.opacity = 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
          
          // Make ring face the camera
          ring.lookAt(camera.position);
        }
      });
    }
    
    renderer.render(scene, camera);
  }
  animate();
  
  // Window Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Utility Functions - NOTIFICATION SYSTEM REMOVED
function showNotification(text) {
  // This function is now disabled - just log to console
  console.log("Notification (disabled):", text);
}

// CLOCK FIX - Update the time every second
function updateDateTime() {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  if (dateTimeDisplay) {
    dateTimeDisplay.textContent = `${hours}:${minutes}:${seconds} UTC`;
  } else {
    console.error("Date time display element not found");
  }
}

// Volume Control
volumeSlider.addEventListener('input', (e) => {
  if (music.readyState >= 2) {
    music.volume = e.target.value;
  }
});

// Sign out function
function signOut() {
  // Stop music
  music.pause();
  music.currentTime = 0;
  
  // Hide panels
  leftPanel.style.opacity = '0';
  rightPanel.style.opacity = '0';
  
  // Hide mission panel if open
  if (missionPanel.classList.contains('active')) {
    missionPanel.classList.remove('active');
  }
  
  // Hide intel panel if open
  if (intelPanel.classList.contains('active')) {
    intelPanel.classList.remove('active');
  }
  
  // Hide HQ panel if open
  if (hqPanel.style.display === 'block') {
    hqPanel.style.display = 'none';
  }
  
  // Hide admin and squad leader controls
  document.getElementById('admin-controls').style.display = 'none';
  document.getElementById('squad-controls').style.display = 'none';
  
  // Set system to inactive
  systemActive = false;
  
  // Sign out of Firebase
  auth.signOut().catch(error => {
    console.error('Sign out error:', error);
  });
  
  // Show login overlay
  loginOverlay.style.display = 'flex';
}

// Add HQ marker to the globe
function addHQMarker() {
  const lat = HQ_LOCATION.lat;
  const lon = HQ_LOCATION.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create HQ marker - Light blue color
  const geometry = new THREE.SphereGeometry(0.2, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0x00BFFF }); // Light blue
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add HQ identifier
  point.userData = { 
    name: HQ_LOCATION.name,
    type: 'hq-point'
  };
  
  scene.add(point);
  
  // Add pulsing effect (ring) - Light blue
  const ringGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00BFFF, // Light blue
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.copy(point.position);
  
  // Orient ring to face outward from globe center
  ring.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(ring);
  
  // Store reference for animation
  point.userData.ring = ring;
  
  return point;
}

// Add a mission marker to the globe from local data - Match old code exactly
function addMissionMarker(mission) {
  const lat = mission.coordinates.lat;
  const lon = mission.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create marker with red color for mission
  const geometry = new THREE.SphereGeometry(0.15, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0x8B0000 }); // Dark red
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add mission identifier and make clickable
  point.userData = { 
    missionId: mission.id,
    type: 'mission-point'
  };
  
  scene.add(point);
  
  // Add pulsing effect (ring)
  const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8B0000, // Dark red
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.copy(point.position);
  
  // Orient ring to face outward from globe center
  ring.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(ring);
  
  // Store reference for animation
  point.userData.ring = ring;
  
  // Store in mission markers array
  missionMarkers.push(point);
  
  // Add this to show it worked
  console.log(`Added mission marker for ${mission.id} at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Create deployment path between HQ and destination
function createDeploymentPath(deployment) {
  // Start point (HQ)
  const startLat = HQ_LOCATION.lat;
  const startLon = HQ_LOCATION.lon;
  const startPhi = (90 - startLat) * Math.PI/180;
  const startTheta = (startLon + 180) * Math.PI/180;
  
  const startX = -10 * Math.sin(startPhi) * Math.cos(startTheta);
  const startY = 10 * Math.cos(startPhi);
  const startZ = 10 * Math.sin(startPhi) * Math.sin(startTheta);
  
  // End point (deployment location)
  const endLat = deployment.coordinates.lat;
  const endLon = deployment.coordinates.lon;
  const endPhi = (90 - endLat) * Math.PI/180;
  const endTheta = (endLon + 180) * Math.PI/180;
  
  const endX = -10 * Math.sin(endPhi) * Math.cos(endTheta);
  const endY = 10 * Math.cos(endPhi);
  const endZ = 10 * Math.sin(endPhi) * Math.sin(endTheta);
  
  // Create line geometry
  const points = [];
  points.push(new THREE.Vector3(startX, startY, startZ));
  points.push(new THREE.Vector3(endX, endY, endZ));
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ 
    color: 0xFFD700, // Gold
    transparent: true,
    opacity: 0.6
  });
  
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  
  // Create soldier icon moving along the path
  const soldierGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const soldierMaterial = new THREE.MeshBasicMaterial({ color: 0x32CD32 }); // Green
  const soldier = new THREE.Mesh(soldierGeometry, soldierMaterial);
  
  // Start at HQ
  soldier.position.set(startX, startY, startZ);
  scene.add(soldier);
  
  // Store deployment data
  soldier.userData = {
    deploymentId: deployment.id,
    startPosition: new THREE.Vector3(startX, startY, startZ),
    endPosition: new THREE.Vector3(endX, endY, endZ),
    startTime: deployment.startTime.toDate(),
    endTime: deployment.endTime.toDate(),
    isReturning: false,
    returnStartTime: null,
    returnEndTime: null,
    line: line
  };
  
  return soldier;
}

// Update deployment soldier positions
function updateDeploymentSoldiers() {
  if (!scene) return;
  
  scene.children.forEach(object => {
    if (object.userData && object.userData.deploymentId) {
      const now = new Date();
      
      if (!object.userData.isReturning) {
        // Going to deployment
        const startTime = object.userData.startTime;
        const endTime = object.userData.endTime;
        const totalTime = endTime - startTime;
        const elapsedTime = now - startTime;
        const progress = Math.min(1, Math.max(0, elapsedTime / totalTime));
        
        // Update position
        object.position.lerpVectors(
          object.userData.startPosition,
          object.userData.endPosition,
          progress
        );
        
        // Check if reached destination
        if (progress >= 1) {
          object.userData.isReturning = true;
          object.userData.returnStartTime = now;
          object.userData.returnEndTime = new Date(now.getTime() + (totalTime / 3)); // Return is 1/3 the time
        }
      } else {
        // Returning to HQ
        const startTime = object.userData.returnStartTime;
        const endTime = object.userData.returnEndTime;
        const totalTime = endTime - startTime;
        const elapsedTime = now - startTime;
        const progress = Math.min(1, Math.max(0, elapsedTime / totalTime));
        
        // Update position (reverse direction)
        object.position.lerpVectors(
          object.userData.endPosition,
          object.userData.startPosition,
          progress
        );
        
        // Check if reached HQ
        if (progress >= 1) {
          // Remove soldier and line when completed
          if (object.userData.line) {
            scene.remove(object.userData.line);
          }
          scene.remove(object);
        }
      }
    }
  });
}

// Display mission details
async function displayMissionDetails(missionId) {
  console.log("Displaying mission details for ID:", missionId);
  
  try {
    // Try to find mission in Firebase first
    const missionDoc = await db.collection('missions').doc(missionId).get();
    
    if (missionDoc.exists) {
      const mission = {
        id: missionDoc.id,
        ...missionDoc.data()
      };
      displayMissionData(mission);
      return;
    }
    
    // If not found in Firebase, try local data
    const missionsResponse = await window.fs.readFile('data/missions.json', { encoding: 'utf8' });
    const missions = JSON.parse(missionsResponse);
    
    const mission = missions.find(m => m.id === missionId);
    
    if (mission) {
      // Also try to get intel data for this mission
      try {
        const intelResponse = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
        const intelData = JSON.parse(intelResponse);
        
        if (intelData[missionId]) {
          mission.intel = intelData[missionId];
        }
      } catch (intelError) {
        console.error('Error loading intel data:', intelError);
      }
      
      displayMissionData(mission);
      return;
    }
    
    // If still not found, show log message
    console.log('Mission not found:', missionId);
  } catch (error) {
    console.error('Error retrieving mission details:', error);
  }
}

// Display mission data
function displayMissionData(mission) {
  // Set active mission
  activeMission = mission;
  
  // Play mission sound
  if (missionSound && missionSound.readyState >= 2) {
    missionSound.currentTime = 0;
    missionSound.play().catch(console.error);
  }
  
  // Update mission panel content
  document.getElementById('mission-title').textContent = mission.name;
  document.getElementById('mission-location').textContent = mission.location;
  document.getElementById('mission-difficulty').textContent = mission.difficulty;
  document.getElementById('mission-payment').textContent = mission.payment;
  document.getElementById('mission-duration').textContent = mission.duration;
  document.getElementById('mission-team-size').textContent = mission.teamSize;
  
  // Display mission image if available
  const missionPanel = document.getElementById('mission-panel');
  let missionImageElement = missionPanel.querySelector('.mission-image');
  
  if (mission.image) {
    // Create or update mission image element
    if (!missionImageElement) {
      missionImageElement = document.createElement('img');
      missionImageElement.className = 'mission-image';
      
      // Insert after mission location
      const locationElement = document.getElementById('mission-location').parentElement;
      locationElement.parentNode.insertBefore(missionImageElement, locationElement.nextSibling);
    }
    
    missionImageElement.src = `data/images/${mission.image}`;
    missionImageElement.style.display = 'block';
  } else if (missionImageElement) {
    // Hide mission image if none available
    missionImageElement.style.display = 'none';
  }
  
  // Show accept button only for squad leads and available missions
  const acceptButton = document.getElementById('accept-mission-button');
  if (acceptButton) {
    if (userRole === 'squadLead' && (!mission.status || mission.status === 'available')) {
      acceptButton.style.display = 'block';
    } else {
      acceptButton.style.display = 'none';
    }
  }
  
  // Show mission panel
  missionPanel.classList.add('active');
  
  // Stop rotation when mission is displayed
  rotating = false;
}

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
  initializeMissionPanel();
  initializeIntelPanel();
  initializeGlobe();
  initializeDecorativeElements();
  
  // Update deployment soldiers every second
  setInterval(updateDeploymentSoldiers, 1000);
  
  // Fix volume icon if not showing
  const volumeIcon = document.getElementById('volume-icon');
  if (volumeIcon) {
    volumeIcon.onerror = function() {
      // Fallback if image fails to load
      this.style.display = 'none';
      document.getElementById('volume-control').innerHTML += '<span style="color:#53a774;">VOL</span>';
    };
  }
  
  // Add sign out button
  const statusBar = document.getElementById('status-bar');
  const signOutButton = document.createElement('button');
  signOutButton.textContent = 'SIGN OUT';
  signOutButton.className = 'sign-out-button';
  signOutButton.addEventListener('click', signOut);
  statusBar.appendChild(signOutButton);
  
  // Force side panels to be visible
  if (leftPanel) leftPanel.style.opacity = '1';
  if (rightPanel) rightPanel.style.opacity = '1';
  
  // Set system as active to allow globe interaction
  systemActive = true;
  
  // Initialize UI sound system
  initializeUISounds();
  
  // Initial clock update
  updateDateTime();
  
  // Set interval for updating the clock - FIXES CLOCK ISSUE
  window.clockInterval = setInterval(updateDateTime, 1000);
});

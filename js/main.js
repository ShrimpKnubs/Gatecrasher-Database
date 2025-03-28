// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKhc_Nl4kMAUfd3Ze43jG6hM1nt9FCsIg",
  authDomain: "gatecrasher-database.firebaseapp.com",
  projectId: "gatecrasher-database",
  storageBucket: "gatecrasher-database.firebaseapp.com",
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
const resourcesPanel = document.getElementById('resources-panel');

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

// Continue as grunt - Improved Audio that plays simultaneously
continueAsGruntButton.addEventListener('click', () => {
  userRole = 'grunt';
  showUserDashboard(userRole);
  loginOverlay.style.display = 'none';
  
  // Set system as active
  systemActive = true;
  
  // Initialize grunt-only features
  initializeGruntFeatures();
  
  // PLAY BOTH SOUNDS SIMULTANEOUSLY - improved approach
  const playAudioSimultaneously = () => {
    // Create a new Audio element for activation sound
    const tempActivation = new Audio('sounds/activation-sound.mp3');
    tempActivation.volume = 1.0;
    
    // Play activation sound
    const activationPromise = tempActivation.play();
    
    // Play music at the same time
    if (music) {
      music.volume = volumeSlider ? volumeSlider.value : 0.5;
      music.loop = true;
      const musicPromise = music.play();
      
      if (musicPromise !== undefined) {
        musicPromise
          .then(() => console.log("Background music started successfully"))
          .catch(err => {
            console.error("Failed to play background music:", err);
            // Fallback music player
            setTimeout(() => {
              const tempMusic = new Audio('music/background-music.mp3');
              tempMusic.volume = volumeSlider ? volumeSlider.value : 0.5;
              tempMusic.loop = true;
              tempMusic.play().catch(e => console.error("Fallback music also failed:", e));
            }, 100);
          });
      }
    }
    
    // Log any issues with activation sound but don't block music
    if (activationPromise !== undefined) {
      activationPromise
        .then(() => console.log("Activation sound playing successfully"))
        .catch(error => console.error("Failed to play activation sound:", error));
    }
  };
  
  // Try to play the sounds
  playAudioSimultaneously();
  
  // Initialize UI
  initializeUIAfterLogin();
});

// Initialize UI after successful login
function initializeUIAfterLogin() {
  // Set system as active
  systemActive = true;
  
  // Apply LCD screen overlay
  lcdOverlay.style.display = 'block';
  
  // Show resource panel
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
  // Ensure clock is updated every second
  window.clockInterval = setInterval(updateDateTime, 1000);
  
  // IMPROVED MISSION LOADING - Load from both sources
  loadMissions().then(missions => {
    console.log("Loaded missions:", missions);
    if (missions && missions.length > 0) {
      missions.forEach(mission => {
        if (mission.coordinates) {
          addMissionMarker(mission);
        }
      });
    }
  }).catch(error => {
    console.error("Error loading missions:", error);
  });
  
  // Update resources display and set up real-time listeners
  updateResourceDisplay();
  
  // Initialize resource listener for real-time updates
  if (typeof setupResourcesListener === 'function') {
    setupResourcesListener();
  } else {
    console.warn("Resource listener function not available");
  }
  
  // Initialize UI sounds
  initializeUISounds();
  
  // Fix Intel Panel position to always be on the left side
  const intelPanel = document.getElementById('intel-panel');
  if (intelPanel) {
    intelPanel.style.left = '-40vw';
    intelPanel.style.right = 'auto';
  }
}

// IMPROVED MISSION LOADING - Prioritize direct fetch over window.fs.readFile
async function loadMissions() {
  try {
    // First try the direct fetch approach (like in old code)
    const response = await fetch('data/missions.json');
    if (response.ok) {
      const missions = await response.json();
      console.log('Successfully loaded missions via fetch:', missions);
      
      // Try to load intel data
      try {
        const intelResponse = await fetch('data/intel.json');
        if (intelResponse.ok) {
          const intel = await intelResponse.json();
          
          // Merge mission data with intel data
          missions.forEach(mission => {
            if (intel[mission.id]) {
              mission.intel = intel[mission.id];
            }
          });
        }
      } catch (intelError) {
        console.error('Error loading intel data:', intelError);
      }
      
      return missions;
    }
  } catch (fetchError) {
    console.error('Fetch error:', fetchError);
    // If fetch fails, continue to try window.fs.readFile
  }
  
  // Fallback to window.fs.readFile if available
  try {
    if (typeof window.fs !== 'undefined' && window.fs.readFile) {
      const missionsContent = await window.fs.readFile('data/missions.json', { encoding: 'utf8' });
      const missions = JSON.parse(missionsContent);
      console.log('Successfully loaded missions via window.fs.readFile:', missions);
      
      // Try to load intel data
      try {
        const intelContent = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
        const intel = JSON.parse(intelContent);
        
        // Merge mission data with intel data
        missions.forEach(mission => {
          if (intel[mission.id]) {
            mission.intel = intel[mission.id];
          }
        });
      } catch (intelError) {
        console.error('Error loading intel data:', intelError);
      }
      
      return missions;
    }
  } catch (fsError) {
    console.error('File system reading error:', fsError);
  }
  
  // Fallback to hardcoded sample missions
  console.warn('Using fallback sample missions');
  return [
    {
      id: 'mission1',
      name: 'FAILED DIPLOMACY',
      location: 'Vietnam',
      difficulty: 'MEDIUM',
      payment: '$27,525.75',
      duration: '2.5 HRS',
      teamSize: 'SQUAD (3-6)',
      coordinates: {
        lat: 10.536421,
        lon: 106.285339
      }
    }
  ];
}

// Debug helper to find the intel.json file
async function findIntelJsonPath() {
  const possiblePaths = [
    'data/intel.json',
    './data/intel.json',
    '../data/intel.json',
    'intel.json',
    './intel.json'
  ];
  
  for (const path of possiblePaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        console.log(`Found intel.json at path: ${path}`);
        return path;
      }
    } catch (error) {
      console.log(`Path ${path} not available`);
    }
  }
  
  console.warn("Could not find intel.json in any of the expected paths");
  return null;
}

// Load intel data - Fixed approach with path discovery
async function loadIntel(missionId) {
  let intelJsonPath = 'data/intel.json'; // Default path
  
  // Try to discover the correct path to intel.json
  const discoveredPath = await findIntelJsonPath();
  if (discoveredPath) {
    intelJsonPath = discoveredPath;
  }
  
  console.log(`Using path for intel.json: ${intelJsonPath}`);

  // If no mission ID specified, try to load all intel data
  if (!missionId) {
    try {
      // First try direct fetch
      const response = await fetch(intelJsonPath);
      if (response.ok) {
        const intelData = await response.json();
        console.log("Successfully loaded all intel data via fetch:", intelData);
        return intelData;
      }
    } catch (fetchError) {
      console.error('Fetch error for all intel:', fetchError);
    }
    
    // Try file system if available
    try {
      if (typeof window.fs !== 'undefined' && window.fs.readFile) {
        const intelContent = await window.fs.readFile(intelJsonPath, { encoding: 'utf8' });
        const intelData = JSON.parse(intelContent);
        console.log("Successfully loaded all intel data via fs.readFile:", intelData);
        return intelData;
      }
    } catch (fsError) {
      console.error('File system reading error for all intel:', fsError);
    }
    
    // Final fallback - hardcoded sample intel
    console.warn("All intel loading methods failed, using fallback");
    return {
      "mission1": {
        "title": "FAILED DIPLOMACY INTEL",
        "content": "A diplomatic meeting has gone wrong, and the embassy staff need immediate extraction. Local forces are hostile and the situation is deteriorating rapidly. Your team needs to get in, secure the staff, and get out before the situation worsens.",
        "images": ["goblin.jpg"]
      }
    };
  }

  // Otherwise, load intel for specific mission
  try {
    // First try direct fetch for the specific mission
    const response = await fetch(intelJsonPath);
    if (response.ok) {
      const allIntelData = await response.json();
      console.log(`All intel data loaded via fetch:`, allIntelData);
      const missionIntel = allIntelData[missionId];
      console.log(`Intel for mission ${missionId}:`, missionIntel);
      return missionIntel;
    }
  } catch (fetchError) {
    console.error('Fetch error for intel:', fetchError);
  }
  
  // Try file system if available
  try {
    if (typeof window.fs !== 'undefined' && window.fs.readFile) {
      const intelContent = await window.fs.readFile(intelJsonPath, { encoding: 'utf8' });
      const allIntelData = JSON.parse(intelContent);
      console.log(`All intel data loaded via fs.readFile:`, allIntelData);
      const missionIntel = allIntelData[missionId];
      console.log(`Intel for mission ${missionId}:`, missionIntel);
      return missionIntel;
    }
  } catch (fsError) {
    console.error('File system reading error for intel:', fsError);
  }
  
  // Try hardcoded fallback for mission1
  if (missionId === 'mission1') {
    console.warn(`Using hardcoded fallback for mission1`);
    return {
      "title": "FAILED DIPLOMACY INTEL",
      "content": "A diplomatic meeting has gone wrong, and the embassy staff need immediate extraction. Local forces are hostile and the situation is deteriorating rapidly. Your team needs to get in, secure the staff, and get out before the situation worsens.",
      "images": ["goblin.jpg"]
    };
  }
  
  // No intel found for this mission
  console.warn(`No intel found for mission ${missionId}`);
  return null;
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
    
    // Make sure intel panel is properly closed
    if (intelPanel.classList.contains('active')) {
      intelPanel.classList.remove('active');
      intelPanel.style.left = '-40vw';
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
  loadMissions(); // Load all missions
  
  // Setup admin panel resource controls
  setupAdminResourceControls();
}

// Setup admin resource controls
function setupAdminResourceControls() {
  // Get admin controls container
  const adminContent = document.querySelector('.admin-content');
  if (!adminContent) return;
  
  // Add resource management section
  const resourceSection = document.createElement('div');
  resourceSection.className = 'admin-section';
  resourceSection.innerHTML = `
    <div class="admin-section-title">RESOURCE MANAGEMENT</div>
    <button id="reset-resources-button">RESET DEFAULT RESOURCES</button>
    <button id="add-resources-button">ADD TEST RESOURCES</button>
  `;
  
  // Add to admin panel
  adminContent.appendChild(resourceSection);
  
  // Add event listeners
  document.getElementById('reset-resources-button').addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button').addEventListener('click', addTestResources);
}

// Reset user resources to default
async function resetUserResources() {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Default resource values
    const defaultResources = {
      money: 100000,
      resources: {
        fuel: 500,
        ammo: 500,
        medicine: 500,
        food: 500,
        materials: 500
      }
    };
    
    // Update the current user's resources
    await db.collection('users').doc(currentUser.uid).update(defaultResources);
    
    // Show notification
    showNotification('RESOURCES RESET TO DEFAULT');
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error('Error resetting resources:', error);
    showNotification('ERROR RESETTING RESOURCES');
  }
}

// Add test resources
async function addTestResources() {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Resources to add
    const addResources = {
      money: firebase.firestore.FieldValue.increment(50000),
      'resources.fuel': firebase.firestore.FieldValue.increment(200),
      'resources.ammo': firebase.firestore.FieldValue.increment(200),
      'resources.medicine': firebase.firestore.FieldValue.increment(200),
      'resources.food': firebase.firestore.FieldValue.increment(200),
      'resources.materials': firebase.firestore.FieldValue.increment(200)
    };
    
    // Update the current user's resources
    await db.collection('users').doc(currentUser.uid).update(addResources);
    
    // Show notification
    showNotification('TEST RESOURCES ADDED');
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error('Error adding test resources:', error);
    showNotification('ERROR ADDING TEST RESOURCES');
  }
}

function initializeSquadLeadFeatures() {
  // Squad leader features
  loadMissions();
  initializeResourceManagement();
}

function initializeGruntFeatures() {
  // Grunt features - view only
  loadMissions();
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
  try {
    let userData;
    
    if (currentUser) {
      // For authenticated users, get data from Firebase
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      userData = userDoc.data();
    } else {
      // For guests, use default values
      userData = {
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        }
      };
    }
    
    // Update the resource monitor in top left
    updateResourceMonitor(userData);
    
    // Also update the base resources display if it exists
    const baseResourcesDisplay = document.getElementById('base-resources');
    if (baseResourcesDisplay) {
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
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Update the animated resource monitor in top left
function updateResourceMonitor(userData) {
  const resourceMonitorContent = document.getElementById('resource-monitor-content');
  if (!resourceMonitorContent) return;
  
  // Clear current content
  resourceMonitorContent.innerHTML = '';
  
  // Add money with special styling
  const moneyItem = document.createElement('div');
  moneyItem.className = 'resource-monitor-item';
  moneyItem.innerHTML = `
    <div class="resource-monitor-label">MONEY</div>
    <div class="resource-monitor-value money-value">$${userData.money.toLocaleString()}</div>
  `;
  resourceMonitorContent.appendChild(moneyItem);
  
  // Add money progress bar
  const moneyBar = document.createElement('div');
  moneyBar.className = 'resource-bar money-bar';
  // Calculate money percentage (max visual at 1 million)
  const moneyPercentage = Math.min(100, (userData.money / 1000000) * 100);
  moneyBar.innerHTML = `<div class="resource-fill" style="width: ${moneyPercentage}%"></div>`;
  resourceMonitorContent.appendChild(moneyBar);
  
  // Add other resources
  if (userData.resources) {
    for (const [resource, amount] of Object.entries(userData.resources)) {
      const resourceItem = document.createElement('div');
      resourceItem.className = 'resource-monitor-item';
      resourceItem.innerHTML = `
        <div class="resource-monitor-label">${resource.toUpperCase()}</div>
        <div class="resource-monitor-value">${amount}</div>
      `;
      resourceMonitorContent.appendChild(resourceItem);
      
      // Add resource progress bar (max visual at 1000)
      const resourceBar = document.createElement('div');
      resourceBar.className = 'resource-bar';
      const resourcePercentage = Math.min(100, (amount / 1000) * 100);
      resourceBar.innerHTML = `<div class="resource-fill" style="width: ${resourcePercentage}%"></div>`;
      resourceMonitorContent.appendChild(resourceBar);
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
  // Create and add the vertical tab close button for mission panel
  const missionVerticalTab = document.createElement('button');
  missionVerticalTab.className = 'vertical-tab-close';
  missionVerticalTab.id = 'mission-vertical-close';
  missionVerticalTab.setAttribute('aria-label', 'Close mission panel');
  missionVerticalTab.setAttribute('title', 'Close mission panel');
  
  // Add the vertical tab to the mission panel if it doesn't already exist
  if (missionPanel && !document.getElementById('mission-vertical-close')) {
    missionPanel.appendChild(missionVerticalTab);
    
    // Add event listener for the vertical tab
    missionVerticalTab.addEventListener('click', () => {
      missionPanel.classList.remove('active');
      activeMission = null;
      
      // Resume auto-rotation when mission panel is closed
      resumeRotation();
    });
  }
  
  // Still keep the original close button functionality as a backup
  if (closeMissionButton) {
    closeMissionButton.addEventListener('click', () => {
      missionPanel.classList.remove('active');
      activeMission = null;
      
      // Resume auto-rotation when mission panel is closed
      resumeRotation();
    });
  }
  
  // Intel button functionality
  missionIntelButton.addEventListener('click', () => {
    if (activeMission) {
      console.log("Opening intel for mission:", activeMission);
      // Call the openIntelPanel function in the global scope
      window.openIntelPanel(activeMission.id || activeMission);
      
      // Force the intel panel to be visible
      const intelPanel = document.getElementById('intel-panel');
      if (intelPanel) {
        intelPanel.style.left = '-40vw'; // Start off-screen
        intelPanel.classList.add('active');
        
        // Force a reflow to ensure transition works
        intelPanel.offsetHeight; 
        
        // Show the panel
        intelPanel.style.left = '0';
      }
    } else {
      showNotification('SELECT A MISSION FIRST');
    }
  });
}

// Intel Panel System
function initializeIntelPanel() {
  // Create and add the vertical tab close button for intel panel
  const intelVerticalTab = document.createElement('button');
  intelVerticalTab.className = 'vertical-tab-close';
  intelVerticalTab.id = 'intel-vertical-close';
  intelVerticalTab.setAttribute('aria-label', 'Close intel panel');
  intelVerticalTab.setAttribute('title', 'Close intel panel');
  
  // Add the vertical tab to the intel panel if it doesn't already exist
  if (intelPanel && !document.getElementById('intel-vertical-close')) {
    intelPanel.appendChild(intelVerticalTab);
    
    // Add event listener for the vertical tab
    intelVerticalTab.addEventListener('click', () => {
      intelPanel.classList.remove('active');
      intelPanel.style.left = '-40vw'; // Move back off-screen
    });
  }
  
  // Still keep the original close button functionality as a backup
  if (closeIntelButton) {
    closeIntelButton.addEventListener('click', () => {
      intelPanel.classList.remove('active');
      intelPanel.style.left = '-40vw'; // Move back off-screen
    });
  }
  
  // Force load intel.json on startup to verify it works
  fetch('data/intel.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Successfully pre-loaded intel.json:", data);
    })
    .catch(error => {
      console.error("Error pre-loading intel.json:", error);
    });
}

// Load mission intel - Improved with multiple sources
async function openIntelPanel(missionId) {
  try {
    // Load intel data
    const missionIntel = await loadIntel(missionId);
    
    if (!missionIntel) {
      console.log('No intel available for this mission');
      return;
    }
    
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
  } catch (error) {
    console.error('Error loading intel:', error);
  }
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

// Globe Visualization System
async function initializeGlobe() {
  // Create Three.js scene
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
  
  // Initialize markers array correctly
  if (!window.missionMarkers) {
    window.missionMarkers = [];
  }
  
  if (!window.deploymentMarkers) {
    window.deploymentMarkers = [];
  }
  
  // Globe interaction
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  
  // Force enable systemActive for globe interaction
  systemActive = true;
  
  // Mouse control for globe
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
    let intersects = raycaster.intersectObjects(missionMarkers);
    if (intersects.length > 0) {
      const missionId = intersects[0].object.userData.missionId;
      displayMissionDetails(missionId);
      return;
    }
    
    // Check for intersections with deployment points - make sure we look in the correct array
    if (deploymentMarkers && deploymentMarkers.length > 0) {
      intersects = raycaster.intersectObjects(deploymentMarkers);
      
      if (intersects.length > 0) {
        const userData = intersects[0].object.userData;
        if (userData.type === 'deployment-point') {
          console.log("Clicked on deployment marker:", userData);
          if (typeof displayDeploymentDetails === 'function') {
            displayDeploymentDetails(userData);
          } else {
            // Fallback if function not defined yet
            showNotification('DEPLOYMENT DETAILS VIEW NOT AVAILABLE');
            console.error('displayDeploymentDetails function not found');
          }
          return;
        }
      }
    }
    
    // Debug output when nothing is clicked
    console.log("Click detected but no markers found. Markers:", missionMarkers.length, "Deployment markers:", deploymentMarkers.length);
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
    
    // Animate mission points - fixed rings to remain static
    if (missionMarkers.length > 0) {
      missionMarkers.forEach(point => {
        if (point.userData.ring) {
          const ring = point.userData.ring;
          ring.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.material.opacity = 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
        }
      });
    }
    
    // Animate deployment markers if they exist
    if (window.deploymentMarkers && window.deploymentMarkers.length > 0) {
      window.deploymentMarkers.forEach(point => {
        if (point.userData.ring) {
          const ring = point.userData.ring;
          ring.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.003);
          ring.material.opacity = 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
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

// Utility Functions - IMPROVED NOTIFICATION SYSTEM
// Updated showNotification function to make notifications visible
function showNotification(text) {
  const notificationElement = document.getElementById('notification');
  if (!notificationElement) return;
  
  // Set text and show notification
  notificationElement.textContent = text;
  notificationElement.style.display = 'block';
  notificationElement.classList.add('show');
  
  // Remove after 3 seconds
  setTimeout(() => {
    notificationElement.classList.remove('show');
    setTimeout(() => {
      notificationElement.style.display = 'none';
    }, 300);
  }, 3000);
}

// Add event listeners for squad panel
document.addEventListener('DOMContentLoaded', function() {
  // Connect the send-deployment-button if it exists
  const sendDeploymentButton = document.getElementById('send-deployment-button');
  if (sendDeploymentButton) {
    sendDeploymentButton.addEventListener('click', function() {
      if (activeMission && activeMission.id) {
        confirmSendSquad(activeMission.id);
      } else {
        showNotification('SELECT A DEPLOYMENT FIRST');
      }
    });
  }
  
  // Make notification visible
  const notification = document.getElementById('notification');
  if (notification) {
    notification.style.display = 'block';
  }
});

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
  
  // Create a parent object for the ring to keep it aligned with globe surface
  const ringParent = new THREE.Object3D();
  ringParent.position.copy(point.position);
  
  // Orient parent to face outward from globe center
  ringParent.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(ringParent);
  
  // Add pulsing effect (ring)
  const ringGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00BFFF, // Light blue
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  
  // Add ring to its parent
  ringParent.add(ring);
  
  // Position ring a tiny bit away from the globe's surface to prevent z-fighting
  ring.position.set(0, 0, 0.01);
  
  // Rotate the ring to face outward
  ring.rotation.x = Math.PI / 2;
  
  // Store reference for animation
  point.userData.ring = ring;
  point.userData.ringParent = ringParent;
  
  console.log(`Added HQ marker at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Add a mission marker to the globe - IMPROVED
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
  
  // Log for debugging
  console.log(`Added mission marker for ${mission.id} at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Display mission details - IMPROVED with globe centering
async function displayMissionDetails(missionId) {
  console.log("Displaying mission details for ID:", missionId);
  
  try {
    // Load all missions first
    const missions = await loadMissions();
    
    // Find the specific mission
    const mission = missions.find(m => m.id === missionId);
    
    if (!mission) {
      console.error("Mission not found with ID:", missionId);
      return;
    }
    
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
    
    // Show mission panel
    missionPanel.classList.add('active');
    
    // Stop rotation when mission is displayed
    rotating = false;
    
    // Globe centering removed as requested
    
    // Show notification
    showNotification(`MISSION BRIEFING: ${mission.name}`);
  } catch (error) {
    console.error('Error displaying mission details:', error);
  }
}

// Load team data from Firebase
async function loadBaseTeams() {
  if (!currentUser) return;
  
  try {
    // Get all teams for the current user
    const teamsRef = db.collection('teams').where('userId', '==', currentUser.uid);
    const snapshot = await teamsRef.get();
    
    if (snapshot.empty) {
      console.log("No teams found for user");
      return;
    }
    
    console.log("Teams loaded successfully");
  } catch (error) {
    console.error('Error loading teams:', error);
  }
}

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
  initializeMissionPanel();
  initializeIntelPanel();
  initializeGlobe();
  initializeDecorativeElements();
  
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
  
  // Set interval for updating the clock
  window.clockInterval = setInterval(updateDateTime, 1000);
  
  // Add button hover glow effect to all buttons
  addButtonGlowEffect();
  
  // Apply background image to vanta-background
  const vantaBackground = document.getElementById('vanta-background');
  if (vantaBackground) {
    vantaBackground.style.backgroundImage = "url('textures/background.png')";
    vantaBackground.style.backgroundSize = "cover";
    vantaBackground.style.backgroundRepeat = "no-repeat";
  }
  
  // Make sure all UI elements are under the LCD overlay
  const lcdOverlay = document.getElementById('lcd-overlay');
  if (lcdOverlay) {
    lcdOverlay.style.zIndex = '6';
    document.querySelectorAll('.side-panel, #mission-panel, #intel-panel, #hq-panel, #resources-panel, #admin-controls, #squad-controls').forEach(element => {
      if (element) {
        // Make sure these elements are below LCD overlay but above globe
        const currentZIndex = parseInt(window.getComputedStyle(element).zIndex) || 0;
        if (currentZIndex >= 6) {
          element.style.zIndex = '5';
        }
      }
    });
  }
});

// Add glow effect to all buttons
function addButtonGlowEffect() {
  const style = document.createElement('style');
  style.textContent = `
    button, .mission-point, .base-platform {
      transition: all 0.3s ease !important;
    }
    
    button:hover, .mission-point:hover, .base-platform:hover {
      box-shadow: 0 0 15px rgba(83, 167, 116, 0.5) !important;
    }
    
    /* Special treatment for main buttons */
    #login-button:hover, #activate-button:hover, .upgrade-button:hover, .intel-button:hover {
      box-shadow: 0 0 20px rgba(83, 167, 116, 0.7) !important;
      transform: translateY(-2px) !important;
    }
    
    #login-button:active, #activate-button:active, .upgrade-button:active, .intel-button:active {
      transform: translateY(1px) !important;
      box-shadow: 0 0 10px rgba(83, 167, 116, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
}


// Function to center the globe on specific coordinates - disabled as per request
function centerGlobeOnCoordinates(lat, lon) {
  // Feature disabled as requested
  console.log("Globe centering feature disabled");
  return;
}

// Make openIntelPanel function available globally to ensure it can be called from anywhere
window.openIntelPanel = async function(missionId) {
  try {
    console.log("Global openIntelPanel called with:", missionId);
    
    // Get a string mission ID no matter what was passed in
    let missionIdStr = missionId;
    if (typeof missionId === 'object') {
      missionIdStr = missionId.id || 'mission1';
    }
    
    console.log("Using mission ID:", missionIdStr);
    
    // DIRECT APPROACH: Load intel data directly from the file
    let intelData = null;
    
    try {
      // Try direct fetch first - most reliable method
      const response = await fetch('data/intel.json');
      if (response.ok) {
        const allIntel = await response.json();
        console.log("All intel data loaded:", allIntel);
        
        // Get the specific mission's intel
        intelData = allIntel[missionIdStr];
        console.log("Extracted intel for mission:", missionIdStr, intelData);
      } else {
        console.error("Failed to fetch intel.json:", response.status);
      }
    } catch (fetchError) {
      console.error("Error fetching intel.json:", fetchError);
    }
    
    // If we still have no intel, use a fallback for mission1
    if (!intelData && missionIdStr === 'mission1') {
      console.warn("Using fallback intel for mission1");
      intelData = {
        title: "FAILED DIPLOMACY INTEL",
        content: "A diplomatic meeting has gone wrong, and the embassy staff need immediate extraction. Local forces are hostile and the situation is deteriorating rapidly. Your team needs to get in, secure the staff, and get out before the situation worsens.",
        images: ["goblin.jpg"]
      };
    } else if (!intelData) {
      // Generic fallback for other missions
      console.warn("Using generic fallback intel");
      intelData = {
        title: "MISSION INTEL FOR " + missionIdStr,
        content: "Mission intel data could not be loaded. Please check the data/intel.json file to ensure it contains information for this mission.",
        images: []
      };
    }
    
    // *** IMPORTANT: Make sure we're targeting the correct intel panel ***
    // We want the mission intel panel, not the intel team tab in HQ
    const missionIntelPanel = document.getElementById('intel-panel');
    if (!missionIntelPanel) {
      console.error("Mission intel panel not found");
      return;
    }
    
    // Play intel sound
    if (intelSound && intelSound.readyState >= 2) {
      intelSound.currentTime = 0;
      intelSound.play().catch(error => console.error("Error playing intel sound:", error));
    }
    
    // Update the panel title - make sure we're targeting the right element
    const titleElement = missionIntelPanel.querySelector('#intel-title');
    if (titleElement) {
      titleElement.textContent = intelData.title || 'MISSION INTEL';
    } else {
      console.error("Intel title element not found in mission intel panel");
    }
    
    // Create HTML for intel content in a simple, direct way
    let htmlContent = '';
    
    // Add the content text
    if (intelData.content) {
      htmlContent += `<p>${intelData.content}</p>`;
      console.log("Added content paragraph:", intelData.content);
    }
    
    // Add images if available
    if (intelData.images && intelData.images.length > 0) {
      intelData.images.forEach(imgSrc => {
        htmlContent += `<img src="data/images/${imgSrc}" class="intel-image" alt="Mission Intel">`;
        console.log("Added image:", imgSrc);
      });
    }
    
    // Fallback if nothing was added
    if (htmlContent === '') {
      htmlContent = '<p>No intel data available.</p>';
      console.warn("No content was generated, using fallback");
    }
    
    console.log("Final HTML content:", htmlContent);
    
    // Find the content container inside the MISSION intel panel
    const contentContainer = missionIntelPanel.querySelector('#intel-content');
    if (contentContainer) {
      console.log("Setting content to mission intel panel content container");
      contentContainer.innerHTML = htmlContent;
    } else {
      console.error("Intel content container not found in mission intel panel");
    }
    
    // Force the panel to be positioned on the left side with correct z-index
    missionIntelPanel.style.left = '-40vw';
    missionIntelPanel.style.right = 'auto';
    missionIntelPanel.style.zIndex = '4'; // Below LCD overlay (z-index 6)
    
    // Show the panel
    missionIntelPanel.classList.add('active');
    
    // Force a reflow and animate
    missionIntelPanel.offsetHeight;
    missionIntelPanel.style.left = '0';
    
    // Show notification
    showNotification('ACCESSING MISSION INTEL');
    
  } catch (error) {
    console.error('Error displaying intel:', error);
    showNotification('ERROR DISPLAYING INTEL');
  }
};

// Check if the intel panel is working correctly
document.addEventListener('DOMContentLoaded', function() {
  // Test the intel panel functionality
  const intelPanel = document.getElementById('intel-panel');
  const missionIntelButton = document.getElementById('mission-intel-button');
  
  if (intelPanel && missionIntelButton) {
    console.log("Intel panel and button found");
    
    // Monitor the intel button for clicks
    missionIntelButton.addEventListener('click', function(event) {
      console.log("Intel button clicked directly");
    });
    
    // Make sure the close button works correctly
    const closeIntelButton = document.getElementById('close-intel');
    if (closeIntelButton) {
      closeIntelButton.addEventListener('click', function() {
        console.log("Close intel button clicked");
        intelPanel.classList.remove('active');
        intelPanel.style.left = '-40vw';
      });
    }
  } else {
    console.error("Intel panel elements not found!");
  }
});


// Fix Intel panel issues - Log to console when update is applied
console.log("Intel panel fixes applied - Version 1.1");

// Add a helper function to check the functionality of openIntelPanel
function testIntelPanelSetup() {
  try {
    const intelPanel = document.getElementById('intel-panel');
    console.log("Intel panel element found:", intelPanel !== null);
    console.log("Intel panel z-index:", window.getComputedStyle(intelPanel).zIndex);
    console.log("Intel panel defined functions:", {
      openIntelPanel: typeof window.openIntelPanel === 'function',
      loadIntel: typeof loadIntel === 'function'
    });
    return "Intel panel configuration check completed";
  } catch (error) {
    console.error("Error checking intel panel setup:", error);
    return "Error checking intel panel setup";
  }
}

// Auto-run the test if in development mode
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  console.log(testIntelPanelSetup());
}


// Add debug function to manually test intel loading
function testIntelLoading(missionId = 'mission1') {
  console.log("Running intel loading test for mission:", missionId);
  
  // Try to find intel.json
  findIntelJsonPath().then(path => {
    console.log("Intel.json path discovery result:", path);
    
    // Try to load all intel data
    loadIntel().then(allIntel => {
      console.log("All intel data:", allIntel);
      
      // Try to load specific mission intel
      loadIntel(missionId).then(missionIntel => {
        console.log("Mission intel for " + missionId + ":", missionIntel);
        
        if (missionIntel) {
          console.log("Intel loading test SUCCESSFUL");
          
          // Test opening intel panel
          if (typeof window.openIntelPanel === 'function') {
            console.log("Opening intel panel for test...");
            window.openIntelPanel(missionId);
          }
        } else {
          console.error("Intel loading test FAILED - No intel found for mission:", missionId);
        }
      });
    });
  });
  
  return "Intel loading test initiated. Check console for results.";
}

// Expose testing function globally
window.testIntelLoading = testIntelLoading;

// Console message to indicate this update has been applied
console.log("Intel display fix applied - Version 2.0");


// Test function to view mission1 intel directly
window.viewMission1Intel = function() {
  // Hardcoded mission1 intel for direct testing
  const mission1Intel = {
    title: "FAILED DIPLOMACY INTEL",
    content: "A diplomatic meeting has gone wrong, and the embassy staff need immediate extraction. Local forces are hostile and the situation is deteriorating rapidly. Your team needs to get in, secure the staff, and get out before the situation worsens.",
    images: ["goblin.jpg"]
  };
  
  // Get the intel panel
  const intelPanel = document.getElementById('intel-panel');
  if (!intelPanel) {
    console.error("Intel panel not found");
    return;
  }
  
  // Update the panel title
  document.getElementById('intel-title').textContent = mission1Intel.title || 'MISSION INTEL';
  
  // Create HTML content
  let htmlContent = '';
  
  // Add content paragraph
  if (mission1Intel.content) {
    htmlContent += `<p>${mission1Intel.content}</p>`;
  }
  
  // Add images
  if (mission1Intel.images && mission1Intel.images.length > 0) {
    mission1Intel.images.forEach(imgSrc => {
      htmlContent += `<img src="data/images/${imgSrc}" class="intel-image" alt="Mission Intel">`;
    });
  }
  
  // Set the content
  const contentContainer = document.getElementById('intel-content');
  if (contentContainer) {
    contentContainer.innerHTML = htmlContent;
    console.log("Set intel content directly:", htmlContent);
  }
  
  // Show the panel
  intelPanel.style.left = '-40vw';
  intelPanel.style.right = 'auto';
  intelPanel.style.zIndex = '7';
  intelPanel.classList.add('active');
  intelPanel.offsetHeight;
  intelPanel.style.left = '0';
  
  showNotification('VIEWING MISSION1 INTEL DIRECTLY');
};

// Simple fix applied - Console message
console.log("Simple intel display fix applied - Version 3.0");


// Test function to view mission1 intel directly
window.viewMission1Intel = function() {
  // Hardcoded mission1 intel for direct testing
  const mission1Intel = {
    title: "FAILED DIPLOMACY INTEL",
    content: "A diplomatic meeting has gone wrong, and the embassy staff need immediate extraction. Local forces are hostile and the situation is deteriorating rapidly. Your team needs to get in, secure the staff, and get out before the situation worsens.",
    images: ["goblin.jpg"]
  };
  
  // Get the intel panel
  const intelPanel = document.getElementById('intel-panel');
  if (!intelPanel) {
    console.error("Intel panel not found");
    return;
  }
  
  // Update the panel title
  document.getElementById('intel-title').textContent = mission1Intel.title || 'MISSION INTEL';
  
  // Create HTML content
  let htmlContent = '';
  
  // Add content paragraph
  if (mission1Intel.content) {
    htmlContent += `<p>${mission1Intel.content}</p>`;
  }
  
  // Add images
  if (mission1Intel.images && mission1Intel.images.length > 0) {
    mission1Intel.images.forEach(imgSrc => {
      htmlContent += `<img src="data/images/${imgSrc}" class="intel-image" alt="Mission Intel">`;
    });
  }
  
  // Set the content
  const contentContainer = document.getElementById('intel-content');
  if (contentContainer) {
    contentContainer.innerHTML = htmlContent;
    console.log("Set intel content directly:", htmlContent);
  }
  
  // Show the panel
  intelPanel.style.left = '-40vw';
  intelPanel.style.right = 'auto';
  intelPanel.style.zIndex = '7';
  intelPanel.classList.add('active');
  intelPanel.offsetHeight;
  intelPanel.style.left = '0';
  
  showNotification('VIEWING MISSION1 INTEL DIRECTLY');
};

// Simple fix applied - Console message
console.log("Simple intel display fix applied - Version 3.0");


// Function to test if we're targeting the correct panel
window.testIntelPanels = function() {
  // First, identify all elements with ID 'intel-content'
  const allIntelContentElements = document.querySelectorAll('#intel-content');
  console.log(`Found ${allIntelContentElements.length} elements with ID 'intel-content'`);
  
  allIntelContentElements.forEach((el, index) => {
    console.log(`Element ${index + 1}:`, el);
    console.log(`  Parent:`, el.parentElement);
    console.log(`  Grandparent:`, el.parentElement?.parentElement);
    
    // Add a temporary class to help identify it visually
    el.classList.add(`intel-content-${index + 1}`);
    
    // Temporarily make it visible with a background color
    el.style.border = '2px solid yellow';
    el.textContent = `Intel content element ${index + 1}`;
    
    // Reset after 5 seconds
    setTimeout(() => {
      el.style.border = '';
      el.classList.remove(`intel-content-${index + 1}`);
    }, 5000);
  });
  
  // Check the mission intel panel specifically
  const missionIntelPanel = document.getElementById('intel-panel');
  console.log("Mission intel panel:", missionIntelPanel);
  
  if (missionIntelPanel) {
    const contentInMissionPanel = missionIntelPanel.querySelector('#intel-content');
    console.log("Content element in mission intel panel:", contentInMissionPanel);
    
    if (contentInMissionPanel) {
      contentInMissionPanel.style.border = '2px solid green';
      contentInMissionPanel.textContent = 'THIS IS THE MISSION INTEL PANEL CONTENT';
      
      // Reset after 5 seconds
      setTimeout(() => {
        contentInMissionPanel.style.border = '';
      }, 5000);
    }
  }
  
  // Check intel team tab in HQ
  const intelTeamTab = document.getElementById('intel-content'); // This might actually be targeting any element with this ID
  console.log("Element with ID 'intel-content' (might be intel team tab):", intelTeamTab);
  
  return "Test complete. Check console for results.";
};

// Tab-fixing version applied
console.log("Intel panel tab fix applied - Version 4.0");


// Test function to check all z-indices
window.checkZIndices = function() {
  console.log("Checking z-indices of important elements:");
  
  const elements = {
    "LCD Overlay": document.getElementById('lcd-overlay'),
    "Mission Panel": document.getElementById('mission-panel'),
    "Intel Panel": document.getElementById('intel-panel'),
    "HQ Panel": document.getElementById('hq-panel'),
    "Resources Panel": document.querySelector('.resources-panel')
  };
  
  for (const [name, element] of Object.entries(elements)) {
    if (element) {
      const zIndex = window.getComputedStyle(element).zIndex;
      console.log(`${name}: z-index = ${zIndex}`);
    } else {
      console.log(`${name}: Element not found`);
    }
  }
  
  return "Z-index check complete. See console for results.";
};

// Z-index fix applied
console.log("Intel panel z-index fix applied - Version 4.1");


// Ensure resources panel appears below intel panel
document.addEventListener('DOMContentLoaded', function() {
  // Set correct z-index for resources panel after DOM is loaded
  const resourcesPanel = document.querySelector('.resources-panel');
  if (resourcesPanel) {
    resourcesPanel.style.zIndex = '3';
  }
});

// Function to compare intel and resources panel z-indices
window.compareZIndices = function() {
  const intelPanel = document.getElementById('intel-panel');
  const resourcesPanel = document.querySelector('.resources-panel');
  
  if (intelPanel && resourcesPanel) {
    const intelZIndex = window.getComputedStyle(intelPanel).zIndex;
    const resourcesZIndex = window.getComputedStyle(resourcesPanel).zIndex;
    
    console.log("Intel Panel z-index:", intelZIndex);
    console.log("Resources Panel z-index:", resourcesZIndex);
    
    if (parseInt(intelZIndex) > parseInt(resourcesZIndex)) {
      console.log("✅ Correct: Intel panel appears above resources panel");
    } else {
      console.log("❌ Issue: Resources panel appears above or at same level as intel panel");
    }
  } else {
    console.log("Could not find both panels to compare");
  }
  
  return "Z-index comparison complete. See console for results.";
};

// Resource panel z-index fix applied
console.log("Resource panel z-index fix applied - Version 4.2");


// Function to ensure vertical tabs are added when panels are shown
function ensureVerticalTabs() {
  // For mission panel
  const missionPanel = document.getElementById('mission-panel');
  if (missionPanel && !document.getElementById('mission-vertical-close')) {
    const missionVerticalTab = document.createElement('button');
    missionVerticalTab.className = 'vertical-tab-close';
    missionVerticalTab.id = 'mission-vertical-close';
    missionVerticalTab.setAttribute('aria-label', 'Close mission panel');
    missionVerticalTab.setAttribute('title', 'Close mission panel');
    
    missionPanel.appendChild(missionVerticalTab);
    
    missionVerticalTab.addEventListener('click', () => {
      missionPanel.classList.remove('active');
      activeMission = null;
      resumeRotation();
    });
  }
  
  // For intel panel
  const intelPanel = document.getElementById('intel-panel');
  if (intelPanel && !document.getElementById('intel-vertical-close')) {
    const intelVerticalTab = document.createElement('button');
    intelVerticalTab.className = 'vertical-tab-close';
    intelVerticalTab.id = 'intel-vertical-close';
    intelVerticalTab.setAttribute('aria-label', 'Close intel panel');
    intelVerticalTab.setAttribute('title', 'Close intel panel');
    
    intelPanel.appendChild(intelVerticalTab);
    
    intelVerticalTab.addEventListener('click', () => {
      intelPanel.classList.remove('active');
      intelPanel.style.left = '-40vw';
    });
  }
}

// Run once on startup and also when DOM content is loaded
ensureVerticalTabs();
document.addEventListener('DOMContentLoaded', ensureVerticalTabs);

// Run periodically to handle dynamic panel creation
setInterval(ensureVerticalTabs, 5000);

// Vertical tabs feature has been applied
console.log("Vertical close tabs added to panels - Version 5.0");


// Function to ensure vertical tabs are added when panels are shown
function ensureVerticalTabs() {
  // For mission panel
  const missionPanel = document.getElementById('mission-panel');
  if (missionPanel && !document.getElementById('mission-vertical-close')) {
    const missionVerticalTab = document.createElement('button');
    missionVerticalTab.className = 'vertical-tab-close';
    missionVerticalTab.id = 'mission-vertical-close';
    missionVerticalTab.setAttribute('aria-label', 'Close mission panel');
    missionVerticalTab.setAttribute('title', 'Close mission panel');
    
    missionPanel.appendChild(missionVerticalTab);
    
    missionVerticalTab.addEventListener('click', () => {
      missionPanel.classList.remove('active');
      activeMission = null;
      resumeRotation();
    });
  }
  
  // For intel panel
  const intelPanel = document.getElementById('intel-panel');
  if (intelPanel && !document.getElementById('intel-vertical-close')) {
    const intelVerticalTab = document.createElement('button');
    intelVerticalTab.className = 'vertical-tab-close';
    intelVerticalTab.id = 'intel-vertical-close';
    intelVerticalTab.setAttribute('aria-label', 'Close intel panel');
    intelVerticalTab.setAttribute('title', 'Close intel panel');
    
    intelPanel.appendChild(intelVerticalTab);
    
    intelVerticalTab.addEventListener('click', () => {
      intelPanel.classList.remove('active');
      intelPanel.style.left = '-40vw';
    });
  }
}

// Run once on startup and also when DOM content is loaded
ensureVerticalTabs();
document.addEventListener('DOMContentLoaded', ensureVerticalTabs);

// Run periodically to handle dynamic panel creation
setInterval(ensureVerticalTabs, 5000);

// Vertical tabs feature has been applied
console.log("Vertical close tabs added to panels - Version 5.0");


// Final polish for vertical tabs
console.log("Vertical tabs polished - no line, X buttons removed - Version 5.1");


// Initialize firebase hosting service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Firebase Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
}

// Display deployment details when clicking on a deployment marker
function displayDeploymentDetails(userData) {
  try {
    const deployment = userData.deployment;
    
    if (!deployment) {
      console.error('Deployment data not found');
      return;
    }
    
    console.log('Displaying deployment details:', deployment);
    
    // Always use mission panel with send squad option
    displayDeploymentInMissionPanel(deployment);
  } catch (error) {
    console.error('Error displaying deployment details:', error);
  }
}

// Helper to get active deployment details
async function getActiveDeploymentDetails(deploymentId) {
  if (!currentUser) return null;
  
  try {
    // Try to find in active deployments collection
    const snapshot = await db.collection('activeDeployments')
      .where('deploymentId', '==', deploymentId)
      .where('userId', '==', currentUser.uid)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching active deployment:", error);
    return null;
  }
}

// Display deployment in mission panel
function displayDeploymentInMissionPanel(deployment) {
  // Play mission sound
  if (missionSound && missionSound.readyState >= 2) {
    missionSound.currentTime = 0;
    missionSound.play().catch(console.error);
  }
  
  // Update mission panel content with deployment info
  document.getElementById('mission-title').textContent = deployment.name || `${deployment.primaryResource.toUpperCase()} DEPLOYMENT`;
  document.getElementById('mission-location').textContent = deployment.location;
  document.getElementById('mission-difficulty').textContent = deployment.difficulty || 'MEDIUM';
  
  // Format payment based on available data
  const paymentText = deployment.resources && deployment.resources.money 
    ? `${deployment.resources.money.toLocaleString()}`
    : (deployment.moneyReward ? `${deployment.moneyReward.toLocaleString()}` : 'VARIES');
  document.getElementById('mission-payment').textContent = paymentText;
  
  // Set duration
  document.getElementById('mission-duration').textContent = `${deployment.duration || 3} DAYS`;
  document.getElementById('mission-team-size').textContent = 'SQUAD (4-6)';
  
  // Show squad deploy button if user is squad leader
  const acceptButton = document.getElementById('accept-mission-button');
  const sendDeploymentButton = document.getElementById('send-deployment-button');
  
  if (acceptButton) {
    acceptButton.style.display = 'none'; // Hide accept mission button
  }
  
  if (sendDeploymentButton) {
    if (userRole === 'squadLead') {
      sendDeploymentButton.style.display = 'block';
      
      // Add click handler to send squad to this deployment
      sendDeploymentButton.onclick = function() {
        confirmSendSquad(deployment.id);
      };
    } else {
      sendDeploymentButton.style.display = 'none';
    }
  }
  
  // Show mission panel
  const missionPanel = document.getElementById('mission-panel');
  missionPanel.classList.add('active');
  
  // Stop rotation when mission is displayed
  rotating = false;
  
  // Set active mission to this deployment for other functions
  activeMission = deployment;
  
  // Show notification
  showNotification(`DEPLOYMENT BRIEFING: ${deployment.name || deployment.primaryResource.toUpperCase() + ' DEPLOYMENT'}`);
}

// Display deployment details when clicking on a deployment marker
function displayDeploymentDetails(userData) {
  try {
    const deployment = userData.deployment;
    
    if (!deployment) {
      console.error('Deployment data not found');
      return;
    }
    
    console.log('Displaying deployment details:', deployment);
    
    // Always use mission panel with send squad option
    displayDeploymentInMissionPanel(deployment);
  } catch (error) {
    console.error('Error displaying deployment details:', error);
  }
}

// Helper to get active deployment details
async function getActiveDeploymentDetails(deploymentId) {
  if (!currentUser) return null;
  
  try {
    // Try to find in active deployments collection
    const snapshot = await db.collection('activeDeployments')
      .where('deploymentId', '==', deploymentId)
      .where('userId', '==', currentUser.uid)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching active deployment:", error);
    return null;
  }
}

// Display deployment in mission panel
function displayDeploymentInMissionPanel(deployment) {
  // Play mission sound
  if (missionSound && missionSound.readyState >= 2) {
    missionSound.currentTime = 0;
    missionSound.play().catch(console.error);
  }
  
  // Update mission panel content with deployment info
  document.getElementById('mission-title').textContent = deployment.name || `${deployment.primaryResource.toUpperCase()} DEPLOYMENT`;
  document.getElementById('mission-location').textContent = deployment.location;
  document.getElementById('mission-difficulty').textContent = deployment.difficulty || 'MEDIUM';
  
  // Format payment based on available data
  const paymentText = deployment.resources && deployment.resources.money 
    ? `${deployment.resources.money.toLocaleString()}`
    : (deployment.moneyReward ? `${deployment.moneyReward.toLocaleString()}` : 'VARIES');
  document.getElementById('mission-payment').textContent = paymentText;
  
  // Set duration
  document.getElementById('mission-duration').textContent = `${deployment.duration || 3} DAYS`;
  document.getElementById('mission-team-size').textContent = 'SQUAD (4-6)';
  
  // Show squad deploy button if user is squad leader
  const acceptButton = document.getElementById('accept-mission-button');
  const sendDeploymentButton = document.getElementById('send-deployment-button');
  
  if (acceptButton) {
    acceptButton.style.display = 'none'; // Hide accept mission button
  }
  
  if (sendDeploymentButton) {
    if (userRole === 'squadLead') {
      sendDeploymentButton.style.display = 'block';
      
      // Add click handler to send squad to this deployment
      sendDeploymentButton.onclick = function() {
        confirmSendSquad(deployment.id);
      };
    } else {
      sendDeploymentButton.style.display = 'none';
    }
  }
  
  // Show mission panel
  const missionPanel = document.getElementById('mission-panel');
  missionPanel.classList.add('active');
  
  // Stop rotation when mission is displayed
  rotating = false;
  
  // Set active mission to this deployment for other functions
  activeMission = deployment;
  
  // Show notification
  showNotification(`DEPLOYMENT BRIEFING: ${deployment.name || deployment.primaryResource.toUpperCase() + ' DEPLOYMENT'}`);
}

// Enhanced animate function to make deployment markers blink faster
// Add this to the animate function in initializeGlobe
function enhanceGlobeAnimation() {
  // Find the original animate function
  const originalAnimateFunction = window.animateFunction;
  
  // Create enhanced version of animation function that adds faster blinking for deployment markers
  function enhancedAnimate() {
    // Call the original animation code
    if (typeof originalAnimateFunction === 'function') {
      originalAnimateFunction();
    }
    
    // Add enhanced animation for deployment markers
    if (deploymentMarkers && deploymentMarkers.length > 0) {
      deploymentMarkers.forEach(marker => {
        if (marker.userData.ring) {
          const ring = marker.userData.ring;
          const pulseSpeed = marker.userData.pulseSpeed || 0.006; // Use stored or default speed
          
          // Enhanced pulsing effect - larger scale and opacity variation
          ring.scale.x = 1 + 0.4 * Math.sin(Date.now() * pulseSpeed);
          ring.scale.y = 1 + 0.4 * Math.sin(Date.now() * pulseSpeed);
          ring.material.opacity = 0.9 * (0.6 + 0.4 * Math.sin(Date.now() * pulseSpeed));
        }
      });
    }
  }
  
  // Store reference to our enhanced function
  window.animateFunction = enhancedAnimate;
  
  return enhancedAnimate;
}

// Execute the enhancement when document loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    enhanceGlobeAnimation();
    console.log("Enhanced globe animation with faster blinking deployment markers");
  }, 2000); // Wait 2 seconds to make sure globe is initialized
});

// Enhanced animate function to make deployment markers blink faster
// Add this to the animate function in initializeGlobe
function enhanceGlobeAnimation() {
  // Find the original animate function
  const originalAnimateFunction = window.animateFunction;
  
  // Create enhanced version of animation function that adds faster blinking for deployment markers
  function enhancedAnimate() {
    // Call the original animation code
    if (typeof originalAnimateFunction === 'function') {
      originalAnimateFunction();
    }
    
    // Add enhanced animation for deployment markers
    if (deploymentMarkers && deploymentMarkers.length > 0) {
      deploymentMarkers.forEach(marker => {
        if (marker.userData.ring) {
          const ring = marker.userData.ring;
          const pulseSpeed = marker.userData.pulseSpeed || 0.006; // Use stored or default speed
          
          // Enhanced pulsing effect - larger scale and opacity variation
          ring.scale.x = 1 + 0.4 * Math.sin(Date.now() * pulseSpeed);
          ring.scale.y = 1 + 0.4 * Math.sin(Date.now() * pulseSpeed);
          ring.material.opacity = 0.9 * (0.6 + 0.4 * Math.sin(Date.now() * pulseSpeed));
        }
      });
    }
  }
  
  // Store reference to our enhanced function
  window.animateFunction = enhancedAnimate;
  
  return enhancedAnimate;
}

// Execute the enhancement when document loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    enhanceGlobeAnimation();
    console.log("Enhanced globe animation with faster blinking deployment markers");
  }, 2000); // Wait 2 seconds to make sure globe is initialized
});

// Force initialize resources and deployments when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add a delayed setup for deployment system
  setTimeout(() => {
    console.log("Initializing deployment system and checking for deployments...");
    if (typeof initializeEnhancedDeploymentSystem === 'function') {
      initializeEnhancedDeploymentSystem();
    } else {
      console.error("Enhanced deployment system function not found");
    }
    
    // Make the globe interact with deployment markers
    setupGlobeDeploymentInteraction();
  }, 3000); // Delay to ensure scene and other components are loaded
});

// Set up globe interaction with deployment markers
function setupGlobeDeploymentInteraction() {
  if (!window.scene) {
    console.error("Globe scene not initialized yet");
    return;
  }
  
  // Set up raycaster for deployment markers if not already done
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Add specific click handler for deployment markers
  document.getElementById('globe').addEventListener('click', function(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, window.camera);
    
    // Check for intersections with deployment markers
    let intersects = raycaster.intersectObjects(window.deploymentMarkers);
    
    if (intersects.length > 0) {
      const userData = intersects[0].object.userData;
      if (userData.type === 'deployment-point') {
        console.log("Clicked deployment marker:", userData);
        if (typeof displayDeploymentDetails === 'function') {
          displayDeploymentDetails(userData);
        } else {
          console.error("displayDeploymentDetails function not found");
        }
      }
    }
  });
  
  console.log("Globe deployment interaction initialized");
}

// Force initialize resources and deployments when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add a delayed setup for deployment system
  setTimeout(() => {
    console.log("Initializing deployment system and checking for deployments...");
    if (typeof initializeEnhancedDeploymentSystem === 'function') {
      initializeEnhancedDeploymentSystem();
    } else {
      console.error("Enhanced deployment system function not found");
    }
    
    // Make the globe interact with deployment markers
    setupGlobeDeploymentInteraction();
  }, 3000); // Delay to ensure scene and other components are loaded
});

// Set up globe interaction with deployment markers
function setupGlobeDeploymentInteraction() {
  if (!window.scene) {
    console.error("Globe scene not initialized yet");
    return;
  }
  
  // Set up raycaster for deployment markers if not already done
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Add specific click handler for deployment markers
  document.getElementById('globe').addEventListener('click', function(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, window.camera);
    
    // Check for intersections with deployment markers
    let intersects = raycaster.intersectObjects(window.deploymentMarkers);
    
    if (intersects.length > 0) {
      const userData = intersects[0].object.userData;
      if (userData.type === 'deployment-point') {
        console.log("Clicked deployment marker:", userData);
        if (typeof displayDeploymentDetails === 'function') {
          displayDeploymentDetails(userData);
        } else {
          console.error("displayDeploymentDetails function not found");
        }
      }
    }
  });
  
  console.log("Globe deployment interaction initialized");
}

// Firebase configuration - Replace with your actual firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
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
const statusText = document.getElementById('status-text');
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
const signOutButton = document.createElement('button');

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
        showNotification('ERROR LOADING USER DATA');
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
    
    // Reset status
    if (statusText) {
      statusText.textContent = 'STATUS: LOGGED OUT';
    }
  }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!userId || !password) {
    errorMessage.textContent = 'ID and password required';
    return;
  }
  
  try {
    // This uses email auth format - you can customize auth methods
    const email = `${userId}@yourarma3ops.com`;
    await auth.signInWithEmailAndPassword(email, password);
    
    // Auth state listener will handle the rest
    
    // Clear form
    loginForm.reset();
    errorMessage.textContent = '';
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'Invalid ID or password';
  }
});

// Continue as grunt
continueAsGruntButton.addEventListener('click', () => {
  userRole = 'grunt';
  showUserDashboard(userRole);
  loginOverlay.style.display = 'none';
  
  // Initialize grunt-only features
  initializeGruntFeatures();
  
  // Play activation sounds and show notification
  activationSound.play().catch(console.error);
  showNotification('ACCESS GRANTED - GRUNT VIEW ONLY');
  
  // Initialize UI
  initializeUIAfterLogin();
});

// Initialize UI after successful login
function initializeUIAfterLogin() {
  // Set system as active
  systemActive = true;
  
  // Play activation sound
  activationSound.play().catch(console.error);
  
  // Set music volume based on slider and play music
  music.volume = volumeSlider.value;
  music.play().catch(console.error);
  
  // Apply LCD screen overlay
  lcdOverlay.style.display = 'block';
  
  // Fade in side panels
  setTimeout(() => {
    leftPanel.style.transition = 'opacity 1s ease-in';
    rightPanel.style.transition = 'opacity 1s ease-in';
    leftPanel.style.opacity = '1';
    rightPanel.style.opacity = '1';
  }, 500);
  
  // Update status based on role
  statusText.textContent = `STATUS: ${userRole.toUpperCase()} - OPERATIONAL`;
  
  // Initialize updating features
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Show notification
  showNotification('SYSTEM ACTIVATED - GLOBE TRACKING OPERATIONAL');
  
  // Setup upgrade check interval
  setInterval(checkUpgrades, 60000); // Check every minute
  
  // Setup healing interval
  initializeHealTimer();
  
  // Add HQ icon to South Africa
  addHQMarker();
  
  // Generate random deployments for admin
  if (userRole === 'admin') {
    generateRandomDeployments(5); // Generate 5 random deployments
  }
}

// Show appropriate dashboard based on user role
function showUserDashboard(role) {
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
    
    // Make first tab active
    document.querySelector('.hq-tab-button.active').classList.remove('active');
    document.querySelector('.hq-tab-content.active').classList.remove('active');
    
    const homeTab = document.querySelector('[data-tab="home"]');
    const combatTab = document.querySelector('[data-tab="combat"]');
    const firstTab = homeTab || combatTab;
    
    if (firstTab) {
      firstTab.classList.add('active');
      document.getElementById(`${firstTab.getAttribute('data-tab')}-content`).classList.add('active');
    }
    
    // Update base visualization
    updateBaseVisualization();
    
    // Play tab sound
    tabSound.play().catch(console.error);
    
    // Show notification
    showNotification('HEADQUARTERS MANAGEMENT ACTIVE');
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
  if (!currentUser) return;
  
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    if (!userData) return;
    
    // Update money display
    const moneyDisplay = document.createElement('div');
    moneyDisplay.className = 'resource-item';
    moneyDisplay.innerHTML = `
      <div class="resource-name">MONEY:</div>
      <div class="resource-value">$${userData.money.toLocaleString()}</div>
    `;
    
    // Update resources display
    const resourceDisplay = document.getElementById('resource-display');
    resourceDisplay.innerHTML = '';
    resourceDisplay.appendChild(moneyDisplay);
    
    for (const [resource, amount] of Object.entries(userData.resources)) {
      const resourceItem = document.createElement('div');
      resourceItem.className = 'resource-item';
      resourceItem.innerHTML = `
        <div class="resource-name">${resource.toUpperCase()}:</div>
        <div class="resource-value">${amount}</div>
      `;
      resourceDisplay.appendChild(resourceItem);
    }
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Initialize decorative elements
function initializeDecorativeElements() {
  // Hide side panels at first
  leftPanel.style.opacity = '0';
  rightPanel.style.opacity = '0';
  
  // Create random radar blips
  setInterval(() => {
    if (!systemActive) return;
    
    const radarContainer = document.querySelector('.radar-container');
    
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
    // Get intel from Firestore
    const intelDoc = await db.collection('intel').doc(missionId).get();
    
    if (!intelDoc.exists) {
      showNotification('NO INTEL AVAILABLE FOR THIS MISSION');
      return;
    }
    
    const missionIntel = intelDoc.data();
    
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
    
    // Show notification
    showNotification('ACCESSING MISSION INTEL');
  } catch (error) {
    console.error('Error loading intel:', error);
    showNotification('ERROR LOADING MISSION INTEL');
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

// Add HQ marker to the globe at South Africa
function addHQMarker() {
  // South Africa coordinates
  const lat = -30.5595;
  const lon = 22.9375;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create HQ marker - light blue color
  const geometry = new THREE.SphereGeometry(0.25, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0x00BFFF }); // Light blue
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add HQ identifier
  point.userData = { 
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
}

// Track movement of deployments
function updateDeploymentMovement() {
  if (!activeDeployments || !activeDeployments.length) return;
  
  activeDeployments.forEach(deployment => {
    if (deployment.status === 'moving-to-target' || deployment.status === 'returning') {
      // Calculate current position based on time
      updateDeploymentPosition(deployment);
    }
  });
  
  // Update markers on globe
  updateGlobeDeploymentMarkers();
}

// Calculate current position of a moving deployment
function updateDeploymentPosition(deployment) {
  // Implementation will depend on your deployment system
  // This is a placeholder showing the concept
  if (!deployment.startPosition || !deployment.targetPosition) return;
  
  const now = new Date();
  let progress = 0;
  
  if (deployment.status === 'moving-to-target') {
    const totalTime = deployment.estimatedArrival - deployment.departureTime;
    const elapsed = now - deployment.departureTime;
    progress = Math.min(1, Math.max(0, elapsed / totalTime));
  } else if (deployment.status === 'returning') {
    const totalTime = deployment.estimatedReturn - deployment.returnDepartureTime;
    const elapsed = now - deployment.returnDepartureTime;
    progress = Math.min(1, Math.max(0, elapsed / totalTime));
  }
  
  // Linear interpolation between points
  deployment.currentPosition = {
    lat: deployment.startPosition.lat + (deployment.targetPosition.lat - deployment.startPosition.lat) * progress,
    lon: deployment.startPosition.lon + (deployment.targetPosition.lon - deployment.startPosition.lon) * progress
  };
}

// Generate random deployments for admin
function generateRandomDeployments(count) {
  // Placeholder function - implementation depends on your deployment system
  const locations = [
    { name: "SIBERIA", lat: 61.0137, lon: 99.1967 },
    { name: "AMAZON", lat: -3.4653, lon: -62.2159 },
    { name: "AFGHANISTAN", lat: 33.9391, lon: 67.7100 },
    { name: "NORTHERN EUROPE", lat: 61.9241, lon: 25.7482 },
    { name: "MIDDLE EAST", lat: 23.8859, lon: 45.0792 }
  ];
  
  for (let i = 0; i < count; i++) {
    const locationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[locationIndex];
    
    // Add marker for admin to place
    addDeploymentPlacementMarker(location.lat, location.lon, `DEPLOYMENT: ${location.name}`);
  }
}

// Add deployment placement marker
function addDeploymentPlacementMarker(lat, lon, name) {
  // Similar to addMissionMarker but for deployments
  // Implementation depends on your Globe system
}

// Update base visualization based on team levels
function updateBaseVisualization() {
  // Calculate total upgrade level
  let totalLevel = 0;
  let maxPossibleLevel = 0;
  
  if (baseTeams) {
    // Count all team levels
    Object.values(baseTeams).forEach(team => {
      if (team && team.level) {
        totalLevel += team.level;
        maxPossibleLevel += 5; // Max level is 5 for each team
      }
    });
  }
  
  // Calculate base expansion phase (1-5)
  // 5 phases based on percentage of max possible level
  const expansionPercentage = totalLevel / maxPossibleLevel;
  const basePhase = Math.ceil(expansionPercentage * 5);
  
  // Update base visualization in the HQ panel
  const baseVisualization = document.getElementById('base-visualization');
  if (baseVisualization) {
    baseVisualization.className = `base-visualization phase-${basePhase}`;
    
    // Update base stats
    const basePhaseElement = document.getElementById('base-phase');
    if (basePhaseElement) {
      basePhaseElement.textContent = basePhase;
    }
    
    const baseCapacityElement = document.getElementById('base-capacity');
    if (baseCapacityElement) {
      baseCapacityElement.textContent = `${Math.round(expansionPercentage * 100)}%`;
    }
  }
}

// Globe Visualization System (use your existing code with modifications for Firebase)
async function initializeGlobe() {
  // Use most of your existing initializeGlobe code
  // But instead of loadMissions, call loadAvailableMissions()
  
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
  
  // Mouse control for globe
  document.addEventListener('mousedown', (e) => {
    if (!systemActive) return;
    
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
    if (!systemActive) return;
    
    // Rotate globe when dragging
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
  
  // Handle clicking on mission points
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  globe.addEventListener('click', (event) => {
    if (!systemActive) return;
    
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

// Utility Functions
function showNotification(text) {
  notification.textContent = text;
  notification.style.display = 'block';
  
  // Use setTimeout for immediate display and removal rather than fade
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function updateDateTime() {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  dateTimeDisplay.textContent = `${hours}:${minutes}:${seconds} UTC`;
}

// Volume Control
volumeSlider.addEventListener('input', (e) => {
  if (music.readyState >= 2) {
    music.volume = e.target.value;
  }
});

// Sign out function
function signOut() {
  auth.signOut().catch(error => {
    console.error('Sign out error:', error);
  });
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
  signOutButton.textContent = 'SIGN OUT';
  signOutButton.className = 'sign-out-button';
  signOutButton.addEventListener('click', signOut);
  statusBar.appendChild(signOutButton);
});

// Initialize background
document.getElementById('vanta-background').style.backgroundImage = "url('textures/background.png')";
document.getElementById('vanta-background').style.backgroundSize = "cover";
document.getElementById('vanta-background').style.backgroundRepeat = "no-repeat";

// DOM Elements
const bootOverlay = document.getElementById('boot-overlay');
const activateButton = document.getElementById('activate-button');
const terminalText = document.getElementById('terminal-text');
const logoScreen = document.getElementById('logo-screen');
const music = document.getElementById('background-music');
const activationSound = document.getElementById('activation-sound');
const tabSound = document.getElementById('tab-sound');
const missionSound = document.getElementById('mission-sound');
const imagePanel = document.getElementById('image-panel');
const tabImage = document.getElementById('tab-image');
const tabs = document.querySelectorAll('.tab');
const statusText = document.getElementById('status-text');
const dateTimeDisplay = document.getElementById('date-time');
const notification = document.getElementById('notification');
const volumeSlider = document.getElementById('volume-slider');
const globe = document.getElementById('globe');
const missionPanel = document.getElementById('mission-panel');
const closeButton = document.getElementById('close-mission');

// Add background image to logo screen too
logoScreen.style.backgroundImage = "url('textures/background.png')";
logoScreen.style.backgroundSize = "cover";
logoScreen.style.backgroundRepeat = "no-repeat";

// Mission Data
const missions = [
  {
    id: 'mission1',
    name: 'OPERATION BLACKOUT',
    location: 'ALTIS - COORDINATES: 38.9072N, 77.0369E',
    details: 'Infiltrate enemy compound to secure intel on weapons shipments. Expect heavy resistance from local militia forces. Stealth approach recommended for initial phase.',
    objectives: '1. Secure intel documents from main building<br>2. Eliminate or neutralize militia commander<br>3. Extract to designated LZ',
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
    details: 'Rescue hostages from terrorist-held village. Heavy civilian presence in area. ROE restricts collateral damage. Night operation preferred.',
    objectives: '1. Locate and secure all hostages<br>2. Eliminate hostile forces<br>3. Extract hostages to FOB Sierra',
    difficulty: 'MEDIUM',
    payment: '$12,000',
    duration: '2 HRS',
    teamSize: 'FIRETEAM (4)',
    coordinates: { lat: 51.5074, lon: -0.1278 }
  },
  {
    id: 'mission3',
    name: 'OPERATION FROZEN THUNDER',
    location: 'CHERNARUS - COORDINATES: 55.7558N, 37.6173E',
    details: 'Sabotage enemy communications array. Weather conditions are extreme, expect temperatures below -20°C. Enemy patrols in area.',
    objectives: '1. Infiltrate communications base<br>2. Plant explosives on main array<br>3. Destroy backup generators<br>4. Exfiltrate to extraction point',
    difficulty: 'EXTREME',
    payment: '$22,000',
    duration: '3 HRS',
    teamSize: 'PLATOON (12-16)',
    coordinates: { lat: 55.7558, lon: 37.6173 }
  },
  {
    id: 'mission4',
    name: 'OPERATION DESERT HAWK',
    location: 'TAKISTAN - COORDINATES: 39.9042N, 116.4074E',
    details: 'Reconnaissance mission to gather intelligence on enemy troop movements. Maintain distance and avoid detection at all costs.',
    objectives: '1. Establish observation point<br>2. Document enemy patrol patterns<br>3. Photograph military installations<br>4. Return with intelligence',
    difficulty: 'LOW',
    payment: '$8,000',
    duration: '4 HRS',
    teamSize: 'RECON TEAM (2-3)',
    coordinates: { lat: 39.9042, lon: 116.4074 }
  }
];

// System State
let systemActive = false;
let activeTab = null;
let activeMission = null;
let rotating = true;
let targetLat = 0;
let targetLon = 0;
let lastInteractionTime = 0;
let rotationTimeout = null;

// Logo Screen Handling (No fading, instant transition)
setTimeout(() => {
  logoScreen.style.display = 'none';
}, 2000);

// Boot Sequence System
function initializeBootSequence() {
  // Initialize States
  activateButton.style.display = 'none';
  
  // Animate Terminal
  const lines = terminalText.querySelectorAll('p');
  let delay = 0;
  lines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = '';
    typeWriter(line, text, delay, () => {
      if (index === lines.length - 1) {
        setTimeout(() => {
          activateButton.style.display = 'block';
          activateButton.style.opacity = '1';
        }, 500);
      }
    });
    delay += text.length * 25 + 250;
  });
  
  // Activation Protocol
  activateButton.addEventListener('click', activateSystem);
}

// Typewriter Effect
function typeWriter(element, text, delay, callback) {
  let i = 0;
  const speed = 25;
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  
  setTimeout(type, delay);
}

// System Activation (No fading, instant transitions for military terminal feel)
function activateSystem() {
  systemActive = true;
  activationSound.play();
  
  // Set music volume based on slider
  music.volume = volumeSlider.value;
  music.play().catch(console.error);
  
  // Instant hide of boot overlay (no fade)
  bootOverlay.style.display = 'none';
  
  // Initialize updating features
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Set STRAT MAP tab as active by default
  const stratMapTab = document.querySelector('.tab[data-section="stratmap"]');
  if (stratMapTab) {
    stratMapTab.classList.add('active');
    activeTab = "stratmap";
  }
  
  // Show notification
  showNotification('SYSTEM ACTIVATED - GLOBE TRACKING OPERATIONAL');
}

// Tab Control System
function initializeTabSystem() {
  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', (e) => {
      if (!systemActive) return;
      
      // Play tab sound
      if (tabSound.readyState >= 2) {
        tabSound.currentTime = 0;
        tabSound.play().catch(console.error);
      }
      
      // Show image panel with corresponding image
      imagePanel.style.opacity = '1';
      imagePanel.style.pointerEvents = 'auto';
      tabImage.src = `textures/${tab.dataset.img}`;
      
      // Update status
      statusText.textContent = `STATUS: ${tab.textContent} SECTION ACTIVE`;
    });
    
    tab.addEventListener('mouseleave', () => {
      // Hide image panel when not hovering
      imagePanel.style.opacity = '0';
      imagePanel.style.pointerEvents = 'none';
    });
    
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!systemActive) return;
      
      // Set active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.section;
      
      // Show notification
      showNotification(`${tab.textContent} SECTION ACCESSED`);
    });
  });
}

// Mission Panel System
function initializeMissionPanel() {
  closeButton.addEventListener('click', () => {
    missionPanel.classList.remove('active');
    activeMission = null;
    
    // Resume auto-rotation when mission panel is closed
    resumeRotation();
  });
}

function displayMission(missionId) {
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return;
  
  // Play mission sound
  if (missionSound && missionSound.readyState >= 2) {
    missionSound.currentTime = 0;
    missionSound.play().catch(console.error);
  }
  
  // Update mission panel content
  document.getElementById('mission-title').textContent = mission.name;
  document.getElementById('mission-name').textContent = mission.name;
  document.getElementById('mission-location').textContent = mission.location;
  document.getElementById('mission-details').textContent = mission.details;
  document.getElementById('mission-objectives').innerHTML = mission.objectives;
  document.getElementById('mission-difficulty').textContent = mission.difficulty;
  document.getElementById('mission-payment').textContent = mission.payment;
  document.getElementById('mission-duration').textContent = mission.duration;
  document.getElementById('mission-team-size').textContent = mission.teamSize;
  
  // Show mission panel
  missionPanel.classList.add('active');
  activeMission = missionId;
  
  // Stop rotation when mission is displayed
  rotating = false;
  
  // Show notification
  showNotification(`MISSION BRIEFING: ${mission.name}`);
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

// Globe Visualization System
function initializeGlobe() {
  const scene = new THREE.Scene();
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
      
      scene.rotation.y += deltaMove.x * 0.005;
      scene.rotation.x += deltaMove.y * 0.005;
      
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
    const earthTexture = textureLoader.load('textures/earth.jpg'); // Fixed: changed to earth.jpg
    
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
  
  // Add mission points of interest
  function addMissionPoint(mission) {
    const lat = mission.coordinates.lat;
    const lon = mission.coordinates.lon;
    const phi = (90 - lat) * Math.PI/180;
    const theta = (lon + 180) * Math.PI/180;
    
    // Create point marker
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x53a774 }); // Changed to highlight color
    const point = new THREE.Mesh(geometry, material);
    
    point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 10 * Math.cos(phi);
    point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
    
    // Add mission identifier
    point.userData = { 
      missionId: mission.id,
      type: 'mission-point'
    };
    
    scene.add(point);
    
    // Add pulsing effect (ring)
    const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x53a774, // Changed to highlight color
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
  
  // Add mission points
  const missionPoints = missions.map(mission => addMissionPoint(mission));
  
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
    const intersects = raycaster.intersectObjects(missionPoints);
    if (intersects.length > 0) {
      const missionId = intersects[0].object.userData.missionId;
      displayMission(missionId);
    }
  });
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate globe if auto-rotation is enabled
    if (rotating) {
      scene.rotation.y += 0.0005;
    }
    
    // Animate mission points
    missionPoints.forEach(point => {
      if (point.userData.ring) {
        const ring = point.userData.ring;
        ring.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.003);
        ring.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.003);
        ring.material.opacity = 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
      }
    });
    
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

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
  initializeBootSequence();
  initializeTabSystem();
  initializeMissionPanel();
  initializeGlobe();
  
  // Fix volume icon if not showing
  const volumeIcon = document.getElementById('volume-icon');
  if (volumeIcon) {
    volumeIcon.onerror = function() {
      // Fallback if image fails to load
      this.style.display = 'none';
      document.getElementById('volume-control').innerHTML += '<span style="color:#53a774;">VOL</span>';
    };
  }
});

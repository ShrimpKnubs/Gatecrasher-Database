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

// Add background image to logo screen and boot overlay too
logoScreen.style.backgroundImage = "url('textures/background.png')";
logoScreen.style.backgroundSize = "cover";
logoScreen.style.backgroundRepeat = "no-repeat";

bootOverlay.style.backgroundImage = "url('textures/background.png')";
bootOverlay.style.backgroundSize = "cover";
bootOverlay.style.backgroundRepeat = "no-repeat";
bootOverlay.style.backgroundColor = "rgba(0, 31, 24, 0.85)"; // Semi-transparent overlay

// System State
let systemActive = false;
let activeMission = null;
let rotating = true;
let lastInteractionTime = 0;
let rotationTimeout = null;
let velocity = { x: 0, y: 0 };
const friction = 0.95;

// Logo Screen Handling (No fading, instant transition)
setTimeout(() => {
  logoScreen.style.display = 'none';
}, 2000);

// Load mission data from external file
async function loadMissions() {
  try {
    const response = await fetch('data/missions.json');
    const missions = await response.json();
    
    // Log loaded missions for debugging
    console.log('Loaded missions:', missions);
    
    if (!missions || missions.length === 0) {
      throw new Error('No missions found in JSON file');
    }
    
    return missions;
  } catch (error) {
    console.error('Error loading missions:', error);
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
      },
      {
        id: 'mission3',
        name: 'OPERATION FROZEN THUNDER',
        location: 'CHERNARUS - COORDINATES: 55.7558N, 37.6173E',
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
        difficulty: 'LOW',
        payment: '$8,000',
        duration: '4 HRS',
        teamSize: 'RECON TEAM (2-3)',
        coordinates: { lat: 39.9042, lon: 116.4074 }
      }
    ];
  }
}

// Load intel data from external file
async function loadIntel() {
  try {
    const response = await fetch('data/intel.json');
    const intel = await response.json();
    return intel;
  } catch (error) {
    console.error('Error loading intel:', error);
    // Fallback to sample intel if file not found
    return {
      "mission1": {
        "title": "OPERATION BLACKOUT INTEL",
        "content": "",
        "images": ["blackout_sat.jpg", "blackout_compound.jpg"]
      },
      "mission2": {
        "title": "OPERATION RED STORM INTEL",
        "content": "",
        "images": ["redstorm_village.jpg", "redstorm_hostages.jpg"]
      },
      "mission3": {
        "title": "OPERATION FROZEN THUNDER INTEL",
        "content": "",
        "images": ["frozen_array.jpg", "frozen_thermal.jpg"]
      },
      "mission4": {
        "title": "OPERATION DESERT HAWK INTEL",
        "content": "",
        "images": ["desert_topo.jpg", "desert_vehicle.jpg"]
      }
    };
  }
}

// Initialize 80s Sci-Fi decorative elements
function initialize80sSciFiElements() {
  // Hide panels initially
  leftPanel.style.opacity = '0';
  rightPanel.style.opacity = '0';
  
  // Initialize wireframe grid
  createWireframeGrid();
  
  // Initialize spectrum analyzer
  createSpectrumAnalyzer();
  
  // Initialize binary display
  initializeBinaryMatrix();
  
  // Initialize random coordinates for radar
  updateRadarCoordinates();
  
  // System status updates (flashing statuses)
  initializeStatusCycle();
  
  // Command line output animation
  initializeCommandLine();
  
  // Initialize HEX dump rotation
  initializeHexDump();
}

// Create a grid for the wireframe background
function createWireframeGrid() {
  const wireframeGrid = document.getElementById('wireframe-grid');
  const rows = 10;
  const cols = 10;
  
  wireframeGrid.innerHTML = '';
  
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.className = 'wireframe-row';
    
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.className = 'wireframe-cell';
      row.appendChild(cell);
    }
    
    wireframeGrid.appendChild(row);
  }
}

// Create spectrum analyzer bars
function createSpectrumAnalyzer() {
  const spectrumContainer = document.getElementById('spectrum-container');
  const numBars = 20;
  
  spectrumContainer.innerHTML = '';
  
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'spectrum-bar';
    
    // Set random animation properties
    const minHeight = 10 + Math.random() * 20;
    const maxHeight = 40 + Math.random() * 40;
    
    bar.style.setProperty('--min-height', `${minHeight}px`);
    bar.style.setProperty('--max-height', `${maxHeight}px`);
    
    // Randomize animation delay
    bar.style.animationDelay = `${Math.random() * 1}s`;
    
    spectrumContainer.appendChild(bar);
  }
}

// Initialize the binary matrix with flashing highlights
function initializeBinaryMatrix() {
  const binaryColumns = document.querySelectorAll('.binary-column');
  
  binaryColumns.forEach(column => {
    // Generate binary strings for each column
    const binaryContent = generateBinaryString(300);
    column.innerHTML = binaryContent;
    
    // Clone the content for continuous scrolling
    column.innerHTML += binaryContent;
  });
  
  // Periodically highlight random binary characters
  setInterval(() => {
    if (!systemActive) return;
    
    // Remove existing highlights
    document.querySelectorAll('.binary-highlight').forEach(el => {
      el.classList.remove('binary-highlight');
    });
    
    // Add new random highlights
    const allBinaryChars = document.querySelectorAll('.binary-char');
    const highlightCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < highlightCount; i++) {
      const randomIndex = Math.floor(Math.random() * allBinaryChars.length);
      if (allBinaryChars[randomIndex]) {
        allBinaryChars[randomIndex].classList.add('binary-highlight');
      }
    }
  }, 1000);
}

// Generate random binary strings
function generateBinaryString(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 2);
    result += `<span class="binary-char">${digit}</span>`;
    
    // Add a space every 8 digits
    if ((i + 1) % 8 === 0) result += ' ';
    
    // Add a line break every 64 digits
    if ((i + 1) % 64 === 0) result += '<br>';
  }
  return result;
}

// Update radar coordinates periodically
function updateRadarCoordinates() {
  if (!systemActive) return;
  
  const radarCoordinates = document.querySelector('.radar-coordinates');
  
  // Generate random coordinates
  const lat = (35 + Math.random() * 10).toFixed(4);
  const lon = (135 + Math.random() * 10).toFixed(4);
  
  // Update display
  radarCoordinates.innerHTML = `LAT: ${lat}° N&nbsp;&nbsp;&nbsp;LON: ${lon}° E`;
  
  // Create random radar dots periodically
  const radarContainer = document.querySelector('.radar-container');
  
  // Remove old dots that aren't the initial ones
  const oldDots = document.querySelectorAll('.radar-dot.temp');
  oldDots.forEach(dot => dot.remove());
  
  // Remove old markers that aren't the initial ones
  const oldMarkers = document.querySelectorAll('.radar-marker.temp');
  oldMarkers.forEach(marker => marker.remove());
  
  // Add 1-3 new random dots
  const numDots = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numDots; i++) {
    // Random position within radar
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 75;
    const x = 75 + Math.cos(angle) * distance;
    const y = 75 + Math.sin(angle) * distance;
    
    // Create dot
    const dot = document.createElement('div');
    dot.className = 'radar-dot temp' + (Math.random() > 0.8 ? ' hostile' : '');
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    
    // Add blink effect to some dots
    if (Math.random() > 0.5) {
      dot.classList.add('blink');
    }
    
    radarContainer.appendChild(dot);
    
    // Add marker for some dots
    if (Math.random() > 0.7) {
      const marker = document.createElement('div');
      marker.className = 'radar-marker temp' + (dot.classList.contains('hostile') ? ' hostile' : '');
      
      // Generate marker code
      const markerText = dot.classList.contains('hostile') 
        ? 'HOSTL' 
        : `P${Math.floor(Math.random() * 99)}`;
      
      marker.textContent = markerText;
      marker.style.left = `${x}px`;
      marker.style.top = `${y - 10}px`;
      
      radarContainer.appendChild(marker);
    }
  }
  
  // Schedule next update
  setTimeout(updateRadarCoordinates, 3000);
}

// Initialize status indicators cycle
function initializeStatusCycle() {
  if (!systemActive) return;
  
  const statuses = [
    'ACTIVE', 'ONLINE', 'NOMINAL', 'SCANNING', 'ANALYZING', 'SYNCED'
  ];
  
  const statusElements = [
    document.getElementById('cmd-status'),
    document.getElementById('decrypt-status'),
    document.getElementById('systems-status'),
    document.getElementById('hex-status'),
    document.getElementById('radar-status'),
    document.getElementById('spectrum-status'),
    document.getElementById('wireframe-status'),
    document.getElementById('waveform-status')
  ];
  
  // Randomly change statuses
  statusElements.forEach(el => {
    if (el && Math.random() > 0.7) {
      // 30% chance to update each status
      el.textContent = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Randomly add/remove active class for blinking
      if (Math.random() > 0.5) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
  
  // Schedule next status cycle
  setTimeout(initializeStatusCycle, 5000);
}

// Initialize command line animation
function initializeCommandLine() {
  if (!systemActive) return;
  
  const commandOutput = document.getElementById('command-output');
  
  // List of possible commands and responses
  const commands = [
    { cmd: 'scan_perimeter', response: ['Scanning perimeter...', 'No threats detected.'] },
    { cmd: 'analyze_signal SIG-7654', response: ['Signal analysis running...', 'Encrypted COMM detected at frequency 426.82 MHz'] },
    { cmd: 'ping_satellite REQ-92', response: ['Pinging satellite...', 'Response received: 163ms'] },
    { cmd: 'decrypt_transmission AG:45:78', response: ['Decrypting transmission...', 'ERROR: Insufficient security clearance.'] },
    { cmd: 'upload_tactical_data', response: ['Uploading tactical data...', 'Upload complete. Mission briefing updated.'] },
    { cmd: 'analyze_threat_matrix', response: ['Analyzing threat matrix...', 'Potential hostiles: 4', 'Threat level: MODERATE'] },
    { cmd: 'SYS_CHECK C_ARRAY[42]', response: ['Checking system array...', 'Array integrity: 87%'] },
    { cmd: 'load_topographic_data', response: ['Loading topographic data...', 'Terrain analysis complete.'] }
  ];
  
  // Get random command
  const commandObj = commands[Math.floor(Math.random() * commands.length)];
  
  // Add command to terminal
  const cmdLine = document.createElement('div');
  cmdLine.className = 'command-line';
  cmdLine.innerHTML = `<span class="command-prompt">SYS6></span> ${commandObj.cmd}`;
  commandOutput.appendChild(cmdLine);
  
  // Add responses with delay
  let delay = 500;
  
  commandObj.response.forEach(resp => {
    setTimeout(() => {
      const respLine = document.createElement('div');
      respLine.className = 'command-line';
      
      // Add class for colored output if relevant
      if (resp.includes('ERROR')) {
        respLine.classList.add('command-error');
      } else if (resp.includes('complete') || resp.includes('detected')) {
        respLine.classList.add('command-success');
      } else if (resp.includes('MODERATE') || resp.includes('WARNING')) {
        respLine.classList.add('command-warning');
      }
      
      respLine.textContent = resp;
      commandOutput.appendChild(respLine);
      
      // Scroll to bottom
      commandOutput.scrollTop = commandOutput.scrollHeight;
    }, delay);
    
    delay += 700;
  });
  
  // Add prompt after all responses
  setTimeout(() => {
    const promptLine = document.createElement('div');
    promptLine.className = 'command-line';
    promptLine.innerHTML = `<span class="command-prompt">SYS6></span> <span class="command-cursor"></span>`;
    commandOutput.appendChild(promptLine);
    
    // Remove old lines if too many
    while (commandOutput.children.length > 12) {
      commandOutput.removeChild(commandOutput.children[0]);
    }
    
    // Scroll to bottom
    commandOutput.scrollTop = commandOutput.scrollHeight;
    
    // Schedule next command
    setTimeout(initializeCommandLine, 7000);
  }, delay);
}

// Initialize HEX dump display with rotating content
function initializeHexDump() {
  if (!systemActive) return;
  
  const hexContent = document.getElementById('hex-content');
  
  // List of possible hex addresses, values and ASCII representations
  const hexAddresses = [
    '0x0000', '0x0010', '0x0020', '0x0030', '0x0040', '0x0050', 
    '0x0060', '0x0070', '0x0080', '0x0090', '0x00A0', '0x00B0'
  ];
  
  const hexLines = [];
  
  // Generate random hex dump lines
  for (let i = 0; i < 6; i++) {
    const values = [];
    const ascii = [];
    
    // Generate 12 hex values per line
    for (let j = 0; j < 12; j++) {
      // Generate random hex value
      const value = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
      values.push(value);
      
      // Generate ASCII representation (printable chars only)
      const charCode = parseInt(value, 16);
      let char = '.';
      if (charCode >= 32 && charCode <= 126) {
        char = String.fromCharCode(charCode);
      }
      ascii.push(char);
    }
    
    // Randomly highlight some values
    if (Math.random() > 0.7) {
      const highlightStart = Math.floor(Math.random() * 8);
      const highlightLength = Math.floor(Math.random() * 4) + 1;
      
      for (let k = highlightStart; k < highlightStart + highlightLength && k < values.length; k++) {
        values[k] = `<span class="hex-highlight">${values[k]}</span>`;
      }
    }
    
    hexLines.push({
      address: hexAddresses[i],
      values: values.join(' '),
      ascii: ascii.join('')
    });
  }
  
  // Update hex dump content
  hexContent.innerHTML = '';
  
  hexLines.forEach(line => {
    const lineElement = document.createElement('div');
    lineElement.className = 'hex-line';
    lineElement.innerHTML = `
      <div class="hex-address">${line.address}</div>
      <div class="hex-values">${line.values}</div>
      <div class="hex-ascii">${line.ascii}</div>
    `;
    hexContent.appendChild(lineElement);
  });
  
  // Schedule next update
  setTimeout(initializeHexDump, 3000);
}

// Update waveform display
function updateWaveform() {
  if (!systemActive) return;
  
  const waveSvgPath = document.querySelector('.wave-svg path');
  const waveTime = document.querySelector('.wave-time');
  const waveStatus = document.querySelector('.wave-status');
  
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
  
  // Update the path
  waveSvgPath.setAttribute('d', pathData);
  
  // Update time
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const millis = String(now.getMilliseconds()).padStart(3, '0');
  waveTime.textContent = `T:${hours}:${minutes}:${seconds}.${millis}`;
  
  // Update status
  const noiseLevel = (5 + Math.random() * 15).toFixed(1);
  waveStatus.textContent = `ENV_NOISE: ${noiseLevel}dB`;
  
  // Schedule next update
  setTimeout(updateWaveform, 2000);
}

// Update wireframe display
function updateWireframe() {
  if (!systemActive) return;
  
  // Update wireframe cube rotation
  const cube = document.getElementById('wireframe-cube');
  if (cube) {
    // Random rotation speed
    const rotX = Math.random() * 360;
    const rotY = Math.random() * 360;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
  
  // Update coordinates
  const coordX = document.querySelector('.wireframe-coordinate-x');
  const coordY = document.querySelector('.wireframe-coordinate-y');
  const coordZ = document.querySelector('.wireframe-coordinate-z');
  
  if (coordX && coordY && coordZ) {
    coordX.textContent = `X:${(100 + Math.random() * 100).toFixed(2)}`;
    coordY.textContent = `Y:${(50 + Math.random() * 100).toFixed(2)}`;
    coordZ.textContent = `Z:${(150 + Math.random() * 100).toFixed(2)}`;
  }
  
  // Schedule next update
  setTimeout(updateWireframe, 3000);
}

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

// System Activation
function activateSystem() {
  systemActive = true;
  activationSound.play().catch(console.error);
  
  // Set music volume based on slider
  music.volume = volumeSlider.value;
  music.play().catch(console.error);
  
  // Instant hide of boot overlay (no fade)
  bootOverlay.style.display = 'none';
  
  // Initialize updating features
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Show notification
  showNotification('SYSTEM ACTIVATED - GLOBE TRACKING OPERATIONAL');
  
  // Apply LCD screen overlay
  lcdOverlay.style.display = 'block';
  
  // Fade in side panels
  setTimeout(() => {
    leftPanel.style.transition = 'opacity 1s ease-in';
    rightPanel.style.transition = 'opacity 1s ease-in';
    leftPanel.style.opacity = '1';
    rightPanel.style.opacity = '1';
    
    // Start all the 80s sci-fi panel animations
    updateRadarCoordinates();
    initializeStatusCycle();
    initializeCommandLine();
    initializeHexDump();
    updateWaveform();
    updateWireframe();
  }, 500);
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
      openIntelPanel(activeMission);
    }
  });
}

// Intel Panel System
function initializeIntelPanel() {
  closeIntelButton.addEventListener('click', () => {
    intelPanel.classList.remove('active');
  });
}

async function openIntelPanel(missionId) {
  // Load intel data
  const intelData = await loadIntel();
  const missionIntel = intelData[missionId];
  
  if (!missionIntel) {
    showNotification('NO INTEL AVAILABLE FOR THIS MISSION');
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
  
  // Show notification
  showNotification('ACCESSING MISSION INTEL');
}

async function displayMission(missionId) {
  // Load mission data
  const missions = await loadMissions();
  const mission = missions.find(m => m.id === missionId);
  
  if (!mission) {
    showNotification('MISSION DATA NOT FOUND');
    return;
  }
  
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
async function initializeGlobe() {
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
  
  // Load missions and add them to the globe
  const missions = await loadMissions();
  const missionPoints = [];
  
  // Add mission points of interest
  function addMissionPoint(mission) {
    const lat = mission.coordinates.lat;
    const lon = mission.coordinates.lon;
    const phi = (90 - lat) * Math.PI/180;
    const theta = (lon + 180) * Math.PI/180;
    
    // Create point marker - Dark red color
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B0000 }); // Dark red
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
    
    // Add pulsing effect (ring) - Dark red
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
    
    return point;
  }
  
  // Add mission points
  missions.forEach(mission => {
    const point = addMissionPoint(mission);
    missionPoints.push(point);
  });
  
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
  initializeMissionPanel();
  initializeIntelPanel();
  initializeGlobe();
  initialize80sSciFiElements();
  
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
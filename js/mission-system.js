// Mission Management System
let availableMissions = [];
let activeMission = null;

// Initialize mission system
function initializeMissionSystem() {
  // Set up mission button listeners
  const acceptMissionButton = document.getElementById('accept-mission-button');
  if (acceptMissionButton) {
    acceptMissionButton.addEventListener('click', () => {
      // Only show if a mission is selected and user is squad lead
      if (activeMission && userRole === 'squadLead') {
        confirmAcceptMission(activeMission.id);
      } else {
        showNotification('SELECT A MISSION FIRST');
      }
    });
  }
  
  // Load missions
  loadAvailableMissions();
}

// Admin: Initialize mission creation tools
function initializeMissionCreationTools() {
  const createMissionButton = document.getElementById('create-mission-button');
  const editMissionButton = document.getElementById('edit-mission-button');
  const completeMissionButton = document.getElementById('complete-mission-button');
  
  if (createMissionButton) createMissionButton.addEventListener('click', showCreateMissionModal);
  if (editMissionButton) editMissionButton.addEventListener('click', showEditMissionsModal);
  if (completeMissionButton) completeMissionButton.addEventListener('click', showCompleteMissionsModal);
}

// IMPROVED: Load missions with multiple methods
async function loadMissions() {
  try {
    // Try different ways to load the missions
    const missions = await tryLoadMissionsFromMultipleSources();
    console.log('Successfully loaded missions:', missions);
    return missions;
  } catch (error) {
    console.error('Error loading missions:', error);
    showNotification('ERROR LOADING MISSIONS');
    
    // Return a fallback sample mission
    return [{
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
    }];
  }
}

// Try multiple ways to load missions
async function tryLoadMissionsFromMultipleSources() {
  // Method 1: Try direct fetch first (works in standard web environment)
  try {
    const response = await fetch('data/missions.json');
    if (response.ok) {
      const missions = await response.json();
      console.log('Loaded missions via fetch:', missions);
      
      // Load and merge intel data if possible
      try {
        const intelResponse = await fetch('data/intel.json');
        if (intelResponse.ok) {
          const intel = await intelResponse.json();
          // Merge intel data with missions
          mergeIntelWithMissions(missions, intel);
        }
      } catch (intelError) {
        console.error('Error loading intel via fetch:', intelError);
      }
      
      return missions;
    }
  } catch (fetchError) {
    console.warn('Fetch method failed, trying alternative:', fetchError);
  }
  
  // Method 2: Try window.fs.readFile (works in Claude environment)
  if (typeof window.fs !== 'undefined' && window.fs.readFile) {
    try {
      const missionsText = await window.fs.readFile('data/missions.json', { encoding: 'utf8' });
      const missions = JSON.parse(missionsText);
      console.log('Loaded missions via window.fs.readFile:', missions);
      
      // Try to load intel as well
      try {
        const intelText = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
        const intel = JSON.parse(intelText);
        // Merge intel data with missions
        mergeIntelWithMissions(missions, intel);
      } catch (intelError) {
        console.error('Error loading intel via window.fs:', intelError);
      }
      
      return missions;
    } catch (fsError) {
      console.warn('window.fs method failed:', fsError);
    }
  }
  
  // Method 3: Try XMLHttpRequest (older browsers)
  try {
    const missions = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/missions.json', true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const missions = JSON.parse(xhr.responseText);
            // Also try to load intel data
            const intelXhr = new XMLHttpRequest();
            intelXhr.open('GET', 'data/intel.json', true);
            intelXhr.onload = function() {
              if (intelXhr.status === 200) {
                try {
                  const intel = JSON.parse(intelXhr.responseText);
                  mergeIntelWithMissions(missions, intel);
                } catch (parseError) {
                  console.error('Intel parse error:', parseError);
                }
              }
              resolve(missions);
            };
            intelXhr.onerror = function() {
              // Still return missions even if intel fails
              resolve(missions);
            };
            intelXhr.send();
          } catch (parseError) {
            reject(parseError);
          }
        } else {
          reject(new Error(`HTTP status ${xhr.status}`));
        }
      };
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      xhr.send();
    });
    
    console.log('Loaded missions via XMLHttpRequest:', missions);
    return missions;
  } catch (xhrError) {
    console.warn('XMLHttpRequest method failed:', xhrError);
  }
  
  // Method 4: Hardcoded fallback
  console.warn('All loading methods failed, using hardcoded fallback');
  
  // Return a fallback sample mission
  return [{
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
  }];
}

// Merge intel data with missions
function mergeIntelWithMissions(missions, intel) {
  if (!intel) return;
  
  missions.forEach(mission => {
    if (intel[mission.id]) {
      mission.intel = intel[mission.id];
    }
  });
}

// Load intel for a specific mission
async function loadIntelForMission(missionId) {
  // Method 1: Try direct fetch
  try {
    const response = await fetch('data/intel.json');
    if (response.ok) {
      const intel = await response.json();
      return intel[missionId];
    }
  } catch (fetchError) {
    console.warn('Fetch method failed for intel:', fetchError);
  }
  
  // Method 2: Try window.fs.readFile
  if (typeof window.fs !== 'undefined' && window.fs.readFile) {
    try {
      const intelText = await window.fs.readFile('data/intel.json', { encoding: 'utf8' });
      const intel = JSON.parse(intelText);
      return intel[missionId];
    } catch (fsError) {
      console.warn('window.fs method failed for intel:', fsError);
    }
  }
  
  // Method 3: Try XMLHttpRequest
  try {
    const intel = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/intel.json', true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const intel = JSON.parse(xhr.responseText);
            resolve(intel[missionId]);
          } catch (parseError) {
            reject(parseError);
          }
        } else {
          reject(new Error(`HTTP status ${xhr.status}`));
        }
      };
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      xhr.send();
    });
    
    return intel;
  } catch (xhrError) {
    console.warn('XMLHttpRequest method failed for intel:', xhrError);
  }
  
  // Fallback
  return null;
}

// Load available missions
async function loadAvailableMissions() {
  try {
    // Get missions from both Firestore and local files
    const allMissions = await loadMissions();
    
    // Filter available missions
    availableMissions = allMissions.filter(m => !m.status || m.status === 'available');
    
    // Update globe with mission markers
    updateGlobeMissionMarkers();
    
    console.log('Available missions loaded:', availableMissions);
  } catch (error) {
    console.error('Error loading available missions:', error);
    showNotification('ERROR LOADING MISSIONS');
  }
}

// Admin: Load all missions
async function loadAllMissions(adminMode = false) {
  if (!adminMode && userRole !== 'admin') return;
  
  try {
    // Get all missions
    const allMissions = await loadMissions();
    
    // Update globe with mission markers
    updateGlobeMissionMarkers(allMissions);
    
    return allMissions;
  } catch (error) {
    console.error('Error loading all missions:', error);
    showNotification('ERROR LOADING MISSIONS');
    return [];
  }
}

// Update globe with mission markers
function updateGlobeMissionMarkers(missions = availableMissions) {
  // First clear existing mission markers
  clearMissionMarkers();
  
  // Add markers for missions
  missions.forEach(mission => {
    if (mission.coordinates) {
      addMissionMarker(mission);
    }
  });
}

// Add a mission marker to the globe - with fixed static rings
function addMissionMarker(mission) {
  if (!scene) {
    console.error('Scene not initialized yet');
    return null;
  }
  
  const lat = mission.coordinates.lat;
  const lon = mission.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create a color based on mission status
  let markerColor;
  if (!mission.status || mission.status === 'available') {
    markerColor = 0x8B0000; // Dark red
  } else if (mission.status === 'active') {
    markerColor = 0x1E90FF; // Blue
  } else if (mission.status === 'completed') {
    markerColor = 0x32CD32; // Green
  } else {
    markerColor = 0x808080; // Gray
  }
  
  // Create point marker
  const geometry = new THREE.SphereGeometry(0.15, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: markerColor });
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
  
  // Create a parent object for the ring to keep it aligned with globe surface
  const ringParent = new THREE.Object3D();
  ringParent.position.copy(point.position);
  
  // Orient parent to face outward from globe center
  ringParent.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(ringParent);
  
  // Add pulsing effect (ring)
  const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: markerColor,
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
  
  // Store in mission markers array
  missionMarkers.push(point);
  
  console.log(`Added mission marker for ${mission.id} at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Clear mission markers from the globe
function clearMissionMarkers() {
  // Remove mission markers from the scene
  if (missionMarkers && missionMarkers.length && scene) {
    missionMarkers.forEach(marker => {
      if (marker.userData && marker.userData.ring) {
        scene.remove(marker.userData.ring);
      }
      scene.remove(marker);
    });
  }
  
  missionMarkers = [];
}

// Display mission details
async function displayMissionDetails(missionId) {
  console.log("Displaying mission details for ID:", missionId);
  
  try {
    // Try to find mission in available missions
    let mission = availableMissions.find(m => m.id === missionId);
    
    // If not found in available, load all missions and try again
    if (!mission) {
      const allMissions = await loadMissions();
      mission = allMissions.find(m => m.id === missionId);
      
      if (!mission) {
        showNotification('MISSION NOT FOUND');
        return;
      }
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
    
    // Show notification
    showNotification(`MISSION BRIEFING: ${mission.name}`);
  } catch (error) {
    console.error('Error loading mission:', error);
    showNotification('ERROR LOADING MISSION');
  }
}

// Open intel panel with improved intel loading - always appears from the left side
async function openIntelPanel(missionId) {
  try {
    // First check if the global function is available
    if (typeof window.openIntelPanel === 'function') {
      // Use the global function for consistency
      return window.openIntelPanel(missionId);
    }
    
    // Fallback if global function isn't available
    // Load intel data for the mission
    const intelData = await loadIntelForMission(missionId);
    
    if (!intelData) {
      showNotification('NO INTEL AVAILABLE');
      return;
    }
    
    // Play intel sound
    if (intelSound && intelSound.readyState >= 2) {
      intelSound.currentTime = 0;
      intelSound.play().catch(console.error);
    }
    
    // Update intel panel content
    document.getElementById('intel-title').textContent = intelData.title || 'MISSION INTEL';
    
    // Create intel content container
    let intelContent = '';
    
    // Only add content paragraph if there's actual content
    if (intelData.content && intelData.content.trim() !== '') {
      intelContent += `<p>${intelData.content}</p>`;
    }
    
    // Add images if available
    if (intelData.images && intelData.images.length > 0) {
      intelData.images.forEach(imgSrc => {
        intelContent += `<img src="data/images/${imgSrc}" class="intel-image" alt="Mission Intel">`;
      });
    }
    
    // If there's no content and no images, show a placeholder message
    if (intelContent === '') {
      intelContent = '<p>No intel data available.</p>';
    }
    
    document.getElementById('intel-content').innerHTML = intelContent;
    
    // Position intel panel on the left side and ensure high z-index
    const intelPanel = document.getElementById('intel-panel');
    intelPanel.style.left = '-40vw'; // Start offscreen to the left
    intelPanel.style.right = 'auto';
    intelPanel.style.zIndex = '7'; // Higher than resources panel
    
    // Show intel panel by adding active class
    intelPanel.classList.add('active');
    
    // Force a reflow to ensure transition works
    intelPanel.offsetHeight;
    
    // Animate panel in
    intelPanel.style.left = '0';
    
    // Show notification
    showNotification('ACCESSING MISSION INTEL');
  } catch (error) {
    console.error('Error loading intel:', error);
    showNotification('ERROR LOADING INTEL');
  }
}

// Squad Leader: Confirm accept mission
function confirmAcceptMission(missionId) {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'accept-mission-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Find mission
  const mission = availableMissions.find(m => m.id === missionId);
  
  if (!mission) {
    showNotification('MISSION NOT FOUND');
    return;
  }
  
  // Create header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-title">CONFIRM MISSION ACCEPTANCE</div>
    <button class="modal-close">X</button>
  `;
  
  // Create body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = `
    <div class="confirmation-message">
      You are about to accept mission: <strong>${mission.name}</strong>
    </div>
    <div class="confirmation-details">
      <div>Location: ${mission.location}</div>
      <div>Payment: ${mission.payment}</div>
      <div>Difficulty: ${mission.difficulty}</div>
    </div>
    <div class="confirmation-warning">
      Once accepted, this mission will be assigned to your team and removed from other teams' availability.
    </div>
  `;
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  footer.innerHTML = `
    <button class="cancel-button">CANCEL</button>
    <button class="confirm-button">ACCEPT MISSION</button>
  `;
  
  // Add elements to modal
  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modalContent.appendChild(footer);
  modal.appendChild(modalContent);
  
  // Add modal to page
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = modal.querySelector('.cancel-button');
  const confirmButton = modal.querySelector('.confirm-button');
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  confirmButton.addEventListener('click', () => {
    acceptMission(missionId);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Squad Leader: Accept mission
async function acceptMission(missionId) {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Update mission status in Firestore
    await db.collection('missions').doc(missionId).update({
      status: 'active',
      assignedTeam: currentUser.uid,
      acceptedAt: firebase.firestore.Timestamp.now()
    });
    
    // Find and remove the mission from available missions
    const missionIndex = availableMissions.findIndex(m => m.id === missionId);
    if (missionIndex !== -1) {
      const mission = availableMissions[missionIndex];
      availableMissions.splice(missionIndex, 1);
      
      // Update mission markers
      updateGlobeMissionMarkers();
      
      // Show notification
      showNotification(`MISSION ACCEPTED: ${mission.name}`);
      
      // Close mission panel
      const missionPanel = document.getElementById('mission-panel');
      missionPanel.classList.remove('active');
      
      // Resume rotation
      resumeRotation();
    }
  } catch (error) {
    console.error('Error accepting mission:', error);
    showNotification('ERROR ACCEPTING MISSION');
  }
}

// Admin mission creation functions
function showCreateMissionModal() {
  // Implementation for admin to create missions would go here
  console.log("Mission creation modal would appear here");
}

function showEditMissionsModal() {
  // Implementation for admin to edit missions would go here
  console.log("Mission editing modal would appear here");
}

function showCompleteMissionsModal() {
  // Implementation for admin to complete missions would go here
  console.log("Mission completion modal would appear here");
}

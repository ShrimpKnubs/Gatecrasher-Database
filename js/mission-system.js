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
  
  createMissionButton.addEventListener('click', showCreateMissionModal);
  editMissionButton.addEventListener('click', showEditMissionsModal);
  completeMissionButton.addEventListener('click', showCompleteMissionsModal);
}

// Load available missions
async function loadAvailableMissions() {
  try {
    // Get missions from Firestore
    const missionsRef = db.collection('missions').where('status', '==', 'available');
    const snapshot = await missionsRef.get();
    
    availableMissions = [];
    snapshot.forEach(doc => {
      availableMissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Update globe with mission markers
    updateGlobeMissionMarkers();
    
    console.log('Available missions loaded:', availableMissions);
  } catch (error) {
    console.error('Error loading missions:', error);
    showNotification('ERROR LOADING MISSIONS');
  }
}

// Admin: Load all missions
async function loadAllMissions(adminMode = false) {
  if (!adminMode && userRole !== 'admin') return;
  
  try {
    // Get all missions from Firestore
    const snapshot = await db.collection('missions').get();
    
    const allMissions = [];
    snapshot.forEach(doc => {
      allMissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
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
  // This function will integrate with your Three.js globe
  // You should modify your existing globe code to work with this
  
  // First clear existing mission markers
  clearMissionMarkers();
  
  // Add markers for missions
  missions.forEach(mission => {
    if (mission.coordinates) {
      addMissionMarker(mission);
    }
  });
}

// Add a mission marker to the globe
function addMissionMarker(mission) {
  // Use your existing Three.js code to add mission markers
  // You'll need to modify this to match your globe implementation
  
  const lat = mission.coordinates.lat;
  const lon = mission.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create a color based on mission status
  let markerColor;
  if (mission.status === 'available') {
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
  
  // Add pulsing effect (ring)
  const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: markerColor,
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
}

// Clear mission markers from the globe
function clearMissionMarkers() {
  // Remove mission markers from the scene
  if (missionMarkers && missionMarkers.length) {
    missionMarkers.forEach(marker => {
      if (marker.userData.ring) {
        scene.remove(marker.userData.ring);
      }
      scene.remove(marker);
    });
  }
  
  missionMarkers = [];
}

// Display mission details (similar to your existing displayMission function)
async function displayMissionDetails(missionId) {
  // Find mission in available missions
  let mission = availableMissions.find(m => m.id === missionId);
  
  // If not found in available, load from Firebase
  if (!mission) {
    try {
      const missionDoc = await db.collection('missions').doc(missionId).get();
      if (missionDoc.exists) {
        mission = {
          id: missionDoc.id,
          ...missionDoc.data()
        };
      } else {
        showNotification('MISSION NOT FOUND');
        return;
      }
    } catch (error) {
      console.error('Error loading mission:', error);
      showNotification('ERROR LOADING MISSION');
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
  
  // Update mission panel content (use your existing code)
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
    if (userRole === 'squadLead' && mission.status === 'available') {
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

// Admin: Show create mission modal
function showCreateMissionModal() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'create-mission-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content create-mission-modal';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-title">CREATE NEW MISSION</div>
    <button class="modal-close">X</button>
  `;
  
  // Create body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = `
    <form id="create-mission-form">
      <div class="form-group">
        <label for="mission-name">MISSION NAME:</label>
        <input type="text" id="mission-name" required>
      </div>
      
      <div class="form-group">
        <label for="mission-location">LOCATION:</label>
        <input type="text" id="mission-location" required>
      </div>
      
      <div class="form-row">
        <div class="form-group half">
          <label for="mission-lat">LATITUDE:</label>
          <input type="number" id="mission-lat" step="0.000001" required>
        </div>
        
        <div class="form-group half">
          <label for="mission-lon">LONGITUDE:</label>
          <input type="number" id="mission-lon" step="0.000001" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group half">
          <label for="mission-difficulty">DIFFICULTY:</label>
          <select id="mission-difficulty" required>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="EXTREME">EXTREME</option>
          </select>
        </div>
        
        <div class="form-group half">
          <label for="mission-team-size">TEAM SIZE:</label>
          <input type="text" id="mission-team-size" value="SQUAD (4-8)" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group half">
          <label for="mission-payment">PAYMENT:</label>
          <input type="text" id="mission-payment" placeholder="$10,000" required>
        </div>
        
        <div class="form-group half">
          <label for="mission-duration">DURATION:</label>
          <input type="text" id="mission-duration" placeholder="2 HRS" required>
        </div>
      </div>
      
      <div class="form-group">
        <label for="mission-intel">INTEL:</label>
        <textarea id="mission-intel" rows="4"></textarea>
      </div>
    </form>
  `;
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  footer.innerHTML = `
    <button class="cancel-button">CANCEL</button>
    <button class="confirm-button" id="create-mission-submit">CREATE MISSION</button>
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
  const submitButton = modal.querySelector('#create-mission-submit');
  const form = modal.querySelector('#create-mission-form');
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  submitButton.addEventListener('click', () => {
    // Trigger form validation
    if (form.checkValidity()) {
      createNewMission(form);
      document.body.removeChild(modal);
    } else {
      form.reportValidity();
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Admin: Create new mission
async function createNewMission(form) {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get form values
    const name = form.querySelector('#mission-name').value;
    const location = form.querySelector('#mission-location').value;
    const lat = parseFloat(form.querySelector('#mission-lat').value);
    const lon = parseFloat(form.querySelector('#mission-lon').value);
    const difficulty = form.querySelector('#mission-difficulty').value;
    const teamSize = form.querySelector('#mission-team-size').value;
    const payment = form.querySelector('#mission-payment').value;
    const duration = form.querySelector('#mission-duration').value;
    const intel = form.querySelector('#mission-intel').value;
    
    // Create mission object
    const mission = {
      name,
      location,
      coordinates: { lat, lon },
      difficulty,
      teamSize,
      payment,
      duration,
      intel,
      status: 'available',
      createdAt: firebase.firestore.Timestamp.now()
    };
    
    // Add to Firestore
    const docRef = await db.collection('missions').add(mission);
    
    // Check if intel is provided
    if (intel && intel.trim() !== '') {
      // Create intel document
      const intelDoc = {
        title: `${name} INTEL`,
        content: intel,
        images: [] // No images initially
      };
      
      await db.collection('intel').doc(docRef.id).set(intelDoc);
    }
    
    // Show notification
    showNotification(`MISSION CREATED: ${name}`);
    
    // Reload missions
    await loadAllMissions(true);
  } catch (error) {
    console.error('Error creating mission:', error);
    showNotification('ERROR CREATING MISSION');
  }
}

// Admin: Show edit missions modal
function showEditMissionsModal() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Load all missions
  loadAllMissions(true).then(missions => {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'edit-missions-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">EDIT MISSIONS</div>
      <button class="modal-close">X</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (!missions || missions.length === 0) {
      body.innerHTML = '<div class="no-missions">No missions available.</div>';
    } else {
      body.innerHTML = '<div class="missions-list"></div>';
      const missionsList = body.querySelector('.missions-list');
      
      missions.forEach(mission => {
        const missionItem = document.createElement('div');
        missionItem.className = `mission-item ${mission.status}`;
        missionItem.innerHTML = `
          <div class="mission-item-header">
            <div class="mission-item-name">${mission.name}</div>
            <div class="mission-item-status">${mission.status.toUpperCase()}</div>
          </div>
          <div class="mission-item-details">
            <div class="mission-item-location">${mission.location}</div>
            <div class="mission-item-payment">${mission.payment}</div>
          </div>
          <div class="mission-item-actions">
            <button class="edit-mission-button" data-id="${mission.id}">EDIT</button>
            <button class="delete-mission-button" data-id="${mission.id}">DELETE</button>
          </div>
        `;
        
        missionsList.appendChild(missionItem);
      });
    }
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = `
      <button class="cancel-button">CLOSE</button>
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
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Add edit button handlers
    const editButtons = modal.querySelectorAll('.edit-mission-button');
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const missionId = button.getAttribute('data-id');
        document.body.removeChild(modal);
        showEditMissionForm(missionId, missions);
      });
    });
    
    // Add delete button handlers
    const deleteButtons = modal.querySelectorAll('.delete-mission-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const missionId = button.getAttribute('data-id');
        confirmDeleteMission(missionId, modal);
      });
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    tabSound.play().catch(console.error);
  });
}

// Admin: Show complete missions modal
function showCompleteMissionsModal() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Load active missions
  db.collection('missions')
    .where('status', '==', 'active')
    .get()
    .then(snapshot => {
      const activeMissions = [];
      snapshot.forEach(doc => {
        activeMissions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Create modal element
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'complete-missions-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = `
        <div class="modal-title">COMPLETE MISSIONS</div>
        <button class="modal-close">X</button>
      `;
      
      // Create body
      const body = document.createElement('div');
      body.className = 'modal-body';
      
      if (activeMissions.length === 0) {
        body.innerHTML = '<div class="no-missions">No active missions to complete.</div>';
      } else {
        body.innerHTML = '<div class="missions-list"></div>';
        const missionsList = body.querySelector('.missions-list');
        
        activeMissions.forEach(mission => {
          // Get team name from assignedTeam
          let teamName = mission.assignedTeam;
          
          // Format date
          const acceptedDate = mission.acceptedAt ? mission.acceptedAt.toDate().toLocaleDateString() : 'Unknown';
          
          const missionItem = document.createElement('div');
          missionItem.className = 'mission-item active';
          missionItem.innerHTML = `
            <div class="mission-item-header">
              <div class="mission-item-name">${mission.name}</div>
              <div class="mission-item-team">TEAM: ${teamName}</div>
            </div>
            <div class="mission-item-details">
              <div class="mission-item-location">${mission.location}</div>
              <div class="mission-item-accepted">ACCEPTED: ${acceptedDate}</div>
            </div>
            <div class="mission-item-actions">
              <button class="success-mission-button" data-id="${mission.id}">SUCCESS</button>
              <button class="failure-mission-button" data-id="${mission.id}">FAILURE</button>
            </div>
          `;
          
          missionsList.appendChild(missionItem);
        });
      }
      
      // Create footer
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="cancel-button">CLOSE</button>
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
      
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Add success button handlers
      const successButtons = modal.querySelectorAll('.success-mission-button');
      successButtons.forEach(button => {
        button.addEventListener('click', () => {
          const missionId = button.getAttribute('data-id');
          completeMission(missionId, true);
          // Remove the mission item from the list
          const missionItem = button.closest('.mission-item');
          missionItem.remove();
          
          // If no more missions, show 'no missions' message
          const missionsList = body.querySelector('.missions-list');
          if (missionsList.children.length === 0) {
            missionsList.innerHTML = '<div class="no-missions">No active missions to complete.</div>';
          }
        });
      });
      
      // Add failure button handlers
      const failureButtons = modal.querySelectorAll('.failure-mission-button');
      failureButtons.forEach(button => {
        button.addEventListener('click', () => {
          const missionId = button.getAttribute('data-id');
          completeMission(missionId, false);
          // Remove the mission item from the list
          const missionItem = button.closest('.mission-item');
          missionItem.remove();
          
          // If no more missions, show 'no missions' message
          const missionsList = body.querySelector('.missions-list');
          if (missionsList.children.length === 0) {
            missionsList.innerHTML = '<div class="no-missions">No active missions to complete.</div>';
          }
        });
      });
      
      // Show modal
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Play sound
      tabSound.play().catch(console.error);
    })
    .catch(error => {
      console.error('Error loading active missions:', error);
      showNotification('ERROR LOADING ACTIVE MISSIONS');
    });
}

// Admin: Complete mission
async function completeMission(missionId, success) {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get mission data
    const missionDoc = await db.collection('missions').doc(missionId).get();
    const mission = missionDoc.data();
    
    if (!mission) {
      showNotification('MISSION NOT FOUND');
      return;
    }
    
    // Get assigned team
    const teamId = mission.assignedTeam;
    
    if (!teamId) {
      showNotification('NO TEAM ASSIGNED TO MISSION');
      return;
    }
    
    // Update mission status
    await db.collection('missions').doc(missionId).update({
      status: 'completed',
      success: success,
      completedAt: firebase.firestore.Timestamp.now()
    });
    
    // If successful, award payment to team
    if (success) {
      // Parse payment value
      const paymentString = mission.payment;
      const paymentValue = parseInt(paymentString.replace(/[\$,]/g, ''));
      
      // Update team money
      await db.collection('users').doc(teamId).update({
        money: firebase.firestore.FieldValue.increment(paymentValue)
      });
      
      // Show notification
      showNotification(`MISSION COMPLETED SUCCESSFULLY: ${mission.name}`);
    } else {
      // Show notification
      showNotification(`MISSION FAILED: ${mission.name}`);
    }
    
    // Reload missions
    await loadAllMissions(true);
  } catch (error) {
    console.error('Error completing mission:', error);
    showNotification('ERROR COMPLETING MISSION');
  }
}

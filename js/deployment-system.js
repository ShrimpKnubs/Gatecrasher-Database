// Deployment System
let activeDeployments = [];
let availableDeployments = [];

// Initialize deployment system
function initializeDeploymentSystem() {
  // Get DOM elements
  const viewDeploymentsButton = document.getElementById('view-deployments-button');
  
  // Add event listeners
  viewDeploymentsButton.addEventListener('click', showAvailableDeployments);
  
  // Load active deployments
  loadActiveDeployments();
  
  // Generate available deployments
  generateAvailableDeployments();
  
  // Set up regular updates
  setInterval(updateDeploymentStatus, 60000); // Check every minute
}

// Load active deployments from Firebase
async function loadActiveDeployments() {
  if (!currentUser) return;
  
  try {
    const deploymentsRef = db.collection('deployments')
      .where('teamId', '==', currentUser.uid)
      .where('status', 'in', ['active', 'returning']);
    
    const snapshot = await deploymentsRef.get();
    
    activeDeployments = [];
    snapshot.forEach(doc => {
      activeDeployments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    updateDeploymentDisplay();
  } catch (error) {
    console.error('Error loading deployments:', error);
    showNotification('ERROR LOADING DEPLOYMENTS');
  }
}

// Update deployment display in the HQ panel
function updateDeploymentDisplay() {
  const deploymentsList = document.getElementById('active-deployments');
  const noDeploymentsMessage = deploymentsList.querySelector('.no-deployments-message');
  
  // Clear existing deployment items (except the 'no deployments' message)
  Array.from(deploymentsList.children).forEach(child => {
    if (!child.classList.contains('no-deployments-message')) {
      child.remove();
    }
  });
  
  // Show/hide 'no deployments' message
  if (activeDeployments.length === 0) {
    if (noDeploymentsMessage) {
      noDeploymentsMessage.style.display = 'block';
    } else {
      const message = document.createElement('div');
      message.className = 'no-deployments-message';
      message.textContent = 'No active deployments';
      deploymentsList.appendChild(message);
    }
    return;
  } else if (noDeploymentsMessage) {
    noDeploymentsMessage.style.display = 'none';
  }
  
  // Add deployment items
  activeDeployments.forEach(deployment => {
    const deploymentItem = document.createElement('div');
    deploymentItem.className = 'deployment-item';
    
    // Calculate progress
    const startTime = deployment.startTime.toDate();
    const endTime = deployment.endTime.toDate();
    const now = new Date();
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    
    // Format times
    const timeRemaining = Math.max(0, endTime - now);
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Create HTML
    deploymentItem.innerHTML = `
      <div class="deployment-header">
        <div class="deployment-name">${deployment.name}</div>
        <div class="deployment-status ${deployment.status}">${deployment.status.toUpperCase()}</div>
      </div>
      <div class="deployment-location">${deployment.location}</div>
      <div class="deployment-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">${Math.round(progress)}%</div>
      </div>
      <div class="deployment-time">REMAINING: ${daysRemaining}D ${hoursRemaining}H</div>
    `;
    
    deploymentsList.appendChild(deploymentItem);
  });
  
  // Update globe markers for deployments
  updateGlobeDeploymentMarkers();
}

// Update globe with markers for deployments
function updateGlobeDeploymentMarkers() {
  // First remove any existing deployment markers
  removeDeploymentMarkers();
  
  // Add markers for active deployments
  activeDeployments.forEach(deployment => {
    if (deployment.coordinates) {
      addDeploymentMarker(deployment);
    }
  });
}

// Add a deployment marker to the globe
function addDeploymentMarker(deployment) {
  // This function will need to be implemented based on your Three.js globe setup
  // It should add a special marker at the deployment coordinates
  
  const lat = deployment.coordinates.lat;
  const lon = deployment.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create a deployment marker - yellow color
  const geometry = new THREE.SphereGeometry(0.15, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold/yellow
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add deployment identifier
  point.userData = { 
    deploymentId: deployment.id,
    type: 'deployment-point'
  };
  
  scene.add(point);
  
  // Add pulsing effect (ring) - Yellow
  const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFFD700, // Gold/yellow
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
  deploymentMarkers.push(point);
}

// Remove all deployment markers from the globe
function removeDeploymentMarkers() {
  // Remove deployment markers from the scene
  if (deploymentMarkers && deploymentMarkers.length) {
    deploymentMarkers.forEach(marker => {
      if (marker.userData.ring) {
        scene.remove(marker.userData.ring);
      }
      scene.remove(marker);
    });
  }
  
  deploymentMarkers = [];
}

// Generate available deployments
function generateAvailableDeployments() {
  // This would normally fetch from Firebase, but for now we'll generate them
  
  // Clear existing available deployments
  availableDeployments = [];
  
  // Generate 3-5 random deployments
  const numDeployments = Math.floor(Math.random() * 3) + 3;
  
  // Possible locations
  const locations = [
    { name: "SIBERIA - RESOURCE EXTRACTION", lat: 61.0137, lon: 99.1967 },
    { name: "AMAZON - INTELLIGENCE GATHERING", lat: -3.4653, lon: -62.2159 },
    { name: "SOUTH AFRICA - SECURITY DETAIL", lat: -30.5595, lon: 22.9375 },
    { name: "AFGHANISTAN - RECON MISSION", lat: 33.9391, lon: 67.7100 },
    { name: "NORTHERN EUROPE - SUPPLY RUN", lat: 61.9241, lon: 25.7482 }
  ];
  
  // Possible durations (in days)
  const durations = [1, 2, 3, 5, 7];
  
  // Possible resources to gain
  const resources = ["fuel", "ammo", "medicine", "food", "materials"];
  
  for (let i = 0; i < numDeployments; i++) {
    // Pick a random location
    const locationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[locationIndex];
    
    // Pick a random duration
    const durationIndex = Math.floor(Math.random() * durations.length);
    const duration = durations[durationIndex];
    
    // Calculate resource rewards
    const rewardResources = {};
    const numResourceTypes = Math.floor(Math.random() * 3) + 1; // 1-3 resource types
    
    for (let j = 0; j < numResourceTypes; j++) {
      const resourceIndex = Math.floor(Math.random() * resources.length);
      const resource = resources[resourceIndex];
      const amount = Math.floor(Math.random() * 100) + 50; // 50-150
      
      rewardResources[resource] = amount;
    }
    
    // Calculate money reward
    const moneyReward = (Math.floor(Math.random() * 20) + 10) * 1000; // $10K-$30K
    
    // Calculate enemy strength (affects casualties)
    const enemyStrength = Math.floor(Math.random() * 100) + 1; // 1-100
    
    // Create deployment object
    const deployment = {
      id: `deploy-${Date.now()}-${i}`,
      name: `OPERATION ${generateCodename()}`,
      location: location.name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      },
      duration: duration,
      resources: rewardResources,
      moneyReward: moneyReward,
      enemyStrength: enemyStrength,
      available: true,
      expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24)) // Available for 24 hours
    };
    
    availableDeployments.push(deployment);
  }
}

// Generate a random codename for operations
function generateCodename() {
  const adjectives = ["SILENT", "FROZEN", "BURNING", "PHANTOM", "SAVAGE", "MIDNIGHT", "CRIMSON"];
  const nouns = ["THUNDER", "SNAKE", "TIGER", "SHADOW", "VIPER", "HAWK", "STORM"];
  
  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);
  
  return `${adjectives[adjIndex]}_${nouns[nounIndex]}`;
}

// Show available deployments modal
function showAvailableDeployments() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'available-deployments-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-title">AVAILABLE DEPLOYMENTS</div>
    <button class="modal-close">X</button>
  `;
  
  // Create body
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  // Add deployments to body
  if (availableDeployments.length === 0) {
    body.innerHTML = '<div class="no-deployments">No deployments available at this time.</div>';
  } else {
    availableDeployments.forEach(deployment => {
      const deploymentElement = document.createElement('div');
      deploymentElement.className = 'available-deployment';
      
      // Calculate expiry time
      const expiryTime = deployment.expiresAt;
      const now = new Date();
      const timeRemaining = expiryTime - now;
      const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      
      // Format resources
      let resourcesHTML = '';
      if (deployment.resources) {
        resourcesHTML = '<div class="deployment-rewards-list">';
        for (const [resource, amount] of Object.entries(deployment.resources)) {
          resourcesHTML += `<div>${resource.toUpperCase()}: ${amount}</div>`;
        }
        resourcesHTML += '</div>';
      }
      
      deploymentElement.innerHTML = `
        <div class="deployment-header">
          <div class="deployment-name">${deployment.name}</div>
          <div class="deployment-expiry">EXPIRES IN: ${hoursRemaining}H ${minutesRemaining}M</div>
        </div>
        <div class="deployment-location">${deployment.location}</div>
        <div class="deployment-details">
          <div class="deployment-duration">DURATION: ${deployment.duration} DAYS</div>
          <div class="deployment-money">REWARD: $${deployment.moneyReward.toLocaleString()}</div>
          <div class="deployment-enemy">ENEMY STRENGTH: ${deployment.enemyStrength}%</div>
        </div>
        <div class="deployment-rewards">
          <div class="rewards-header">RESOURCES:</div>
          ${resourcesHTML}
        </div>
        <button class="send-deployment-button" data-id="${deployment.id}">SEND TEAM</button>
      `;
      
      body.appendChild(deploymentElement);
    });
  }
  
  // Add elements to modal
  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modal.appendChild(modalContent);
  
  // Add modal to page
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeButton = modal.querySelector('.modal-close');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Add event listeners to deployment buttons
  const deploymentButtons = modal.querySelectorAll('.send-deployment-button');
  deploymentButtons.forEach(button => {
    button.addEventListener('click', () => {
      const deploymentId = button.getAttribute('data-id');
      sendDeployment(deploymentId);
      document.body.removeChild(modal);
    });
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Send a team on deployment
async function sendDeployment(deploymentId) {
  if (!currentUser || userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Find the deployment
    const deployment = availableDeployments.find(d => d.id === deploymentId);
    
    if (!deployment) {
      showNotification('DEPLOYMENT NOT FOUND');
      return;
    }
    
    // Get current user data (for resources)
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    // Get combat team data
    const combatTeamDoc = await db.collection('teams').doc(currentUser.uid + '_combat').get();
    
    if (!combatTeamDoc.exists) {
      showNotification('COMBAT TEAM NOT INITIALIZED');
      return;
    }
    
    const combatTeam = combatTeamDoc.data();
    
    // Check if team is available (not all on deployment)
    if (combatTeam.availableMembers < 5) {
      showNotification('NOT ENOUGH TEAM MEMBERS AVAILABLE');
      return;
    }
    
    // Calculate start and end times
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (deployment.duration * 24 * 60 * 60 * 1000));
    
    // Create deployment document
    const deploymentData = {
      name: deployment.name,
      location: deployment.location,
      coordinates: deployment.coordinates,
      teamId: currentUser.uid,
      teamName: userData.username,
      startTime: firebase.firestore.Timestamp.fromDate(startTime),
      endTime: firebase.firestore.Timestamp.fromDate(endTime),
      duration: deployment.duration,
      status: 'active',
      resources: deployment.resources,
      moneyReward: deployment.moneyReward,
      enemyStrength: deployment.enemyStrength,
      casualties: 0, // Will be calculated on completion
      success: true // Will be determined on completion
    };
    
    // Add to Firestore
    await db.collection('deployments').add(deploymentData);
    
    // Update combat team (reduce available members)
    const membersOnMission = Math.min(5, combatTeam.availableMembers);
    await db.collection('teams').doc(currentUser.uid + '_combat').update({
      availableMembers: firebase.firestore.FieldValue.increment(-membersOnMission),
      deployedMembers: firebase.firestore.FieldValue.increment(membersOnMission)
    });
    
    // Remove from available deployments
    availableDeployments = availableDeployments.filter(d => d.id !== deploymentId);
    
    // Reload active deployments
    await loadActiveDeployments();
    
    // Show notification
    showNotification(`TEAM DEPLOYED: ${deployment.name}`);
    
    // Play mission sound
    if (missionSound && missionSound.readyState >= 2) {
      missionSound.currentTime = 0;
      missionSound.play().catch(console.error);
    }
  } catch (error) {
    console.error('Error sending deployment:', error);
    showNotification('ERROR SENDING DEPLOYMENT');
  }
}

// Update deployment status (called regularly)
async function updateDeploymentStatus() {
  if (!currentUser) return;
  
  try {
    // Get deployments to check
    const deploymentsToCheck = activeDeployments.filter(d => 
      d.status === 'active' && d.endTime.toDate() <= new Date()
    );
    
    for (const deployment of deploymentsToCheck) {
      // Calculate results based on enemyStrength and team level
      await processCompletedDeployment(deployment);
    }
    
    // Check for returning teams that have arrived
    const returningDeployments = activeDeployments.filter(d => 
      d.status === 'returning' && d.returnTime.toDate() <= new Date()
    );
    
    for (const deployment of returningDeployments) {
      await finalizeDeployment(deployment);
    }
    
    // Reload active deployments if any were updated
    if (deploymentsToCheck.length > 0 || returningDeployments.length > 0) {
      await loadActiveDeployments();
    }
  } catch (error) {
    console.error('Error updating deployment status:', error);
  }
}

// Process a completed deployment
async function processCompletedDeployment(deployment) {
  try {
    // Get combat team data
    const combatTeamDoc = await db.collection('teams').doc(deployment.teamId + '_combat').get();
    const combatTeam = combatTeamDoc.data();
    
    // Calculate success chance based on team power and enemy strength
    const teamPower = combatTeam.power || 100;
    const powerRatio = teamPower / deployment.enemyStrength;
    const successChance = Math.min(0.95, Math.max(0.5, powerRatio));
    
    // Determine success
    const success = Math.random() < successChance;
    
    // Calculate casualties
    const casualtyBase = success ? 0.1 : 0.3; // Base casualty rate
    const casualtyRate = casualtyBase * (deployment.enemyStrength / 100);
    const casualties = Math.floor(casualtyRate * 5); // Assuming 5 team members sent
    
    // Calculate return time (1/3 of original duration)
    const returnDuration = deployment.duration / 3; // Return takes 1/3 of original time
    const returnTime = new Date(Date.now() + (returnDuration * 24 * 60 * 60 * 1000));
    
    // Update deployment status
    await db.collection('deployments').doc(deployment.id).update({
      status: 'returning',
      success: success,
      casualties: casualties,
      returnTime: firebase.firestore.Timestamp.fromDate(returnTime),
      completedAt: firebase.firestore.Timestamp.now()
    });
    
    // Show notification
    showNotification(`DEPLOYMENT ${success ? 'SUCCESSFUL' : 'FAILED'}: ${deployment.name}`);
  } catch (error) {
    console.error('Error processing completed deployment:', error);
  }
}

// Finalize a returned deployment
async function finalizeDeployment(deployment) {
  try {
    // Get user data
    const userDoc = await db.collection('users').doc(deployment.teamId).get();
    const userData = userDoc.data();
    
    // Update user resources and money if successful
    if (deployment.success) {
      const updates = {};
      
      // Add money
      updates.money = firebase.firestore.FieldValue.increment(deployment.moneyReward);
      
      // Add resources
      if (deployment.resources) {
        for (const [resource, amount] of Object.entries(deployment.resources)) {
          updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(amount);
        }
      }
      
      await db.collection('users').doc(deployment.teamId).update(updates);
    }
    
    // Update combat team
    const teamUpdates = {
      // Return team members minus casualties
      availableMembers: firebase.firestore.FieldValue.increment(5 - deployment.casualties),
      deployedMembers: firebase.firestore.FieldValue.increment(-5),
      woundedMembers: firebase.firestore.FieldValue.increment(deployment.casualties)
    };
    
    await db.collection('teams').doc(deployment.teamId + '_combat').update(teamUpdates);
    
    // Archive deployment
    await db.collection('deployments').doc(deployment.id).update({
      status: 'completed',
      archived: true
    });
    
    // Show notification
    showNotification(`TEAM RETURNED: ${deployment.name}`);
  } catch (error) {
    console.error('Error finalizing deployment:', error);
  }
}

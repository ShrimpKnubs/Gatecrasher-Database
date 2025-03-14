// Deployment System Functions
// These should be integrated into your deployment-system.js file

// Generate random deployments on the globe
function generateRandomDeployments(count = 5) {
  const deployments = [];
  
  // Possible locations around the world
  const potentialLocations = [
    { name: "SIBERIA - RESOURCE EXTRACTION", lat: 61.0137, lon: 99.1967, type: "resource" },
    { name: "AMAZON - INTELLIGENCE GATHERING", lat: -3.4653, lon: -62.2159, type: "intel" },
    { name: "SAHARA - SECURITY DETAIL", lat: 23.4162, lon: 25.6628, type: "security" },
    { name: "AFGHANISTAN - RECON MISSION", lat: 33.9391, lon: 67.7100, type: "recon" },
    { name: "NORTHERN EUROPE - SUPPLY RUN", lat: 61.9241, lon: 25.7482, type: "supply" },
    { name: "ANTARCTICA - RESEARCH PROTECTION", lat: -79.4063, lon: 0.3150, type: "security" },
    { name: "AUSTRALIA OUTBACK - EXTRACTION", lat: -25.2744, lon: 133.7751, type: "rescue" },
    { name: "PACIFIC ISLAND - ASSET RECOVERY", lat: -17.7134, lon: 178.0650, type: "recovery" },
    { name: "SOUTH CHINA SEA - NAVAL SUPPORT", lat: 13.2904, lon: 114.3321, type: "naval" },
    { name: "ANDES - HIGH ALTITUDE TRAINING", lat: -13.4125, lon: -72.3430, type: "training" }
  ];
  
  // Difficulty levels
  const difficulties = ["LOW", "MEDIUM", "HIGH", "EXTREME"];
  
  // Resource types
  const resourceTypes = ["fuel", "ammo", "medicine", "food", "materials"];
  
  // Generate deployments
  for (let i = 0; i < count; i++) {
    // Select random location
    const locationIndex = Math.floor(Math.random() * potentialLocations.length);
    const location = potentialLocations[locationIndex];
    
    // Don't select the same location twice
    potentialLocations.splice(locationIndex, 1);
    if (potentialLocations.length === 0) break; // Stop if we run out of locations
    
    // Select random difficulty
    const difficultyIndex = Math.floor(Math.random() * difficulties.length);
    const difficulty = difficulties[difficultyIndex];
    
    // Calculate duration based on difficulty (1-7 days)
    let duration;
    switch (difficulty) {
      case "LOW":
        duration = 1 + Math.floor(Math.random() * 2); // 1-2 days
        break;
      case "MEDIUM":
        duration = 2 + Math.floor(Math.random() * 2); // 2-3 days
        break;
      case "HIGH":
        duration = 3 + Math.floor(Math.random() * 3); // 3-5 days
        break;
      case "EXTREME":
        duration = 5 + Math.floor(Math.random() * 3); // 5-7 days
        break;
    }
    
    // Calculate rewards based on difficulty and type
    const resources = {};
    const resourceCount = Math.floor(Math.random() * 3) + 1; // 1-3 resource types
    
    // Add a guaranteed resource based on mission type
    let guaranteedResource;
    switch (location.type) {
      case "resource":
      case "supply":
        guaranteedResource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        break;
      case "intel":
        guaranteedResource = "intel";
        break;
      case "security":
      case "recon":
        guaranteedResource = "ammo";
        break;
      case "rescue":
      case "recovery":
        guaranteedResource = "medicine";
        break;
      case "naval":
        guaranteedResource = "fuel";
        break;
      case "training":
        guaranteedResource = "materials";
        break;
    }
    
    // Add the guaranteed resource
    const guaranteedAmount = calculateResourceAmount(difficulty, guaranteedResource);
    resources[guaranteedResource] = guaranteedAmount;
    
    // Add additional random resources
    for (let j = 0; j < resourceCount - 1; j++) {
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      
      // Skip if already added
      if (resources[resourceType]) continue;
      
      const amount = calculateResourceAmount(difficulty, resourceType);
      resources[resourceType] = amount;
    }
    
    // Calculate money reward
    const baseReward = 5000; // Base reward
    let difficultyMultiplier;
    switch (difficulty) {
      case "LOW":
        difficultyMultiplier = 1;
        break;
      case "MEDIUM":
        difficultyMultiplier = 2;
        break;
      case "HIGH":
        difficultyMultiplier = 3.5;
        break;
      case "EXTREME":
        difficultyMultiplier = 5;
        break;
    }
    
    const moneyReward = Math.round(baseReward * difficultyMultiplier * (0.9 + Math.random() * 0.2));
    
    // Calculate enemy strength (affects casualties)
    let baseStrength;
    switch (difficulty) {
      case "LOW":
        baseStrength = 20;
        break;
      case "MEDIUM":
        baseStrength = 40;
        break;
      case "HIGH":
        baseStrength = 70;
        break;
      case "EXTREME":
        baseStrength = 90;
        break;
    }
    
    const enemyStrength = baseStrength + Math.floor(Math.random() * 20 - 10); // +/- 10
    
    // Create deployment object
    const deployment = {
      id: `deploy-${Date.now()}-${i}`,
      name: `OPERATION ${generateCodename()}`,
      location: location.name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      },
      difficulty: difficulty,
      duration: duration,
      resources: resources,
      moneyReward: moneyReward,
      enemyStrength: enemyStrength,
      type: location.type,
      available: true,
      expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 2)) // Available for 2 days
    };
    
    deployments.push(deployment);
  }
  
  return deployments;
}

// Calculate resource amount based on difficulty
function calculateResourceAmount(difficulty, resourceType) {
  let baseAmount;
  
  switch (difficulty) {
    case "LOW":
      baseAmount = 50;
      break;
    case "MEDIUM":
      baseAmount = 100;
      break;
    case "HIGH":
      baseAmount = 200;
      break;
    case "EXTREME":
      baseAmount = 350;
      break;
  }
  
  // Add some randomness
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  
  // Some resources are more valuable
  let typeMultiplier = 1;
  if (resourceType === "medicine" || resourceType === "intel") {
    typeMultiplier = 0.7; // Less of these
  } else if (resourceType === "materials" || resourceType === "fuel") {
    typeMultiplier = 1.2; // More of these
  }
  
  return Math.round(baseAmount * randomFactor * typeMultiplier);
}

// Generate random codename for missions
function generateCodename() {
  const adjectives = ["SILENT", "FROZEN", "BURNING", "PHANTOM", "SAVAGE", "MIDNIGHT", "CRIMSON", "DESERT", "THUNDER", "JUNGLE"];
  const nouns = ["WOLF", "SNAKE", "TIGER", "SHADOW", "VIPER", "HAWK", "STORM", "SHIELD", "DAGGER", "GHOST"];
  
  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);
  
  return `${adjectives[adjIndex]}_${nouns[nounIndex]}`;
}

// Admin: Generate and store random deployments
async function adminGenerateDeployments(count = 5) {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Generate random deployments
    const deployments = generateRandomDeployments(count);
    
    // Store in Firebase
    const batch = db.batch();
    
    for (const deployment of deployments) {
      const deploymentRef = db.collection('availableDeployments').doc(deployment.id);
      batch.set(deploymentRef, deployment);
    }
    
    await batch.commit();
    
    showNotification(`${count} NEW DEPLOYMENTS GENERATED`);
    return deployments;
  } catch (error) {
    console.error('Error generating deployments:', error);
    showNotification('ERROR GENERATING DEPLOYMENTS');
    return [];
  }
}

// Add these functions to the admin panel
function setupDeploymentAdminControls() {
  // Add deployment generation button to admin controls
  const adminControls = document.getElementById('admin-controls');
  const deploymentSection = document.createElement('div');
  deploymentSection.className = 'admin-section';
  deploymentSection.innerHTML = `
    <div class="admin-section-title">DEPLOYMENT MANAGEMENT</div>
    <button id="generate-deployments-button">GENERATE DEPLOYMENTS</button>
    <button id="view-deployments-button">VIEW DEPLOYMENTS</button>
  `;
  
  adminControls.appendChild(deploymentSection);
  
  // Add event listeners
  document.getElementById('generate-deployments-button').addEventListener('click', () => {
    adminGenerateDeployments(5);
  });
  
  document.getElementById('view-deployments-button').addEventListener('click', () => {
    adminViewDeployments();
  });
}

// Admin: View all deployments
async function adminViewDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get all deployments
    const availableSnapshot = await db.collection('availableDeployments').get();
    const activeSnapshot = await db.collection('deployments').get();
    
    const availableDeployments = [];
    const activeDeployments = [];
    
    availableSnapshot.forEach(doc => {
      availableDeployments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    activeSnapshot.forEach(doc => {
      activeDeployments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Create modal to display deployments
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'admin-deployments-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">DEPLOYMENT MANAGEMENT</div>
      <button class="modal-close">X</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    // Display available deployments
    const availableSection = document.createElement('div');
    availableSection.className = 'deployments-section';
    availableSection.innerHTML = `<h3>AVAILABLE DEPLOYMENTS (${availableDeployments.length})</h3>`;
    
    if (availableDeployments.length > 0) {
      const availableList = document.createElement('div');
      availableList.className = 'deployments-list';
      
      availableDeployments.forEach(deployment => {
        const item = document.createElement('div');
        item.className = 'deployment-item';
        item.innerHTML = `
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name}</div>
            <div class="deployment-difficulty ${deployment.difficulty}">${deployment.difficulty}</div>
          </div>
          <div class="deployment-location">${deployment.location}</div>
          <div class="deployment-reward">$${deployment.moneyReward.toLocaleString()}</div>
          <button class="remove-deployment-button" data-id="${deployment.id}">REMOVE</button>
        `;
        
        availableList.appendChild(item);
      });
      
      availableSection.appendChild(availableList);
    } else {
      availableSection.innerHTML += `<div class="no-deployments">No available deployments</div>`;
    }
    
    // Display active deployments
    const activeSection = document.createElement('div');
    activeSection.className = 'deployments-section';
    activeSection.innerHTML = `<h3>ACTIVE DEPLOYMENTS (${activeDeployments.length})</h3>`;
    
    if (activeDeployments.length > 0) {
      const activeList = document.createElement('div');
      activeList.className = 'deployments-list';
      
      activeDeployments.forEach(deployment => {
        const startTime = deployment.startTime.toDate();
        const endTime = deployment.endTime.toDate();
        const now = new Date();
        const progress = Math.min(100, ((now - startTime) / (endTime - startTime)) * 100);
        
        const item = document.createElement('div');
        item.className = 'deployment-item';
        item.innerHTML = `
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name}</div>
            <div class="deployment-status">${deployment.status.toUpperCase()}</div>
          </div>
          <div class="deployment-location">${deployment.location}</div>
          <div class="deployment-team">TEAM: ${deployment.teamName || "Unknown"}</div>
          <div class="deployment-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${Math.round(progress)}%</div>
          </div>
        `;
        
        activeList.appendChild(item);
      });
      
      activeSection.appendChild(activeList);
    } else {
      activeSection.innerHTML += `<div class="no-deployments">No active deployments</div>`;
    }
    
    // Add sections to body
    body.appendChild(availableSection);
    body.appendChild(activeSection);
    
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
    
    // Add event listeners to remove buttons
    const removeButtons = modal.querySelectorAll('.remove-deployment-button');
    removeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const deploymentId = button.getAttribute('data-id');
        try {
          await db.collection('availableDeployments').doc(deploymentId).delete();
          button.closest('.deployment-item').remove();
          showNotification('DEPLOYMENT REMOVED');
        } catch (error) {
          console.error('Error removing deployment:', error);
          showNotification('ERROR REMOVING DEPLOYMENT');
        }
      });
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play tab sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error viewing deployments:', error);
    showNotification('ERROR VIEWING DEPLOYMENTS');
  }
}

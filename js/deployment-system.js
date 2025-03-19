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

// Admin: Generate and store specific resource deployment
async function adminGenerateResourceDeployment(resourceType) {
  if (userRole !== 'admin') {
    console.error('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Generate a random deployment focused on the specified resource
    const deployment = generateSpecificResourceDeployment(resourceType);
    
    // Store in Firebase
    await db.collection('availableDeployments').doc(deployment.id).set(deployment);
    
    // Add marker to globe
    addDeploymentMarker(deployment);
    
    console.log(`NEW ${resourceType.toUpperCase()} DEPLOYMENT GENERATED`);
    return deployment;
  } catch (error) {
    console.error(`Error generating ${resourceType} deployment:`, error);
    return null;
  }
}

// Generate a deployment focused on a specific resource
function generateSpecificResourceDeployment(resourceType) {
  // Possible locations around the world - we'll pick one randomly
  const potentialLocations = [
    { name: "SIBERIA", lat: 61.0137, lon: 99.1967 },
    { name: "AMAZON", lat: -3.4653, lon: -62.2159 },
    { name: "SAHARA", lat: 23.4162, lon: 25.6628 },
    { name: "AFGHANISTAN", lat: 33.9391, lon: 67.7100 },
    { name: "NORTHERN EUROPE", lat: 61.9241, lon: 25.7482 },
    { name: "ANTARCTICA", lat: -79.4063, lon: 0.3150 },
    { name: "AUSTRALIA OUTBACK", lat: -25.2744, lon: 133.7751 },
    { name: "PACIFIC ISLAND", lat: -17.7134, lon: 178.0650 },
    { name: "SOUTH CHINA SEA", lat: 13.2904, lon: 114.3321 },
    { name: "ANDES", lat: -13.4125, lon: -72.3430 },
    { name: "EASTERN EUROPE", lat: 50.4501, lon: 30.5234 },
    { name: "NORTH ATLANTIC", lat: 56.8129, lon: -42.1598 },
    { name: "CENTRAL AFRICA", lat: 6.8770, lon: 20.6446 },
    { name: "MIDDLE EAST", lat: 24.4539, lon: 54.3773 },
    { name: "SOUTH ASIA", lat: 28.6139, lon: 77.2090 }
  ];
  
  // Randomly select a location
  const locationIndex = Math.floor(Math.random() * potentialLocations.length);
  const location = potentialLocations[locationIndex];
  
  // Determine operation types based on resource
  const operationTypes = {
    money: ["BANK HEIST", "STOCK EXCHANGE", "TREASURY RAID", "CASINO OPERATION"],
    fuel: ["OIL FIELD", "REFINERY CAPTURE", "PIPELINE OPERATION", "FUEL DEPOT"],
    ammo: ["ARMS CACHE", "MUNITIONS FACTORY", "WEAPONS DEPOT", "ARMORY RAID"],
    medicine: ["MEDICAL FACILITY", "PHARMACEUTICAL LAB", "HOSPITAL SUPPLIES", "MED-STATION"],
    food: ["AGRICULTURAL CENTER", "FOOD DEPOT", "SUPPLY WAREHOUSE", "DISTRIBUTION HUB"],
    materials: ["MINING OPERATION", "INDUSTRIAL COMPLEX", "RESOURCE EXTRACTION", "MANUFACTURING PLANT"]
  };
  
  // Select random operation type for the resource
  const operationType = operationTypes[resourceType][Math.floor(Math.random() * operationTypes[resourceType].length)];
  
  // Random difficulty levels with weighted distribution
  const difficulties = ["LOW", "MEDIUM", "HIGH", "EXTREME"];
  const difficultyWeights = [0.3, 0.4, 0.2, 0.1]; // Higher chance for medium difficulty
  
  let difficultyIndex = 0;
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < difficulties.length; i++) {
    cumulativeWeight += difficultyWeights[i];
    if (random <= cumulativeWeight) {
      difficultyIndex = i;
      break;
    }
  }
  
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
  
  // Calculate enemy strength based on difficulty
  let baseStrength;
  switch (difficulty) {
    case "LOW":
      baseStrength = 20 + Math.floor(Math.random() * 30); // 20-50
      break;
    case "MEDIUM":
      baseStrength = 50 + Math.floor(Math.random() * 50); // 50-100
      break;
    case "HIGH":
      baseStrength = 100 + Math.floor(Math.random() * 100); // 100-200
      break;
    case "EXTREME":
      baseStrength = 200 + Math.floor(Math.random() * 100); // 200-300
      break;
  }
  
  // Calculate rewards based on difficulty
  const resources = {};
  
  // Primary resource (the one this deployment is for)
  let primaryAmount;
  switch (difficulty) {
    case "LOW":
      primaryAmount = 100 + Math.floor(Math.random() * 100); // 100-200
      break;
    case "MEDIUM":
      primaryAmount = 200 + Math.floor(Math.random() * 300); // 200-500
      break;
    case "HIGH":
      primaryAmount = 500 + Math.floor(Math.random() * 500); // 500-1000
      break;
    case "EXTREME":
      primaryAmount = 1000 + Math.floor(Math.random() * 1000); // 1000-2000
      break;
  }
  
  resources[resourceType] = primaryAmount;
  
  // Add some secondary resources (0-2 additional types)
  const secondaryResourceCount = Math.floor(Math.random() * 3); // 0-2
  const allResourceTypes = ["money", "fuel", "ammo", "medicine", "food", "materials"];
  const availableSecondaryTypes = allResourceTypes.filter(type => type !== resourceType);
  
  for (let i = 0; i < secondaryResourceCount; i++) {
    if (availableSecondaryTypes.length === 0) break;
    
    const secondaryIndex = Math.floor(Math.random() * availableSecondaryTypes.length);
    const secondaryType = availableSecondaryTypes[secondaryIndex];
    availableSecondaryTypes.splice(secondaryIndex, 1);
    
    // Secondary resources are worth less than the primary
    const secondaryAmount = Math.floor(primaryAmount * (0.2 + Math.random() * 0.3)); // 20-50% of primary
    resources[secondaryType] = secondaryAmount;
  }
  
  // Calculate money reward (always included)
  if (!resources.money) {
    let moneyReward;
    switch (difficulty) {
      case "LOW":
        moneyReward = 5000 + Math.floor(Math.random() * 5000); // 5000-10000
        break;
      case "MEDIUM":
        moneyReward = 10000 + Math.floor(Math.random() * 15000); // 10000-25000
        break;
      case "HIGH":
        moneyReward = 25000 + Math.floor(Math.random() * 25000); // 25000-50000
        break;
      case "EXTREME":
        moneyReward = 50000 + Math.floor(Math.random() * 50000); // 50000-100000
        break;
    }
    resources.money = moneyReward;
  }
  
  // Create deployment object
  const deployment = {
    id: `deploy-${resourceType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `${operationType} - ${location.name}`,
    location: location.name,
    coordinates: {
      lat: location.lat,
      lon: location.lon
    },
    difficulty: difficulty,
    duration: duration, // days
    travelTime: Math.ceil(1 + Math.random() * 3), // 1-4 days
    enemyStrength: baseStrength,
    resources: resources,
    primaryResource: resourceType,
    available: true,
    status: "available",
    createdAt: firebase.firestore.Timestamp.now(),
    expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)) // Available for 7 days
  };
  
  return deployment;
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


// Initialize deployment system with new buttons and events
function initializeEnhancedDeploymentSystem() {
  // Setup deployment generation buttons
  document.getElementById('generate-money-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('money');
  });
  
  document.getElementById('generate-fuel-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('fuel');
  });
  
  document.getElementById('generate-ammo-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('ammo');
  });
  
  document.getElementById('generate-medicine-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('medicine');
  });
  
  document.getElementById('generate-food-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('food');
  });
  
  document.getElementById('generate-materials-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('materials');
  });
  
  document.getElementById('view-active-deployments')?.addEventListener('click', () => {
    viewActiveDeployments();
  });
  
  // Setup click handler for deployment markers on globe
  if (scene) {
    // Raycaster for detecting clicks on deployment markers will be handled in main.js
    console.log("Deployment system initialized with globe interaction");
  }
  
  // Load existing deployments from Firebase when initializing
  loadActiveDeployments();
  loadAvailableDeployments();
  
  // Start periodic checking of deployment progress
  setInterval(checkDeploymentProgress, 60000); // Check every minute
  
  // Check for available deployments periodically
  setInterval(() => {
    loadAvailableDeployments();
    console.log("Checking for new available deployments...");
  }, 120000); // Check every 2 minutes
}

// Load active deployments from Firebase
async function loadActiveDeployments() {
  if (!currentUser) return;
  
  try {
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    if (snapshot.empty) {
      console.log("No active deployments found");
      return;
    }
    
    // Process each active deployment
    snapshot.forEach(doc => {
      const deployment = doc.data();
      console.log("Loaded active deployment:", deployment.deploymentId || doc.id);
      
      // Add marker to globe if coordinates exist
      if (deployment.deploymentData && deployment.deploymentData.coordinates) {
        addDeploymentMarker(deployment.deploymentData);
      }
    });
    
    console.log("Active deployments loaded successfully");
    
    // Update the active deployments count in the HQ panel
    const activeDeploymentsCount = document.getElementById('active-deployments-count');
    if (activeDeploymentsCount) {
      activeDeploymentsCount.textContent = snapshot.size;
    }
    
  } catch (error) {
    console.error('Error loading active deployments:', error);
  }
}

// View active deployments
async function viewActiveDeployments() {
  try {
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    // Create modal for deployments list
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'view-deployments-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">ACTIVE DEPLOYMENTS</div>
      <button class="modal-close">X</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (snapshot.empty) {
      body.innerHTML = '<div class="no-deployments-message">No active deployments found.</div>';
    } else {
      // Group deployments by status
      const deploymentsByStatus = {
        traveling: [],
        fighting: [],
        victorious: [],
        failed: [],
        returned: []
      };
      
      snapshot.forEach(doc => {
        const deployment = doc.data();
        deployment.id = doc.id;
        
        if (deploymentsByStatus[deployment.status]) {
          deploymentsByStatus[deployment.status].push(deployment);
        } else {
          deploymentsByStatus.traveling.push(deployment);
        }
      });
      
      // Create sections for each status
      const statusLabels = {
        traveling: "TRAVELING",
        fighting: "IN COMBAT",
        victorious: "VICTORIOUS",
        failed: "FAILED",
        returned: "RETURNED"
      };
      
      for (const [status, deployments] of Object.entries(deploymentsByStatus)) {
        if (deployments.length === 0) continue;
        
        const statusSection = document.createElement('div');
        statusSection.className = 'deployments-section';
        
        const statusTitle = document.createElement('h3');
        statusTitle.textContent = statusLabels[status] || status.toUpperCase();
        statusSection.appendChild(statusTitle);
        
        const deploymentsList = document.createElement('div');
        deploymentsList.className = 'deployments-list';
        
        deployments.forEach(deployment => {
          const item = document.createElement('div');
          item.className = `deployment-item ${status}`;
          
          const name = deployment.deploymentData?.name || "Unknown Deployment";
          const location = deployment.deploymentData?.location || "Unknown Location";
          const resource = deployment.deploymentData?.primaryResource?.toUpperCase() || "Unknown";
          
          // Format times
          const arrivalTime = deployment.arrivalTime?.toDate()?.toLocaleString() || "Unknown";
          const returnTime = deployment.returnTime?.toDate()?.toLocaleString() || "Unknown";
          
          // Calculate progress percentage
          let progressText = "";
          let progressPercentage = 0;
          
          if (status === "traveling") {
            const now = new Date();
            const departureTime = deployment.departureTime.toDate();
            const arrivalTime = deployment.arrivalTime.toDate();
            const totalTravelTime = arrivalTime - departureTime;
            const elapsed = now - departureTime;
            progressPercentage = Math.min(100, Math.max(0, (elapsed / totalTravelTime) * 100));
            progressText = `Arriving: ${arrivalTime}`;
          } else if (status === "fighting") {
            const squadRemaining = deployment.squadData?.remainingMembers || 0;
            const squadTotal = deployment.squadData?.size || 10;
            const enemyRemaining = deployment.enemyRemaining || 0;
            const enemyTotal = deployment.deploymentData?.enemyStrength || 100;
            
            progressPercentage = Math.min(100, Math.max(0, 100 - ((enemyRemaining / enemyTotal) * 100)));
            progressText = `Squad: ${squadRemaining}/${squadTotal} | Enemy: ${Math.floor(enemyRemaining)}/${Math.floor(enemyTotal)}`;
          } else if (status === "victorious" || status === "failed") {
            const now = new Date();
            const battleEndTime = deployment.lastBattleUpdate?.toDate() || new Date();
            const returnTime = deployment.returnTime.toDate();
            const totalReturnTime = returnTime - battleEndTime;
            const elapsed = now - battleEndTime;
            progressPercentage = Math.min(100, Math.max(0, (elapsed / totalReturnTime) * 100));
            progressText = `Returning: ${returnTime}`;
          } else {
            progressPercentage = 100;
          }
          
          item.innerHTML = `
            <div class="deployment-header">
              <div class="deployment-name">${name}</div>
              <div class="deployment-status">${status.toUpperCase()}</div>
            </div>
            <div class="deployment-location">${location} - ${resource}</div>
            <div class="deployment-progress">
              <div class="progress-text">${progressText}</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
              </div>
            </div>
            <button class="view-deployment-details" data-id="${deployment.id}">VIEW DETAILS</button>
          `;
          
          deploymentsList.appendChild(item);
        });
        
        statusSection.appendChild(deploymentsList);
        body.appendChild(statusSection);
      }
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
    
    // Add event listeners for view details buttons
    const viewButtons = modal.querySelectorAll('.view-deployment-details');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const deploymentId = button.getAttribute('data-id');
        viewDeploymentDetails(deploymentId);
        document.body.removeChild(modal);
      });
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  } catch (error) {
    console.error('Error viewing deployments:', error);
  }
}

// View details for a specific deployment
async function viewDeploymentDetails(deploymentId) {
  try {
    const deploymentDoc = await db.collection('activeDeployments').doc(deploymentId).get();
    
    if (!deploymentDoc.exists) {
      console.error('Deployment not found');
      return;
    }
    
    const deployment = deploymentDoc.data();
    
    // Create or get deployment status panel
    let statusPanel = document.getElementById('deployment-status-panel');
    
    if (!statusPanel) {
      statusPanel = document.createElement('div');
      statusPanel.id = 'deployment-status-panel';
      document.body.appendChild(statusPanel);
    }
    
    // Format data for display
    const deploymentName = deployment.deploymentData?.name || "Unknown Deployment";
    const location = deployment.deploymentData?.location || "Unknown Location";
    const resource = deployment.deploymentData?.primaryResource?.toUpperCase() || "Unknown";
    const difficulty = deployment.deploymentData?.difficulty || "MEDIUM";
    const status = deployment.status.toUpperCase();
    
    // Format times
    const departureTime = deployment.departureTime?.toDate()?.toLocaleString() || "Unknown";
    const arrivalTime = deployment.arrivalTime?.toDate()?.toLocaleString() || "Unknown";
    const returnTime = deployment.returnTime?.toDate()?.toLocaleString() || "Unknown";
    
    // Squad data
    const squadSize = deployment.squadData?.size || 0;
    const squadStrength = deployment.squadData?.strength || 0;
    const squadRemaining = deployment.squadData?.remainingMembers || 0;
    const squadCasualties = deployment.squadData?.casualties || 0;
    
    // Enemy data
    const enemyStrength = deployment.deploymentData?.enemyStrength || 0;
    const enemyRemaining = deployment.enemyRemaining ?? enemyStrength;
    
    // Resource rewards
    const resourcesHtml = Object.entries(deployment.deploymentData?.resources || {})
      .map(([type, amount]) => `<div>${type.toUpperCase()}: ${amount}</div>`)
      .join('');
    
    // Battle log
    const battleLogHtml = (deployment.battleLog || [])
      .map(entry => {
        const timestamp = entry.timestamp?.toDate()?.toLocaleTimeString() || "";
        return `<div class="battle-log-entry ${entry.type || ''}">[${timestamp}] ${entry.message}</div>`;
      })
      .join('');
    
    // Update panel content
    statusPanel.innerHTML = `
      <div class="deployment-status-header">
        <div class="deployment-status-title">${deploymentName} - ${status}</div>
        <button class="modal-close">X</button>
      </div>
      
      <div class="deployment-status-content">
        <div class="deployment-info">
          <div class="deployment-info-title">DEPLOYMENT INFORMATION</div>
          <div class="deployment-data">
            <div>Location:</div>
            <div>${location}</div>
            
            <div>Primary Resource:</div>
            <div>${resource}</div>
            
            <div>Difficulty:</div>
            <div>${difficulty}</div>
            
            <div>Departure:</div>
            <div>${departureTime}</div>
            
            <div>Arrival:</div>
            <div>${arrivalTime}</div>
            
            <div>Expected Return:</div>
            <div>${returnTime}</div>
            
            <div>Enemy Strength:</div>
            <div>${Math.floor(enemyRemaining)}/${Math.floor(enemyStrength)}</div>
          </div>
        </div>
        
        <div class="squad-info">
          <div class="squad-info-title">SQUAD INFORMATION</div>
          <div class="squad-data">
            <div>Squad Size:</div>
            <div>${squadRemaining}/${squadSize}</div>
            
            <div>Squad Power:</div>
            <div>${squadStrength}</div>
            
            <div>Casualties:</div>
            <div>${squadCasualties}</div>
            
            <div>Rewards:</div>
            <div class="rewards-data">${resourcesHtml}</div>
          </div>
        </div>
      </div>
      
      <div class="battle-log">
        <div class="battle-log-title">MISSION LOG</div>
        <div class="battle-log-content">
          ${battleLogHtml || '<div class="no-log-entries">No log entries yet.</div>'}
        </div>
      </div>
      
      <div class="deployment-status-footer">
        <button class="cancel-button">CLOSE</button>
      </div>
    `;
    
    // Display panel
    statusPanel.style.display = 'block';
    
    // Add event listeners
    const closeButton = statusPanel.querySelector('.modal-close');
    const cancelButton = statusPanel.querySelector('.cancel-button');
    
    closeButton.addEventListener('click', () => {
      statusPanel.style.display = 'none';
    });
    
    cancelButton.addEventListener('click', () => {
      statusPanel.style.display = 'none';
    });
    
  } catch (error) {
    console.error('Error viewing deployment details:', error);
  }
}

// Add at document load
document.addEventListener('DOMContentLoaded', function() {
  initializeEnhancedDeploymentSystem();
});
// Add a deployment marker to the globe
function addDeploymentMarker(deployment) {
  if (!scene) {
    console.error('Scene not initialized yet');
    return null;
  }
  
  const lat = deployment.coordinates.lat;
  const lon = deployment.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Use yellow color for all deployment markers
  const markerColor = 0xFFC107; // Yellow/Amber
  
  // Create point marker - slightly larger for better visibility
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: markerColor });
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add deployment identifier
  point.userData = { 
    deploymentId: deployment.id,
    type: 'deployment-point',
    primaryResource: deployment.primaryResource,
    deployment: deployment // Store the full deployment data for easy access
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
    color: markerColor,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  
  // Add ring to its parent
  ringParent.add(ring);
  
  // Position ring a tiny bit away from the globe's surface to prevent z-fighting
  ring.position.set(0, 0, 0.01);
  
  // Rotate the ring to face outward
  ring.rotation.x = Math.PI / 2;
  
  // Store reference for animation - increase animation speed
  point.userData.ring = ring;
  point.userData.ringParent = ringParent;
  point.userData.pulseSpeed = 0.006; // Faster pulse speed
  
  // Store in deployment markers array
  deploymentMarkers.push(point);
  
  console.log(`Added deployment marker for ${deployment.id} (${deployment.primaryResource}) at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Send a squad to a deployment
async function sendSquadToDeployment(deploymentId) {
  try {
    // Get the deployment info
    const deploymentDoc = await db.collection('availableDeployments').doc(deploymentId).get();
    
    if (!deploymentDoc.exists) {
      console.error('Deployment not found');
      return;
    }
    
    const deployment = deploymentDoc.data();
    
    // Get the combat team stats
    const teamDoc = await db.collection('teams').doc(`${currentUser.uid}_combat`).get();
    
    if (!teamDoc.exists) {
      console.error('Combat team not found');
      return;
    }
    
    const combatTeam = teamDoc.data();
    
    // Check if there are enough available team members
    if (combatTeam.availableMembers < 5) {
      console.error('Not enough available combat team members');
      return;
    }
    
    // Calculate travel time (from deployment data or calculate based on distance)
    const travelTime = deployment.travelTime || 2; // Default 2 days if not specified
    
    // Calculate squad strength
    const squadStrength = combatTeam.power;
    const squadSize = Math.min(combatTeam.availableMembers, 10); // Cap at 10 members
    
    // Calculate arrival and return times
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + (travelTime * 24 * 60 * 60 * 1000));
    const missionDuration = deployment.duration || 3; // Default 3 days if not specified
    const returnTime = new Date(arrivalTime.getTime() + (missionDuration * 24 * 60 * 60 * 1000));
    
    // Create active deployment record
    const activeDeployment = {
      deploymentId: deploymentId,
      userId: currentUser.uid,
      deploymentData: deployment,
      squadData: {
        strength: squadStrength,
        size: squadSize,
        remainingMembers: squadSize,
        casualties: 0
      },
      status: "traveling",
      departureTime: firebase.firestore.Timestamp.fromDate(now),
      arrivalTime: firebase.firestore.Timestamp.fromDate(arrivalTime),
      returnTime: firebase.firestore.Timestamp.fromDate(returnTime),
      battleLog: [{
        timestamp: firebase.firestore.Timestamp.fromDate(now),
        message: `Squad dispatched to ${deployment.name}`,
        type: "info"
      }]
    };
    
    // Update in a batch transaction
    const batch = db.batch();
    
    // Create active deployment
    const activeDeploymentRef = db.collection('activeDeployments').doc();
    batch.set(activeDeploymentRef, activeDeployment);
    
    // Update deployment status
    const deploymentRef = db.collection('availableDeployments').doc(deploymentId);
    batch.update(deploymentRef, {
      available: false,
      status: "in_progress",
      assignedTeam: currentUser.uid
    });
    
    // Update combat team stats
    const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
    batch.update(teamRef, {
      availableMembers: firebase.firestore.FieldValue.increment(-squadSize),
      deployedMembers: firebase.firestore.FieldValue.increment(squadSize)
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Squad sent to deployment ${deploymentId}`);
    console.log(`Expected arrival: ${arrivalTime}`);
    console.log(`Expected return: ${returnTime}`);
    
    // Create visual path on globe (in a real implementation, this would be handled by the UI)
    createSquadPath(deployment.coordinates);
    
    return activeDeploymentRef.id;
  } catch (error) {
    console.error('Error sending squad to deployment:', error);
    return null;
  }
}

// Create a visual path from HQ to deployment location
function createSquadPath(destinationCoords) {
  // HQ coordinates (already defined in main.js)
  const hqLat = HQ_LOCATION.lat;
  const hqLon = HQ_LOCATION.lon;
  
  // Destination coordinates
  const destLat = destinationCoords.lat;
  const destLon = destinationCoords.lon;
  
  // Create a curved path between points
  // This is a simplified version - a full implementation would need
  // to calculate a great circle path on the sphere
  
  // Convert to 3D coordinates
  const hqPhi = (90 - hqLat) * Math.PI/180;
  const hqTheta = (hqLon + 180) * Math.PI/180;
  
  const destPhi = (90 - destLat) * Math.PI/180;
  const destTheta = (destLon + 180) * Math.PI/180;
  
  const hqPoint = new THREE.Vector3(
    -10 * Math.sin(hqPhi) * Math.cos(hqTheta),
    10 * Math.cos(hqPhi),
    10 * Math.sin(hqPhi) * Math.sin(hqTheta)
  );
  
  const destPoint = new THREE.Vector3(
    -10 * Math.sin(destPhi) * Math.cos(destTheta),
    10 * Math.cos(destPhi),
    10 * Math.sin(destPhi) * Math.sin(destTheta)
  );
  
  // Create a curved path (arc) between the two points
  const curvePoints = [];
  const segments = 50;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    // Simple linear interpolation
    const x = hqPoint.x * (1 - t) + destPoint.x * t;
    const y = hqPoint.y * (1 - t) + destPoint.y * t;
    const z = hqPoint.z * (1 - t) + destPoint.z * t;
    
    // Project back onto sphere surface
    const length = Math.sqrt(x * x + y * y + z * z);
    const normalized = new THREE.Vector3(x / length, y / length, z / length);
    
    // Scale to globe radius
    curvePoints.push(normalized.multiplyScalar(10.05)); // Slightly above surface
  }
  
  // Create curve from points
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  
  // Create geometry from curve
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
  
  // Create material
  const curveMaterial = new THREE.LineBasicMaterial({
    color: 0x4CAF50, // Green
    linewidth: 2,
    transparent: true,
    opacity: 0.8,
    dashSize: 0.2,
    gapSize: 0.1,
  });
  
  // Create line
  const curveObject = new THREE.Line(curveGeometry, curveMaterial);
  curveObject.userData = { type: 'squad-path' };
  
  // Add to scene
  scene.add(curveObject);
  
  console.log('Created visual path for squad deployment');
  
  return curveObject;
}

// Check for squad arrival at deployment and handle battle simulation
async function checkDeploymentProgress() {
  try {
    // Get all active deployments for current user
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    if (snapshot.empty) {
      return; // No active deployments
    }
    
    const now = new Date();
    const batch = db.batch();
    
    for (const doc of snapshot.docs) {
      const deployment = doc.data();
      const deploymentRef = doc.ref;
      
      // Skip if already returned
      if (deployment.status === "returned") continue;
      
      const arrivalTime = deployment.arrivalTime.toDate();
      const returnTime = deployment.returnTime.toDate();
      
      // Check if squad has arrived but status hasn't been updated
      if (now >= arrivalTime && deployment.status === "traveling") {
        // Update status to "fighting"
        batch.update(deploymentRef, {
          status: "fighting",
          battleStartTime: firebase.firestore.Timestamp.now(),
          battleLog: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            message: `Squad arrived at ${deployment.deploymentData.name} and engaged enemy forces`,
            type: "info"
          })
        });
        
        console.log(`Squad arrived at deployment ${doc.id}`);
      }
      
      // Check if battle is in progress
      else if (deployment.status === "fighting") {
        // Check if it's time to simulate next battle round
        const lastBattleUpdate = deployment.lastBattleUpdate?.toDate() || arrivalTime;
        const battleInterval = 15 * 60 * 1000; // 15 minutes in milliseconds
        
        if (now.getTime() - lastBattleUpdate.getTime() >= battleInterval) {
          // Simulate battle round
          const battleResult = simulateBattleRound(deployment);
          
          // Update deployment with battle results
          batch.update(deploymentRef, {
            lastBattleUpdate: firebase.firestore.Timestamp.now(),
            'squadData.remainingMembers': battleResult.remainingSquadMembers,
            'squadData.casualties': battleResult.squadCasualties,
            enemyRemaining: battleResult.remainingEnemyForce,
            battleLog: firebase.firestore.FieldValue.arrayUnion(...battleResult.logEntries)
          });
          
          // Check if battle is over (either squad wiped out or enemy defeated)
          if (battleResult.remainingSquadMembers <= 0 || battleResult.remainingEnemyForce <= 0) {
            // Update status based on outcome
            if (battleResult.remainingSquadMembers <= 0) {
              // Squad was wiped out
              batch.update(deploymentRef, {
                status: "failed",
                battleLog: firebase.firestore.FieldValue.arrayUnion({
                  timestamp: firebase.firestore.Timestamp.now(),
                  message: "Squad was defeated. No resources recovered.",
                  type: "info"
                })
              });
              
              // Update combat team stats
              const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
              batch.update(teamRef, {
                woundedMembers: firebase.firestore.FieldValue.increment(battleResult.squadCasualties),
                deployedMembers: firebase.firestore.FieldValue.increment(-deployment.squadData.size)
              });
              
              console.log(`Squad was defeated at deployment ${doc.id}`);
            } else {
              // Enemy was defeated
              batch.update(deploymentRef, {
                status: "victorious",
                battleLog: firebase.firestore.FieldValue.arrayUnion({
                  timestamp: firebase.firestore.Timestamp.now(),
                  message: "Enemy forces defeated. Resources secured!",
                  type: "info"
                })
              });
              
              // Award resources
              await awardDeploymentResources(deployment, batch);
              
              console.log(`Squad victorious at deployment ${doc.id}`);
            }
          }
        }
      }
      
      // Check if it's time for squad to return
      else if ((deployment.status === "victorious" || deployment.status === "failed") && 
               now >= returnTime && deployment.status !== "returned") {
        // Update status to "returned"
        batch.update(deploymentRef, {
          status: "returned",
          battleLog: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            message: `Squad returned to base`,
            type: "info"
          })
        });
        
        // Update combat team stats
        const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
        
        if (deployment.status === "victorious") {
          // Return surviving members to available pool
          batch.update(teamRef, {
            availableMembers: firebase.firestore.FieldValue.increment(deployment.squadData.remainingMembers),
            deployedMembers: firebase.firestore.FieldValue.increment(-deployment.squadData.size)
          });
        }
        
        console.log(`Squad returned from deployment ${doc.id}`);
      }
    }
    
    // Commit all updates
    await batch.commit();
  } catch (error) {
    console.error('Error checking deployment progress:', error);
  }
}

// Simulate a single round of battle
function simulateBattleRound(deployment) {
  // Get current state
  const squadStrength = deployment.squadData.strength || 100;
  const squadSize = deployment.squadData.size || 10;
  const remainingSquadMembers = deployment.squadData.remainingMembers || squadSize;
  const squadCasualties = deployment.squadData.casualties || 0;
  
  // Calculate enemy stats
  const enemyStrength = deployment.deploymentData.enemyStrength || 100;
  const enemyRemaining = deployment.enemyRemaining || enemyStrength;
  
  // No battle if either side is already defeated
  if (remainingSquadMembers <= 0 || enemyRemaining <= 0) {
    return {
      remainingSquadMembers,
      squadCasualties,
      remainingEnemyForce: enemyRemaining,
      logEntries: []
    };
  }
  
  // Calculate effective squad power (based on remaining members)
  const effectiveSquadPower = squadStrength * (remainingSquadMembers / squadSize);
  
  // Calculate damage factors (with randomness)
  const squadDamageBase = effectiveSquadPower / 100;
  const enemyDamageBase = enemyRemaining / 100;
  
  // Add randomness (0.5 to 1.5x multiplier)
  const squadDamage = Math.max(1, Math.floor(enemyDamageBase * (0.5 + Math.random())));
  const enemyDamage = Math.max(1, Math.floor(squadDamageBase * (0.5 + Math.random())));
  
  // Apply damage
  const newEnemyForce = Math.max(0, enemyRemaining - squadDamage);
  let newSquadMembers = Math.max(0, remainingSquadMembers - enemyDamage);
  const newSquadCasualties = squadCasualties + (remainingSquadMembers - newSquadMembers);
  
  // Create log entries
  const logEntries = [
    {
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Squad inflicted ${squadDamage} damage to enemy forces`,
      type: "squad"
    },
    {
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Enemy forces inflicted ${enemyDamage} casualties to squad`,
      type: "enemy"
    }
  ];
  
  return {
    remainingSquadMembers: newSquadMembers,
    squadCasualties: newSquadCasualties,
    remainingEnemyForce: newEnemyForce,
    logEntries
  };
}

// Award resources for successful deployment
async function awardDeploymentResources(deployment, batchRef) {
  // Get the resources to award
  const resources = deployment.deploymentData.resources;
  
  if (!resources) return;
  
  // Get global resources reference
  const globalResourcesRef = db.collection('globalResources').doc('shared');
  
  // Create updates object
  const updates = {};
  
  // Add resources
  for (const [resource, amount] of Object.entries(resources)) {
    if (resource === 'money') {
      updates.money = firebase.firestore.FieldValue.increment(amount);
    } else {
      updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(amount);
    }
  }
  
  // Add timestamp and random value to force update detection
  updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
  updates.updateId = Math.random().toString(36).substring(2, '15');
  
  // Apply updates to global resources
  batchRef.update(globalResourcesRef, updates);
  
  // Add log entries for resources gained
  const logEntries = [];
  
  for (const [resource, amount] of Object.entries(resources)) {
    logEntries.push({
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Gained ${amount} ${resource.toUpperCase()}`,
      type: "resource"
    });
  }
  
  // Add resource award log entries
  batchRef.update(deployment.ref, {
    battleLog: firebase.firestore.FieldValue.arrayUnion(...logEntries)
  });
}

// Confirm sending squad to deployment
function confirmSendSquad(deploymentId) {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get the deployment info
    db.collection('availableDeployments').doc(deploymentId).get().then(doc => {
      if (!doc.exists) {
        showNotification('DEPLOYMENT NOT FOUND');
        return;
      }
      
      const deployment = doc.data();
      
      // Create confirmation modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'send-squad-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = `
        <div class="modal-title">CONFIRM SQUAD DEPLOYMENT</div>
        <button class="modal-close">X</button>
      `;
      
      // Format resource rewards
      let resourcesHtml = '<ul>';
      for (const [resource, amount] of Object.entries(deployment.resources)) {
        if (resource === 'money') {
          resourcesHtml += `<li>${amount.toLocaleString()}</li>`;
        } else {
          resourcesHtml += `<li>${resource.toUpperCase()}: ${amount}</li>`;
        }
      }
      resourcesHtml += '</ul>';
      
      // Create body
      const body = document.createElement('div');
      body.className = 'modal-body';
      body.innerHTML = `
        <div class="confirmation-message">
          Deploy squad to: <strong>${deployment.name}</strong>
        </div>
        <div class="confirmation-details">
          <div>Location: ${deployment.location}</div>
          <div>Difficulty: ${deployment.difficulty}</div>
          <div>Duration: ${deployment.duration} days</div>
          <div>Travel Time: ${deployment.travelTime || 2} days</div>
          <div>Enemy Strength: ${deployment.enemyStrength}</div>
          <div class="rewards-header">Potential Rewards:</div>
          <div class="rewards-list">${resourcesHtml}</div>
        </div>
        <div class="confirmation-warning">
          This operation will send your squad on a ${deployment.duration + (deployment.travelTime || 2) * 2} day mission. 
          Squad members may be injured or killed during combat.
        </div>
      `;
      
      // Create footer
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button">DEPLOY SQUAD</button>
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
      
      confirmButton.addEventListener('click', async () => {
        // Send squad to deployment
        const result = await sendSquadToDeployment(deploymentId);
        
        if (result) {
          showNotification('SQUAD DEPLOYED');
        } else {
          showNotification('ERROR DEPLOYING SQUAD');
        }
        
        document.body.removeChild(modal);
      });
      
      // Show modal
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Play sound
      tabSound.play().catch(console.error);
    }).catch(error => {
      console.error('Error fetching deployment:', error);
      showNotification('ERROR FETCHING DEPLOYMENT DATA');
    });
  } catch (error) {
    console.error('Error sending squad:', error);
    showNotification('ERROR SENDING SQUAD');
  }
}
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

// Admin: Generate and store specific resource deployment
async function adminGenerateResourceDeployment(resourceType) {
  if (userRole !== 'admin') {
    console.error('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Generate a random deployment focused on the specified resource
    const deployment = generateSpecificResourceDeployment(resourceType);
    
    // Store in Firebase
    await db.collection('availableDeployments').doc(deployment.id).set(deployment);
    
    // Add marker to globe
    addDeploymentMarker(deployment);
    
    console.log(`NEW ${resourceType.toUpperCase()} DEPLOYMENT GENERATED`);
    return deployment;
  } catch (error) {
    console.error(`Error generating ${resourceType} deployment:`, error);
    return null;
  }
}

// Generate a deployment focused on a specific resource
function generateSpecificResourceDeployment(resourceType) {
  // Possible locations around the world - we'll pick one randomly
  const potentialLocations = [
    { name: "SIBERIA", lat: 61.0137, lon: 99.1967 },
    { name: "AMAZON", lat: -3.4653, lon: -62.2159 },
    { name: "SAHARA", lat: 23.4162, lon: 25.6628 },
    { name: "AFGHANISTAN", lat: 33.9391, lon: 67.7100 },
    { name: "NORTHERN EUROPE", lat: 61.9241, lon: 25.7482 },
    { name: "ANTARCTICA", lat: -79.4063, lon: 0.3150 },
    { name: "AUSTRALIA OUTBACK", lat: -25.2744, lon: 133.7751 },
    { name: "PACIFIC ISLAND", lat: -17.7134, lon: 178.0650 },
    { name: "SOUTH CHINA SEA", lat: 13.2904, lon: 114.3321 },
    { name: "ANDES", lat: -13.4125, lon: -72.3430 },
    { name: "EASTERN EUROPE", lat: 50.4501, lon: 30.5234 },
    { name: "NORTH ATLANTIC", lat: 56.8129, lon: -42.1598 },
    { name: "CENTRAL AFRICA", lat: 6.8770, lon: 20.6446 },
    { name: "MIDDLE EAST", lat: 24.4539, lon: 54.3773 },
    { name: "SOUTH ASIA", lat: 28.6139, lon: 77.2090 }
  ];
  
  // Randomly select a location
  const locationIndex = Math.floor(Math.random() * potentialLocations.length);
  const location = potentialLocations[locationIndex];
  
  // Determine operation types based on resource
  const operationTypes = {
    money: ["BANK HEIST", "STOCK EXCHANGE", "TREASURY RAID", "CASINO OPERATION"],
    fuel: ["OIL FIELD", "REFINERY CAPTURE", "PIPELINE OPERATION", "FUEL DEPOT"],
    ammo: ["ARMS CACHE", "MUNITIONS FACTORY", "WEAPONS DEPOT", "ARMORY RAID"],
    medicine: ["MEDICAL FACILITY", "PHARMACEUTICAL LAB", "HOSPITAL SUPPLIES", "MED-STATION"],
    food: ["AGRICULTURAL CENTER", "FOOD DEPOT", "SUPPLY WAREHOUSE", "DISTRIBUTION HUB"],
    materials: ["MINING OPERATION", "INDUSTRIAL COMPLEX", "RESOURCE EXTRACTION", "MANUFACTURING PLANT"]
  };
  
  // Select random operation type for the resource
  const operationType = operationTypes[resourceType][Math.floor(Math.random() * operationTypes[resourceType].length)];
  
  // Random difficulty levels with weighted distribution
  const difficulties = ["LOW", "MEDIUM", "HIGH", "EXTREME"];
  const difficultyWeights = [0.3, 0.4, 0.2, 0.1]; // Higher chance for medium difficulty
  
  let difficultyIndex = 0;
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < difficulties.length; i++) {
    cumulativeWeight += difficultyWeights[i];
    if (random <= cumulativeWeight) {
      difficultyIndex = i;
      break;
    }
  }
  
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
  
  // Calculate enemy strength based on difficulty
  let baseStrength;
  switch (difficulty) {
    case "LOW":
      baseStrength = 20 + Math.floor(Math.random() * 30); // 20-50
      break;
    case "MEDIUM":
      baseStrength = 50 + Math.floor(Math.random() * 50); // 50-100
      break;
    case "HIGH":
      baseStrength = 100 + Math.floor(Math.random() * 100); // 100-200
      break;
    case "EXTREME":
      baseStrength = 200 + Math.floor(Math.random() * 100); // 200-300
      break;
  }
  
  // Calculate rewards based on difficulty
  const resources = {};
  
  // Primary resource (the one this deployment is for)
  let primaryAmount;
  switch (difficulty) {
    case "LOW":
      primaryAmount = 100 + Math.floor(Math.random() * 100); // 100-200
      break;
    case "MEDIUM":
      primaryAmount = 200 + Math.floor(Math.random() * 300); // 200-500
      break;
    case "HIGH":
      primaryAmount = 500 + Math.floor(Math.random() * 500); // 500-1000
      break;
    case "EXTREME":
      primaryAmount = 1000 + Math.floor(Math.random() * 1000); // 1000-2000
      break;
  }
  
  resources[resourceType] = primaryAmount;
  
  // Add some secondary resources (0-2 additional types)
  const secondaryResourceCount = Math.floor(Math.random() * 3); // 0-2
  const allResourceTypes = ["money", "fuel", "ammo", "medicine", "food", "materials"];
  const availableSecondaryTypes = allResourceTypes.filter(type => type !== resourceType);
  
  for (let i = 0; i < secondaryResourceCount; i++) {
    if (availableSecondaryTypes.length === 0) break;
    
    const secondaryIndex = Math.floor(Math.random() * availableSecondaryTypes.length);
    const secondaryType = availableSecondaryTypes[secondaryIndex];
    availableSecondaryTypes.splice(secondaryIndex, 1);
    
    // Secondary resources are worth less than the primary
    const secondaryAmount = Math.floor(primaryAmount * (0.2 + Math.random() * 0.3)); // 20-50% of primary
    resources[secondaryType] = secondaryAmount;
  }
  
  // Calculate money reward (always included)
  if (!resources.money) {
    let moneyReward;
    switch (difficulty) {
      case "LOW":
        moneyReward = 5000 + Math.floor(Math.random() * 5000); // 5000-10000
        break;
      case "MEDIUM":
        moneyReward = 10000 + Math.floor(Math.random() * 15000); // 10000-25000
        break;
      case "HIGH":
        moneyReward = 25000 + Math.floor(Math.random() * 25000); // 25000-50000
        break;
      case "EXTREME":
        moneyReward = 50000 + Math.floor(Math.random() * 50000); // 50000-100000
        break;
    }
    resources.money = moneyReward;
  }
  
  // Create deployment object
  const deployment = {
    id: `deploy-${resourceType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `${operationType} - ${location.name}`,
    location: location.name,
    coordinates: {
      lat: location.lat,
      lon: location.lon
    },
    difficulty: difficulty,
    duration: duration, // days
    travelTime: Math.ceil(1 + Math.random() * 3), // 1-4 days
    enemyStrength: baseStrength,
    resources: resources,
    primaryResource: resourceType,
    available: true,
    status: "available",
    createdAt: firebase.firestore.Timestamp.now(),
    expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)) // Available for 7 days
  };
  
  return deployment;
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
          <div class="deployment-reward">${deployment.moneyReward.toLocaleString()}</div>
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


// Initialize deployment system with new buttons and events
function initializeEnhancedDeploymentSystem() {
  // Setup deployment generation buttons
  document.getElementById('generate-money-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('money');
  });
  
  document.getElementById('generate-fuel-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('fuel');
  });
  
  document.getElementById('generate-ammo-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('ammo');
  });
  
  document.getElementById('generate-medicine-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('medicine');
  });
  
  document.getElementById('generate-food-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('food');
  });
  
  document.getElementById('generate-materials-deployment')?.addEventListener('click', () => {
    adminGenerateResourceDeployment('materials');
  });
  
  document.getElementById('view-active-deployments')?.addEventListener('click', () => {
    viewActiveDeployments();
  });
  
  // Setup click handler for deployment markers on globe
  if (scene) {
    // Raycaster for detecting clicks on deployment markers will be handled in main.js
    console.log("Deployment system initialized with globe interaction");
  }
  
  // Load existing deployments from Firebase when initializing
  loadActiveDeployments();
  loadAvailableDeployments();
  
  // Start periodic checking of deployment progress
  setInterval(checkDeploymentProgress, 60000); // Check every minute
  
  // Check for available deployments periodically
  setInterval(() => {
    loadAvailableDeployments();
    console.log("Checking for new available deployments...");
  }, 120000); // Check every 2 minutes
}

// Load active deployments from Firebase
async function loadActiveDeployments() {
  if (!currentUser) return;
  
  try {
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    if (snapshot.empty) {
      console.log("No active deployments found");
      return;
    }
    
    // Process each active deployment
    snapshot.forEach(doc => {
      const deployment = doc.data();
      console.log("Loaded active deployment:", deployment.deploymentId || doc.id);
      
      // Add marker to globe if coordinates exist
      if (deployment.deploymentData && deployment.deploymentData.coordinates) {
        addDeploymentMarker(deployment.deploymentData);
      }
    });
    
    console.log("Active deployments loaded successfully");
    
    // Update the active deployments count in the HQ panel
    const activeDeploymentsCount = document.getElementById('active-deployments-count');
    if (activeDeploymentsCount) {
      activeDeploymentsCount.textContent = snapshot.size;
    }
    
  } catch (error) {
    console.error('Error loading active deployments:', error);
  }
}

// View active deployments
async function viewActiveDeployments() {
  try {
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    // Create modal for deployments list
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'view-deployments-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">ACTIVE DEPLOYMENTS</div>
      <button class="modal-close">X</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (snapshot.empty) {
      body.innerHTML = '<div class="no-deployments-message">No active deployments found.</div>';
    } else {
      // Group deployments by status
      const deploymentsByStatus = {
        traveling: [],
        fighting: [],
        victorious: [],
        failed: [],
        returned: []
      };
      
      snapshot.forEach(doc => {
        const deployment = doc.data();
        deployment.id = doc.id;
        
        if (deploymentsByStatus[deployment.status]) {
          deploymentsByStatus[deployment.status].push(deployment);
        } else {
          deploymentsByStatus.traveling.push(deployment);
        }
      });
      
      // Create sections for each status
      const statusLabels = {
        traveling: "TRAVELING",
        fighting: "IN COMBAT",
        victorious: "VICTORIOUS",
        failed: "FAILED",
        returned: "RETURNED"
      };
      
      for (const [status, deployments] of Object.entries(deploymentsByStatus)) {
        if (deployments.length === 0) continue;
        
        const statusSection = document.createElement('div');
        statusSection.className = 'deployments-section';
        
        const statusTitle = document.createElement('h3');
        statusTitle.textContent = statusLabels[status] || status.toUpperCase();
        statusSection.appendChild(statusTitle);
        
        const deploymentsList = document.createElement('div');
        deploymentsList.className = 'deployments-list';
        
        deployments.forEach(deployment => {
          const item = document.createElement('div');
          item.className = `deployment-item ${status}`;
          
          const name = deployment.deploymentData?.name || "Unknown Deployment";
          const location = deployment.deploymentData?.location || "Unknown Location";
          const resource = deployment.deploymentData?.primaryResource?.toUpperCase() || "Unknown";
          
          // Format times
          const arrivalTime = deployment.arrivalTime?.toDate()?.toLocaleString() || "Unknown";
          const returnTime = deployment.returnTime?.toDate()?.toLocaleString() || "Unknown";
          
          // Calculate progress percentage
          let progressText = "";
          let progressPercentage = 0;
          
          if (status === "traveling") {
            const now = new Date();
            const departureTime = deployment.departureTime.toDate();
            const arrivalTime = deployment.arrivalTime.toDate();
            const totalTravelTime = arrivalTime - departureTime;
            const elapsed = now - departureTime;
            progressPercentage = Math.min(100, Math.max(0, (elapsed / totalTravelTime) * 100));
            progressText = `Arriving: ${arrivalTime}`;
          } else if (status === "fighting") {
            const squadRemaining = deployment.squadData?.remainingMembers || 0;
            const squadTotal = deployment.squadData?.size || 10;
            const enemyRemaining = deployment.enemyRemaining || 0;
            const enemyTotal = deployment.deploymentData?.enemyStrength || 100;
            
            progressPercentage = Math.min(100, Math.max(0, 100 - ((enemyRemaining / enemyTotal) * 100)));
            progressText = `Squad: ${squadRemaining}/${squadTotal} | Enemy: ${Math.floor(enemyRemaining)}/${Math.floor(enemyTotal)}`;
          } else if (status === "victorious" || status === "failed") {
            const now = new Date();
            const battleEndTime = deployment.lastBattleUpdate?.toDate() || new Date();
            const returnTime = deployment.returnTime.toDate();
            const totalReturnTime = returnTime - battleEndTime;
            const elapsed = now - battleEndTime;
            progressPercentage = Math.min(100, Math.max(0, (elapsed / totalReturnTime) * 100));
            progressText = `Returning: ${returnTime}`;
          } else {
            progressPercentage = 100;
          }
          
          item.innerHTML = `
            <div class="deployment-header">
              <div class="deployment-name">${name}</div>
              <div class="deployment-status">${status.toUpperCase()}</div>
            </div>
            <div class="deployment-location">${location} - ${resource}</div>
            <div class="deployment-progress">
              <div class="progress-text">${progressText}</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
              </div>
            </div>
            <button class="view-deployment-details" data-id="${deployment.id}">VIEW DETAILS</button>
          `;
          
          deploymentsList.appendChild(item);
        });
        
        statusSection.appendChild(deploymentsList);
        body.appendChild(statusSection);
      }
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
    
    // Add event listeners for view details buttons
    const viewButtons = modal.querySelectorAll('.view-deployment-details');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const deploymentId = button.getAttribute('data-id');
        viewDeploymentDetails(deploymentId);
        document.body.removeChild(modal);
      });
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  } catch (error) {
    console.error('Error viewing deployments:', error);
  }
}

// View details for a specific deployment
async function viewDeploymentDetails(deploymentId) {
  try {
    const deploymentDoc = await db.collection('activeDeployments').doc(deploymentId).get();
    
    if (!deploymentDoc.exists) {
      console.error('Deployment not found');
      return;
    }
    
    const deployment = deploymentDoc.data();
    
    // Create or get deployment status panel
    let statusPanel = document.getElementById('deployment-status-panel');
    
    if (!statusPanel) {
      statusPanel = document.createElement('div');
      statusPanel.id = 'deployment-status-panel';
      document.body.appendChild(statusPanel);
    }
    
    // Format data for display
    const deploymentName = deployment.deploymentData?.name || "Unknown Deployment";
    const location = deployment.deploymentData?.location || "Unknown Location";
    const resource = deployment.deploymentData?.primaryResource?.toUpperCase() || "Unknown";
    const difficulty = deployment.deploymentData?.difficulty || "MEDIUM";
    const status = deployment.status.toUpperCase();
    
    // Format times
    const departureTime = deployment.departureTime?.toDate()?.toLocaleString() || "Unknown";
    const arrivalTime = deployment.arrivalTime?.toDate()?.toLocaleString() || "Unknown";
    const returnTime = deployment.returnTime?.toDate()?.toLocaleString() || "Unknown";
    
    // Squad data
    const squadSize = deployment.squadData?.size || 0;
    const squadStrength = deployment.squadData?.strength || 0;
    const squadRemaining = deployment.squadData?.remainingMembers || 0;
    const squadCasualties = deployment.squadData?.casualties || 0;
    
    // Enemy data
    const enemyStrength = deployment.deploymentData?.enemyStrength || 0;
    const enemyRemaining = deployment.enemyRemaining ?? enemyStrength;
    
    // Resource rewards
    const resourcesHtml = Object.entries(deployment.deploymentData?.resources || {})
      .map(([type, amount]) => `<div>${type.toUpperCase()}: ${amount}</div>`)
      .join('');
    
    // Battle log
    const battleLogHtml = (deployment.battleLog || [])
      .map(entry => {
        const timestamp = entry.timestamp?.toDate()?.toLocaleTimeString() || "";
        return `<div class="battle-log-entry ${entry.type || ''}">[${timestamp}] ${entry.message}</div>`;
      })
      .join('');
    
    // Update panel content
    statusPanel.innerHTML = `
      <div class="deployment-status-header">
        <div class="deployment-status-title">${deploymentName} - ${status}</div>
        <button class="modal-close">X</button>
      </div>
      
      <div class="deployment-status-content">
        <div class="deployment-info">
          <div class="deployment-info-title">DEPLOYMENT INFORMATION</div>
          <div class="deployment-data">
            <div>Location:</div>
            <div>${location}</div>
            
            <div>Primary Resource:</div>
            <div>${resource}</div>
            
            <div>Difficulty:</div>
            <div>${difficulty}</div>
            
            <div>Departure:</div>
            <div>${departureTime}</div>
            
            <div>Arrival:</div>
            <div>${arrivalTime}</div>
            
            <div>Expected Return:</div>
            <div>${returnTime}</div>
            
            <div>Enemy Strength:</div>
            <div>${Math.floor(enemyRemaining)}/${Math.floor(enemyStrength)}</div>
          </div>
        </div>
        
        <div class="squad-info">
          <div class="squad-info-title">SQUAD INFORMATION</div>
          <div class="squad-data">
            <div>Squad Size:</div>
            <div>${squadRemaining}/${squadSize}</div>
            
            <div>Squad Power:</div>
            <div>${squadStrength}</div>
            
            <div>Casualties:</div>
            <div>${squadCasualties}</div>
            
            <div>Rewards:</div>
            <div class="rewards-data">${resourcesHtml}</div>
          </div>
        </div>
      </div>
      
      <div class="battle-log">
        <div class="battle-log-title">MISSION LOG</div>
        <div class="battle-log-content">
          ${battleLogHtml || '<div class="no-log-entries">No log entries yet.</div>'}
        </div>
      </div>
      
      <div class="deployment-status-footer">
        <button class="cancel-button">CLOSE</button>
      </div>
    `;
    
    // Display panel
    statusPanel.style.display = 'block';
    
    // Add event listeners
    const closeButton = statusPanel.querySelector('.modal-close');
    const cancelButton = statusPanel.querySelector('.cancel-button');
    
    closeButton.addEventListener('click', () => {
      statusPanel.style.display = 'none';
    });
    
    cancelButton.addEventListener('click', () => {
      statusPanel.style.display = 'none';
    });
    
  } catch (error) {
    console.error('Error viewing deployment details:', error);
  }
}

// Add at document load
document.addEventListener('DOMContentLoaded', function() {
  initializeEnhancedDeploymentSystem();
});
// Add a deployment marker to the globe
function addDeploymentMarker(deployment) {
  if (!scene) {
    console.error('Scene not initialized yet');
    return null;
  }
  
  const lat = deployment.coordinates.lat;
  const lon = deployment.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Use yellow color for all deployment markers
  const markerColor = 0xFFC107; // Yellow/Amber
  
  // Create point marker - slightly larger for better visibility
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: markerColor });
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add deployment identifier
  point.userData = { 
    deploymentId: deployment.id,
    type: 'deployment-point',
    primaryResource: deployment.primaryResource,
    deployment: deployment // Store the full deployment data for easy access
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
    color: markerColor,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  
  // Add ring to its parent
  ringParent.add(ring);
  
  // Position ring a tiny bit away from the globe's surface to prevent z-fighting
  ring.position.set(0, 0, 0.01);
  
  // Rotate the ring to face outward
  ring.rotation.x = Math.PI / 2;
  
  // Store reference for animation - increase animation speed
  point.userData.ring = ring;
  point.userData.ringParent = ringParent;
  point.userData.pulseSpeed = 0.006; // Faster pulse speed
  
  // Store in deployment markers array
  deploymentMarkers.push(point);
  
  console.log(`Added deployment marker for ${deployment.id} (${deployment.primaryResource}) at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Send a squad to a deployment
async function sendSquadToDeployment(deploymentId) {
  try {
    // Get the deployment info
    const deploymentDoc = await db.collection('availableDeployments').doc(deploymentId).get();
    
    if (!deploymentDoc.exists) {
      console.error('Deployment not found');
      return;
    }
    
    const deployment = deploymentDoc.data();
    
    // Get the combat team stats
    const teamDoc = await db.collection('teams').doc(`${currentUser.uid}_combat`).get();
    
    if (!teamDoc.exists) {
      console.error('Combat team not found');
      return;
    }
    
    const combatTeam = teamDoc.data();
    
    // Check if there are enough available team members
    if (combatTeam.availableMembers < 5) {
      console.error('Not enough available combat team members');
      return;
    }
    
    // Calculate travel time (from deployment data or calculate based on distance)
    const travelTime = deployment.travelTime || 2; // Default 2 days if not specified
    
    // Calculate squad strength
    const squadStrength = combatTeam.power;
    const squadSize = Math.min(combatTeam.availableMembers, 10); // Cap at 10 members
    
    // Calculate arrival and return times
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + (travelTime * 24 * 60 * 60 * 1000));
    const missionDuration = deployment.duration || 3; // Default 3 days if not specified
    const returnTime = new Date(arrivalTime.getTime() + (missionDuration * 24 * 60 * 60 * 1000));
    
    // Create active deployment record
    const activeDeployment = {
      deploymentId: deploymentId,
      userId: currentUser.uid,
      deploymentData: deployment,
      squadData: {
        strength: squadStrength,
        size: squadSize,
        remainingMembers: squadSize,
        casualties: 0
      },
      status: "traveling",
      departureTime: firebase.firestore.Timestamp.fromDate(now),
      arrivalTime: firebase.firestore.Timestamp.fromDate(arrivalTime),
      returnTime: firebase.firestore.Timestamp.fromDate(returnTime),
      battleLog: [{
        timestamp: firebase.firestore.Timestamp.fromDate(now),
        message: `Squad dispatched to ${deployment.name}`,
        type: "info"
      }]
    };
    
    // Update in a batch transaction
    const batch = db.batch();
    
    // Create active deployment
    const activeDeploymentRef = db.collection('activeDeployments').doc();
    batch.set(activeDeploymentRef, activeDeployment);
    
    // Update deployment status
    const deploymentRef = db.collection('availableDeployments').doc(deploymentId);
    batch.update(deploymentRef, {
      available: false,
      status: "in_progress",
      assignedTeam: currentUser.uid
    });
    
    // Update combat team stats
    const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
    batch.update(teamRef, {
      availableMembers: firebase.firestore.FieldValue.increment(-squadSize),
      deployedMembers: firebase.firestore.FieldValue.increment(squadSize)
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Squad sent to deployment ${deploymentId}`);
    console.log(`Expected arrival: ${arrivalTime}`);
    console.log(`Expected return: ${returnTime}`);
    
    // Create visual path on globe (in a real implementation, this would be handled by the UI)
    createSquadPath(deployment.coordinates);
    
    return activeDeploymentRef.id;
  } catch (error) {
    console.error('Error sending squad to deployment:', error);
    return null;
  }
}

// Create a visual path from HQ to deployment location
function createSquadPath(destinationCoords) {
  // HQ coordinates (already defined in main.js)
  const hqLat = HQ_LOCATION.lat;
  const hqLon = HQ_LOCATION.lon;
  
  // Destination coordinates
  const destLat = destinationCoords.lat;
  const destLon = destinationCoords.lon;
  
  // Create a curved path between points
  // This is a simplified version - a full implementation would need
  // to calculate a great circle path on the sphere
  
  // Convert to 3D coordinates
  const hqPhi = (90 - hqLat) * Math.PI/180;
  const hqTheta = (hqLon + 180) * Math.PI/180;
  
  const destPhi = (90 - destLat) * Math.PI/180;
  const destTheta = (destLon + 180) * Math.PI/180;
  
  const hqPoint = new THREE.Vector3(
    -10 * Math.sin(hqPhi) * Math.cos(hqTheta),
    10 * Math.cos(hqPhi),
    10 * Math.sin(hqPhi) * Math.sin(hqTheta)
  );
  
  const destPoint = new THREE.Vector3(
    -10 * Math.sin(destPhi) * Math.cos(destTheta),
    10 * Math.cos(destPhi),
    10 * Math.sin(destPhi) * Math.sin(destTheta)
  );
  
  // Create a curved path (arc) between the two points
  const curvePoints = [];
  const segments = 50;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    // Simple linear interpolation
    const x = hqPoint.x * (1 - t) + destPoint.x * t;
    const y = hqPoint.y * (1 - t) + destPoint.y * t;
    const z = hqPoint.z * (1 - t) + destPoint.z * t;
    
    // Project back onto sphere surface
    const length = Math.sqrt(x * x + y * y + z * z);
    const normalized = new THREE.Vector3(x / length, y / length, z / length);
    
    // Scale to globe radius
    curvePoints.push(normalized.multiplyScalar(10.05)); // Slightly above surface
  }
  
  // Create curve from points
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  
  // Create geometry from curve
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
  
  // Create material
  const curveMaterial = new THREE.LineBasicMaterial({
    color: 0x4CAF50, // Green
    linewidth: 2,
    transparent: true,
    opacity: 0.8,
    dashSize: 0.2,
    gapSize: 0.1,
  });
  
  // Create line
  const curveObject = new THREE.Line(curveGeometry, curveMaterial);
  curveObject.userData = { type: 'squad-path' };
  
  // Add to scene
  scene.add(curveObject);
  
  console.log('Created visual path for squad deployment');
  
  return curveObject;
}

// Check for squad arrival at deployment and handle battle simulation
async function checkDeploymentProgress() {
  try {
    // Get all active deployments for current user
    const activeDeploymentsRef = db.collection('activeDeployments')
      .where('userId', '==', currentUser.uid);
    
    const snapshot = await activeDeploymentsRef.get();
    
    if (snapshot.empty) {
      return; // No active deployments
    }
    
    const now = new Date();
    const batch = db.batch();
    
    for (const doc of snapshot.docs) {
      const deployment = doc.data();
      const deploymentRef = doc.ref;
      
      // Skip if already returned
      if (deployment.status === "returned") continue;
      
      const arrivalTime = deployment.arrivalTime.toDate();
      const returnTime = deployment.returnTime.toDate();
      
      // Check if squad has arrived but status hasn't been updated
      if (now >= arrivalTime && deployment.status === "traveling") {
        // Update status to "fighting"
        batch.update(deploymentRef, {
          status: "fighting",
          battleStartTime: firebase.firestore.Timestamp.now(),
          battleLog: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            message: `Squad arrived at ${deployment.deploymentData.name} and engaged enemy forces`,
            type: "info"
          })
        });
        
        console.log(`Squad arrived at deployment ${doc.id}`);
      }
      
      // Check if battle is in progress
      else if (deployment.status === "fighting") {
        // Check if it's time to simulate next battle round
        const lastBattleUpdate = deployment.lastBattleUpdate?.toDate() || arrivalTime;
        const battleInterval = 15 * 60 * 1000; // 15 minutes in milliseconds
        
        if (now.getTime() - lastBattleUpdate.getTime() >= battleInterval) {
          // Simulate battle round
          const battleResult = simulateBattleRound(deployment);
          
          // Update deployment with battle results
          batch.update(deploymentRef, {
            lastBattleUpdate: firebase.firestore.Timestamp.now(),
            'squadData.remainingMembers': battleResult.remainingSquadMembers,
            'squadData.casualties': battleResult.squadCasualties,
            enemyRemaining: battleResult.remainingEnemyForce,
            battleLog: firebase.firestore.FieldValue.arrayUnion(...battleResult.logEntries)
          });
          
          // Check if battle is over (either squad wiped out or enemy defeated)
          if (battleResult.remainingSquadMembers <= 0 || battleResult.remainingEnemyForce <= 0) {
            // Update status based on outcome
            if (battleResult.remainingSquadMembers <= 0) {
              // Squad was wiped out
              batch.update(deploymentRef, {
                status: "failed",
                battleLog: firebase.firestore.FieldValue.arrayUnion({
                  timestamp: firebase.firestore.Timestamp.now(),
                  message: "Squad was defeated. No resources recovered.",
                  type: "info"
                })
              });
              
              // Update combat team stats
              const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
              batch.update(teamRef, {
                woundedMembers: firebase.firestore.FieldValue.increment(battleResult.squadCasualties),
                deployedMembers: firebase.firestore.FieldValue.increment(-deployment.squadData.size)
              });
              
              console.log(`Squad was defeated at deployment ${doc.id}`);
            } else {
              // Enemy was defeated
              batch.update(deploymentRef, {
                status: "victorious",
                battleLog: firebase.firestore.FieldValue.arrayUnion({
                  timestamp: firebase.firestore.Timestamp.now(),
                  message: "Enemy forces defeated. Resources secured!",
                  type: "info"
                })
              });
              
              // Award resources
              await awardDeploymentResources(deployment, batch);
              
              console.log(`Squad victorious at deployment ${doc.id}`);
            }
          }
        }
      }
      
      // Check if it's time for squad to return
      else if ((deployment.status === "victorious" || deployment.status === "failed") && 
               now >= returnTime && deployment.status !== "returned") {
        // Update status to "returned"
        batch.update(deploymentRef, {
          status: "returned",
          battleLog: firebase.firestore.FieldValue.arrayUnion({
            timestamp: firebase.firestore.Timestamp.now(),
            message: `Squad returned to base`,
            type: "info"
          })
        });
        
        // Update combat team stats
        const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
        
        if (deployment.status === "victorious") {
          // Return surviving members to available pool
          batch.update(teamRef, {
            availableMembers: firebase.firestore.FieldValue.increment(deployment.squadData.remainingMembers),
            deployedMembers: firebase.firestore.FieldValue.increment(-deployment.squadData.size)
          });
        }
        
        console.log(`Squad returned from deployment ${doc.id}`);
      }
    }
    
    // Commit all updates
    await batch.commit();
  } catch (error) {
    console.error('Error checking deployment progress:', error);
  }
}

// Simulate a single round of battle
function simulateBattleRound(deployment) {
  // Get current state
  const squadStrength = deployment.squadData.strength || 100;
  const squadSize = deployment.squadData.size || 10;
  const remainingSquadMembers = deployment.squadData.remainingMembers || squadSize;
  const squadCasualties = deployment.squadData.casualties || 0;
  
  // Calculate enemy stats
  const enemyStrength = deployment.deploymentData.enemyStrength || 100;
  const enemyRemaining = deployment.enemyRemaining || enemyStrength;
  
  // No battle if either side is already defeated
  if (remainingSquadMembers <= 0 || enemyRemaining <= 0) {
    return {
      remainingSquadMembers,
      squadCasualties,
      remainingEnemyForce: enemyRemaining,
      logEntries: []
    };
  }
  
  // Calculate effective squad power (based on remaining members)
  const effectiveSquadPower = squadStrength * (remainingSquadMembers / squadSize);
  
  // Calculate damage factors (with randomness)
  const squadDamageBase = effectiveSquadPower / 100;
  const enemyDamageBase = enemyRemaining / 100;
  
  // Add randomness (0.5 to 1.5x multiplier)
  const squadDamage = Math.max(1, Math.floor(enemyDamageBase * (0.5 + Math.random())));
  const enemyDamage = Math.max(1, Math.floor(squadDamageBase * (0.5 + Math.random())));
  
  // Apply damage
  const newEnemyForce = Math.max(0, enemyRemaining - squadDamage);
  let newSquadMembers = Math.max(0, remainingSquadMembers - enemyDamage);
  const newSquadCasualties = squadCasualties + (remainingSquadMembers - newSquadMembers);
  
  // Create log entries
  const logEntries = [
    {
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Squad inflicted ${squadDamage} damage to enemy forces`,
      type: "squad"
    },
    {
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Enemy forces inflicted ${enemyDamage} casualties to squad`,
      type: "enemy"
    }
  ];
  
  return {
    remainingSquadMembers: newSquadMembers,
    squadCasualties: newSquadCasualties,
    remainingEnemyForce: newEnemyForce,
    logEntries
  };
}

// Award resources for successful deployment
async function awardDeploymentResources(deployment, batchRef) {
  // Get the resources to award
  const resources = deployment.deploymentData.resources;
  
  if (!resources) return;
  
  // Get global resources reference
  const globalResourcesRef = db.collection('globalResources').doc('shared');
  
  // Create updates object
  const updates = {};
  
  // Add resources
  for (const [resource, amount] of Object.entries(resources)) {
    if (resource === 'money') {
      updates.money = firebase.firestore.FieldValue.increment(amount);
    } else {
      updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(amount);
    }
  }
  
  // Add timestamp and random value to force update detection
  updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
  updates.updateId = Math.random().toString(36).substring(2, '15');
  
  // Apply updates to global resources
  batchRef.update(globalResourcesRef, updates);
  
  // Add log entries for resources gained
  const logEntries = [];
  
  for (const [resource, amount] of Object.entries(resources)) {
    logEntries.push({
      timestamp: firebase.firestore.Timestamp.now(),
      message: `Gained ${amount} ${resource.toUpperCase()}`,
      type: "resource"
    });
  }
  
  // Add resource award log entries
  batchRef.update(deployment.ref, {
    battleLog: firebase.firestore.FieldValue.arrayUnion(...logEntries)
  });
}

// Add deployment marker to the globe
function addDeploymentMarker(deployment) {
  if (!scene) {
    console.error('Scene not initialized yet');
    return null;
  }
  
  const lat = deployment.coordinates.lat;
  const lon = deployment.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create color based on primary resource
  let markerColor;
  switch (deployment.primaryResource) {
    case 'money':
      markerColor = 0xFFD700; // Gold
      break;
    case 'fuel':
      markerColor = 0xFF5722; // Deep Orange
      break;
    case 'ammo':
      markerColor = 0xF44336; // Red
      break;
    case 'medicine':
      markerColor = 0x4CAF50; // Green
      break;
    case 'food':
      markerColor = 0x8BC34A; // Light Green
      break;
    case 'materials':
      markerColor = 0x795548; // Brown
      break;
    default:
      markerColor = 0xFFC107; // Amber (default)
  }
  
  // Create point marker
  const geometry = new THREE.SphereGeometry(0.2, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: markerColor });
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add deployment identifier
  point.userData = { 
    deploymentId: deployment.id,
    type: 'deployment-point',
    primaryResource: deployment.primaryResource,
    deployment: deployment // Store the full deployment data for easy access
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
  
  // Store in deployment markers array
  deploymentMarkers.push(point);
  
  console.log(`Added deployment marker for ${deployment.id} (${deployment.primaryResource}) at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Confirm sending squad to deployment
function confirmSendSquad(deploymentId) {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get the deployment info
    db.collection('availableDeployments').doc(deploymentId).get().then(doc => {
      if (!doc.exists) {
        showNotification('DEPLOYMENT NOT FOUND');
        return;
      }
      
      const deployment = doc.data();
      
      // Create confirmation modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'send-squad-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = `
        <div class="modal-title">CONFIRM SQUAD DEPLOYMENT</div>
        <button class="modal-close">X</button>
      `;
      
      // Format resource rewards
      let resourcesHtml = '<ul>';
      for (const [resource, amount] of Object.entries(deployment.resources)) {
        if (resource === 'money') {
          resourcesHtml += `<li>$${amount.toLocaleString()}</li>`;
        } else {
          resourcesHtml += `<li>${resource.toUpperCase()}: ${amount}</li>`;
        }
      }
      resourcesHtml += '</ul>';
      
      // Create body
      const body = document.createElement('div');
      body.className = 'modal-body';
      body.innerHTML = `
        <div class="confirmation-message">
          Deploy squad to: <strong>${deployment.name}</strong>
        </div>
        <div class="confirmation-details">
          <div>Location: ${deployment.location}</div>
          <div>Difficulty: ${deployment.difficulty}</div>
          <div>Duration: ${deployment.duration} days</div>
          <div>Travel Time: ${deployment.travelTime || 2} days</div>
          <div>Enemy Strength: ${deployment.enemyStrength}</div>
          <div class="rewards-header">Potential Rewards:</div>
          <div class="rewards-list">${resourcesHtml}</div>
        </div>
        <div class="confirmation-warning">
          This operation will send your squad on a ${deployment.duration + (deployment.travelTime || 2) * 2} day mission. 
          Squad members may be injured or killed during combat.
        </div>
      `;
      
      // Create footer
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button">DEPLOY SQUAD</button>
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
      
      confirmButton.addEventListener('click', async () => {
        // Send squad to deployment
        const result = await sendSquadToDeployment(deploymentId);
        
        if (result) {
          showNotification('SQUAD DEPLOYED');
        } else {
          showNotification('ERROR DEPLOYING SQUAD');
        }
        
        document.body.removeChild(modal);
      });
      
      // Show modal
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Play sound
      tabSound.play().catch(console.error);
    }).catch(error => {
      console.error('Error fetching deployment:', error);
      showNotification('ERROR FETCHING DEPLOYMENT DATA');
    });
  } catch (error) {
    console.error('Error sending squad:', error);
    showNotification('ERROR SENDING SQUAD');
  }
}

// Add deployment marker to the globe
function addDeploymentMarker(deployment) {
  if (!scene) {
    console.error('Scene not initialized yet');
    return null;
  }
  
  const lat = deployment.coordinates.lat;
  const lon = deployment.coordinates.lon;
  const phi = (90 - lat) * Math.PI/180;
  const theta = (lon + 180) * Math.PI/180;
  
  // Create color based on primary resource
  let markerColor;
  switch (deployment.primaryResource) {
    case 'money':
      markerColor = 0xFFD700; // Gold
      break;
    case 'fuel':
      markerColor = 0xFF5722; // Deep Orange
      break;
    case 'ammo':
      markerColor = 0xF44336; // Red
      break;
    case 'medicine':
      markerColor = 0x4CAF50; // Green
      break;
    case 'food':
      markerColor = 0x8BC34A; // Light Green
      break;
    case 'materials':
      markerColor = 0x795548; // Brown
      break;
    default:
      markerColor = 0xFFC107; // Amber (default)
  }
  
  // Create point marker
  const geometry = new THREE.SphereGeometry(0.2, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: markerColor });
  const point = new THREE.Mesh(geometry, material);
  
  point.position.x = -10 * Math.sin(phi) * Math.cos(theta);
  point.position.y = 10 * Math.cos(phi);
  point.position.z = 10 * Math.sin(phi) * Math.sin(theta);
  
  // Add deployment identifier
  point.userData = { 
    deploymentId: deployment.id,
    type: 'deployment-point',
    primaryResource: deployment.primaryResource,
    deployment: deployment // Store the full deployment data for easy access
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
  
  // Store in deployment markers array
  deploymentMarkers.push(point);
  
  console.log(`Added deployment marker for ${deployment.id} (${deployment.primaryResource}) at coordinates: ${lat}, ${lon}`);
  
  return point;
}

// Confirm sending squad to deployment
function confirmSendSquad(deploymentId) {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get the deployment info
    db.collection('availableDeployments').doc(deploymentId).get().then(doc => {
      if (!doc.exists) {
        showNotification('DEPLOYMENT NOT FOUND');
        return;
      }
      
      const deployment = doc.data();
      
      // Create confirmation modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'send-squad-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = `
        <div class="modal-title">CONFIRM SQUAD DEPLOYMENT</div>
        <button class="modal-close">X</button>
      `;
      
      // Format resource rewards
      let resourcesHtml = '<ul>';
      for (const [resource, amount] of Object.entries(deployment.resources)) {
        if (resource === 'money') {
          resourcesHtml += `<li>$${amount.toLocaleString()}</li>`;
        } else {
          resourcesHtml += `<li>${resource.toUpperCase()}: ${amount}</li>`;
        }
      }
      resourcesHtml += '</ul>';
      
      // Create body
      const body = document.createElement('div');
      body.className = 'modal-body';
      body.innerHTML = `
        <div class="confirmation-message">
          Deploy squad to: <strong>${deployment.name}</strong>
        </div>
        <div class="confirmation-details">
          <div>Location: ${deployment.location}</div>
          <div>Difficulty: ${deployment.difficulty}</div>
          <div>Duration: ${deployment.duration} days</div>
          <div>Travel Time: ${deployment.travelTime || 2} days</div>
          <div>Enemy Strength: ${deployment.enemyStrength}</div>
          <div class="rewards-header">Potential Rewards:</div>
          <div class="rewards-list">${resourcesHtml}</div>
        </div>
        <div class="confirmation-warning">
          This operation will send your squad on a ${deployment.duration + (deployment.travelTime || 2) * 2} day mission. 
          Squad members may be injured or killed during combat.
        </div>
      `;
      
      // Create footer
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button">DEPLOY SQUAD</button>
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
      
      confirmButton.addEventListener('click', async () => {
        // Send squad to deployment
        const result = await sendSquadToDeployment(deploymentId);
        
        if (result) {
          showNotification('SQUAD DEPLOYED');
        } else {
          showNotification('ERROR DEPLOYING SQUAD');
        }
        
        document.body.removeChild(modal);
      });
      
      // Show modal
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Play sound
      tabSound.play().catch(console.error);
    }).catch(error => {
      console.error('Error fetching deployment:', error);
      showNotification('ERROR FETCHING DEPLOYMENT DATA');
    });
  } catch (error) {
    console.error('Error sending squad:', error);
    showNotification('ERROR SENDING SQUAD');
  }
}

// Adding this function at the end of the file
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the enhanced deployment system
  console.log("Initializing enhanced deployment system");
  initializeEnhancedDeploymentSystem();
  
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
});

// Adding this function at the end of the file
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the enhanced deployment system
  console.log("Initializing enhanced deployment system");
  initializeEnhancedDeploymentSystem();
  
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
});

// Load available deployments from Firebase
async function loadAvailableDeployments() {
  try {
    // Clear existing deployment markers first
    if (deploymentMarkers && deploymentMarkers.length > 0) {
      // We'll only clear markers that aren't active deployments
      const markersToRemove = deploymentMarkers.filter(marker => 
        marker.userData.deployment && marker.userData.deployment.status === 'available');
      
      markersToRemove.forEach(marker => {
        // Remove the marker and its associated elements
        if (marker.userData.ring && marker.userData.ring.parent) {
          scene.remove(marker.userData.ring.parent);
        }
        if (marker.userData.ringParent) {
          scene.remove(marker.userData.ringParent);
        }
        scene.remove(marker);
      });
      
      // Update the deploymentMarkers array
      deploymentMarkers = deploymentMarkers.filter(marker => 
        !(marker.userData.deployment && marker.userData.deployment.status === 'available'));
    }
    
    // Query available deployments
    const availableDeploymentsRef = db.collection('availableDeployments')
      .where('available', '==', true);
    
    const snapshot = await availableDeploymentsRef.get();
    
    if (snapshot.empty) {
      console.log("No available deployments found");
      return;
    }
    
    console.log(`Found ${snapshot.size} available deployments`);
    
    // Process each available deployment
    snapshot.forEach(doc => {
      const deployment = doc.data();
      deployment.id = doc.id; // Ensure ID is set
      
      console.log("Processing available deployment:", deployment.name || deployment.id);
      
      // Add marker to globe if coordinates exist
      if (deployment.coordinates) {
        const marker = addDeploymentMarker(deployment);
        console.log(`Added marker for deployment: ${deployment.name || deployment.id}`);
      } else {
        console.warn(`Deployment ${deployment.id} has no coordinates`);
      }
    });
    
    console.log("Available deployments loaded successfully");
    
  } catch (error) {
    console.error('Error loading available deployments:', error);
  }
}

// Load available deployments from Firebase
async function loadAvailableDeployments() {
  try {
    // Clear existing deployment markers first
    if (deploymentMarkers && deploymentMarkers.length > 0) {
      // We'll only clear markers that aren't active deployments
      const markersToRemove = deploymentMarkers.filter(marker => 
        marker.userData.deployment && marker.userData.deployment.status === 'available');
      
      markersToRemove.forEach(marker => {
        // Remove the marker and its associated elements
        if (marker.userData.ring && marker.userData.ring.parent) {
          scene.remove(marker.userData.ring.parent);
        }
        if (marker.userData.ringParent) {
          scene.remove(marker.userData.ringParent);
        }
        scene.remove(marker);
      });
      
      // Update the deploymentMarkers array
      deploymentMarkers = deploymentMarkers.filter(marker => 
        !(marker.userData.deployment && marker.userData.deployment.status === 'available'));
    }
    
    // Query available deployments
    const availableDeploymentsRef = db.collection('availableDeployments')
      .where('available', '==', true);
    
    const snapshot = await availableDeploymentsRef.get();
    
    if (snapshot.empty) {
      console.log("No available deployments found");
      return;
    }
    
    console.log(`Found ${snapshot.size} available deployments`);
    
    // Process each available deployment
    snapshot.forEach(doc => {
      const deployment = doc.data();
      deployment.id = doc.id; // Ensure ID is set
      
      console.log("Processing available deployment:", deployment.name || deployment.id);
      
      // Add marker to globe if coordinates exist
      if (deployment.coordinates) {
        const marker = addDeploymentMarker(deployment);
        console.log(`Added marker for deployment: ${deployment.name || deployment.id}`);
      } else {
        console.warn(`Deployment ${deployment.id} has no coordinates`);
      }
    });
    
    console.log("Available deployments loaded successfully");
    
  } catch (error) {
    console.error('Error loading available deployments:', error);
  }
}

// Adding this function at the end of the file
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the enhanced deployment system
  console.log("Initializing enhanced deployment system");
  initializeEnhancedDeploymentSystem();
  
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
});

// Adding this function at the end of the file
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the enhanced deployment system
  console.log("Initializing enhanced deployment system");
  initializeEnhancedDeploymentSystem();
  
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
});

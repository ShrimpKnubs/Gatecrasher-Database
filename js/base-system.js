// Base Management System
let baseTeams = {};
let currentUpgrades = {};

// Define upgrade costs and benefits by team type and level
const upgradeData = {
  combat: {
    2: {
      cost: 100000,
      resources: { fuel: 200, materials: 300 },
      time: 5,
      benefits: { power: 150, maxMembers: 15 }
    },
    3: {
      cost: 250000,
      resources: { fuel: 400, materials: 600 },
      time: 7,
      benefits: { power: 250, maxMembers: 25 }
    }
  },
  medical: {
    2: {
      cost: 75000,
      resources: { medicine: 300, materials: 200 },
      time: 4,
      benefits: { healRate: 2 } // 2x faster healing
    },
    3: {
      cost: 180000,
      resources: { medicine: 600, materials: 400 },
      time: 6,
      benefits: { healRate: 4 } // 4x faster healing
    }
  },
  intel: {
    2: {
      cost: 90000,
      resources: { fuel: 150, materials: 250 },
      time: 4,
      benefits: { intelRate: 2 } // 2x faster intel gathering
    },
    3: {
      cost: 200000,
      resources: { fuel: 300, materials: 500 },
      time: 6,
      benefits: { intelRate: 4 } // 4x faster intel gathering
    }
  },
  rnd: {
    2: {
      cost: 120000,
      resources: { materials: 400 },
      time: 6,
      benefits: { unlockWeapons: ['tier2'] }
    },
    3: {
      cost: 280000,
      resources: { materials: 800 },
      time: 8,
      benefits: { unlockWeapons: ['tier3'] }
    }
  },
  command: {
    2: {
      cost: 150000,
      resources: { fuel: 300, materials: 300 },
      time: 5,
      benefits: { maxDeployments: 2 }
    },
    3: {
      cost: 300000,
      resources: { fuel: 600, materials: 600 },
      time: 8,
      benefits: { maxDeployments: 3 }
    }
  },
  development: {
    2: {
      cost: 80000,
      resources: { materials: 500 },
      time: 3,
      benefits: { buildTimeReduction: 0.8 } // 20% faster upgrades
    },
    3: {
      cost: 180000,
      resources: { materials: 1000 },
      time: 5,
      benefits: { buildTimeReduction: 0.6 } // 40% faster upgrades
    }
  }
};

// Initialize base management
function initializeBaseManagement() {
  // Get HQ button
  const hqButton = document.getElementById('hq-button');
  const closeHqButton = document.getElementById('close-hq');
  const hqPanel = document.getElementById('hq-panel');
  
  // Add event listeners
  hqButton.addEventListener('click', () => {
    // Show HQ panel
    hqPanel.style.display = 'block';
    
    // Close other panels
    const missionPanel = document.getElementById('mission-panel');
    const intelPanel = document.getElementById('intel-panel');
    
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
    
    // Show notification
    showNotification('HEADQUARTERS MANAGEMENT ACTIVE');
  });
  
  closeHqButton.addEventListener('click', () => {
    // Hide HQ panel
    hqPanel.style.display = 'none';
  });
  
  // Add tab switching functionality
  const tabButtons = document.querySelectorAll('.hq-tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.hq-tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active class to selected tab
      button.classList.add('active');
      document.getElementById(`${tabName}-content`).classList.add('active');
      
      // Play tab sound
      tabSound.play().catch(console.error);
    });
  });
  
  // Setup upgrade buttons
  setupUpgradeButtons();
}

// Load base teams from Firebase
async function loadBaseTeams() {
  if (!currentUser) return;
  
  try {
    // Get all teams for the current user
    const teamsRef = db.collection('teams').where('userId', '==', currentUser.uid);
    const snapshot = await teamsRef.get();
    
    if (snapshot.empty) {
      // User has no teams yet, create default teams
      await createDefaultTeams();
      return loadBaseTeams(); // Reload after creation
    }
    
    baseTeams = {};
    snapshot.forEach(doc => {
      const team = doc.data();
      baseTeams[team.type] = {
        id: doc.id,
        ...team
      };
    });
    
    // Update UI with team data
    updateTeamUi();
    
    // Load current upgrades
    await loadCurrentUpgrades();
  } catch (error) {
    console.error('Error loading teams:', error);
    showNotification('ERROR LOADING BASE TEAMS');
  }
}

// Create default teams for new user
async function createDefaultTeams() {
  if (!currentUser) return;
  
  try {
    const teamTypes = ['combat', 'medical', 'intel', 'rnd', 'command', 'development'];
    const batch = db.batch();
    
    for (const type of teamTypes) {
      const teamRef = db.collection('teams').doc(`${currentUser.uid}_${type}`);
      
      // Set default values based on team type
      let teamData = {
        userId: currentUser.uid,
        type: type,
        level: 1,
        upgrading: false
      };
      
      // Add specific properties based on team type
      if (type === 'combat') {
        teamData = {
          ...teamData,
          power: 100,
          totalMembers: 10,
          availableMembers: 10,
          deployedMembers: 0,
          woundedMembers: 0
        };
      } else if (type === 'medical') {
        teamData = {
          ...teamData,
          healRate: 1 // Base healing rate
        };
      } else if (type === 'intel') {
        teamData = {
          ...teamData,
          intelRate: 1 // Base intel gathering rate
        };
      } else if (type === 'rnd') {
        teamData = {
          ...teamData,
          unlockedWeapons: ['tier1'],
          researching: false
        };
      } else if (type === 'command') {
        teamData = {
          ...teamData,
          maxDeployments: 1 // Start with 1 max deployment
        };
      } else if (type === 'development') {
        teamData = {
          ...teamData,
          buildTimeReduction: 1 // No reduction initially (multiplier)
        };
      }
      
      batch.set(teamRef, teamData);
    }
    
    await batch.commit();
    showNotification('BASE TEAMS INITIALIZED');
  } catch (error) {
    console.error('Error creating teams:', error);
    showNotification('ERROR CREATING BASE TEAMS');
  }
}

// Load current upgrades
async function loadCurrentUpgrades() {
  if (!currentUser) return;
  
  try {
    const upgradesRef = db.collection('upgrades').where('userId', '==', currentUser.uid);
    const snapshot = await upgradesRef.get();
    
    currentUpgrades = {};
    snapshot.forEach(doc => {
      const upgrade = doc.data();
      currentUpgrades[upgrade.teamType] = {
        id: doc.id,
        ...upgrade
      };
    });
    
    // Update UI to show ongoing upgrades
    updateUpgradeUi();
  } catch (error) {
    console.error('Error loading upgrades:', error);
    showNotification('ERROR LOADING UPGRADES');
  }
}

// Update team UI with current data
function updateTeamUi() {
  // Update each team's stats on UI
  Object.keys(baseTeams).forEach(teamType => {
    const team = baseTeams[teamType];
    
    // Update level display
    const levelElement = document.getElementById(`${teamType}-level`);
    if (levelElement) {
      levelElement.textContent = team.level;
    }
    
    // Update stats based on team type
    if (teamType === 'combat') {
      document.getElementById('combat-power').textContent = team.power;
      document.getElementById('combat-members').textContent = team.availableMembers;
      document.getElementById('combat-wounded').textContent = team.woundedMembers;
    } else if (teamType === 'medical') {
      // Update medical team display
      const healRateElement = document.getElementById('medical-heal-rate');
      if (healRateElement) {
        healRateElement.textContent = `${team.healRate}x`;
      }
    } else if (teamType === 'intel') {
      // Update intel team display
      const intelRateElement = document.getElementById('intel-rate');
      if (intelRateElement) {
        intelRateElement.textContent = `${team.intelRate}x`;
      }
    } else if (teamType === 'rnd') {
      // Update R&D display
      const weaponsTierElement = document.getElementById('weapons-tier');
      if (weaponsTierElement) {
        const maxTier = Math.max(...team.unlockedWeapons.map(tier => parseInt(tier.replace('tier', ''))));
        weaponsTierElement.textContent = maxTier;
      }
    } else if (teamType === 'command') {
      // Update command display
      const maxDeploymentsElement = document.getElementById('max-deployments');
      if (maxDeploymentsElement) {
        maxDeploymentsElement.textContent = team.maxDeployments;
      }
    } else if (teamType === 'development') {
      // Update development display
      const buildReductionElement = document.getElementById('build-reduction');
      if (buildReductionElement) {
        const reductionPercent = Math.round((1 - team.buildTimeReduction) * 100);
        buildReductionElement.textContent = `${reductionPercent}%`;
      }
    }
  });
}

// Update upgrade UI
function updateUpgradeUi() {
  // Loop through each team
  Object.keys(baseTeams).forEach(teamType => {
    const team = baseTeams[teamType];
    const upgradeSection = document.getElementById(`${teamType}-upgrade-section`);
    
    if (!upgradeSection) return;
    
    // Check if team is upgrading
    if (team.upgrading) {
      // Team is upgrading, show progress
      const upgrade = currentUpgrades[teamType];
      
      if (upgrade) {
        const now = new Date();
        const startTime = upgrade.startTime.toDate();
        const endTime = upgrade.endTime.toDate();
        
        // Calculate progress
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        
        // Calculate time remaining
        const timeRemaining = Math.max(0, endTime - now);
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        // Update UI
        upgradeSection.innerHTML = `
          <div class="upgrade-progress">
            <div class="upgrade-title">UPGRADING TO LEVEL ${team.level + 1}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="upgrade-time">TIME REMAINING: ${daysRemaining}D ${hoursRemaining}H</div>
          </div>
        `;
      }
    } else {
      // Team is not upgrading, show upgrade button if not max level
      if (team.level < 3) {
        const nextLevel = team.level + 1;
        const upgradeInfo = upgradeData[teamType][nextLevel];
        
        // Format cost and resources
        const formattedCost = `$${upgradeInfo.cost.toLocaleString()}`;
        let resourcesHtml = '';
        
        for (const [resource, amount] of Object.entries(upgradeInfo.resources)) {
          resourcesHtml += `<li>${resource.toUpperCase()}: ${amount}</li>`;
        }
        
        // Create upgrade UI
        upgradeSection.innerHTML = `
          <div class="upgrade-details">
            <div class="upgrade-title">UPGRADE TO LEVEL ${nextLevel}</div>
            <div class="upgrade-cost">COST: ${formattedCost}</div>
            <div class="upgrade-resources">
              RESOURCES NEEDED:
              <ul>
                ${resourcesHtml}
              </ul>
            </div>
            <div class="upgrade-time">TIME: ${upgradeInfo.time} DAYS</div>
          </div>
          <button class="upgrade-button" data-team="${teamType}" data-level="${nextLevel}">INITIATE UPGRADE</button>
        `;
      } else {
        // Max level reached
        upgradeSection.innerHTML = `
          <div class="max-level">
            MAXIMUM LEVEL REACHED
          </div>
        `;
      }
    }
  });
}

// Setup upgrade buttons
function setupUpgradeButtons() {
  // Use event delegation for upgrade buttons
  document.addEventListener('click', event => {
    if (event.target.classList.contains('upgrade-button')) {
      const teamType = event.target.getAttribute('data-team');
      const nextLevel = parseInt(event.target.getAttribute('data-level'));
      
      if (teamType && nextLevel) {
        confirmUpgrade(teamType, nextLevel);
      }
    }
  });
}

// Confirm upgrade with modal
function confirmUpgrade(teamType, nextLevel) {
  if (!currentUser || userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  // Get upgrade data
  const upgradeInfo = upgradeData[teamType][nextLevel];
  
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'confirm-upgrade-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <div class="modal-title">CONFIRM UPGRADE</div>
    <button class="modal-close">X</button>
  `;
  
  // Format resources
  let resourcesHtml = '';
  for (const [resource, amount] of Object.entries(upgradeInfo.resources)) {
    resourcesHtml += `<div>${resource.toUpperCase()}: ${amount}</div>`;
  }
  
  // Create body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = `
    <div class="confirmation-message">
      You are about to upgrade your ${teamType.toUpperCase()} TEAM to level ${nextLevel}.
    </div>
    <div class="confirmation-details">
      <div class="upgrade-cost">COST: $${upgradeInfo.cost.toLocaleString()}</div>
      <div class="upgrade-resources">
        <div class="resources-header">RESOURCES NEEDED:</div>
        <div class="resources-list">
          ${resourcesHtml}
        </div>
      </div>
      <div class="upgrade-time">TIME: ${upgradeInfo.time} DAYS</div>
    </div>
    <div class="confirmation-benefits">
      <div class="benefits-header">BENEFITS:</div>
      <div class="benefits-list">
        ${formatUpgradeBenefits(teamType, nextLevel)}
      </div>
    </div>
  `;
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  footer.innerHTML = `
    <button class="cancel-button">CANCEL</button>
    <button class="confirm-button">CONFIRM UPGRADE</button>
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
    startUpgrade(teamType, nextLevel);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Format upgrade benefits for display
function formatUpgradeBenefits(teamType, level) {
  const benefits = upgradeData[teamType][level].benefits;
  let benefitsHtml = '';
  
  for (const [benefit, value] of Object.entries(benefits)) {
    if (benefit === 'power') {
      benefitsHtml += `<div>COMBAT POWER: ${value}</div>`;
    } else if (benefit === 'maxMembers') {
      benefitsHtml += `<div>MAX TEAM SIZE: ${value}</div>`;
    } else if (benefit === 'healRate') {
      benefitsHtml += `<div>HEALING RATE: ${value}x FASTER</div>`;
    } else if (benefit === 'intelRate') {
      benefitsHtml += `<div>INTEL GATHERING: ${value}x FASTER</div>`;
    } else if (benefit === 'unlockWeapons') {
      const tier = value[0].replace('tier', '');
      benefitsHtml += `<div>UNLOCK WEAPONS: TIER ${tier}</div>`;
    } else if (benefit === 'maxDeployments') {
      benefitsHtml += `<div>MAX DEPLOYMENTS: ${value}</div>`;
    } else if (benefit === 'buildTimeReduction') {
      const percent = Math.round((1 - value) * 100);
      benefitsHtml += `<div>BUILD TIME REDUCTION: ${percent}%</div>`;
    }
  }
  
  return benefitsHtml;
}

// Start the upgrade process
async function startUpgrade(teamType, nextLevel) {
  if (!currentUser || userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get upgrade info
    const upgradeInfo = upgradeData[teamType][nextLevel];
    
    // Verify user has enough money and resources
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    // Check money
    if (userData.money < upgradeInfo.cost) {
      showNotification('INSUFFICIENT FUNDS FOR UPGRADE');
      return;
    }
    
    // Check resources
    for (const [resource, amount] of Object.entries(upgradeInfo.resources)) {
      if (!userData.resources[resource] || userData.resources[resource] < amount) {
        showNotification(`INSUFFICIENT ${resource.toUpperCase()} FOR UPGRADE`);
        return;
      }
    }
    
    // Calculate upgrade duration with development team bonus
    let upgradeDuration = upgradeInfo.time;
    
    // Apply development team bonus if available
    if (baseTeams.development) {
      upgradeDuration *= baseTeams.development.buildTimeReduction;
    }
    
    // Calculate start and end times
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (upgradeDuration * 24 * 60 * 60 * 1000));
    
    // Create upgrade document
    const upgradeData = {
      userId: currentUser.uid,
      teamType: teamType,
      fromLevel: baseTeams[teamType].level,
      toLevel: nextLevel,
      startTime: firebase.firestore.Timestamp.fromDate(startTime),
      endTime: firebase.firestore.Timestamp.fromDate(endTime),
      completed: false
    };
    
    // Create batch to update multiple documents
    const batch = db.batch();
    
    // Add upgrade document
    const upgradeRef = db.collection('upgrades').doc();
    batch.set(upgradeRef, upgradeData);
    
    // Update team status
    const teamRef = db.collection('teams').doc(`${currentUser.uid}_${teamType}`);
    batch.update(teamRef, {
      upgrading: true
    });
    
    // Deduct resources and money
    const userRef = db.collection('users').doc(currentUser.uid);
    
    // Create updates object
    const userUpdates = {
      money: firebase.firestore.FieldValue.increment(-upgradeInfo.cost)
    };
    
    // Add resource updates
    for (const [resource, amount] of Object.entries(upgradeInfo.resources)) {
      userUpdates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(-amount);
    }
    
    batch.update(userRef, userUpdates);
    
    // Commit the batch
    await batch.commit();
    
    // Show notification
    showNotification(`UPGRADE STARTED: ${teamType.toUpperCase()} TEAM TO LEVEL ${nextLevel}`);
    
    // Reload team data
    await loadBaseTeams();
  } catch (error) {
    console.error('Error starting upgrade:', error);
    showNotification('ERROR STARTING UPGRADE');
  }
}

// Check and apply completed upgrades
async function checkUpgrades() {
  if (!currentUser) return;
  
  try {
    // Find completed upgrades
    const upgradesRef = db.collection('upgrades')
      .where('userId', '==', currentUser.uid)
      .where('completed', '==', false);
    
    const snapshot = await upgradesRef.get();
    
    for (const doc of snapshot.docs) {
      const upgrade = doc.data();
      const endTime = upgrade.endTime.toDate();
      
      // Check if upgrade is complete
      if (endTime <= new Date()) {
        // Apply upgrade
        await applyUpgrade(doc.id, upgrade);
      }
    }
  } catch (error) {
    console.error('Error checking upgrades:', error);
  }
}

// Apply a completed upgrade
async function applyUpgrade(upgradeId, upgrade) {
  try {
    const batch = db.batch();
    
    // Get team reference
    const teamRef = db.collection('teams').doc(`${currentUser.uid}_${upgrade.teamType}`);
    
    // Get upgrade benefits
    const benefits = upgradeData[upgrade.teamType][upgrade.toLevel].benefits;
    
    // Create update object with new level and turn off upgrading flag
    const teamUpdates = {
      level: upgrade.toLevel,
      upgrading: false
    };
    
    // Add benefits based on team type
    for (const [benefit, value] of Object.entries(benefits)) {
      teamUpdates[benefit] = value;
    }
    
    // Update team
    batch.update(teamRef, teamUpdates);
    
    // Mark upgrade as completed
    const upgradeRef = db.collection('upgrades').doc(upgradeId);
    batch.update(upgradeRef, {
      completed: true,
      completedAt: firebase.firestore.Timestamp.now()
    });
    
    // Commit the batch
    await batch.commit();
    
    // Show notification
    showNotification(`UPGRADE COMPLETE: ${upgrade.teamType.toUpperCase()} TEAM TO LEVEL ${upgrade.toLevel}`);
    
    // Reload team data
    await loadBaseTeams();
  } catch (error) {
    console.error('Error applying upgrade:', error);
    showNotification('ERROR APPLYING UPGRADE');
  }
}

// Initialize heal timer for wounded team members
function initializeHealTimer() {
  // Check wounded members every hour
  setInterval(healWoundedMembers, 60 * 60 * 1000);
}

// Heal wounded team members based on medical team level
async function healWoundedMembers() {
  if (!currentUser) return;
  
  try {
    // Get combat team
    const combatTeam = baseTeams.combat;
    
    if (!combatTeam || combatTeam.woundedMembers <= 0) {
      return; // No wounded members to heal
    }
    
    // Get medical team
    const medicalTeam = baseTeams.medical;
    
    if (!medicalTeam) {
      return; // No medical team
    }
    
    // Calculate members to heal based on medical team level
    // At level 1, heal 1 member per day (so ~1/24 per hour)
    // Higher levels will heal faster
    const baseHealRate = 1 / 24; // Members per hour
    const adjustedHealRate = baseHealRate * medicalTeam.healRate;
    
    // Calculate members to heal this hour (with randomness)
    // Add some randomness but ensure it averages out to the heal rate
    const random = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
    const membersToHeal = Math.floor(adjustedHealRate * random);
    
    if (membersToHeal <= 0) {
      return; // Not enough to heal anyone yet
    }
    
    // Update combat team
    const teamRef = db.collection('teams').doc(`${currentUser.uid}_combat`);
    
    // Calculate actual healing (can't heal more than wounded)
    const actualHealing = Math.min(membersToHeal, combatTeam.woundedMembers);
    
    await teamRef.update({
      woundedMembers: firebase.firestore.FieldValue.increment(-actualHealing),
      availableMembers: firebase.firestore.FieldValue.increment(actualHealing)
    });
    
    // If more than one member was healed, show notification
    if (actualHealing > 0) {
      showNotification(`${actualHealing} TEAM MEMBERS RECOVERED FROM INJURIES`);
      
      // Reload team data
      await loadBaseTeams();
    }
  } catch (error) {
    console.error('Error healing wounded members:', error);
  }
}

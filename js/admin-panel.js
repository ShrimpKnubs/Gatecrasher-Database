// Enhanced Admin Panel System
let adminPanelDraggable = true;
let adminTestingEnabled = true;

// Initialize Admin Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up the admin panel
  initializeAdminPanel();
});

// Initialize Admin Panel
function initializeAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Make panel draggable
  if (adminPanelDraggable) {
    makeDraggable(adminPanel);
  }
  
  // Replace admin panel content with enhanced version
  createEnhancedAdminPanel();
  
  // Add event listeners for buttons
  setupButtonListeners();
}

// Create enhanced admin panel
function createEnhancedAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Clear existing content first
  adminPanel.innerHTML = '';
  
  // Add drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '⋮⋮⋮';
  adminPanel.appendChild(dragHandle);
  
  // Add header
  const header = document.createElement('div');
  header.className = 'admin-header';
  header.innerHTML = `
    <div class="admin-title">ADMIN CONTROLS v2.0</div>
    <button class="minimize-btn">−</button>
  `;
  adminPanel.appendChild(header);
  
  // Add content container
  const content = document.createElement('div');
  content.className = 'admin-content';
  
  // Add resource management section
  const resourceSection = createResourceSection();
  content.appendChild(resourceSection);
  
  // Add deployment management section
  const deploymentSection = createDeploymentSection();
  content.appendChild(deploymentSection);
  
  // Add user management section
  const userSection = createUserSection();
  content.appendChild(userSection);
  
  // Add testing tools section
  if (adminTestingEnabled) {
    const testingSection = createTestingSection();
    content.appendChild(testingSection);
  }
  
  // Add system tools section
  const systemSection = createSystemSection();
  content.appendChild(systemSection);
  
  adminPanel.appendChild(content);
  
  // Add minimize button functionality
  const minimizeBtn = adminPanel.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const content = adminPanel.querySelector('.admin-content');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      this.textContent = '−';
    } else {
      content.style.display = 'none';
      this.textContent = '+';
    }
  });
}

// Create resource management section
function createResourceSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
    <div class="admin-resource-buttons">
      <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <button id="modify-resources-button" class="resource-button modify">CUSTOM RESOURCE MODIFICATION</button>
    </div>
  `;
  return section;
}

// Create deployment management section
function createDeploymentSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title deployments">DEPLOYMENT SYSTEM</div>
    <div class="admin-deployment-buttons">
      <button id="generate-deployments-button" class="deployment-button generate">GENERATE RANDOM DEPLOYMENTS</button>
      <button id="view-deployments-button" class="deployment-button view">VIEW ALL DEPLOYMENTS</button>
      <button id="clear-deployments-button" class="deployment-button clear">CLEAR ALL DEPLOYMENTS</button>
      <button id="force-complete-button" class="deployment-button complete">FORCE COMPLETE ACTIVE DEPLOYMENT</button>
    </div>
  `;
  return section;
}

// Create user management section
function createUserSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title users">USER MANAGEMENT</div>
    <div class="admin-user-buttons">
      <button id="create-user-button" class="user-button create">CREATE TEST USER</button>
      <button id="list-users-button" class="user-button list">LIST ALL USERS</button>
      <button id="reset-user-button" class="user-button reset">RESET USER PROGRESS</button>
      <button id="promote-user-button" class="user-button promote">CHANGE USER ROLE</button>
    </div>
  `;
  return section;
}

// Create testing tools section
function createTestingSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title testing">TESTING TOOLS</div>
    <div class="admin-testing-buttons">
      <button id="test-notification-button" class="testing-button notification">TEST NOTIFICATION SYSTEM</button>
      <button id="test-sound-button" class="testing-button sound">TEST SOUND EFFECTS</button>
      <button id="test-intel-button" class="testing-button intel">TEST INTEL PANEL</button>
      <button id="test-mission-button" class="testing-button mission">TEST MISSION SYSTEM</button>
    </div>
  `;
  return section;
}

// Create system tools section
function createSystemSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title system">SYSTEM TOOLS</div>
    <div class="admin-system-buttons">
      <button id="clear-cache-button" class="system-button cache">CLEAR FIREBASE CACHE</button>
      <button id="reload-globe-button" class="system-button globe">RELOAD GLOBE</button>
      <button id="toggle-debug-button" class="system-button debug">TOGGLE DEBUG MODE</button>
      <button id="console-stats-button" class="system-button stats">CONSOLE PERFORMANCE STATS</button>
    </div>
  `;
  return section;
}

// Set up button listeners for admin panel
function setupButtonListeners() {
  // Resource Management Button Listeners
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', addTestResources);
  document.getElementById('modify-resources-button')?.addEventListener('click', showResourceModificationModal);
  
  // Deployment System Button Listeners
  document.getElementById('generate-deployments-button')?.addEventListener('click', generateRandomDeployments);
  document.getElementById('view-deployments-button')?.addEventListener('click', viewAllDeployments);
  document.getElementById('clear-deployments-button')?.addEventListener('click', clearAllDeployments);
  document.getElementById('force-complete-button')?.addEventListener('click', forceCompleteDeployment);
  
  // User Management Button Listeners
  document.getElementById('create-user-button')?.addEventListener('click', showCreateUserModal);
  document.getElementById('list-users-button')?.addEventListener('click', listAllUsers);
  document.getElementById('reset-user-button')?.addEventListener('click', showResetUserModal);
  document.getElementById('promote-user-button')?.addEventListener('click', showPromoteUserModal);
  
  // Testing Tools Button Listeners
  document.getElementById('test-notification-button')?.addEventListener('click', testNotificationSystem);
  document.getElementById('test-sound-button')?.addEventListener('click', testSoundEffects);
  document.getElementById('test-intel-button')?.addEventListener('click', testIntelPanel);
  document.getElementById('test-mission-button')?.addEventListener('click', testMissionSystem);
  
  // System Tools Button Listeners
  document.getElementById('clear-cache-button')?.addEventListener('click', clearFirebaseCache);
  document.getElementById('reload-globe-button')?.addEventListener('click', reloadGlobe);
  document.getElementById('toggle-debug-button')?.addEventListener('click', toggleDebugMode);
  document.getElementById('console-stats-button')?.addEventListener('click', logPerformanceStats);
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
      element.style.right = 'auto'; // Remove right positioning
      element.style.transform = 'none'; // Remove any transform
    }
  });
}

// RESOURCE MANAGEMENT FUNCTIONS

// Show resource modification modal
function showResourceModificationModal() {
  // Create modal for custom resource modification
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'resource-mod-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">MODIFY RESOURCES</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="resource-type">RESOURCE TYPE:</label>
          <select id="resource-type">
            <option value="money">MONEY</option>
            <option value="fuel">FUEL</option>
            <option value="ammo">AMMO</option>
            <option value="medicine">MEDICINE</option>
            <option value="food">FOOD</option>
            <option value="materials">MATERIALS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resource-amount">AMOUNT:</label>
          <input type="number" id="resource-amount" value="1000">
        </div>
        <div class="form-group">
          <label for="resource-operation">OPERATION:</label>
          <select id="resource-operation">
            <option value="add">ADD</option>
            <option value="subtract">SUBTRACT</option>
            <option value="set">SET TO VALUE</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="apply-resource-mod">APPLY CHANGES</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#apply-resource-mod').addEventListener('click', () => {
    const resourceType = document.getElementById('resource-type').value;
    const amount = parseInt(document.getElementById('resource-amount').value);
    const operation = document.getElementById('resource-operation').value;
    
    applyResourceModification(resourceType, amount, operation);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Apply resource modification
async function applyResourceModification(resourceType, amount, operation) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      await initializeGlobalResources();
      showNotification('RESOURCES INITIALIZED');
      return;
    }
    
    let updateData = {};
    
    // Apply operation
    if (resourceType === 'money') {
      if (operation === 'add') {
        updateData.money = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData.money = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData.money = amount;
      }
    } else {
      if (operation === 'add') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData[`resources.${resourceType}`] = amount;
      }
    }
    
    // Add timestamp to force update
    updateData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    updateData.updateId = Math.random().toString(36).substring(2, 15);
    
    await globalResourcesRef.update(updateData);
    
    showNotification(`${resourceType.toUpperCase()} ${operation.toUpperCase()}ED: ${amount}`);
  } catch (error) {
    console.error('Error modifying resources:', error);
    showNotification('ERROR MODIFYING RESOURCES');
  }
}

// DEPLOYMENT SYSTEM FUNCTIONS

// Generate random deployments
function generateRandomDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Show a modal to select how many deployments to generate
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'deployment-count-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">GENERATE DEPLOYMENTS</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="deployment-count">NUMBER OF DEPLOYMENTS:</label>
          <input type="number" id="deployment-count" value="5" min="1" max="10">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="generate-confirm">GENERATE</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#generate-confirm').addEventListener('click', async () => {
    const count = parseInt(document.getElementById('deployment-count').value);
    
    document.body.removeChild(modal);
    
    // Call the adminGenerateDeployments function from deployment-system.js
    try {
      const deployments = await adminGenerateDeployments(count);
      showNotification(`${deployments.length} DEPLOYMENTS GENERATED`);
    } catch (error) {
      console.error('Error generating deployments:', error);
      showNotification('ERROR GENERATING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// View all deployments
function viewAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Call the adminViewDeployments function from deployment-system.js
  adminViewDeployments();
}

// Clear all deployments
async function clearAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'clear-deployments-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">CONFIRM DELETION</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="confirmation-message">
          Are you sure you want to delete ALL deployments?
        </div>
        <div class="confirmation-warning">
          This action cannot be undone. All active and available deployments will be permanently removed.
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button delete-confirm" id="clear-confirm">DELETE ALL</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#clear-confirm').addEventListener('click', async () => {
    document.body.removeChild(modal);
    
    try {
      // Delete all deployments from Firestore
      // First, get available deployments
      const availableSnapshot = await db.collection('availableDeployments').get();
      const availableBatch = db.batch();
      
      availableSnapshot.forEach(doc => {
        availableBatch.delete(doc.ref);
      });
      
      // Then get active deployments
      const activeSnapshot = await db.collection('deployments').get();
      const activeBatch = db.batch();
      
      activeSnapshot.forEach(doc => {
        activeBatch.delete(doc.ref);
      });
      
      // Commit the batches
      await Promise.all([
        availableBatch.commit(),
        activeBatch.commit()
      ]);
      
      showNotification('ALL DEPLOYMENTS DELETED');
    } catch (error) {
      console.error('Error clearing deployments:', error);
      showNotification('ERROR CLEARING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  errorSound.play().catch(console.error);
}

// Force complete an active deployment
async function forceCompleteDeployment() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get active deployments
    const deploymentsRef = db.collection('deployments');
    const snapshot = await deploymentsRef.get();
    
    if (snapshot.empty) {
      showNotification('NO ACTIVE DEPLOYMENTS FOUND');
      return;
    }
    
    // Create modal to select which deployment to complete
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'complete-deployment-modal';
    
    let modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">FORCE COMPLETE DEPLOYMENT</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="deployments-list">
    `;
    
    snapshot.forEach(doc => {
      const deployment = doc.data();
      const startTime = deployment.startTime?.toDate().toLocaleString() || 'Unknown';
      const endTime = deployment.endTime?.toDate().toLocaleString() || 'Unknown';
      
      modalContent += `
        <div class="deployment-item">
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name || doc.id}</div>
            <div class="deployment-status">${deployment.status?.toUpperCase() || 'ACTIVE'}</div>
          </div>
          <div class="deployment-location">${deployment.location || 'Unknown location'}</div>
          <div class="deployment-team">TEAM: ${deployment.teamName || "Unknown"}</div>
          <div class="deployment-times">
            <div>START: ${startTime}</div>
            <div>END: ${endTime}</div>
          </div>
          <button class="complete-deployment-button" data-id="${doc.id}">FORCE COMPLETE</button>
        </div>
      `;
    });
    
    modalContent += `
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#clear-cache-confirm').addEventListener('click', async () => {
      // Clear Firebase cache
      try {
        // Try to clear Firestore cache
        await firebase.firestore().clearPersistence();
        
        // Show success notification
        showNotification('FIREBASE CACHE CLEARED SUCCESSFULLY');
        
        // Prompt for reload
        setTimeout(() => {
          const reloadConfirm = confirm('Firebase cache cleared. Reload the application?');
          if (reloadConfirm) {
            window.location.reload();
          }
        }, 1000);
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error clearing cache:', error);
        showNotification('ERROR CLEARING CACHE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    errorSound.play().catch(console.error);
  }
}

// Reload globe
function reloadGlobe() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'reload-globe-modal';
    
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">RELOAD GLOBE</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-message">
            Are you sure you want to reload the globe?
          </div>
          <div class="confirmation-warning">
            This will clear all current markers and reload missions from the database.
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
          <button class="confirm-button" id="reload-globe-confirm">RELOAD GLOBE</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#reload-globe-confirm').addEventListener('click', async () => {
      try {
        // Clear existing markers
        if (typeof clearMissionMarkers === 'function') {
          clearMissionMarkers();
        }
        
        // Reload missions
        if (typeof loadMissions === 'function') {
          const missions = await loadMissions();
          
          if (missions && Array.isArray(missions)) {
            missions.forEach(mission => {
              if (mission.coordinates && typeof addMissionMarker === 'function') {
                addMissionMarker(mission);
              }
            });
          }
        }
        
        // Reload active deployments if available
        if (typeof loadActiveDeployments === 'function') {
          await loadActiveDeployments();
        }
        
        showNotification('GLOBE RELOADED SUCCESSFULLY');
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error reloading globe:', error);
        showNotification('ERROR RELOADING GLOBE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error reloading globe:', error);
    showNotification('ERROR RELOADING GLOBE', 'error');
  }
}

// Toggle debug mode
function toggleDebugMode() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Check if debug mode is already enabled
    const isDebugMode = localStorage.getItem('debugMode') === 'true';
    
    if (isDebugMode) {
      // Disable debug mode
      localStorage.setItem('debugMode', 'false');
      showNotification('DEBUG MODE DISABLED');
      
      // Remove debug elements if they exist
      const debugPanel = document.getElementById('debug-panel');
      if (debugPanel) {
        document.body.removeChild(debugPanel);
      }
    } else {
      // Enable debug mode
      localStorage.setItem('debugMode', 'true');
      showNotification('DEBUG MODE ENABLED');
      
      // Create debug panel
      createDebugPanel();
    }
  } catch (error) {
    console.error('Error toggling debug mode:', error);
    showNotification('ERROR TOGGLING DEBUG MODE', 'error');
  }
}

// Create debug panel
function createDebugPanel() {
  // Check if panel already exists
  if (document.getElementById('debug-panel')) {
    return;
  }
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.className = 'debug-panel';
  
  // Add content
  debugPanel.innerHTML = `
    <div class="debug-header">
      <div class="debug-title">DEBUG PANEL</div>
      <button class="debug-close">X</button>
    </div>
    <div class="debug-content">
      <div class="debug-section">
        <div class="debug-section-title">SYSTEM INFO</div>
        <div class="debug-info" id="debug-system-info">
          <div>USER: <span id="debug-user">${currentUser ? currentUser.uid : 'Not logged in'}</span></div>
          <div>ROLE: <span id="debug-role">${userRole || 'None'}</span></div>
          <div>VERSION: <span>1.0.0</span></div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">PERFORMANCE</div>
        <div class="debug-info" id="debug-performance">
          <div>FPS: <span id="debug-fps">0</span></div>
          <div>MEMORY: <span id="debug-memory">0</span> MB</div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">EVENT LOG</div>
        <div class="debug-log" id="debug-event-log"></div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(debugPanel);
  
  // Add event listeners
  debugPanel.querySelector('.debug-close').addEventListener('click', () => {
    document.body.removeChild(debugPanel);
    localStorage.setItem('debugMode', 'false');
    showNotification('DEBUG MODE DISABLED');
  });
  
  // Start performance monitoring
  startPerformanceMonitoring();
  
  // Override console.log for debug panel
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    // Call original console.log
    originalConsoleLog.apply(console, args);
    
    // Add to debug panel
    const debugLog = document.getElementById('debug-event-log');
    if (debugLog) {
      const logItem = document.createElement('div');
      logItem.className = 'debug-log-item';
      logItem.textContent = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      // Add timestamp
      const timestamp = new Date().toLocaleTimeString();
      logItem.innerHTML = `<span class="debug-timestamp">[${timestamp}]</span> ${logItem.textContent}`;
      
      // Add to log
      debugLog.appendChild(logItem);
      
      // Limit log items
      if (debugLog.children.length > 100) {
        debugLog.removeChild(debugLog.firstChild);
      }
      
      // Scroll to bottom
      debugLog.scrollTop = debugLog.scrollHeight;
    }
  };
}

// Start performance monitoring
function startPerformanceMonitoring() {
  // Variables for FPS calculation
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  // Function to update FPS
  function updateFPS() {
    // Increment frame count
    frameCount++;
    
    // Calculate FPS every second
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {
      fps = Math.round((frameCount * 1000) / elapsedTime);
      frameCount = 0;
      lastTime = currentTime;
      
      // Update FPS display
      const fpsElement = document.getElementById('debug-fps');
      if (fpsElement) {
        fpsElement.textContent = fps;
      }
      
      // Update memory usage if available
      if (window.performance && window.performance.memory) {
        const memoryElement = document.getElementById('debug-memory');
        if (memoryElement) {
          const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
          memoryElement.textContent = memoryUsage;
        }
      }
    }
    
    // Request next frame
    requestAnimationFrame(updateFPS);
  }
  
  // Start monitoring
  updateFPS();
}

// Log performance stats
function logPerformanceStats() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Performance metrics
    const metrics = {
      navigation: {},
      memory: {},
      timing: {},
      timeOrigin: performance.timeOrigin,
      now: performance.now(),
      resources: []
    };
    
    // Navigation timing data
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        metrics.navigation = navEntries[0];
      }
    }
    
    // Memory usage
    if (window.performance && window.performance.memory) {
      metrics.memory = {
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        usedJSHeapPercentage: (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    
    // Resource timing
    if (performance.getEntriesByType) {
      const resourceEntries = performance.getEntriesByType('resource');
      if (resourceEntries && resourceEntries.length > 0) {
        // Get top 10 slowest resources
        const sortedResources = [...resourceEntries].sort((a, b) => b.duration - a.duration).slice(0, 10);
        
        metrics.resources = sortedResources.map(resource => ({
          name: resource.name.split('/').pop(),
          duration: resource.duration.toFixed(2) + 'ms',
          size: resource.transferSize ? (resource.transferSize / 1024).toFixed(2) + 'KB' : 'Unknown'
        }));
      }
    }
    
    // Log to console
    console.group('PERFORMANCE METRICS');
    console.log('Time since page load:', (metrics.now / 1000).toFixed(2) + 's');
    
    console.group('Navigation Timing');
    if (metrics.navigation.domComplete) {
      console.log('DOM Complete:', metrics.navigation.domComplete.toFixed(2) + 'ms');
      console.log('DOM Interactive:', metrics.navigation.domInteractive.toFixed(2) + 'ms');
      console.log('Load Event:', metrics.navigation.loadEventEnd.toFixed(2) + 'ms');
    } else {
      console.log('Navigation timing not available');
    }
    console.groupEnd();
    
    console.group('Memory Usage');
    if (metrics.memory.usedJSHeapSize) {
      console.log('Used Heap:', (metrics.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Total Heap:', (metrics.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Heap Limit:', (metrics.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Used Percentage:', metrics.memory.usedJSHeapPercentage);
    } else {
      console.log('Memory metrics not available');
    }
    console.groupEnd();
    
    console.group('Slowest Resources (Top 10)');
    if (metrics.resources.length > 0) {
      metrics.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}: ${resource.duration} (${resource.size})`);
      });
    } else {
      console.log('Resource timing not available');
    }
    console.groupEnd();
    
    console.groupEnd();
    
    // Show notification
    showNotification('PERFORMANCE STATS LOGGED TO CONSOLE');
  } catch (error) {
    console.error('Error logging performance stats:', error);
    showNotification('ERROR LOGGING PERFORMANCE STATS', 'error');
  }
}

// Enhanced Admin Panel System
let adminPanelDraggable = true;
let adminTestingEnabled = true;

// Initialize Admin Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up the admin panel
  initializeAdminPanel();
});

// Initialize Admin Panel
function initializeAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Make panel draggable
  if (adminPanelDraggable) {
    makeDraggable(adminPanel);
  }
  
  // Replace admin panel content with enhanced version
  createEnhancedAdminPanel();
  
  // Add event listeners for buttons
  setupButtonListeners();
}

// Create enhanced admin panel
function createEnhancedAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Clear existing content first
  adminPanel.innerHTML = '';
  
  // Add drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '⋮⋮⋮';
  adminPanel.appendChild(dragHandle);
  
  // Add header
  const header = document.createElement('div');
  header.className = 'admin-header';
  header.innerHTML = `
    <div class="admin-title">ADMIN CONTROLS v2.0</div>
    <button class="minimize-btn">−</button>
  `;
  adminPanel.appendChild(header);
  
  // Add content container
  const content = document.createElement('div');
  content.className = 'admin-content';
  
  // Add resource management section
  const resourceSection = createResourceSection();
  content.appendChild(resourceSection);
  
  // Add deployment management section
  const deploymentSection = createDeploymentSection();
  content.appendChild(deploymentSection);
  
  // Add user management section
  const userSection = createUserSection();
  content.appendChild(userSection);
  
  // Add testing tools section
  if (adminTestingEnabled) {
    const testingSection = createTestingSection();
    content.appendChild(testingSection);
  }
  
  // Add system tools section
  const systemSection = createSystemSection();
  content.appendChild(systemSection);
  
  adminPanel.appendChild(content);
  
  // Add minimize button functionality
  const minimizeBtn = adminPanel.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const content = adminPanel.querySelector('.admin-content');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      this.textContent = '−';
    } else {
      content.style.display = 'none';
      this.textContent = '+';
    }
  });
}

// Create resource management section
function createResourceSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
    <div class="admin-resource-buttons">
      <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <button id="modify-resources-button" class="resource-button modify">CUSTOM RESOURCE MODIFICATION</button>
    </div>
  `;
  return section;
}

// Create deployment management section
function createDeploymentSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title deployments">DEPLOYMENT SYSTEM</div>
    <div class="admin-deployment-buttons">
      <button id="generate-deployments-button" class="deployment-button generate">GENERATE RANDOM DEPLOYMENTS</button>
      <button id="view-deployments-button" class="deployment-button view">VIEW ALL DEPLOYMENTS</button>
      <button id="clear-deployments-button" class="deployment-button clear">CLEAR ALL DEPLOYMENTS</button>
      <button id="force-complete-button" class="deployment-button complete">FORCE COMPLETE ACTIVE DEPLOYMENT</button>
    </div>
  `;
  return section;
}

// Create user management section
function createUserSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title users">USER MANAGEMENT</div>
    <div class="admin-user-buttons">
      <button id="create-user-button" class="user-button create">CREATE TEST USER</button>
      <button id="list-users-button" class="user-button list">LIST ALL USERS</button>
      <button id="reset-user-button" class="user-button reset">RESET USER PROGRESS</button>
      <button id="promote-user-button" class="user-button promote">CHANGE USER ROLE</button>
    </div>
  `;
  return section;
}

// Create testing tools section
function createTestingSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title testing">TESTING TOOLS</div>
    <div class="admin-testing-buttons">
      <button id="test-notification-button" class="testing-button notification">TEST NOTIFICATION SYSTEM</button>
      <button id="test-sound-button" class="testing-button sound">TEST SOUND EFFECTS</button>
      <button id="test-intel-button" class="testing-button intel">TEST INTEL PANEL</button>
      <button id="test-mission-button" class="testing-button mission">TEST MISSION SYSTEM</button>
    </div>
  `;
  return section;
}

// Create system tools section
function createSystemSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title system">SYSTEM TOOLS</div>
    <div class="admin-system-buttons">
      <button id="clear-cache-button" class="system-button cache">CLEAR FIREBASE CACHE</button>
      <button id="reload-globe-button" class="system-button globe">RELOAD GLOBE</button>
      <button id="toggle-debug-button" class="system-button debug">TOGGLE DEBUG MODE</button>
      <button id="console-stats-button" class="system-button stats">CONSOLE PERFORMANCE STATS</button>
    </div>
  `;
  return section;
}

// Set up button listeners for admin panel
function setupButtonListeners() {
  // Resource Management Button Listeners
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', addTestResources);
  document.getElementById('modify-resources-button')?.addEventListener('click', showResourceModificationModal);
  
  // Deployment System Button Listeners
  document.getElementById('generate-deployments-button')?.addEventListener('click', generateRandomDeployments);
  document.getElementById('view-deployments-button')?.addEventListener('click', viewAllDeployments);
  document.getElementById('clear-deployments-button')?.addEventListener('click', clearAllDeployments);
  document.getElementById('force-complete-button')?.addEventListener('click', forceCompleteDeployment);
  
  // User Management Button Listeners
  document.getElementById('create-user-button')?.addEventListener('click', showCreateUserModal);
  document.getElementById('list-users-button')?.addEventListener('click', listAllUsers);
  document.getElementById('reset-user-button')?.addEventListener('click', showResetUserModal);
  document.getElementById('promote-user-button')?.addEventListener('click', showPromoteUserModal);
  
  // Testing Tools Button Listeners
  document.getElementById('test-notification-button')?.addEventListener('click', testNotificationSystem);
  document.getElementById('test-sound-button')?.addEventListener('click', testSoundEffects);
  document.getElementById('test-intel-button')?.addEventListener('click', testIntelPanel);
  document.getElementById('test-mission-button')?.addEventListener('click', testMissionSystem);
  
  // System Tools Button Listeners
  document.getElementById('clear-cache-button')?.addEventListener('click', clearFirebaseCache);
  document.getElementById('reload-globe-button')?.addEventListener('click', reloadGlobe);
  document.getElementById('toggle-debug-button')?.addEventListener('click', toggleDebugMode);
  document.getElementById('console-stats-button')?.addEventListener('click', logPerformanceStats);
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
      element.style.right = 'auto'; // Remove right positioning
      element.style.transform = 'none'; // Remove any transform
    }
  });
}

// RESOURCE MANAGEMENT FUNCTIONS

// Show resource modification modal
function showResourceModificationModal() {
  // Create modal for custom resource modification
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'resource-mod-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">MODIFY RESOURCES</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="resource-type">RESOURCE TYPE:</label>
          <select id="resource-type">
            <option value="money">MONEY</option>
            <option value="fuel">FUEL</option>
            <option value="ammo">AMMO</option>
            <option value="medicine">MEDICINE</option>
            <option value="food">FOOD</option>
            <option value="materials">MATERIALS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resource-amount">AMOUNT:</label>
          <input type="number" id="resource-amount" value="1000">
        </div>
        <div class="form-group">
          <label for="resource-operation">OPERATION:</label>
          <select id="resource-operation">
            <option value="add">ADD</option>
            <option value="subtract">SUBTRACT</option>
            <option value="set">SET TO VALUE</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="apply-resource-mod">APPLY CHANGES</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#apply-resource-mod').addEventListener('click', () => {
    const resourceType = document.getElementById('resource-type').value;
    const amount = parseInt(document.getElementById('resource-amount').value);
    const operation = document.getElementById('resource-operation').value;
    
    applyResourceModification(resourceType, amount, operation);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Apply resource modification
async function applyResourceModification(resourceType, amount, operation) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      await initializeGlobalResources();
      showNotification('RESOURCES INITIALIZED');
      return;
    }
    
    let updateData = {};
    
    // Apply operation
    if (resourceType === 'money') {
      if (operation === 'add') {
        updateData.money = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData.money = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData.money = amount;
      }
    } else {
      if (operation === 'add') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData[`resources.${resourceType}`] = amount;
      }
    }
    
    // Add timestamp to force update
    updateData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    updateData.updateId = Math.random().toString(36).substring(2, 15);
    
    await globalResourcesRef.update(updateData);
    
    showNotification(`${resourceType.toUpperCase()} ${operation.toUpperCase()}ED: ${amount}`);
  } catch (error) {
    console.error('Error modifying resources:', error);
    showNotification('ERROR MODIFYING RESOURCES');
  }
}

// DEPLOYMENT SYSTEM FUNCTIONS

// Generate random deployments
function generateRandomDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Show a modal to select how many deployments to generate
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'deployment-count-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">GENERATE DEPLOYMENTS</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="deployment-count">NUMBER OF DEPLOYMENTS:</label>
          <input type="number" id="deployment-count" value="5" min="1" max="10">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="generate-confirm">GENERATE</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#generate-confirm').addEventListener('click', async () => {
    const count = parseInt(document.getElementById('deployment-count').value);
    
    document.body.removeChild(modal);
    
    // Call the adminGenerateDeployments function from deployment-system.js
    try {
      const deployments = await adminGenerateDeployments(count);
      showNotification(`${deployments.length} DEPLOYMENTS GENERATED`);
    } catch (error) {
      console.error('Error generating deployments:', error);
      showNotification('ERROR GENERATING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// View all deployments
function viewAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Call the adminViewDeployments function from deployment-system.js
  adminViewDeployments();
}

// Clear all deployments
async function clearAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'clear-deployments-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">CONFIRM DELETION</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="confirmation-message">
          Are you sure you want to delete ALL deployments?
        </div>
        <div class="confirmation-warning">
          This action cannot be undone. All active and available deployments will be permanently removed.
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button delete-confirm" id="clear-confirm">DELETE ALL</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#clear-confirm').addEventListener('click', async () => {
    document.body.removeChild(modal);
    
    try {
      // Delete all deployments from Firestore
      // First, get available deployments
      const availableSnapshot = await db.collection('availableDeployments').get();
      const availableBatch = db.batch();
      
      availableSnapshot.forEach(doc => {
        availableBatch.delete(doc.ref);
      });
      
      // Then get active deployments
      const activeSnapshot = await db.collection('deployments').get();
      const activeBatch = db.batch();
      
      activeSnapshot.forEach(doc => {
        activeBatch.delete(doc.ref);
      });
      
      // Commit the batches
      await Promise.all([
        availableBatch.commit(),
        activeBatch.commit()
      ]);
      
      showNotification('ALL DEPLOYMENTS DELETED');
    } catch (error) {
      console.error('Error clearing deployments:', error);
      showNotification('ERROR CLEARING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  errorSound.play().catch(console.error);
}

// Force complete an active deployment
async function forceCompleteDeployment() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get active deployments
    const deploymentsRef = db.collection('deployments');
    const snapshot = await deploymentsRef.get();
    
    if (snapshot.empty) {
      showNotification('NO ACTIVE DEPLOYMENTS FOUND');
      return;
    }
    
    // Create modal to select which deployment to complete
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'complete-deployment-modal';
    
    let modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">FORCE COMPLETE DEPLOYMENT</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="deployments-list">
    `;
    
    snapshot.forEach(doc => {
      const deployment = doc.data();
      const startTime = deployment.startTime?.toDate().toLocaleString() || 'Unknown';
      const endTime = deployment.endTime?.toDate().toLocaleString() || 'Unknown';
      
      modalContent += `
        <div class="deployment-item">
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name || doc.id}</div>
            <div class="deployment-status">${deployment.status?.toUpperCase() || 'ACTIVE'}</div>
          </div>
          <div class="deployment-location">${deployment.location || 'Unknown location'}</div>
          <div class="deployment-team">TEAM: ${deployment.teamName || "Unknown"}</div>
          <div class="deployment-times">
            <div>START: ${startTime}</div>
            <div>END: ${endTime}</div>
          </div>
          <button class="complete-deployment-button" data-id="${doc.id}">FORCE COMPLETE</button>
        </div>
      `;
    });
    
    modalContent += `
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#clear-cache-confirm').addEventListener('click', async () => {
      // Clear Firebase cache
      try {
        // Try to clear Firestore cache
        await firebase.firestore().clearPersistence();
        
        // Show success notification
        showNotification('FIREBASE CACHE CLEARED SUCCESSFULLY');
        
        // Prompt for reload
        setTimeout(() => {
          const reloadConfirm = confirm('Firebase cache cleared. Reload the application?');
          if (reloadConfirm) {
            window.location.reload();
          }
        }, 1000);
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error clearing cache:', error);
        showNotification('ERROR CLEARING CACHE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    errorSound.play().catch(console.error);
  }
}

// Reload globe
function reloadGlobe() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'reload-globe-modal';
    
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">RELOAD GLOBE</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-message">
            Are you sure you want to reload the globe?
          </div>
          <div class="confirmation-warning">
            This will clear all current markers and reload missions from the database.
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
          <button class="confirm-button" id="reload-globe-confirm">RELOAD GLOBE</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#reload-globe-confirm').addEventListener('click', async () => {
      try {
        // Clear existing markers
        if (typeof clearMissionMarkers === 'function') {
          clearMissionMarkers();
        }
        
        // Reload missions
        if (typeof loadMissions === 'function') {
          const missions = await loadMissions();
          
          if (missions && Array.isArray(missions)) {
            missions.forEach(mission => {
              if (mission.coordinates && typeof addMissionMarker === 'function') {
                addMissionMarker(mission);
              }
            });
          }
        }
        
        // Reload active deployments if available
        if (typeof loadActiveDeployments === 'function') {
          await loadActiveDeployments();
        }
        
        showNotification('GLOBE RELOADED SUCCESSFULLY');
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error reloading globe:', error);
        showNotification('ERROR RELOADING GLOBE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error reloading globe:', error);
    showNotification('ERROR RELOADING GLOBE', 'error');
  }
}

// Toggle debug mode
function toggleDebugMode() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Check if debug mode is already enabled
    const isDebugMode = localStorage.getItem('debugMode') === 'true';
    
    if (isDebugMode) {
      // Disable debug mode
      localStorage.setItem('debugMode', 'false');
      showNotification('DEBUG MODE DISABLED');
      
      // Remove debug elements if they exist
      const debugPanel = document.getElementById('debug-panel');
      if (debugPanel) {
        document.body.removeChild(debugPanel);
      }
    } else {
      // Enable debug mode
      localStorage.setItem('debugMode', 'true');
      showNotification('DEBUG MODE ENABLED');
      
      // Create debug panel
      createDebugPanel();
    }
  } catch (error) {
    console.error('Error toggling debug mode:', error);
    showNotification('ERROR TOGGLING DEBUG MODE', 'error');
  }
}

// Create debug panel
function createDebugPanel() {
  // Check if panel already exists
  if (document.getElementById('debug-panel')) {
    return;
  }
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.className = 'debug-panel';
  
  // Add content
  debugPanel.innerHTML = `
    <div class="debug-header">
      <div class="debug-title">DEBUG PANEL</div>
      <button class="debug-close">X</button>
    </div>
    <div class="debug-content">
      <div class="debug-section">
        <div class="debug-section-title">SYSTEM INFO</div>
        <div class="debug-info" id="debug-system-info">
          <div>USER: <span id="debug-user">${currentUser ? currentUser.uid : 'Not logged in'}</span></div>
          <div>ROLE: <span id="debug-role">${userRole || 'None'}</span></div>
          <div>VERSION: <span>1.0.0</span></div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">PERFORMANCE</div>
        <div class="debug-info" id="debug-performance">
          <div>FPS: <span id="debug-fps">0</span></div>
          <div>MEMORY: <span id="debug-memory">0</span> MB</div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">EVENT LOG</div>
        <div class="debug-log" id="debug-event-log"></div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(debugPanel);
  
  // Add event listeners
  debugPanel.querySelector('.debug-close').addEventListener('click', () => {
    document.body.removeChild(debugPanel);
    localStorage.setItem('debugMode', 'false');
    showNotification('DEBUG MODE DISABLED');
  });
  
  // Start performance monitoring
  startPerformanceMonitoring();
  
  // Override console.log for debug panel
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    // Call original console.log
    originalConsoleLog.apply(console, args);
    
    // Add to debug panel
    const debugLog = document.getElementById('debug-event-log');
    if (debugLog) {
      const logItem = document.createElement('div');
      logItem.className = 'debug-log-item';
      logItem.textContent = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      // Add timestamp
      const timestamp = new Date().toLocaleTimeString();
      logItem.innerHTML = `<span class="debug-timestamp">[${timestamp}]</span> ${logItem.textContent}`;
      
      // Add to log
      debugLog.appendChild(logItem);
      
      // Limit log items
      if (debugLog.children.length > 100) {
        debugLog.removeChild(debugLog.firstChild);
      }
      
      // Scroll to bottom
      debugLog.scrollTop = debugLog.scrollHeight;
    }
  };
}

// Start performance monitoring
function startPerformanceMonitoring() {
  // Variables for FPS calculation
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  // Function to update FPS
  function updateFPS() {
    // Increment frame count
    frameCount++;
    
    // Calculate FPS every second
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {
      fps = Math.round((frameCount * 1000) / elapsedTime);
      frameCount = 0;
      lastTime = currentTime;
      
      // Update FPS display
      const fpsElement = document.getElementById('debug-fps');
      if (fpsElement) {
        fpsElement.textContent = fps;
      }
      
      // Update memory usage if available
      if (window.performance && window.performance.memory) {
        const memoryElement = document.getElementById('debug-memory');
        if (memoryElement) {
          const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
          memoryElement.textContent = memoryUsage;
        }
      }
    }
    
    // Request next frame
    requestAnimationFrame(updateFPS);
  }
  
  // Start monitoring
  updateFPS();
}

// Log performance stats
function logPerformanceStats() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Performance metrics
    const metrics = {
      navigation: {},
      memory: {},
      timing: {},
      timeOrigin: performance.timeOrigin,
      now: performance.now(),
      resources: []
    };
    
    // Navigation timing data
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        metrics.navigation = navEntries[0];
      }
    }
    
    // Memory usage
    if (window.performance && window.performance.memory) {
      metrics.memory = {
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        usedJSHeapPercentage: (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    
    // Resource timing
    if (performance.getEntriesByType) {
      const resourceEntries = performance.getEntriesByType('resource');
      if (resourceEntries && resourceEntries.length > 0) {
        // Get top 10 slowest resources
        const sortedResources = [...resourceEntries].sort((a, b) => b.duration - a.duration).slice(0, 10);
        
        metrics.resources = sortedResources.map(resource => ({
          name: resource.name.split('/').pop(),
          duration: resource.duration.toFixed(2) + 'ms',
          size: resource.transferSize ? (resource.transferSize / 1024).toFixed(2) + 'KB' : 'Unknown'
        }));
      }
    }
    
    // Log to console
    console.group('PERFORMANCE METRICS');
    console.log('Time since page load:', (metrics.now / 1000).toFixed(2) + 's');
    
    console.group('Navigation Timing');
    if (metrics.navigation.domComplete) {
      console.log('DOM Complete:', metrics.navigation.domComplete.toFixed(2) + 'ms');
      console.log('DOM Interactive:', metrics.navigation.domInteractive.toFixed(2) + 'ms');
      console.log('Load Event:', metrics.navigation.loadEventEnd.toFixed(2) + 'ms');
    } else {
      console.log('Navigation timing not available');
    }
    console.groupEnd();
    
    console.group('Memory Usage');
    if (metrics.memory.usedJSHeapSize) {
      console.log('Used Heap:', (metrics.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Total Heap:', (metrics.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Heap Limit:', (metrics.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Used Percentage:', metrics.memory.usedJSHeapPercentage);
    } else {
      console.log('Memory metrics not available');
    }
    console.groupEnd();
    
    console.group('Slowest Resources (Top 10)');
    if (metrics.resources.length > 0) {
      metrics.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}: ${resource.duration} (${resource.size})`);
      });
    } else {
      console.log('Resource timing not available');
    }
    console.groupEnd();
    
    console.groupEnd();
    
    // Show notification
    showNotification('PERFORMANCE STATS LOGGED TO CONSOLE');
  } catch (error) {
    console.error('Error logging performance stats:', error);
    showNotification('ERROR LOGGING PERFORMANCE STATS', 'error');
  }
}

// Enhanced Admin Panel System
let adminPanelDraggable = true;
let adminTestingEnabled = true;

// Initialize Admin Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up the admin panel
  initializeAdminPanel();
});

// Initialize Admin Panel
function initializeAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Make panel draggable
  if (adminPanelDraggable) {
    makeDraggable(adminPanel);
  }
  
  // Replace admin panel content with enhanced version
  createEnhancedAdminPanel();
  
  // Add event listeners for buttons
  setupButtonListeners();
}

// Create enhanced admin panel
function createEnhancedAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Clear existing content first
  adminPanel.innerHTML = '';
  
  // Add drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '⋮⋮⋮';
  adminPanel.appendChild(dragHandle);
  
  // Add header
  const header = document.createElement('div');
  header.className = 'admin-header';
  header.innerHTML = `
    <div class="admin-title">ADMIN CONTROLS v2.0</div>
    <button class="minimize-btn">−</button>
  `;
  adminPanel.appendChild(header);
  
  // Add content container
  const content = document.createElement('div');
  content.className = 'admin-content';
  
  // Add resource management section
  const resourceSection = createResourceSection();
  content.appendChild(resourceSection);
  
  // Add deployment management section
  const deploymentSection = createDeploymentSection();
  content.appendChild(deploymentSection);
  
  // Add user management section
  const userSection = createUserSection();
  content.appendChild(userSection);
  
  // Add testing tools section
  if (adminTestingEnabled) {
    const testingSection = createTestingSection();
    content.appendChild(testingSection);
  }
  
  // Add system tools section
  const systemSection = createSystemSection();
  content.appendChild(systemSection);
  
  adminPanel.appendChild(content);
  
  // Add minimize button functionality
  const minimizeBtn = adminPanel.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const content = adminPanel.querySelector('.admin-content');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      this.textContent = '−';
    } else {
      content.style.display = 'none';
      this.textContent = '+';
    }
  });
}

// Create resource management section
function createResourceSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
    <div class="admin-resource-buttons">
      <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <button id="modify-resources-button" class="resource-button modify">CUSTOM RESOURCE MODIFICATION</button>
    </div>
  `;
  return section;
}

// Create deployment management section
function createDeploymentSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title deployments">DEPLOYMENT SYSTEM</div>
    <div class="admin-deployment-buttons">
      <button id="generate-deployments-button" class="deployment-button generate">GENERATE RANDOM DEPLOYMENTS</button>
      <button id="view-deployments-button" class="deployment-button view">VIEW ALL DEPLOYMENTS</button>
      <button id="clear-deployments-button" class="deployment-button clear">CLEAR ALL DEPLOYMENTS</button>
      <button id="force-complete-button" class="deployment-button complete">FORCE COMPLETE ACTIVE DEPLOYMENT</button>
    </div>
  `;
  return section;
}

// Create user management section
function createUserSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title users">USER MANAGEMENT</div>
    <div class="admin-user-buttons">
      <button id="create-user-button" class="user-button create">CREATE TEST USER</button>
      <button id="list-users-button" class="user-button list">LIST ALL USERS</button>
      <button id="reset-user-button" class="user-button reset">RESET USER PROGRESS</button>
      <button id="promote-user-button" class="user-button promote">CHANGE USER ROLE</button>
    </div>
  `;
  return section;
}

// Create testing tools section
function createTestingSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title testing">TESTING TOOLS</div>
    <div class="admin-testing-buttons">
      <button id="test-notification-button" class="testing-button notification">TEST NOTIFICATION SYSTEM</button>
      <button id="test-sound-button" class="testing-button sound">TEST SOUND EFFECTS</button>
      <button id="test-intel-button" class="testing-button intel">TEST INTEL PANEL</button>
      <button id="test-mission-button" class="testing-button mission">TEST MISSION SYSTEM</button>
    </div>
  `;
  return section;
}

// Create system tools section
function createSystemSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title system">SYSTEM TOOLS</div>
    <div class="admin-system-buttons">
      <button id="clear-cache-button" class="system-button cache">CLEAR FIREBASE CACHE</button>
      <button id="reload-globe-button" class="system-button globe">RELOAD GLOBE</button>
      <button id="toggle-debug-button" class="system-button debug">TOGGLE DEBUG MODE</button>
      <button id="console-stats-button" class="system-button stats">CONSOLE PERFORMANCE STATS</button>
    </div>
  `;
  return section;
}

// Set up button listeners for admin panel
function setupButtonListeners() {
  // Resource Management Button Listeners
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', addTestResources);
  document.getElementById('modify-resources-button')?.addEventListener('click', showResourceModificationModal);
  
  // Deployment System Button Listeners
  document.getElementById('generate-deployments-button')?.addEventListener('click', generateRandomDeployments);
  document.getElementById('view-deployments-button')?.addEventListener('click', viewAllDeployments);
  document.getElementById('clear-deployments-button')?.addEventListener('click', clearAllDeployments);
  document.getElementById('force-complete-button')?.addEventListener('click', forceCompleteDeployment);
  
  // User Management Button Listeners
  document.getElementById('create-user-button')?.addEventListener('click', showCreateUserModal);
  document.getElementById('list-users-button')?.addEventListener('click', listAllUsers);
  document.getElementById('reset-user-button')?.addEventListener('click', showResetUserModal);
  document.getElementById('promote-user-button')?.addEventListener('click', showPromoteUserModal);
  
  // Testing Tools Button Listeners
  document.getElementById('test-notification-button')?.addEventListener('click', testNotificationSystem);
  document.getElementById('test-sound-button')?.addEventListener('click', testSoundEffects);
  document.getElementById('test-intel-button')?.addEventListener('click', testIntelPanel);
  document.getElementById('test-mission-button')?.addEventListener('click', testMissionSystem);
  
  // System Tools Button Listeners
  document.getElementById('clear-cache-button')?.addEventListener('click', clearFirebaseCache);
  document.getElementById('reload-globe-button')?.addEventListener('click', reloadGlobe);
  document.getElementById('toggle-debug-button')?.addEventListener('click', toggleDebugMode);
  document.getElementById('console-stats-button')?.addEventListener('click', logPerformanceStats);
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
      element.style.right = 'auto'; // Remove right positioning
      element.style.transform = 'none'; // Remove any transform
    }
  });
}

// RESOURCE MANAGEMENT FUNCTIONS

// Show resource modification modal
function showResourceModificationModal() {
  // Create modal for custom resource modification
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'resource-mod-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">MODIFY RESOURCES</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="resource-type">RESOURCE TYPE:</label>
          <select id="resource-type">
            <option value="money">MONEY</option>
            <option value="fuel">FUEL</option>
            <option value="ammo">AMMO</option>
            <option value="medicine">MEDICINE</option>
            <option value="food">FOOD</option>
            <option value="materials">MATERIALS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resource-amount">AMOUNT:</label>
          <input type="number" id="resource-amount" value="1000">
        </div>
        <div class="form-group">
          <label for="resource-operation">OPERATION:</label>
          <select id="resource-operation">
            <option value="add">ADD</option>
            <option value="subtract">SUBTRACT</option>
            <option value="set">SET TO VALUE</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="apply-resource-mod">APPLY CHANGES</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#apply-resource-mod').addEventListener('click', () => {
    const resourceType = document.getElementById('resource-type').value;
    const amount = parseInt(document.getElementById('resource-amount').value);
    const operation = document.getElementById('resource-operation').value;
    
    applyResourceModification(resourceType, amount, operation);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Apply resource modification
async function applyResourceModification(resourceType, amount, operation) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      await initializeGlobalResources();
      showNotification('RESOURCES INITIALIZED');
      return;
    }
    
    let updateData = {};
    
    // Apply operation
    if (resourceType === 'money') {
      if (operation === 'add') {
        updateData.money = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData.money = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData.money = amount;
      }
    } else {
      if (operation === 'add') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData[`resources.${resourceType}`] = amount;
      }
    }
    
    // Add timestamp to force update
    updateData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    updateData.updateId = Math.random().toString(36).substring(2, 15);
    
    await globalResourcesRef.update(updateData);
    
    showNotification(`${resourceType.toUpperCase()} ${operation.toUpperCase()}ED: ${amount}`);
  } catch (error) {
    console.error('Error modifying resources:', error);
    showNotification('ERROR MODIFYING RESOURCES');
  }
}

// DEPLOYMENT SYSTEM FUNCTIONS

// Generate random deployments
function generateRandomDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Show a modal to select how many deployments to generate
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'deployment-count-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">GENERATE DEPLOYMENTS</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="deployment-count">NUMBER OF DEPLOYMENTS:</label>
          <input type="number" id="deployment-count" value="5" min="1" max="10">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="generate-confirm">GENERATE</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#generate-confirm').addEventListener('click', async () => {
    const count = parseInt(document.getElementById('deployment-count').value);
    
    document.body.removeChild(modal);
    
    // Call the adminGenerateDeployments function from deployment-system.js
    try {
      const deployments = await adminGenerateDeployments(count);
      showNotification(`${deployments.length} DEPLOYMENTS GENERATED`);
    } catch (error) {
      console.error('Error generating deployments:', error);
      showNotification('ERROR GENERATING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// View all deployments
function viewAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Call the adminViewDeployments function from deployment-system.js
  adminViewDeployments();
}

// Clear all deployments
async function clearAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'clear-deployments-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">CONFIRM DELETION</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="confirmation-message">
          Are you sure you want to delete ALL deployments?
        </div>
        <div class="confirmation-warning">
          This action cannot be undone. All active and available deployments will be permanently removed.
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button delete-confirm" id="clear-confirm">DELETE ALL</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#clear-confirm').addEventListener('click', async () => {
    document.body.removeChild(modal);
    
    try {
      // Delete all deployments from Firestore
      // First, get available deployments
      const availableSnapshot = await db.collection('availableDeployments').get();
      const availableBatch = db.batch();
      
      availableSnapshot.forEach(doc => {
        availableBatch.delete(doc.ref);
      });
      
      // Then get active deployments
      const activeSnapshot = await db.collection('deployments').get();
      const activeBatch = db.batch();
      
      activeSnapshot.forEach(doc => {
        activeBatch.delete(doc.ref);
      });
      
      // Commit the batches
      await Promise.all([
        availableBatch.commit(),
        activeBatch.commit()
      ]);
      
      showNotification('ALL DEPLOYMENTS DELETED');
    } catch (error) {
      console.error('Error clearing deployments:', error);
      showNotification('ERROR CLEARING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  errorSound.play().catch(console.error);
}

// Force complete an active deployment
async function forceCompleteDeployment() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get active deployments
    const deploymentsRef = db.collection('deployments');
    const snapshot = await deploymentsRef.get();
    
    if (snapshot.empty) {
      showNotification('NO ACTIVE DEPLOYMENTS FOUND');
      return;
    }
    
    // Create modal to select which deployment to complete
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'complete-deployment-modal';
    
    let modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">FORCE COMPLETE DEPLOYMENT</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="deployments-list">
    `;
    
    snapshot.forEach(doc => {
      const deployment = doc.data();
      const startTime = deployment.startTime?.toDate().toLocaleString() || 'Unknown';
      const endTime = deployment.endTime?.toDate().toLocaleString() || 'Unknown';
      
      modalContent += `
        <div class="deployment-item">
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name || doc.id}</div>
            <div class="deployment-status">${deployment.status?.toUpperCase() || 'ACTIVE'}</div>
          </div>
          <div class="deployment-location">${deployment.location || 'Unknown location'}</div>
          <div class="deployment-team">TEAM: ${deployment.teamName || "Unknown"}</div>
          <div class="deployment-times">
            <div>START: ${startTime}</div>
            <div>END: ${endTime}</div>
          </div>
          <button class="complete-deployment-button" data-id="${doc.id}">FORCE COMPLETE</button>
        </div>
      `;
    });
    
    modalContent += `
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#clear-cache-confirm').addEventListener('click', async () => {
      // Clear Firebase cache
      try {
        // Try to clear Firestore cache
        await firebase.firestore().clearPersistence();
        
        // Show success notification
        showNotification('FIREBASE CACHE CLEARED SUCCESSFULLY');
        
        // Prompt for reload
        setTimeout(() => {
          const reloadConfirm = confirm('Firebase cache cleared. Reload the application?');
          if (reloadConfirm) {
            window.location.reload();
          }
        }, 1000);
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error clearing cache:', error);
        showNotification('ERROR CLEARING CACHE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    errorSound.play().catch(console.error);
  }
}

// Reload globe
function reloadGlobe() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'reload-globe-modal';
    
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">RELOAD GLOBE</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-message">
            Are you sure you want to reload the globe?
          </div>
          <div class="confirmation-warning">
            This will clear all current markers and reload missions from the database.
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
          <button class="confirm-button" id="reload-globe-confirm">RELOAD GLOBE</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#reload-globe-confirm').addEventListener('click', async () => {
      try {
        // Clear existing markers
        if (typeof clearMissionMarkers === 'function') {
          clearMissionMarkers();
        }
        
        // Reload missions
        if (typeof loadMissions === 'function') {
          const missions = await loadMissions();
          
          if (missions && Array.isArray(missions)) {
            missions.forEach(mission => {
              if (mission.coordinates && typeof addMissionMarker === 'function') {
                addMissionMarker(mission);
              }
            });
          }
        }
        
        // Reload active deployments if available
        if (typeof loadActiveDeployments === 'function') {
          await loadActiveDeployments();
        }
        
        showNotification('GLOBE RELOADED SUCCESSFULLY');
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error reloading globe:', error);
        showNotification('ERROR RELOADING GLOBE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error reloading globe:', error);
    showNotification('ERROR RELOADING GLOBE', 'error');
  }
}

// Toggle debug mode
function toggleDebugMode() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Check if debug mode is already enabled
    const isDebugMode = localStorage.getItem('debugMode') === 'true';
    
    if (isDebugMode) {
      // Disable debug mode
      localStorage.setItem('debugMode', 'false');
      showNotification('DEBUG MODE DISABLED');
      
      // Remove debug elements if they exist
      const debugPanel = document.getElementById('debug-panel');
      if (debugPanel) {
        document.body.removeChild(debugPanel);
      }
    } else {
      // Enable debug mode
      localStorage.setItem('debugMode', 'true');
      showNotification('DEBUG MODE ENABLED');
      
      // Create debug panel
      createDebugPanel();
    }
  } catch (error) {
    console.error('Error toggling debug mode:', error);
    showNotification('ERROR TOGGLING DEBUG MODE', 'error');
  }
}

// Create debug panel
function createDebugPanel() {
  // Check if panel already exists
  if (document.getElementById('debug-panel')) {
    return;
  }
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.className = 'debug-panel';
  
  // Add content
  debugPanel.innerHTML = `
    <div class="debug-header">
      <div class="debug-title">DEBUG PANEL</div>
      <button class="debug-close">X</button>
    </div>
    <div class="debug-content">
      <div class="debug-section">
        <div class="debug-section-title">SYSTEM INFO</div>
        <div class="debug-info" id="debug-system-info">
          <div>USER: <span id="debug-user">${currentUser ? currentUser.uid : 'Not logged in'}</span></div>
          <div>ROLE: <span id="debug-role">${userRole || 'None'}</span></div>
          <div>VERSION: <span>1.0.0</span></div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">PERFORMANCE</div>
        <div class="debug-info" id="debug-performance">
          <div>FPS: <span id="debug-fps">0</span></div>
          <div>MEMORY: <span id="debug-memory">0</span> MB</div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">EVENT LOG</div>
        <div class="debug-log" id="debug-event-log"></div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(debugPanel);
  
  // Add event listeners
  debugPanel.querySelector('.debug-close').addEventListener('click', () => {
    document.body.removeChild(debugPanel);
    localStorage.setItem('debugMode', 'false');
    showNotification('DEBUG MODE DISABLED');
  });
  
  // Start performance monitoring
  startPerformanceMonitoring();
  
  // Override console.log for debug panel
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    // Call original console.log
    originalConsoleLog.apply(console, args);
    
    // Add to debug panel
    const debugLog = document.getElementById('debug-event-log');
    if (debugLog) {
      const logItem = document.createElement('div');
      logItem.className = 'debug-log-item';
      logItem.textContent = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      // Add timestamp
      const timestamp = new Date().toLocaleTimeString();
      logItem.innerHTML = `<span class="debug-timestamp">[${timestamp}]</span> ${logItem.textContent}`;
      
      // Add to log
      debugLog.appendChild(logItem);
      
      // Limit log items
      if (debugLog.children.length > 100) {
        debugLog.removeChild(debugLog.firstChild);
      }
      
      // Scroll to bottom
      debugLog.scrollTop = debugLog.scrollHeight;
    }
  };
}

// Start performance monitoring
function startPerformanceMonitoring() {
  // Variables for FPS calculation
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  // Function to update FPS
  function updateFPS() {
    // Increment frame count
    frameCount++;
    
    // Calculate FPS every second
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {
      fps = Math.round((frameCount * 1000) / elapsedTime);
      frameCount = 0;
      lastTime = currentTime;
      
      // Update FPS display
      const fpsElement = document.getElementById('debug-fps');
      if (fpsElement) {
        fpsElement.textContent = fps;
      }
      
      // Update memory usage if available
      if (window.performance && window.performance.memory) {
        const memoryElement = document.getElementById('debug-memory');
        if (memoryElement) {
          const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
          memoryElement.textContent = memoryUsage;
        }
      }
    }
    
    // Request next frame
    requestAnimationFrame(updateFPS);
  }
  
  // Start monitoring
  updateFPS();
}

// Log performance stats
function logPerformanceStats() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Performance metrics
    const metrics = {
      navigation: {},
      memory: {},
      timing: {},
      timeOrigin: performance.timeOrigin,
      now: performance.now(),
      resources: []
    };
    
    // Navigation timing data
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        metrics.navigation = navEntries[0];
      }
    }
    
    // Memory usage
    if (window.performance && window.performance.memory) {
      metrics.memory = {
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        usedJSHeapPercentage: (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    
    // Resource timing
    if (performance.getEntriesByType) {
      const resourceEntries = performance.getEntriesByType('resource');
      if (resourceEntries && resourceEntries.length > 0) {
        // Get top 10 slowest resources
        const sortedResources = [...resourceEntries].sort((a, b) => b.duration - a.duration).slice(0, 10);
        
        metrics.resources = sortedResources.map(resource => ({
          name: resource.name.split('/').pop(),
          duration: resource.duration.toFixed(2) + 'ms',
          size: resource.transferSize ? (resource.transferSize / 1024).toFixed(2) + 'KB' : 'Unknown'
        }));
      }
    }
    
    // Log to console
    console.group('PERFORMANCE METRICS');
    console.log('Time since page load:', (metrics.now / 1000).toFixed(2) + 's');
    
    console.group('Navigation Timing');
    if (metrics.navigation.domComplete) {
      console.log('DOM Complete:', metrics.navigation.domComplete.toFixed(2) + 'ms');
      console.log('DOM Interactive:', metrics.navigation.domInteractive.toFixed(2) + 'ms');
      console.log('Load Event:', metrics.navigation.loadEventEnd.toFixed(2) + 'ms');
    } else {
      console.log('Navigation timing not available');
    }
    console.groupEnd();
    
    console.group('Memory Usage');
    if (metrics.memory.usedJSHeapSize) {
      console.log('Used Heap:', (metrics.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Total Heap:', (metrics.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Heap Limit:', (metrics.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Used Percentage:', metrics.memory.usedJSHeapPercentage);
    } else {
      console.log('Memory metrics not available');
    }
    console.groupEnd();
    
    console.group('Slowest Resources (Top 10)');
    if (metrics.resources.length > 0) {
      metrics.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}: ${resource.duration} (${resource.size})`);
      });
    } else {
      console.log('Resource timing not available');
    }
    console.groupEnd();
    
    console.groupEnd();
    
    // Show notification
    showNotification('PERFORMANCE STATS LOGGED TO CONSOLE');
  } catch (error) {
    console.error('Error logging performance stats:', error);
    showNotification('ERROR LOGGING PERFORMANCE STATS', 'error');
  }
}

// Enhanced Admin Panel System
let adminPanelDraggable = true;
let adminTestingEnabled = true;

// Initialize Admin Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up the admin panel
  initializeAdminPanel();
});

// Initialize Admin Panel
function initializeAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Make panel draggable
  if (adminPanelDraggable) {
    makeDraggable(adminPanel);
  }
  
  // Replace admin panel content with enhanced version
  createEnhancedAdminPanel();
  
  // Add event listeners for buttons
  setupButtonListeners();
}

// Create enhanced admin panel
function createEnhancedAdminPanel() {
  const adminPanel = document.getElementById('admin-controls');
  if (!adminPanel) return;
  
  // Clear existing content first
  adminPanel.innerHTML = '';
  
  // Add drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '⋮⋮⋮';
  adminPanel.appendChild(dragHandle);
  
  // Add header
  const header = document.createElement('div');
  header.className = 'admin-header';
  header.innerHTML = `
    <div class="admin-title">ADMIN CONTROLS v2.0</div>
    <button class="minimize-btn">−</button>
  `;
  adminPanel.appendChild(header);
  
  // Add content container
  const content = document.createElement('div');
  content.className = 'admin-content';
  
  // Add resource management section
  const resourceSection = createResourceSection();
  content.appendChild(resourceSection);
  
  // Add deployment management section
  const deploymentSection = createDeploymentSection();
  content.appendChild(deploymentSection);
  
  // Add user management section
  const userSection = createUserSection();
  content.appendChild(userSection);
  
  // Add testing tools section
  if (adminTestingEnabled) {
    const testingSection = createTestingSection();
    content.appendChild(testingSection);
  }
  
  // Add system tools section
  const systemSection = createSystemSection();
  content.appendChild(systemSection);
  
  adminPanel.appendChild(content);
  
  // Add minimize button functionality
  const minimizeBtn = adminPanel.querySelector('.minimize-btn');
  minimizeBtn.addEventListener('click', function() {
    const content = adminPanel.querySelector('.admin-content');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      this.textContent = '−';
    } else {
      content.style.display = 'none';
      this.textContent = '+';
    }
  });
}

// Create resource management section
function createResourceSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
    <div class="admin-resource-buttons">
      <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <button id="modify-resources-button" class="resource-button modify">CUSTOM RESOURCE MODIFICATION</button>
    </div>
  `;
  return section;
}

// Create deployment management section
function createDeploymentSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title deployments">DEPLOYMENT SYSTEM</div>
    <div class="admin-deployment-buttons">
      <button id="generate-deployments-button" class="deployment-button generate">GENERATE RANDOM DEPLOYMENTS</button>
      <button id="view-deployments-button" class="deployment-button view">VIEW ALL DEPLOYMENTS</button>
      <button id="clear-deployments-button" class="deployment-button clear">CLEAR ALL DEPLOYMENTS</button>
      <button id="force-complete-button" class="deployment-button complete">FORCE COMPLETE ACTIVE DEPLOYMENT</button>
    </div>
  `;
  return section;
}

// Create user management section
function createUserSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title users">USER MANAGEMENT</div>
    <div class="admin-user-buttons">
      <button id="create-user-button" class="user-button create">CREATE TEST USER</button>
      <button id="list-users-button" class="user-button list">LIST ALL USERS</button>
      <button id="reset-user-button" class="user-button reset">RESET USER PROGRESS</button>
      <button id="promote-user-button" class="user-button promote">CHANGE USER ROLE</button>
    </div>
  `;
  return section;
}

// Create testing tools section
function createTestingSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title testing">TESTING TOOLS</div>
    <div class="admin-testing-buttons">
      <button id="test-notification-button" class="testing-button notification">TEST NOTIFICATION SYSTEM</button>
      <button id="test-sound-button" class="testing-button sound">TEST SOUND EFFECTS</button>
      <button id="test-intel-button" class="testing-button intel">TEST INTEL PANEL</button>
      <button id="test-mission-button" class="testing-button mission">TEST MISSION SYSTEM</button>
    </div>
  `;
  return section;
}

// Create system tools section
function createSystemSection() {
  const section = document.createElement('div');
  section.className = 'admin-section';
  section.innerHTML = `
    <div class="admin-section-title system">SYSTEM TOOLS</div>
    <div class="admin-system-buttons">
      <button id="clear-cache-button" class="system-button cache">CLEAR FIREBASE CACHE</button>
      <button id="reload-globe-button" class="system-button globe">RELOAD GLOBE</button>
      <button id="toggle-debug-button" class="system-button debug">TOGGLE DEBUG MODE</button>
      <button id="console-stats-button" class="system-button stats">CONSOLE PERFORMANCE STATS</button>
    </div>
  `;
  return section;
}

// Set up button listeners for admin panel
function setupButtonListeners() {
  // Resource Management Button Listeners
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', addTestResources);
  document.getElementById('modify-resources-button')?.addEventListener('click', showResourceModificationModal);
  
  // Deployment System Button Listeners
  document.getElementById('generate-deployments-button')?.addEventListener('click', generateRandomDeployments);
  document.getElementById('view-deployments-button')?.addEventListener('click', viewAllDeployments);
  document.getElementById('clear-deployments-button')?.addEventListener('click', clearAllDeployments);
  document.getElementById('force-complete-button')?.addEventListener('click', forceCompleteDeployment);
  
  // User Management Button Listeners
  document.getElementById('create-user-button')?.addEventListener('click', showCreateUserModal);
  document.getElementById('list-users-button')?.addEventListener('click', listAllUsers);
  document.getElementById('reset-user-button')?.addEventListener('click', showResetUserModal);
  document.getElementById('promote-user-button')?.addEventListener('click', showPromoteUserModal);
  
  // Testing Tools Button Listeners
  document.getElementById('test-notification-button')?.addEventListener('click', testNotificationSystem);
  document.getElementById('test-sound-button')?.addEventListener('click', testSoundEffects);
  document.getElementById('test-intel-button')?.addEventListener('click', testIntelPanel);
  document.getElementById('test-mission-button')?.addEventListener('click', testMissionSystem);
  
  // System Tools Button Listeners
  document.getElementById('clear-cache-button')?.addEventListener('click', clearFirebaseCache);
  document.getElementById('reload-globe-button')?.addEventListener('click', reloadGlobe);
  document.getElementById('toggle-debug-button')?.addEventListener('click', toggleDebugMode);
  document.getElementById('console-stats-button')?.addEventListener('click', logPerformanceStats);
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
      element.style.right = 'auto'; // Remove right positioning
      element.style.transform = 'none'; // Remove any transform
    }
  });
}

// RESOURCE MANAGEMENT FUNCTIONS

// Show resource modification modal
function showResourceModificationModal() {
  // Create modal for custom resource modification
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'resource-mod-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">MODIFY RESOURCES</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="resource-type">RESOURCE TYPE:</label>
          <select id="resource-type">
            <option value="money">MONEY</option>
            <option value="fuel">FUEL</option>
            <option value="ammo">AMMO</option>
            <option value="medicine">MEDICINE</option>
            <option value="food">FOOD</option>
            <option value="materials">MATERIALS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resource-amount">AMOUNT:</label>
          <input type="number" id="resource-amount" value="1000">
        </div>
        <div class="form-group">
          <label for="resource-operation">OPERATION:</label>
          <select id="resource-operation">
            <option value="add">ADD</option>
            <option value="subtract">SUBTRACT</option>
            <option value="set">SET TO VALUE</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="apply-resource-mod">APPLY CHANGES</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#apply-resource-mod').addEventListener('click', () => {
    const resourceType = document.getElementById('resource-type').value;
    const amount = parseInt(document.getElementById('resource-amount').value);
    const operation = document.getElementById('resource-operation').value;
    
    applyResourceModification(resourceType, amount, operation);
    document.body.removeChild(modal);
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// Apply resource modification
async function applyResourceModification(resourceType, amount, operation) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      await initializeGlobalResources();
      showNotification('RESOURCES INITIALIZED');
      return;
    }
    
    let updateData = {};
    
    // Apply operation
    if (resourceType === 'money') {
      if (operation === 'add') {
        updateData.money = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData.money = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData.money = amount;
      }
    } else {
      if (operation === 'add') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
      } else if (operation === 'subtract') {
        updateData[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(-amount);
      } else if (operation === 'set') {
        updateData[`resources.${resourceType}`] = amount;
      }
    }
    
    // Add timestamp to force update
    updateData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    updateData.updateId = Math.random().toString(36).substring(2, 15);
    
    await globalResourcesRef.update(updateData);
    
    showNotification(`${resourceType.toUpperCase()} ${operation.toUpperCase()}ED: ${amount}`);
  } catch (error) {
    console.error('Error modifying resources:', error);
    showNotification('ERROR MODIFYING RESOURCES');
  }
}

// DEPLOYMENT SYSTEM FUNCTIONS

// Generate random deployments
function generateRandomDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Show a modal to select how many deployments to generate
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'deployment-count-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">GENERATE DEPLOYMENTS</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="deployment-count">NUMBER OF DEPLOYMENTS:</label>
          <input type="number" id="deployment-count" value="5" min="1" max="10">
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button" id="generate-confirm">GENERATE</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#generate-confirm').addEventListener('click', async () => {
    const count = parseInt(document.getElementById('deployment-count').value);
    
    document.body.removeChild(modal);
    
    // Call the adminGenerateDeployments function from deployment-system.js
    try {
      const deployments = await adminGenerateDeployments(count);
      showNotification(`${deployments.length} DEPLOYMENTS GENERATED`);
    } catch (error) {
      console.error('Error generating deployments:', error);
      showNotification('ERROR GENERATING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  tabSound.play().catch(console.error);
}

// View all deployments
function viewAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Call the adminViewDeployments function from deployment-system.js
  adminViewDeployments();
}

// Clear all deployments
async function clearAllDeployments() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'clear-deployments-modal';
  
  const modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">CONFIRM DELETION</div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
        <div class="confirmation-message">
          Are you sure you want to delete ALL deployments?
        </div>
        <div class="confirmation-warning">
          This action cannot be undone. All active and available deployments will be permanently removed.
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">CANCEL</button>
        <button class="confirm-button delete-confirm" id="clear-confirm">DELETE ALL</button>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#clear-confirm').addEventListener('click', async () => {
    document.body.removeChild(modal);
    
    try {
      // Delete all deployments from Firestore
      // First, get available deployments
      const availableSnapshot = await db.collection('availableDeployments').get();
      const availableBatch = db.batch();
      
      availableSnapshot.forEach(doc => {
        availableBatch.delete(doc.ref);
      });
      
      // Then get active deployments
      const activeSnapshot = await db.collection('deployments').get();
      const activeBatch = db.batch();
      
      activeSnapshot.forEach(doc => {
        activeBatch.delete(doc.ref);
      });
      
      // Commit the batches
      await Promise.all([
        availableBatch.commit(),
        activeBatch.commit()
      ]);
      
      showNotification('ALL DEPLOYMENTS DELETED');
    } catch (error) {
      console.error('Error clearing deployments:', error);
      showNotification('ERROR CLEARING DEPLOYMENTS');
    }
  });
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Play sound
  errorSound.play().catch(console.error);
}

// Force complete an active deployment
async function forceCompleteDeployment() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get active deployments
    const deploymentsRef = db.collection('deployments');
    const snapshot = await deploymentsRef.get();
    
    if (snapshot.empty) {
      showNotification('NO ACTIVE DEPLOYMENTS FOUND');
      return;
    }
    
    // Create modal to select which deployment to complete
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'complete-deployment-modal';
    
    let modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">FORCE COMPLETE DEPLOYMENT</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="deployments-list">
    `;
    
    snapshot.forEach(doc => {
      const deployment = doc.data();
      const startTime = deployment.startTime?.toDate().toLocaleString() || 'Unknown';
      const endTime = deployment.endTime?.toDate().toLocaleString() || 'Unknown';
      
      modalContent += `
        <div class="deployment-item">
          <div class="deployment-header">
            <div class="deployment-name">${deployment.name || doc.id}</div>
            <div class="deployment-status">${deployment.status?.toUpperCase() || 'ACTIVE'}</div>
          </div>
          <div class="deployment-location">${deployment.location || 'Unknown location'}</div>
          <div class="deployment-team">TEAM: ${deployment.teamName || "Unknown"}</div>
          <div class="deployment-times">
            <div>START: ${startTime}</div>
            <div>END: ${endTime}</div>
          </div>
          <button class="complete-deployment-button" data-id="${doc.id}">FORCE COMPLETE</button>
        </div>
      `;
    });
    
    modalContent += `
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#clear-cache-confirm').addEventListener('click', async () => {
      // Clear Firebase cache
      try {
        // Try to clear Firestore cache
        await firebase.firestore().clearPersistence();
        
        // Show success notification
        showNotification('FIREBASE CACHE CLEARED SUCCESSFULLY');
        
        // Prompt for reload
        setTimeout(() => {
          const reloadConfirm = confirm('Firebase cache cleared. Reload the application?');
          if (reloadConfirm) {
            window.location.reload();
          }
        }, 1000);
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error clearing cache:', error);
        showNotification('ERROR CLEARING CACHE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    errorSound.play().catch(console.error);
  }
}

// Reload globe
function reloadGlobe() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'reload-globe-modal';
    
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">RELOAD GLOBE</div>
          <button class="modal-close">X</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-message">
            Are you sure you want to reload the globe?
          </div>
          <div class="confirmation-warning">
            This will clear all current markers and reload missions from the database.
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">CANCEL</button>
          <button class="confirm-button" id="reload-globe-confirm">RELOAD GLOBE</button>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-button').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#reload-globe-confirm').addEventListener('click', async () => {
      try {
        // Clear existing markers
        if (typeof clearMissionMarkers === 'function') {
          clearMissionMarkers();
        }
        
        // Reload missions
        if (typeof loadMissions === 'function') {
          const missions = await loadMissions();
          
          if (missions && Array.isArray(missions)) {
            missions.forEach(mission => {
              if (mission.coordinates && typeof addMissionMarker === 'function') {
                addMissionMarker(mission);
              }
            });
          }
        }
        
        // Reload active deployments if available
        if (typeof loadActiveDeployments === 'function') {
          await loadActiveDeployments();
        }
        
        showNotification('GLOBE RELOADED SUCCESSFULLY');
        
        // Close modal
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error reloading globe:', error);
        showNotification('ERROR RELOADING GLOBE', 'error');
      }
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error reloading globe:', error);
    showNotification('ERROR RELOADING GLOBE', 'error');
  }
}

// Toggle debug mode
function toggleDebugMode() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Check if debug mode is already enabled
    const isDebugMode = localStorage.getItem('debugMode') === 'true';
    
    if (isDebugMode) {
      // Disable debug mode
      localStorage.setItem('debugMode', 'false');
      showNotification('DEBUG MODE DISABLED');
      
      // Remove debug elements if they exist
      const debugPanel = document.getElementById('debug-panel');
      if (debugPanel) {
        document.body.removeChild(debugPanel);
      }
    } else {
      // Enable debug mode
      localStorage.setItem('debugMode', 'true');
      showNotification('DEBUG MODE ENABLED');
      
      // Create debug panel
      createDebugPanel();
    }
  } catch (error) {
    console.error('Error toggling debug mode:', error);
    showNotification('ERROR TOGGLING DEBUG MODE', 'error');
  }
}

// Create debug panel
function createDebugPanel() {
  // Check if panel already exists
  if (document.getElementById('debug-panel')) {
    return;
  }
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debug-panel';
  debugPanel.className = 'debug-panel';
  
  // Add content
  debugPanel.innerHTML = `
    <div class="debug-header">
      <div class="debug-title">DEBUG PANEL</div>
      <button class="debug-close">X</button>
    </div>
    <div class="debug-content">
      <div class="debug-section">
        <div class="debug-section-title">SYSTEM INFO</div>
        <div class="debug-info" id="debug-system-info">
          <div>USER: <span id="debug-user">${currentUser ? currentUser.uid : 'Not logged in'}</span></div>
          <div>ROLE: <span id="debug-role">${userRole || 'None'}</span></div>
          <div>VERSION: <span>1.0.0</span></div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">PERFORMANCE</div>
        <div class="debug-info" id="debug-performance">
          <div>FPS: <span id="debug-fps">0</span></div>
          <div>MEMORY: <span id="debug-memory">0</span> MB</div>
        </div>
      </div>
      <div class="debug-section">
        <div class="debug-section-title">EVENT LOG</div>
        <div class="debug-log" id="debug-event-log"></div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(debugPanel);
  
  // Add event listeners
  debugPanel.querySelector('.debug-close').addEventListener('click', () => {
    document.body.removeChild(debugPanel);
    localStorage.setItem('debugMode', 'false');
    showNotification('DEBUG MODE DISABLED');
  });
  
  // Start performance monitoring
  startPerformanceMonitoring();
  
  // Override console.log for debug panel
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    // Call original console.log
    originalConsoleLog.apply(console, args);
    
    // Add to debug panel
    const debugLog = document.getElementById('debug-event-log');
    if (debugLog) {
      const logItem = document.createElement('div');
      logItem.className = 'debug-log-item';
      logItem.textContent = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        } else {
          return String(arg);
        }
      }).join(' ');
      
      // Add timestamp
      const timestamp = new Date().toLocaleTimeString();
      logItem.innerHTML = `<span class="debug-timestamp">[${timestamp}]</span> ${logItem.textContent}`;
      
      // Add to log
      debugLog.appendChild(logItem);
      
      // Limit log items
      if (debugLog.children.length > 100) {
        debugLog.removeChild(debugLog.firstChild);
      }
      
      // Scroll to bottom
      debugLog.scrollTop = debugLog.scrollHeight;
    }
  };
}

// Start performance monitoring
function startPerformanceMonitoring() {
  // Variables for FPS calculation
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  // Function to update FPS
  function updateFPS() {
    // Increment frame count
    frameCount++;
    
    // Calculate FPS every second
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {
      fps = Math.round((frameCount * 1000) / elapsedTime);
      frameCount = 0;
      lastTime = currentTime;
      
      // Update FPS display
      const fpsElement = document.getElementById('debug-fps');
      if (fpsElement) {
        fpsElement.textContent = fps;
      }
      
      // Update memory usage if available
      if (window.performance && window.performance.memory) {
        const memoryElement = document.getElementById('debug-memory');
        if (memoryElement) {
          const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
          memoryElement.textContent = memoryUsage;
        }
      }
    }
    
    // Request next frame
    requestAnimationFrame(updateFPS);
  }
  
  // Start monitoring
  updateFPS();
}

// Log performance stats
function logPerformanceStats() {
  if (userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Performance metrics
    const metrics = {
      navigation: {},
      memory: {},
      timing: {},
      timeOrigin: performance.timeOrigin,
      now: performance.now(),
      resources: []
    };
    
    // Navigation timing data
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        metrics.navigation = navEntries[0];
      }
    }
    
    // Memory usage
    if (window.performance && window.performance.memory) {
      metrics.memory = {
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        usedJSHeapPercentage: (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    
    // Resource timing
    if (performance.getEntriesByType) {
      const resourceEntries = performance.getEntriesByType('resource');
      if (resourceEntries && resourceEntries.length > 0) {
        // Get top 10 slowest resources
        const sortedResources = [...resourceEntries].sort((a, b) => b.duration - a.duration).slice(0, 10);
        
        metrics.resources = sortedResources.map(resource => ({
          name: resource.name.split('/').pop(),
          duration: resource.duration.toFixed(2) + 'ms',
          size: resource.transferSize ? (resource.transferSize / 1024).toFixed(2) + 'KB' : 'Unknown'
        }));
      }
    }
    
    // Log to console
    console.group('PERFORMANCE METRICS');
    console.log('Time since page load:', (metrics.now / 1000).toFixed(2) + 's');
    
    console.group('Navigation Timing');
    if (metrics.navigation.domComplete) {
      console.log('DOM Complete:', metrics.navigation.domComplete.toFixed(2) + 'ms');
      console.log('DOM Interactive:', metrics.navigation.domInteractive.toFixed(2) + 'ms');
      console.log('Load Event:', metrics.navigation.loadEventEnd.toFixed(2) + 'ms');
    } else {
      console.log('Navigation timing not available');
    }
    console.groupEnd();
    
    console.group('Memory Usage');
    if (metrics.memory.usedJSHeapSize) {
      console.log('Used Heap:', (metrics.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Total Heap:', (metrics.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Heap Limit:', (metrics.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB');
      console.log('Used Percentage:', metrics.memory.usedJSHeapPercentage);
    } else {
      console.log('Memory metrics not available');
    }
    console.groupEnd();
    
    console.group('Slowest Resources (Top 10)');
    if (metrics.resources.length > 0) {
      metrics.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}: ${resource.duration} (${resource.size})`);
      });
    } else {
      console.log('Resource timing not available');
    }
    console.groupEnd();
    
    console.groupEnd();
    
    // Show notification
    showNotification('PERFORMANCE STATS LOGGED TO CONSOLE');
  } catch (error) {
    console.error('Error logging performance stats:', error);
    showNotification('ERROR LOGGING PERFORMANCE STATS', 'error');
  }
}


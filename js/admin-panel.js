// Admin Panel Functionality

// Initialize admin panel
function initializeAdminPanel() {
  // Make the panel draggable
  makeDraggable(document.getElementById('admin-controls'));
  
  // Set up resource input groups
  enhanceResourceInputs();
  
  // Set up deployment management section
  enhanceDeploymentManagement();
  
  // Add event listeners to resource buttons
  document.getElementById('add-money-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('money-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('money', amount);
    }
  });
  
  document.getElementById('add-fuel-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('fuel-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('fuel', amount);
    }
  });
  
  document.getElementById('add-ammo-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('ammo-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('ammo', amount);
    }
  });
  
  document.getElementById('add-medicine-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('medicine-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('medicine', amount);
    }
  });
  
  document.getElementById('add-food-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('food-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('food', amount);
    }
  });
  
  document.getElementById('add-materials-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('materials-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('materials', amount);
    }
  });
  
  document.getElementById('reset-resources-button')?.addEventListener('click', () => {
    resetUserResources();
  });
  
  document.getElementById('add-resources-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('test-resources-amount').value) || 200;
    addTestResources(amount);
  });
}

// Add a specific resource
async function addSpecificResource(resourceType, amount) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create the resource object based on type
    const resourceUpdate = {};
    
    if (resourceType === 'money') {
      resourceUpdate.money = amount;
    } else {
      resourceUpdate[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
    }
    
    // Get global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    // Add timestamp to force update detection
    resourceUpdate.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    resourceUpdate.updateId = Math.random().toString(36).substring(2, 15);
    
    // Apply updates
    await globalResourcesRef.update(resourceUpdate);
    
    showNotification(`ADDED ${amount} ${resourceType.toUpperCase()}`);
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error(`Error adding ${resourceType}:`, error);
    showNotification(`ERROR ADDING ${resourceType.toUpperCase()}`);
  }
}

// Add test resources with specified amount
async function addTestResources(amount = 200) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Resources to add
    const updates = {
      money: firebase.firestore.FieldValue.increment(amount * 250), // More money
      'resources.fuel': firebase.firestore.FieldValue.increment(amount),
      'resources.ammo': firebase.firestore.FieldValue.increment(amount),
      'resources.medicine': firebase.firestore.FieldValue.increment(amount),
      'resources.food': firebase.firestore.FieldValue.increment(amount),
      'resources.materials': firebase.firestore.FieldValue.increment(amount),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      updateId: Math.random().toString(36).substring(2, 15)
    };
    
    // Get global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    // Apply updates
    await globalResourcesRef.update(updates);
    
    showNotification(`ADDED ${amount} OF EACH RESOURCE`);
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error('Error adding test resources:', error);
    showNotification('ERROR ADDING TEST RESOURCES');
  }
}

// Initialize admin panel on document load
document.addEventListener('DOMContentLoaded', function() {
  initializeAdminPanel();
});

// Admin Panel Functionality

// Initialize admin panel
function initializeAdminPanel() {
  // Make the panel draggable
  makeDraggable(document.getElementById('admin-controls'));
  
  // Set up resource input groups
  enhanceResourceInputs();
  
  // Set up deployment management section
  enhanceDeploymentManagement();
  
  // Add event listeners to resource buttons
  document.getElementById('add-money-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('money-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('money', amount);
    }
  });
  
  document.getElementById('add-fuel-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('fuel-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('fuel', amount);
    }
  });
  
  document.getElementById('add-ammo-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('ammo-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('ammo', amount);
    }
  });
  
  document.getElementById('add-medicine-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('medicine-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('medicine', amount);
    }
  });
  
  document.getElementById('add-food-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('food-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('food', amount);
    }
  });
  
  document.getElementById('add-materials-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('materials-amount').value) || 0;
    if (amount > 0) {
      addSpecificResource('materials', amount);
    }
  });
  
  document.getElementById('reset-resources-button')?.addEventListener('click', () => {
    resetUserResources();
  });
  
  document.getElementById('add-resources-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('test-resources-amount').value) || 200;
    addTestResources(amount);
  });
}

// Add a specific resource
async function addSpecificResource(resourceType, amount) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Create the resource object based on type
    const resourceUpdate = {};
    
    if (resourceType === 'money') {
      resourceUpdate.money = amount;
    } else {
      resourceUpdate[`resources.${resourceType}`] = firebase.firestore.FieldValue.increment(amount);
    }
    
    // Get global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    // Add timestamp to force update detection
    resourceUpdate.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    resourceUpdate.updateId = Math.random().toString(36).substring(2, 15);
    
    // Apply updates
    await globalResourcesRef.update(resourceUpdate);
    
    showNotification(`ADDED ${amount} ${resourceType.toUpperCase()}`);
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error(`Error adding ${resourceType}:`, error);
    showNotification(`ERROR ADDING ${resourceType.toUpperCase()}`);
  }
}

// Add test resources with specified amount
async function addTestResources(amount = 200) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return;
  }
  
  try {
    // Resources to add
    const updates = {
      money: firebase.firestore.FieldValue.increment(amount * 250), // More money
      'resources.fuel': firebase.firestore.FieldValue.increment(amount),
      'resources.ammo': firebase.firestore.FieldValue.increment(amount),
      'resources.medicine': firebase.firestore.FieldValue.increment(amount),
      'resources.food': firebase.firestore.FieldValue.increment(amount),
      'resources.materials': firebase.firestore.FieldValue.increment(amount),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      updateId: Math.random().toString(36).substring(2, 15)
    };
    
    // Get global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    // Apply updates
    await globalResourcesRef.update(updates);
    
    showNotification(`ADDED ${amount} OF EACH RESOURCE`);
    
    // Update display
    updateResourceDisplay();
  } catch (error) {
    console.error('Error adding test resources:', error);
    showNotification('ERROR ADDING TEST RESOURCES');
  }
}

// Initialize admin panel on document load
document.addEventListener('DOMContentLoaded', function() {
  initializeAdminPanel();
});


// Add input fields for resource amounts
function enhanceResourceInputs() {
  // Create input groups for each resource type
  const resourceTypes = ['money', 'fuel', 'ammo', 'medicine', 'food', 'materials'];
  const adminContent = document.querySelector('.admin-content');
  
  if (!adminContent) return;
  
  // Remove old resource buttons section if it exists
  const oldSection = document.querySelector('.admin-section-title.resources')?.closest('.admin-section');
  if (oldSection) {
    oldSection.remove();
  }
  
  // Create new resource section with input fields
  const resourceSection = document.createElement('div');
  resourceSection.className = 'admin-section';
  
  let sectionHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
  `;
  
  // Add input group for each resource type
  resourceTypes.forEach(type => {
    // Add default values for input fields
    const defaultValue = type === 'money' ? 10000 : 100;
    
    sectionHTML += `
      <div class="resource-input-group">
        <button id="add-${type}-button" class="resource-button">ADD ${type.toUpperCase()}</button>
        <input type="number" id="${type}-amount" placeholder="Amount" min="0" value="${defaultValue}">
      </div>
    `;
  });
  
  // Add reset and test resources buttons
  sectionHTML += `
    <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
    <div class="resource-input-group">
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <input type="number" id="test-resources-amount" placeholder="Amount" min="0" value="200">
    </div>
  `;
  
  resourceSection.innerHTML = sectionHTML;
  adminContent.appendChild(resourceSection);
  
  // Add event listeners for resource buttons
  resourceTypes.forEach(type => {
    document.getElementById(`add-${type}-button`)?.addEventListener('click', () => {
      const amount = parseInt(document.getElementById(`${type}-amount`).value) || 0;
      if (amount > 0) {
        addSpecificResource(type, amount);
      }
    });
  });
  
  // Add event listeners for reset and test resources buttons
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('test-resources-amount').value) || 200;
    addTestResources(amount);
  });
}

// Call the function to enhance resource inputs
document.addEventListener('DOMContentLoaded', function() {
  initializeAdminPanel();
  enhanceResourceInputs();
});

// Add input fields for resource amounts
function enhanceResourceInputs() {
  // Create input groups for each resource type
  const resourceTypes = ['money', 'fuel', 'ammo', 'medicine', 'food', 'materials'];
  const adminContent = document.querySelector('.admin-content');
  
  if (!adminContent) return;
  
  // Remove old resource buttons section if it exists
  const oldSection = document.querySelector('.admin-section-title.resources')?.closest('.admin-section');
  if (oldSection) {
    oldSection.remove();
  }
  
  // Create new resource section with input fields
  const resourceSection = document.createElement('div');
  resourceSection.className = 'admin-section';
  
  let sectionHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
  `;
  
  // Add input group for each resource type
  resourceTypes.forEach(type => {
    // Add default values for input fields
    const defaultValue = type === 'money' ? 10000 : 100;
    
    sectionHTML += `
      <div class="resource-input-group">
        <button id="add-${type}-button" class="resource-button">ADD ${type.toUpperCase()}</button>
        <input type="number" id="${type}-amount" placeholder="Amount" min="0" value="${defaultValue}">
      </div>
    `;
  });
  
  // Add reset and test resources buttons
  sectionHTML += `
    <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
    <div class="resource-input-group">
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
      <input type="number" id="test-resources-amount" placeholder="Amount" min="0" value="200">
    </div>
  `;
  
  resourceSection.innerHTML = sectionHTML;
  adminContent.appendChild(resourceSection);
  
  // Add event listeners for resource buttons
  resourceTypes.forEach(type => {
    document.getElementById(`add-${type}-button`)?.addEventListener('click', () => {
      const amount = parseInt(document.getElementById(`${type}-amount`).value) || 0;
      if (amount > 0) {
        addSpecificResource(type, amount);
      }
    });
  });
  
  // Add event listeners for reset and test resources buttons
  document.getElementById('reset-resources-button')?.addEventListener('click', resetUserResources);
  document.getElementById('add-resources-button')?.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('test-resources-amount').value) || 200;
    addTestResources(amount);
  });
}

// Call the function to enhance resource inputs
document.addEventListener('DOMContentLoaded', function() {
  initializeAdminPanel();
  enhanceResourceInputs();
});

// Enhance deployment management section
function enhanceDeploymentManagement() {
  const adminContent = document.querySelector('.admin-content');
  if (!adminContent) return;
  
  // Remove old deployment section if it exists
  const oldSection = document.querySelector('.admin-section-title')?.closest('.admin-section');
  if (oldSection && oldSection.querySelector('.admin-section-title')?.textContent === 'DEPLOYMENT MANAGEMENT') {
    oldSection.remove();
  }
  
  // Create new deployment section with enhanced styling
  const deploymentSection = document.createElement('div');
  deploymentSection.className = 'admin-section';
  
  let sectionHTML = `
    <div class="admin-section-title" style="color: #64B5F6 !important; font-weight: bold; 
         text-shadow: 0 0 5px rgba(100, 181, 246, 0.5); border-bottom: 2px solid #64B5F6 !important; 
         padding-bottom: 8px; margin-bottom: 12px;">DEPLOYMENT MANAGEMENT</div>
    <div class="deployment-buttons-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
  `;
  
  // Resource deployment buttons
  const resources = [
    { type: 'money', color: '#FFD700', icon: '💰' },
    { type: 'fuel', color: '#FF5722', icon: '⛽' },
    { type: 'ammo', color: '#F44336', icon: '🔫' },
    { type: 'medicine', color: '#4CAF50', icon: '🏥' },
    { type: 'food', color: '#8BC34A', icon: '🍗' },
    { type: 'materials', color: '#795548', icon: '🧱' }
  ];
  
  resources.forEach(resource => {
    sectionHTML += `
      <button id="generate-${resource.type}-deployment" 
              style="background: rgba(0, 40, 30, 0.8) !important; 
                     color: ${resource.color} !important; 
                     border: 1px solid ${resource.color} !important; 
                     text-align: left !important;
                     display: flex !important;
                     align-items: center !important;
                     gap: 8px !important;
                     padding: 10px 15px !important;
                     transition: all 0.3s ease !important;
                     margin-bottom: 5px !important;">
        <span style="font-size: 16px;">${resource.icon}</span>
        <span>GENERATE ${resource.type.toUpperCase()} DEPLOYMENT</span>
      </button>
    `;
  });
  
  // Add view deployments button
  sectionHTML += `
      <button id="view-active-deployments" 
              style="background: rgba(0, 40, 30, 0.8) !important; 
                     color: #64B5F6 !important; 
                     border: 1px solid #64B5F6 !important; 
                     text-align: left !important;
                     display: flex !important;
                     align-items: center !important;
                     gap: 8px !important;
                     padding: 10px 15px !important;
                     grid-column: span 2;
                     transition: all 0.3s ease !important;
                     margin-top: 5px !important;">
        <span style="font-size: 16px;">📊</span>
        <span>VIEW ACTIVE DEPLOYMENTS</span>
      </button>
    </div>
  `;
  
  deploymentSection.innerHTML = sectionHTML;
  
  // Add to admin panel - before resource section if it exists
  const resourceSection = document.querySelector('.admin-section-title.resources')?.closest('.admin-section');
  if (resourceSection) {
    adminContent.insertBefore(deploymentSection, resourceSection);
  } else {
    adminContent.appendChild(deploymentSection);
  }
  
  // Add CSS for button hover effects
  const style = document.createElement('style');
  style.textContent = `
    #admin-controls button[id^="generate-"] {
      position: relative;
      overflow: hidden;
    }
    
    #admin-controls button[id^="generate-"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 0 15px rgba(100, 181, 246, 0.5) !important;
    }
    
    #admin-controls button[id^="generate-"]:after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: 0.5s;
    }
    
    #admin-controls button[id^="generate-"]:hover:after {
      left: 100%;
    }
    
    #view-active-deployments:hover {
      background: rgba(100, 181, 246, 0.2) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 0 15px rgba(100, 181, 246, 0.5) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add click event listeners
  resources.forEach(resource => {
    document.getElementById(`generate-${resource.type}-deployment`)?.addEventListener('click', () => {
      adminGenerateResourceDeployment(resource.type);
    });
  });
  
  document.getElementById('view-active-deployments')?.addEventListener('click', () => {
    viewActiveDeployments();
  });
}

// Enhance deployment management section
function enhanceDeploymentManagement() {
  const adminContent = document.querySelector('.admin-content');
  if (!adminContent) return;
  
  // Remove old deployment section if it exists
  const oldSection = document.querySelector('.admin-section-title')?.closest('.admin-section');
  if (oldSection && oldSection.querySelector('.admin-section-title')?.textContent === 'DEPLOYMENT MANAGEMENT') {
    oldSection.remove();
  }
  
  // Create new deployment section with enhanced styling
  const deploymentSection = document.createElement('div');
  deploymentSection.className = 'admin-section';
  
  let sectionHTML = `
    <div class="admin-section-title" style="color: #64B5F6 !important; font-weight: bold; 
         text-shadow: 0 0 5px rgba(100, 181, 246, 0.5); border-bottom: 2px solid #64B5F6 !important; 
         padding-bottom: 8px; margin-bottom: 12px;">DEPLOYMENT MANAGEMENT</div>
    <div class="deployment-buttons-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
  `;
  
  // Resource deployment buttons
  const resources = [
    { type: 'money', color: '#FFD700', icon: '💰' },
    { type: 'fuel', color: '#FF5722', icon: '⛽' },
    { type: 'ammo', color: '#F44336', icon: '🔫' },
    { type: 'medicine', color: '#4CAF50', icon: '🏥' },
    { type: 'food', color: '#8BC34A', icon: '🍗' },
    { type: 'materials', color: '#795548', icon: '🧱' }
  ];
  
  resources.forEach(resource => {
    sectionHTML += `
      <button id="generate-${resource.type}-deployment" 
              style="background: rgba(0, 40, 30, 0.8) !important; 
                     color: ${resource.color} !important; 
                     border: 1px solid ${resource.color} !important; 
                     text-align: left !important;
                     display: flex !important;
                     align-items: center !important;
                     gap: 8px !important;
                     padding: 10px 15px !important;
                     transition: all 0.3s ease !important;
                     margin-bottom: 5px !important;">
        <span style="font-size: 16px;">${resource.icon}</span>
        <span>GENERATE ${resource.type.toUpperCase()} DEPLOYMENT</span>
      </button>
    `;
  });
  
  // Add view deployments button
  sectionHTML += `
      <button id="view-active-deployments" 
              style="background: rgba(0, 40, 30, 0.8) !important; 
                     color: #64B5F6 !important; 
                     border: 1px solid #64B5F6 !important; 
                     text-align: left !important;
                     display: flex !important;
                     align-items: center !important;
                     gap: 8px !important;
                     padding: 10px 15px !important;
                     grid-column: span 2;
                     transition: all 0.3s ease !important;
                     margin-top: 5px !important;">
        <span style="font-size: 16px;">📊</span>
        <span>VIEW ACTIVE DEPLOYMENTS</span>
      </button>
    </div>
  `;
  
  deploymentSection.innerHTML = sectionHTML;
  
  // Add to admin panel - before resource section if it exists
  const resourceSection = document.querySelector('.admin-section-title.resources')?.closest('.admin-section');
  if (resourceSection) {
    adminContent.insertBefore(deploymentSection, resourceSection);
  } else {
    adminContent.appendChild(deploymentSection);
  }
  
  // Add CSS for button hover effects
  const style = document.createElement('style');
  style.textContent = `
    #admin-controls button[id^="generate-"] {
      position: relative;
      overflow: hidden;
    }
    
    #admin-controls button[id^="generate-"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 0 15px rgba(100, 181, 246, 0.5) !important;
    }
    
    #admin-controls button[id^="generate-"]:after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: 0.5s;
    }
    
    #admin-controls button[id^="generate-"]:hover:after {
      left: 100%;
    }
    
    #view-active-deployments:hover {
      background: rgba(100, 181, 246, 0.2) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 0 15px rgba(100, 181, 246, 0.5) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add click event listeners
  resources.forEach(resource => {
    document.getElementById(`generate-${resource.type}-deployment`)?.addEventListener('click', () => {
      adminGenerateResourceDeployment(resource.type);
    });
  });
  
  document.getElementById('view-active-deployments')?.addEventListener('click', () => {
    viewActiveDeployments();
  });
}

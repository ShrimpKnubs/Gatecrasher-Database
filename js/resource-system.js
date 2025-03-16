// Resource Management System

// Resource types and their display names
const resourceTypes = {
  money: 'Money',
  fuel: 'Fuel',
  ammo: 'Ammunition',
  medicine: 'Medical Supplies',
  food: 'Food',
  materials: 'Construction Materials'
};

// Default resource values
const defaultResources = {
  money: 100000,
  resources: {
    fuel: 500,
    ammo: 500,
    medicine: 500,
    food: 500,
    materials: 500
  }
};

// Initialize resource management
function initializeResourceManagement() {
  // Get user resources initially
  updateResourceDisplay();
  
  // Add shop button listener
  const shopButton = document.getElementById('shop-button');
  if (shopButton) {
    shopButton.addEventListener('click', openShop);
  }
  
  // Set up interval to update resources display every minute
  setInterval(updateResourceDisplay, 60000);
}

// Update resource display with current values - Firebase Integration
async function updateResourceDisplay() {
  try {
    let userData;
    
    if (currentUser) {
      // For authenticated users, get data from Firebase
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      
      if (userDoc.exists) {
        userData = userDoc.data();
      } else {
        // If user document doesn't exist, create it with defaults
        userData = defaultResources;
        await db.collection('users').doc(currentUser.uid).set({
          ...userData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } else {
      // For guests, use default values
      userData = defaultResources;
    }
    
    // Update the enhanced sci-fi resource monitor
    updateResourceMonitor(userData);
    
    // Update squad panel resource display
    const resourceDisplay = document.getElementById('resource-display');
    if (resourceDisplay) {
      resourceDisplay.innerHTML = '';
      
      // Add money display
      const moneyItem = document.createElement('div');
      moneyItem.className = 'resource-item';
      moneyItem.innerHTML = `
        <div class="resource-name">MONEY:</div>
        <div class="resource-value">$${userData.money.toLocaleString()}</div>
      `;
      resourceDisplay.appendChild(moneyItem);
      
      // Add other resources
      if (userData.resources) {
        for (const [resource, amount] of Object.entries(userData.resources)) {
          const resourceItem = document.createElement('div');
          resourceItem.className = 'resource-item';
          resourceItem.innerHTML = `
            <div class="resource-name">${resource.toUpperCase()}:</div>
            <div class="resource-value">${amount}</div>
          `;
          resourceDisplay.appendChild(resourceItem);
        }
      }
    }
    
    // Also update the base resources display if it exists
    updateBaseResourceDisplay(userData);
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Update the enhanced sci-fi resource monitor
function updateResourceMonitor(userData) {
  const resourceMonitorContent = document.getElementById('resource-monitor-content');
  if (!resourceMonitorContent) return;
  
  // Clear existing content
  resourceMonitorContent.innerHTML = '';
  
  // Add money with animated styling
  const moneyItem = document.createElement('div');
  moneyItem.className = 'resource-monitor-item';
  moneyItem.innerHTML = `
    <div class="resource-monitor-label">MONEY</div>
    <div class="resource-monitor-value money-value">${userData.money.toLocaleString()}</div>
  `;
  resourceMonitorContent.appendChild(moneyItem);
  
  // Add money progress bar with special styling
  const moneyBar = document.createElement('div');
  moneyBar.className = 'resource-bar money-bar';
  const moneyPercentage = Math.min(100, (userData.money / 1000000) * 100); // Max at 1 million
  moneyBar.innerHTML = `<div class="resource-fill" style="width: ${moneyPercentage}%"></div>`;
  resourceMonitorContent.appendChild(moneyBar);
  
  // Add other resources in a consistent, fixed order
  if (userData.resources) {
    // Define the order we want to display resources in
    const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
    
    // Process resources in our defined order
    resourceOrder.forEach(resource => {
      // Skip if this resource doesn't exist in userData
      if (!userData.resources.hasOwnProperty(resource)) return;
      
      const amount = userData.resources[resource];
      const resourceItem = document.createElement('div');
      resourceItem.className = 'resource-monitor-item';
      resourceItem.innerHTML = `
        <div class="resource-monitor-label">${resource.toUpperCase()}</div>
        <div class="resource-monitor-value">${amount}</div>
      `;
      resourceMonitorContent.appendChild(resourceItem);
      
      // Add resource progress bar
      const resourceBar = document.createElement('div');
      resourceBar.className = 'resource-bar';
      const percentage = Math.min(100, (amount / 1000) * 100); // Max at 1000
      resourceBar.innerHTML = `<div class="resource-fill" style="width: ${percentage}%"></div>`;
      resourceMonitorContent.appendChild(resourceBar);
    });
  }
}

// Update base resource display in the BASE tab
function updateBaseResourceDisplay(userData) {
  const baseResourcesDisplay = document.getElementById('base-resources');
  if (!baseResourcesDisplay) return;
  
  baseResourcesDisplay.innerHTML = '';
  
  // Add money display
  const moneyDisplay = document.createElement('div');
  moneyDisplay.className = 'resource-item';
  moneyDisplay.innerHTML = `
    <div class="resource-name">MONEY:</div>
    <div class="resource-value">${userData.money.toLocaleString()}</div>
  `;
  baseResourcesDisplay.appendChild(moneyDisplay);
  
  // Add other resources in a consistent, fixed order
  if (userData.resources) {
    // Define the order we want to display resources in
    const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
    
    // Process resources in our defined order
    resourceOrder.forEach(resource => {
      // Skip if this resource doesn't exist in userData
      if (!userData.resources.hasOwnProperty(resource)) return;
      
      const amount = userData.resources[resource];
      const resourceItem = document.createElement('div');
      resourceItem.className = 'resource-item';
      resourceItem.innerHTML = `
        <div class="resource-name">${resource.toUpperCase()}:</div>
        <div class="resource-value">${amount}</div>
      `;
      baseResourcesDisplay.appendChild(resourceItem);
    });
  }
}

// Add resources to user - Firebase Integration - FIXED
// ENHANCED for reliable real-time updates with DOM preservation
async function addResources(userId, resources) {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    // Get the global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const globalDoc = await globalResourcesRef.get();
    
    if (!globalDoc.exists) {
      // Initialize global resources if they don't exist
      await initializeGlobalResources();
    }
    
    // Create updates object
    const updates = {};
    
    // Process money if provided
    if (resources.money) {
      updates.money = firebase.firestore.FieldValue.increment(resources.money);
    }
    
    // Process other resources
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'money' && amount) {
        updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(amount);
      }
    }
    
    // Add timestamp and random value to force update detection
    updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    updates.updateId = Math.random().toString(36).substring(2, 15);
    
    // Apply updates to global resources
    await globalResourcesRef.update(updates);
    
    console.log("Added resources to global pool:", resources);
    
    // Force a UI refresh just to be sure, but use the new DOM-preserving approach
    setTimeout(() => {
      globalResourcesRef.get().then(doc => {
        if (doc.exists) {
          const sharedData = doc.data();
          updateResourceMonitor(sharedData);
          updateBaseResourceDisplay(sharedData); // Will now preserve DOM structure
        }
      });
    }, 300); // Reduced timeout for faster update
    
    return { success: true };
  } catch (error) {
    console.error('Error adding global resources:', error);
    return { success: false, error: error.message };
  }
}

// Subtract resources - MODIFIED to use global resources
async function subtractResources(userId, resources) {
  try {
    // Get the global resources
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const globalDoc = await globalResourcesRef.get();
    
    if (!globalDoc.exists) {
      await initializeGlobalResources();
      return { success: false, error: 'Global resources not initialized' };
    }
    
    const globalData = globalDoc.data();
    
    // Check if there are enough resources
    if (resources.money && globalData.money < resources.money) {
      showNotification('INSUFFICIENT FUNDS');
      return { success: false, error: 'Not enough money' };
    }
    
    // Check other resources
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'money' && amount) {
        if (!globalData.resources || 
            !globalData.resources[resource] || 
            globalData.resources[resource] < amount) {
          showNotification(`INSUFFICIENT ${resource.toUpperCase()}`);
          return { success: false, error: `Not enough ${resource}` };
        }
      }
    }
    
    // Create updates object
    const updates = {};
    
    // Process money if provided
    if (resources.money) {
      updates.money = firebase.firestore.FieldValue.increment(-resources.money);
    }
    
    // Process other resources
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'money' && amount) {
        updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(-amount);
      }
    }
    
    // Add timestamp
    updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    
    // Apply updates to global resources
    await globalResourcesRef.update(updates);
    
    console.log("Subtracted resources from global pool:", resources);
    
    return { success: true };
  } catch (error) {
    console.error('Error subtracting global resources:', error);
    return { success: false, error: error.message };
  }
}

// Check if user has enough resources - Firebase Integration
async function checkResources(userId, resources) {
  if (!userId) return false;
  
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data();
    
    // Check money
    if (resources.money && userData.money < resources.money) {
      return false;
    }
    
    // Check other resources
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'money' && amount) {
        if (!userData.resources || !userData.resources[resource] || userData.resources[resource] < amount) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking resources:', error);
    return false;
  }
}

// Reset resources to default - Admin Function - MODIFIED to use global resources
async function resetUserResources(userId = null) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    // Reset the global resources document
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    await globalResourcesRef.set({
      money: defaultResources.money,
      resources: defaultResources.resources,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      notifyUpdates: true
    });
    
    showNotification('RESOURCES RESET TO DEFAULT VALUES');
    
    return { success: true };
  } catch (error) {
    console.error('Error resetting global resources:', error);
    showNotification('ERROR RESETTING RESOURCES');
    return { success: false, error: error.message };
  }
}

// Add test resources - Admin Function - MODIFIED to use global resources
async function addTestResources(userId = null) {
  if (!currentUser || userRole !== 'admin') {
    showNotification('UNAUTHORIZED: ADMIN ACCESS REQUIRED');
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    // Resources to add
    const testResources = {
      money: 50000,
      resources: {
        fuel: 200,
        ammo: 200,
        medicine: 200,
        food: 200,
        materials: 200
      }
    };
    
    // Get global resources reference
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    
    // Create updates
    const updates = {
      money: firebase.firestore.FieldValue.increment(testResources.money),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      notifyUpdates: true
    };
    
    // Add resource updates
    for (const [resource, amount] of Object.entries(testResources.resources)) {
      updates[`resources.${resource}`] = firebase.firestore.FieldValue.increment(amount);
    }
    
    // Apply updates
    await globalResourcesRef.update(updates);
    
    showNotification('TEST RESOURCES ADDED');
    console.log("Added test resources to global pool");
    
    return { success: true };
  } catch (error) {
    console.error('Error adding test resources:', error);
    showNotification('ERROR ADDING TEST RESOURCES');
    return { success: false, error: error.message };
  }
}

// Equipment and Weapons Shop
async function openShop() {
  if (userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Get R&D team level to determine available weapons
    const rndTeamRef = db.collection('teams').doc(`${currentUser.uid}_rnd`);
    const rndTeamDoc = await rndTeamRef.get();
    
    let unlockedTiers = ['tier1']; // Default to tier 1 only
    
    if (rndTeamDoc.exists) {
      const rndTeam = rndTeamDoc.data();
      unlockedTiers = rndTeam.unlockedWeapons || ['tier1'];
    }
    
    // Define shop items based on unlocked weapon tiers
    const shopItems = getShopItemsByTier(unlockedTiers);
    
    // Create shop modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'shop-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">EQUIPMENT SHOP</div>
      <button class="modal-close">X</button>
    `;
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    // Add R&D team level info
    body.innerHTML = `
      <div class="shop-info">
        <div class="shop-tier">R&D LEVEL: ${rndTeamDoc.exists ? rndTeamDoc.data().level : 1}</div>
        <div class="shop-tier">UNLOCKED TIERS: ${unlockedTiers.map(tier => tier.replace('tier', '')).join(', ')}</div>
      </div>
    `;
    
    // Group items by category
    const categories = {};
    
    shopItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    // Create category sections
    for (const [category, items] of Object.entries(categories)) {
      const categorySection = document.createElement('div');
      categorySection.className = 'shop-category';
      categorySection.innerHTML = `
        <div class="shop-category-title">${category.toUpperCase()}</div>
      `;
      
      // Create items grid
      const itemsGrid = document.createElement('div');
      itemsGrid.className = 'shop-items-grid';
      
      // Add items
      items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        
        // Format resource costs
        let costHTML = '';
        for (const [resource, amount] of Object.entries(item.cost)) {
          if (resource === 'money') {
            costHTML += `<div>$${amount.toLocaleString()}</div>`;
          } else {
            costHTML += `<div>${resource.toUpperCase()}: ${amount}</div>`;
          }
        }
        
        itemElement.innerHTML = `
          <div class="shop-item-header">
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-tier">TIER ${item.tier}</div>
          </div>
          <div class="shop-item-description">${item.description}</div>
          <div class="shop-item-stats">
            ${item.stats ? Object.entries(item.stats).map(([stat, value]) => 
              `<div><span>${stat.toUpperCase()}:</span> ${value}</div>`
            ).join('') : ''}
          </div>
          <div class="shop-item-cost">
            ${costHTML}
          </div>
          <button class="shop-item-buy" data-item-id="${item.id}">PURCHASE</button>
        `;
        
        itemsGrid.appendChild(itemElement);
      });
      
      categorySection.appendChild(itemsGrid);
      body.appendChild(categorySection);
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
    
    // Add buy button listeners
    const buyButtons = modal.querySelectorAll('.shop-item-buy');
    buyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-item-id');
        purchaseItem(itemId, shopItems);
      });
    });
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Play tab sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error opening shop:', error);
    showNotification('ERROR OPENING SHOP');
  }
}

// Get shop items based on unlocked tiers
function getShopItemsByTier(unlockedTiers) {
  // Define all shop items
  const allItems = [
    // Tier 1 Weapons
    {
      id: 'assault_rifle_t1',
      name: 'BASIC ASSAULT RIFLE',
      description: 'Standard-issue assault rifle with moderate accuracy and rate of fire.',
      category: 'Weapons',
      tier: 1,
      stats: {
        damage: 25,
        accuracy: 70,
        range: 'Medium'
      },
      cost: {
        money: 5000,
        materials: 50,
        ammo: 100
      }
    },
    {
      id: 'sniper_rifle_t1',
      name: 'STANDARD SNIPER RIFLE',
      description: 'Long-range rifle with high accuracy but slow rate of fire.',
      category: 'Weapons',
      tier: 1,
      stats: {
        damage: 85,
        accuracy: 90,
        range: 'Long'
      },
      cost: {
        money: 8000,
        materials: 80,
        ammo: 50
      }
    },
    {
      id: 'shotgun_t1',
      name: 'TACTICAL SHOTGUN',
      description: 'Close-quarters weapon with high stopping power but limited range.',
      category: 'Weapons',
      tier: 1,
      stats: {
        damage: 90,
        accuracy: 45,
        range: 'Short'
      },
      cost: {
        money: 4000,
        materials: 60,
        ammo: 80
      }
    },
    
    // Tier 2 Weapons
    {
      id: 'assault_rifle_t2',
      name: 'ADVANCED ASSAULT RIFLE',
      description: 'Enhanced assault rifle with improved accuracy and reduced recoil.',
      category: 'Weapons',
      tier: 2,
      stats: {
        damage: 30,
        accuracy: 80,
        range: 'Medium-Long'
      },
      cost: {
        money: 12000,
        materials: 120,
        ammo: 200
      }
    },
    {
      id: 'sniper_rifle_t2',
      name: 'PRECISION SNIPER RIFLE',
      description: 'Advanced sniper system with enhanced optics and stability.',
      category: 'Weapons',
      tier: 2,
      stats: {
        damage: 100,
        accuracy: 95,
        range: 'Extreme'
      },
      cost: {
        money: 18000,
        materials: 150,
        ammo: 100
      }
    },
    
    // Tier 3 Weapons
    {
      id: 'assault_rifle_t3',
      name: 'PROTOTYPE ASSAULT SYSTEM',
      description: 'Cutting-edge assault platform with integrated targeting and modular capabilities.',
      category: 'Weapons',
      tier: 3,
      stats: {
        damage: 40,
        accuracy: 90,
        range: 'All Ranges'
      },
      cost: {
        money: 25000,
        materials: 250,
        ammo: 300
      }
    },
    
    // Equipment - Tier 1
    {
      id: 'body_armor_t1',
      name: 'STANDARD BODY ARMOR',
      description: 'Basic protection against small arms fire.',
      category: 'Equipment',
      tier: 1,
      stats: {
        protection: 40,
        weight: 'Medium',
        durability: 'Standard'
      },
      cost: {
        money: 3000,
        materials: 100
      }
    },
    {
      id: 'medkit_t1',
      name: 'FIELD MEDKIT',
      description: 'Basic medical supplies for treating injuries in the field.',
      category: 'Equipment',
      tier: 1,
      stats: {
        healing: 50,
        uses: 3
      },
      cost: {
        money: 2000,
        medicine: 50
      }
    },
    
    // Equipment - Tier 2
    {
      id: 'body_armor_t2',
      name: 'ADVANCED BODY ARMOR',
      description: 'Enhanced protection with reduced weight and improved mobility.',
      category: 'Equipment',
      tier: 2,
      stats: {
        protection: 65,
        weight: 'Light',
        durability: 'Enhanced'
      },
      cost: {
        money: 8000,
        materials: 200
      }
    },
    {
      id: 'night_vision_t2',
      name: 'NIGHT VISION GOGGLES',
      description: 'Allows effective operation in low-light conditions.',
      category: 'Equipment',
      tier: 2,
      stats: {
        visibility: 'Dark environments',
        battery: '8 hours'
      },
      cost: {
        money: 15000,
        materials: 150,
        fuel: 100
      }
    },
    
    // Equipment - Tier 3
    {
      id: 'body_armor_t3',
      name: 'PROTOTYPE COMBAT SUIT',
      description: 'Cutting-edge full-body protection with integrated systems.',
      category: 'Equipment',
      tier: 3,
      stats: {
        protection: 90,
        weight: 'Ultra-Light',
        durability: 'Superior',
        features: 'Environmental protection, Stealth capabilities'
      },
      cost: {
        money: 30000,
        materials: 400,
        fuel: 200
      }
    }
  ];
  
  // Filter items based on unlocked tiers
  const tierNumbers = unlockedTiers.map(tier => parseInt(tier.replace('tier', '')));
  const maxTier = Math.max(...tierNumbers);
  
  return allItems.filter(item => item.tier <= maxTier);
}

// Purchase an item from the shop
async function purchaseItem(itemId, items) {
  if (!currentUser || userRole !== 'squadLead') {
    showNotification('UNAUTHORIZED: SQUAD LEADER ACCESS REQUIRED');
    return;
  }
  
  try {
    // Find the item
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
      showNotification('ITEM NOT FOUND');
      return;
    }
    
    // Check if user has enough resources
    const hasResources = await checkResources(currentUser.uid, item.cost);
    
    if (!hasResources) {
      showNotification('INSUFFICIENT RESOURCES FOR PURCHASE');
      return;
    }
    
    // Create confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal';
    confirmModal.id = 'confirm-purchase-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <div class="modal-title">CONFIRM PURCHASE</div>
      <button class="modal-close">X</button>
    `;
    
    // Format resource costs
    let costHTML = '<ul>';
    for (const [resource, amount] of Object.entries(item.cost)) {
      if (resource === 'money') {
        costHTML += `<li>$${amount.toLocaleString()}</li>`;
      } else {
        costHTML += `<li>${resource.toUpperCase()}: ${amount}</li>`;
      }
    }
    costHTML += '</ul>';
    
    // Create body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = `
      <div class="confirmation-message">
        You are about to purchase ${item.name}.
      </div>
      <div class="confirmation-details">
        <div class="item-cost">
          <div class="cost-header">COST:</div>
          ${costHTML}
        </div>
      </div>
      <div class="confirmation-warning">
        This action will deduct the resources from your inventory.
      </div>
    `;
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = `
      <button class="cancel-button">CANCEL</button>
      <button class="confirm-button">CONFIRM PURCHASE</button>
    `;
    
    // Add elements to modal
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);
    confirmModal.appendChild(modalContent);
    
    // Add modal to page
    document.body.appendChild(confirmModal);
    
    // Add event listeners
    const closeButton = confirmModal.querySelector('.modal-close');
    const cancelButton = confirmModal.querySelector('.cancel-button');
    const confirmButton = confirmModal.querySelector('.confirm-button');
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(confirmModal);
    });
    
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(confirmModal);
    });
    
    confirmButton.addEventListener('click', async () => {
      // Deduct resources
      const result = await subtractResources(currentUser.uid, item.cost);
      
      if (result.success) {
        // Add item to inventory
        await addToInventory(item);
        
        showNotification(`PURCHASE SUCCESSFUL: ${item.name}`);
      } else {
        showNotification(`PURCHASE FAILED: ${result.error}`);
      }
      
      // Close modal
      document.body.removeChild(confirmModal);
    });
    
    // Show modal
    setTimeout(() => {
      confirmModal.classList.add('active');
    }, 10);
    
    // Play tab sound
    tabSound.play().catch(console.error);
  } catch (error) {
    console.error('Error purchasing item:', error);
    showNotification('ERROR PROCESSING PURCHASE');
  }
}

// Add purchased item to inventory
async function addToInventory(item) {
  try {
    // Get or create inventory
    const inventoryRef = db.collection('inventory').doc(currentUser.uid);
    const inventoryDoc = await inventoryRef.get();
    
    if (!inventoryDoc.exists) {
      // Create new inventory
      await inventoryRef.set({
        userId: currentUser.uid,
        weapons: [],
        equipment: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Add item to appropriate category
    const category = item.category.toLowerCase();
    const categoryKey = category === 'weapons' ? 'weapons' : 'equipment';
    
    // Add item with ID, name, and tier
    await inventoryRef.update({
      [categoryKey]: firebase.firestore.FieldValue.arrayUnion({
        id: item.id,
        name: item.name,
        tier: item.tier,
        category: item.category,
        stats: item.stats,
        purchasedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    });
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    throw error;
  }
}

// Setup Admin Resource Controls - Enhanced with proper styling
function setupAdminResourceControls() {
  // Remove any existing resource sections to prevent duplicates
  const existingResourceSections = document.querySelectorAll('.admin-section-title');
  existingResourceSections.forEach(section => {
    if (section.textContent === 'RESOURCE MANAGEMENT') {
      const parentSection = section.closest('.admin-section');
      if (parentSection && parentSection.parentNode) {
        parentSection.parentNode.removeChild(parentSection);
      }
    }
  });
  
  // Get admin controls container
  const adminContent = document.querySelector('.admin-content');
  if (!adminContent) return;
  
  // Add resource management section with enhanced styling
  const resourceSection = document.createElement('div');
  resourceSection.className = 'admin-section';
  resourceSection.innerHTML = `
    <div class="admin-section-title resources">RESOURCE MANAGEMENT</div>
    <div class="admin-resource-buttons">
      <button id="reset-resources-button" class="resource-button reset">RESET DEFAULT RESOURCES</button>
      <button id="add-resources-button" class="resource-button add">ADD TEST RESOURCES</button>
    </div>
  `;
  
  // Add to admin panel
  adminContent.appendChild(resourceSection);
  
  // Add event listeners
  const resetButton = document.getElementById('reset-resources-button');
  const addButton = document.getElementById('add-resources-button');
  
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetUserResources().then(result => {
        if (result.success) {
          showNotification('RESOURCES RESET TO DEFAULT VALUES');
        } else {
          showNotification('ERROR: ' + (result.error || 'Unknown error'));
        }
      });
    });
  }
  
  if (addButton) {
    addButton.addEventListener('click', () => {
      addTestResources().then(result => {
        if (result.success) {
          showNotification('TEST RESOURCES ADDED SUCCESSFULLY');
        } else {
          showNotification('ERROR: ' + (result.error || 'Unknown error'));
        }
      });
    });
  }
}

// CSS for shop
const shopStyles = `
.shop-info {
  margin-bottom: 20px;
}

.shop-tier {
  color: var(--highlight-color);
  margin-bottom: 5px;
  font-family: 'Hack-Bold', monospace !important;
}

.shop-category {
  margin-bottom: 30px;
}

.shop-category-title {
  color: var(--highlight-color);
  font-size: 1.2em;
  margin-bottom: 10px;
  font-family: 'Hack-Bold', monospace !important;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px;
}

.shop-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.shop-item {
  background: var(--background-dark);
  padding: 15px;
  border: 1px solid var(--border-color);
}

.shop-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.shop-item-name {
  color: var(--highlight-color);
  font-family: 'Hack-Bold', monospace !important;
}

.shop-item-tier {
  color: var(--warning-color);
  font-size: 0.9em;
}

.shop-item-description {
  color: var(--text-primary);
  font-size: 0.9em;
  margin-bottom: 10px;
}

.shop-item-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-bottom: 15px;
  font-size: 0.8em;
  color: var(--text-primary);
}

.shop-item-stats div span {
  color: var(--highlight-color);
}

.shop-item-cost {
  margin-bottom: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
  font-size: 0.9em;
  color: var(--text-primary);
}

.shop-item-buy {
  width: 100%;
  background: var(--accent-color);
  color: var(--highlight-color);
  border: none;
  padding: 8px;
  cursor: pointer;
  font-family: 'Hack-Bold', monospace !important;
}

.shop-item-buy:hover {
  background: var(--background-light);
}

.item-cost {
  margin-bottom: 15px;
}

.cost-header {
  color: var(--highlight-color);
  margin-bottom: 5px;
  font-family: 'Hack-Bold', monospace !important;
}
`;

// Add shop styles to document
function addShopStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = shopStyles;
  document.head.appendChild(styleElement);
}

// Add shop styles when DOM is loaded
document.addEventListener('DOMContentLoaded', addShopStyles);





// Setup real-time resource updates listener - ENHANCED FOR REAL-TIME UPDATES
function setupResourcesListener() {
  console.log("Setting up enhanced real-time resource listener");
  
  // Create a global collection to store the shared resources for all users
  // This is a better approach than trying to sync individual user accounts
  const globalResourcesRef = db.collection('globalResources').doc('shared');
  
  // Remove any existing listener first to prevent duplicates
  if (window.resourceUnsubscribe) {
    window.resourceUnsubscribe();
    console.log("Removed previous resource listener");
  }
  
  // Setup listener with options for enhanced real-time behavior
  window.resourceUnsubscribe = globalResourcesRef.onSnapshot({
    // Include metadata changes to ensure we get all updates
    includeMetadataChanges: true
  }, (doc) => {
    try {
      // Check if this is from cache or server
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      
      if (doc.exists) {
        const sharedData = doc.data();
        console.log(`Received global resource update (${source}):`, sharedData);
        
        // Force UI refresh for immediate visual feedback
        window.requestAnimationFrame(() => {
          // Update all UI displays with the shared data
          updateResourceMonitor(sharedData);
          updateBaseResourceDisplay(sharedData);
          
          // Update squad panel resource display if it exists
          const resourceDisplay = document.getElementById('resource-display');
          if (resourceDisplay) {
            resourceDisplay.innerHTML = '';
            
            // Add money display
            const moneyItem = document.createElement('div');
            moneyItem.className = 'resource-item';
            moneyItem.innerHTML = `
              <div class="resource-name">MONEY:</div>
              <div class="resource-value">${sharedData.money.toLocaleString()}</div>
            `;
            resourceDisplay.appendChild(moneyItem);
            
            // Add other resources in a consistent, fixed order
            if (sharedData.resources) {
              // Define the order we want to display resources in
              const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
              
              // Process resources in our defined order
              resourceOrder.forEach(resource => {
                // Skip if this resource doesn't exist in userData
                if (!sharedData.resources.hasOwnProperty(resource)) return;
                
                const amount = sharedData.resources[resource];
                const resourceItem = document.createElement('div');
                resourceItem.className = 'resource-item';
                resourceItem.innerHTML = `
                  <div class="resource-name">${resource.toUpperCase()}:</div>
                  <div class="resource-value">${amount}</div>
                `;
                resourceDisplay.appendChild(resourceItem);
              });
            }
          }
          
          // Removed notification - no longer showing resource update notifications
        });
      } else {
        console.log("No shared resources found, initializing default values");
        // Initialize with default values if document doesn't exist
        initializeGlobalResources();
      }
    } catch (error) {
      console.error("Error processing resource update:", error);
    }
  }, (error) => {
    console.error("Error setting up global resource listener:", error);
  });
  
  // If admin adds resources through the admin panel, update global resources
  if (userRole === 'admin') {
    console.log("Setting up admin resource update handlers");
    
    // Override the addResources and resetUserResources functions to update global resources
    window.addResourcesToGlobal = async function(resources) {
      try {
        const globalDoc = await globalResourcesRef.get();
        
        if (globalDoc.exists) {
          const globalData = globalDoc.data();
          const updates = {};
          
          // Update money if provided
          if (resources.money) {
            updates.money = globalData.money + resources.money;
          }
          
          // Update other resources
          if (resources.resources) {
            const updatedResources = {...globalData.resources};
            
            for (const [resource, amount] of Object.entries(resources.resources)) {
              if (updatedResources[resource] !== undefined) {
                updatedResources[resource] += amount;
              } else {
                updatedResources[resource] = amount;
              }
            }
            
            updates.resources = updatedResources;
          }
          
          // Add timestamp to force update detection
          updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
          
          // Apply updates
          await globalResourcesRef.update(updates);
          console.log("Global resources updated:", updates);
          
          return true;
        } else {
          console.log("No global resources document found");
          return false;
        }
      } catch (error) {
        console.error("Error updating global resources:", error);
        return false;
      }
    };
  }
  
  // Set up periodic refresh as a fallback
  if (window.resourceRefreshInterval) {
    clearInterval(window.resourceRefreshInterval);
  }
  
  window.resourceRefreshInterval = setInterval(() => {
    globalResourcesRef.get().then(doc => {
      if (doc.exists) {
        const sharedData = doc.data();
        updateResourceMonitor(sharedData);
        updateBaseResourceDisplay(sharedData);
        console.log("Fallback resources refresh completed");
      }
    }).catch(err => {
      console.error("Error in fallback resources refresh:", err);
    });
  }, 30000); // Refresh every 30 seconds as a fallback
}

// Initialize global resources if they don't exist
async function initializeGlobalResources() {
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      // Create the global resources document with default values
      await globalResourcesRef.set({
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        },
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        updateId: Math.random().toString(36).substring(2, 15),
        notifyUpdates: false, // Always disabled to avoid showing notifications
        cacheVersion: 1.2 // Updated version number
      });
      
      console.log("Global resources initialized with default values");
    } else {
      // Make sure we have the updateId property for forcing updates
      // And also ensure notifyUpdates is disabled
      await globalResourcesRef.update({
        updateId: Math.random().toString(36).substring(2, 15),
        notifyUpdates: false, // Always ensure notifications are disabled
        cacheVersion: 1.2
      });
    }
  } catch (error) {
    console.error("Error initializing global resources:", error);
  }
}

// Override original update resource display function to use global resources
async function updateResourceDisplay() {
  try {
    // Get global resources instead of user-specific resources
    const globalDoc = await db.collection('globalResources').doc('shared').get();
    
    let resourceData;
    if (globalDoc.exists) {
      resourceData = globalDoc.data();
    } else {
      // Fall back to default values and initialize global resources
      resourceData = {
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        }
      };
      
      // Initialize the global resources
      initializeGlobalResources();
    }
    
    // Update all UI displays with the data
    updateResourceMonitor(resourceData);
    updateBaseResourceDisplay(resourceData);
    
    // Also update squad panel display
    const resourceDisplay = document.getElementById('resource-display');
    if (resourceDisplay) {
      resourceDisplay.innerHTML = '';
      
      // Add money display
      const moneyItem = document.createElement('div');
      moneyItem.className = 'resource-item';
      moneyItem.innerHTML = `
        <div class="resource-name">MONEY:</div>
        <div class="resource-value">${resourceData.money.toLocaleString()}</div>
      `;
      resourceDisplay.appendChild(moneyItem);
      
      // Add other resources in a consistent, fixed order
      if (resourceData.resources) {
        // Define the order we want to display resources in
        const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
        
        // Process resources in our defined order
        resourceOrder.forEach(resource => {
          // Skip if this resource doesn't exist in userData
          if (!resourceData.resources.hasOwnProperty(resource)) return;
          
          const amount = resourceData.resources[resource];
          const resourceItem = document.createElement('div');
          resourceItem.className = 'resource-item';
          resourceItem.innerHTML = `
            <div class="resource-name">${resource.toUpperCase()}:</div>
            <div class="resource-value">${amount}</div>
          `;
          resourceDisplay.appendChild(resourceItem);
        });
      }
    }
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Setup real-time resource updates listener - ENHANCED FOR REAL-TIME UPDATES
function setupResourcesListener() {
  console.log("Setting up enhanced real-time resource listener");
  
  // Create a global collection to store the shared resources for all users
  // This is a better approach than trying to sync individual user accounts
  const globalResourcesRef = db.collection('globalResources').doc('shared');
  
  // Remove any existing listener first to prevent duplicates
  if (window.resourceUnsubscribe) {
    window.resourceUnsubscribe();
    console.log("Removed previous resource listener");
  }
  
  // Setup listener with options for enhanced real-time behavior
  window.resourceUnsubscribe = globalResourcesRef.onSnapshot({
    // Include metadata changes to ensure we get all updates
    includeMetadataChanges: true
  }, (doc) => {
    try {
      // Check if this is from cache or server
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      
      if (doc.exists) {
        const sharedData = doc.data();
        console.log(`Received global resource update (${source}):`, sharedData);
        
        // Force UI refresh for immediate visual feedback
        window.requestAnimationFrame(() => {
          // Update all UI displays with the shared data
          updateResourceMonitor(sharedData);
          updateBaseResourceDisplay(sharedData);
          
          // Update squad panel resource display if it exists
          const resourceDisplay = document.getElementById('resource-display');
          if (resourceDisplay) {
            resourceDisplay.innerHTML = '';
            
            // Add money display
            const moneyItem = document.createElement('div');
            moneyItem.className = 'resource-item';
            moneyItem.innerHTML = `
              <div class="resource-name">MONEY:</div>
              <div class="resource-value">${sharedData.money.toLocaleString()}</div>
            `;
            resourceDisplay.appendChild(moneyItem);
            
            // Add other resources in a consistent, fixed order
            if (sharedData.resources) {
              // Define the order we want to display resources in
              const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
              
              // Process resources in our defined order
              resourceOrder.forEach(resource => {
                // Skip if this resource doesn't exist in userData
                if (!sharedData.resources.hasOwnProperty(resource)) return;
                
                const amount = sharedData.resources[resource];
                const resourceItem = document.createElement('div');
                resourceItem.className = 'resource-item';
                resourceItem.innerHTML = `
                  <div class="resource-name">${resource.toUpperCase()}:</div>
                  <div class="resource-value">${amount}</div>
                `;
                resourceDisplay.appendChild(resourceItem);
              });
            }
          }
          
          // Removed notification - no longer showing resource update notifications
        });
      } else {
        console.log("No shared resources found, initializing default values");
        // Initialize with default values if document doesn't exist
        initializeGlobalResources();
      }
    } catch (error) {
      console.error("Error processing resource update:", error);
    }
  }, (error) => {
    console.error("Error setting up global resource listener:", error);
  });
  
  // If admin adds resources through the admin panel, update global resources
  if (userRole === 'admin') {
    console.log("Setting up admin resource update handlers");
    
    // Override the addResources and resetUserResources functions to update global resources
    window.addResourcesToGlobal = async function(resources) {
      try {
        const globalDoc = await globalResourcesRef.get();
        
        if (globalDoc.exists) {
          const globalData = globalDoc.data();
          const updates = {};
          
          // Update money if provided
          if (resources.money) {
            updates.money = globalData.money + resources.money;
          }
          
          // Update other resources
          if (resources.resources) {
            const updatedResources = {...globalData.resources};
            
            for (const [resource, amount] of Object.entries(resources.resources)) {
              if (updatedResources[resource] !== undefined) {
                updatedResources[resource] += amount;
              } else {
                updatedResources[resource] = amount;
              }
            }
            
            updates.resources = updatedResources;
          }
          
          // Add timestamp to force update detection
          updates.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
          
          // Apply updates
          await globalResourcesRef.update(updates);
          console.log("Global resources updated:", updates);
          
          return true;
        } else {
          console.log("No global resources document found");
          return false;
        }
      } catch (error) {
        console.error("Error updating global resources:", error);
        return false;
      }
    };
  }
  
  // Set up periodic refresh as a fallback
  if (window.resourceRefreshInterval) {
    clearInterval(window.resourceRefreshInterval);
  }
  
  window.resourceRefreshInterval = setInterval(() => {
    globalResourcesRef.get().then(doc => {
      if (doc.exists) {
        const sharedData = doc.data();
        updateResourceMonitor(sharedData);
        updateBaseResourceDisplay(sharedData);
        console.log("Fallback resources refresh completed");
      }
    }).catch(err => {
      console.error("Error in fallback resources refresh:", err);
    });
  }, 30000); // Refresh every 30 seconds as a fallback
}

// Initialize global resources if they don't exist
async function initializeGlobalResources() {
  try {
    const globalResourcesRef = db.collection('globalResources').doc('shared');
    const doc = await globalResourcesRef.get();
    
    if (!doc.exists) {
      // Create the global resources document with default values
      await globalResourcesRef.set({
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        },
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        updateId: Math.random().toString(36).substring(2, 15),
        notifyUpdates: false, // Always disabled to avoid showing notifications
        cacheVersion: 1.2 // Updated version number
      });
      
      console.log("Global resources initialized with default values");
    } else {
      // Make sure we have the updateId property for forcing updates
      // And also ensure notifyUpdates is disabled
      await globalResourcesRef.update({
        updateId: Math.random().toString(36).substring(2, 15),
        notifyUpdates: false, // Always ensure notifications are disabled
        cacheVersion: 1.2
      });
    }
  } catch (error) {
    console.error("Error initializing global resources:", error);
  }
}

// Override original update resource display function to use global resources
async function updateResourceDisplay() {
  try {
    // Get global resources instead of user-specific resources
    const globalDoc = await db.collection('globalResources').doc('shared').get();
    
    let resourceData;
    if (globalDoc.exists) {
      resourceData = globalDoc.data();
    } else {
      // Fall back to default values and initialize global resources
      resourceData = {
        money: 100000,
        resources: {
          fuel: 500,
          ammo: 500,
          medicine: 500,
          food: 500,
          materials: 500
        }
      };
      
      // Initialize the global resources
      initializeGlobalResources();
    }
    
    // Update all UI displays with the data
    updateResourceMonitor(resourceData);
    updateBaseResourceDisplay(resourceData);
    
    // Also update squad panel display
    const resourceDisplay = document.getElementById('resource-display');
    if (resourceDisplay) {
      resourceDisplay.innerHTML = '';
      
      // Add money display
      const moneyItem = document.createElement('div');
      moneyItem.className = 'resource-item';
      moneyItem.innerHTML = `
        <div class="resource-name">MONEY:</div>
        <div class="resource-value">${resourceData.money.toLocaleString()}</div>
      `;
      resourceDisplay.appendChild(moneyItem);
      
      // Add other resources in a consistent, fixed order
      if (resourceData.resources) {
        // Define the order we want to display resources in
        const resourceOrder = ['fuel', 'ammo', 'medicine', 'food', 'materials'];
        
        // Process resources in our defined order
        resourceOrder.forEach(resource => {
          // Skip if this resource doesn't exist in userData
          if (!resourceData.resources.hasOwnProperty(resource)) return;
          
          const amount = resourceData.resources[resource];
          const resourceItem = document.createElement('div');
          resourceItem.className = 'resource-item';
          resourceItem.innerHTML = `
            <div class="resource-name">${resource.toUpperCase()}:</div>
            <div class="resource-value">${amount}</div>
          `;
          resourceDisplay.appendChild(resourceItem);
        });
      }
    }
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

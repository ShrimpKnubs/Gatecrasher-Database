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

// Update resource display with current values
async function updateResourceDisplay() {
  if (!currentUser) return;
  
  try {
    // Get the user's current resources
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    if (!userData) {
      console.error('No user data found');
      return;
    }
    
    // Get the resource display element
    const resourceDisplay = document.getElementById('resource-display');
    if (!resourceDisplay) return;
    
    // Clear existing content
    resourceDisplay.innerHTML = '';
    
    // Add money display
    const moneyItem = document.createElement('div');
    moneyItem.className = 'resource-item';
    moneyItem.innerHTML = `
      <div class="resource-name">MONEY:</div>
      <div class="resource-value">$${userData.money.toLocaleString()}</div>
    `;
    resourceDisplay.appendChild(moneyItem);
    
    // Add resources
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
  } catch (error) {
    console.error('Error updating resource display:', error);
  }
}

// Add resources to user
async function addResources(userId, resources) {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return { success: false, error: 'User not found' };
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
    
    // Apply updates
    await userRef.update(updates);
    
    // Update display
    updateResourceDisplay();
    
    return { success: true };
  } catch (error) {
    console.error('Error adding resources:', error);
    return { success: false, error: error.message };
  }
}

// Subtract resources from user
async function subtractResources(userId, resources) {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    
    // Check if user has enough resources
    if (resources.money && userData.money < resources.money) {
      return { success: false, error: 'Not enough money' };
    }
    
    // Check other resources
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'money' && amount) {
        if (!userData.resources || !userData.resources[resource] || userData.resources[resource] < amount) {
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
    
    // Apply updates
    await userRef.update(updates);
    
    // Update display
    updateResourceDisplay();
    
    return { success: true };
  } catch (error) {
    console.error('Error subtracting resources:', error);
    return { success: false, error: error.message };
  }
}

// Check if user has enough resources
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
    
    if (!rndTeamDoc.exists) {
      showNotification('R&D TEAM NOT INITIALIZED');
      return;
    }
    
    const rndTeam = rndTeamDoc.data();
    const unlockedTiers = rndTeam.unlockedWeapons || ['tier1'];
    
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
        <div class="shop-tier">R&D LEVEL: ${rndTeam.level}</div>
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

// Intel Panel System - New independent file to manage intel panel functions

// Function to fix the z-index of panels
function fixPanelZIndices() {
  // Make sure intel panel has higher z-index than resource panel
  const intelPanel = document.getElementById('intel-panel');
  const resourcesPanel = document.querySelector('.resources-panel');
  
  if (intelPanel && resourcesPanel) {
    intelPanel.style.zIndex = '4';
    resourcesPanel.style.zIndex = '3';
  }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Apply z-index fixes
  fixPanelZIndices();
  
  // Also set these fixes to run periodically to ensure they stick
  setInterval(fixPanelZIndices, 2000);
  
  // Log to console
  console.log("Intel Panel System initialized with z-index fixes");
});

// Intel Panel System - New independent file to manage intel panel functions

// Function to fix the z-index of panels
function fixPanelZIndices() {
  // Make sure intel panel has higher z-index than resource panel
  const intelPanel = document.getElementById('intel-panel');
  const resourcesPanel = document.querySelector('.resources-panel');
  
  if (intelPanel && resourcesPanel) {
    intelPanel.style.zIndex = '4';
    resourcesPanel.style.zIndex = '3';
  }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Apply z-index fixes
  fixPanelZIndices();
  
  // Also set these fixes to run periodically to ensure they stick
  setInterval(fixPanelZIndices, 2000);
  
  // Log to console
  console.log("Intel Panel System initialized with z-index fixes");
});


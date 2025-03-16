// Firebase configuration - Using the same config from main.js
const firebaseConfig = {
  apiKey: "AIzaSyBKhc_Nl4kMAUfd3Ze43jG6hM1nt9FCsIg",
  authDomain: "gatecrasher-database.firebaseapp.com",
  projectId: "gatecrasher-database",
  storageBucket: "gatecrasher-database.firebaseapp.com",
  messagingSenderId: "221759991275",
  appId: "1:221759991275:web:4b1a92d2647d9f48c8bdae",
  measurementId: "G-QH1TYL025K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements (add these to your existing elements)
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const userIdInput = document.getElementById('user-id');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const continueAsGruntButton = document.getElementById('continue-as-grunt');
const errorMessage = document.getElementById('error-message');

// Authentication state
let currentUser = null;
let userRole = null;

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!userId || !password) {
    errorMessage.textContent = 'ID and password required';
    return;
  }
  
  try {
    // This uses email auth format - you can customize auth methods
    const email = `${userId}@yourarma3ops.com`;
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      userRole = userData.role;
      
      // Show appropriate features based on role
      showUserDashboard(userRole);
      
      // Hide login overlay
      loginOverlay.style.display = 'none';
      
      // Initialize appropriate systems based on role
      if (userRole === 'admin') {
        initializeAdminFeatures();
      } else if (userRole === 'squadLead') {
        initializeSquadLeadFeatures();
      } else {
        initializeGruntFeatures();
      }
      
      // Play activation sound and show notification
      activationSound.play().catch(console.error);
      showNotification(`LOGIN SUCCESSFUL - WELCOME ${userData.username}`);
      
      // Set music volume based on slider and play music
      music.volume = volumeSlider.value;
      music.play().catch(console.error);
      
      // Show remaining UI elements
      initializeUIAfterLogin();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'Invalid ID or password';
  }
});

// Continue as grunt
continueAsGruntButton.addEventListener('click', () => {
  userRole = 'grunt';
  showUserDashboard(userRole);
  loginOverlay.style.display = 'none';
  
  // Initialize grunt-only features
  initializeGruntFeatures();
  
  // Play activation sounds and show notification
  activationSound.play().catch(console.error);
  showNotification('ACCESS GRANTED - GRUNT VIEW ONLY');
  
  // Set music volume based on slider and play music
  music.volume = volumeSlider.value;
  music.play().catch(console.error);
  
  // Show remaining UI elements
  initializeUIAfterLogin();
});

// Initialize UI after successful login
function initializeUIAfterLogin() {
  // Apply LCD screen overlay
  lcdOverlay.style.display = 'block';
  
  // Fade in side panels
  setTimeout(() => {
    leftPanel.style.transition = 'opacity 1s ease-in';
    rightPanel.style.transition = 'opacity 1s ease-in';
    leftPanel.style.opacity = '1';
    rightPanel.style.opacity = '1';
  }, 500);
  
  // Update status based on role
  statusText.textContent = `STATUS: ${userRole.toUpperCase()} - OPERATIONAL`;
  
  // Initialize updating features
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

// Show appropriate dashboard based on user role
function showUserDashboard(role) {
  systemActive = true;
  
  // Show HQ button for all users
  document.getElementById('hq-button').style.display = 'block';
  
  if (role === 'admin') {
    // Show admin controls
    document.getElementById('admin-controls').style.display = 'block';
  } else if (role === 'squadLead') {
    // Show squad leader controls
    document.getElementById('squad-controls').style.display = 'block';
  }
  
  // Everyone sees the mission information
  document.getElementById('mission-info').style.display = 'block';
}

// Initialize features for different roles
function initializeAdminFeatures() {
  // Admin-specific features
  loadAllMissions(true); // true = admin mode
  initializeMissionCreationTools();
  initializeMissionCompletionTools();
}

function initializeSquadLeadFeatures() {
  // Squad leader features
  loadAvailableMissions();
  initializeDeploymentSystem();
  initializeBaseManagement();
  initializeResourceManagement();
}

function initializeGruntFeatures() {
  // Grunt features - view only
  loadAvailableMissions();
  initializeViewOnlyMode();
}

// Function to create new user (for admin use)
async function createNewUser(username, role, password) {
  try {
    // Create authentication record
    const email = `${username}@yourarma3ops.com`;
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      username: username,
      role: role,
      money: 50000, // Starting money
      resources: {
        fuel: 100,
        ammo: 100,
        medicine: 100,
        food: 100,
        materials: 100
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error('Error creating new user:', error);
    return { success: false, error: error.message };
  }
}

// Function to sign out
function signOut() {
  auth.signOut().then(() => {
    // Reset UI and state
    currentUser = null;
    userRole = null;
    systemActive = false;
    
    // Show login overlay
    loginOverlay.style.display = 'flex';
    
    // Hide panels
    leftPanel.style.opacity = '0';
    rightPanel.style.opacity = '0';
    
    // Stop music
    music.pause();
    music.currentTime = 0;
    
    // Reset status
    statusText.textContent = 'STATUS: LOGGED OUT';
    
    // Hide role-specific UI elements
    document.getElementById('admin-controls').style.display = 'none';
    document.getElementById('squad-controls').style.display = 'none';
    document.getElementById('mission-info').style.display = 'none';
    document.getElementById('hq-button').style.display = 'none';
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
}

// Initialize Firebase configuration to avoid caching issues
(function() {
  // Set Firebase cache settings
  firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });
  
  // Enable offline persistence with aggressive refresh
  firebase.firestore().enablePersistence({
    synchronizeTabs: true
  }).catch(function(err) {
    console.error("Firebase persistence error:", err);
  });
  
  console.log("Firebase cache configuration applied");
})();

// Initialize Firebase configuration to avoid caching issues
(function() {
  // Set Firebase cache settings
  firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });
  
  // Enable offline persistence with aggressive refresh
  firebase.firestore().enablePersistence({
    synchronizeTabs: true
  }).catch(function(err) {
    console.error("Firebase persistence error:", err);
  });
  
  console.log("Firebase cache configuration applied");
})();

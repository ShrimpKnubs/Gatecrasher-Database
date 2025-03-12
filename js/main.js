// Initialize Vanta.js (Z-Index: -1)
VANTA.CLOUDS({
  el: "#vanta-background",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  backgroundColor: 0x0a1520,
  skyColor: 0x1a2a3a,
  cloudColor: 0x1a2530,
  sunColor: 0x4b9fff,
  sunGlareColor: 0x3a6a9a,
  sunlightColor: 0x2a5a8a
});

// DOM Elements
const bootOverlay = document.getElementById('boot-overlay');
const activateButton = document.getElementById('activate-button');
const terminalText = document.getElementById('terminal-text');
const logoScreen = document.getElementById('logo-screen');
const music = document.getElementById('background-music');
const activationSound = document.getElementById('activation-sound');
const tabSound = document.getElementById('tab-sound');
const imagePanel = document.getElementById('image-panel');
const tabImage = document.getElementById('tab-image');
const tabs = document.querySelectorAll('.tab');
const statusText = document.getElementById('status-text');
const coordsDisplay = document.getElementById('coordinates');
const dateTimeDisplay = document.getElementById('date-time');
const notification = document.getElementById('notification');
const reticle = document.querySelector('.reticle');
const volumeSlider = document.getElementById('volume-slider');
const globe = document.getElementById('globe');

// System State
let systemActive = false;
let activeTab = null;
let rotating = true;
let targetLat = 0;
let targetLon = 0;

// Logo Screen Handling
setTimeout(() => {
  fadeOut(logoScreen, 1000);
}, 2000);

// Boot Sequence System
function initializeBootSequence() {
  // Initialize States
  activateButton.style.display = 'none';
  
  // Animate Terminal
  const lines = terminalText.querySelectorAll('p');
  let delay = 0;
  lines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = '';
    typeWriter(line, text, delay, () => {
      if (index === lines.length - 1) {
        setTimeout(() => {
          activateButton.style.display = 'block';
          activateButton.style.opacity = '1';
        }, 500);
      }
    });
    delay += text.length * 25 + 250;
  });
  
  // Activation Protocol
  activateButton.addEventListener('click', activateSystem);
}

// Typewriter Effect
function typeWriter(element, text, delay, callback) {
  let i = 0;
  const speed = 25;
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  
  setTimeout(type, delay);
}

// System Activation
function activateSystem() {
  systemActive = true;
  activationSound.play();
  
  // Set music volume based on slider
  music.volume = volumeSlider.value;
  music.play().catch(console.error);
  
  // Fade out boot overlay
  fadeOut(bootOverlay, 1000);
  
  // Animate sidebar entrance
  setTimeout(() => {
    document.querySelectorAll('.tab').forEach((tab, index) => {
      setTimeout(() => {
        tab.style.transition = 'transform 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
        tab.style.transform = 'translateX(0)';
      }, index * 200);
    });
  }, 500);
  
  // Initialize updating features
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Show notification
  showNotification('SYSTEM ACTIVATED - GLOBE TRACKING OPERATIONAL');
}

// Tab Control System
function initializeTabSystem() {
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!systemActive) return;
      
      // Play tab sound
      if (tabSound.readyState >= 2) { // Check if audio is loaded
        tabSound.currentTime = 0;
        tabSound.play().catch(console.error);
      }
      
      // Set active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.section;
      
      // Update status
      statusText.textContent = `STATUS: ${tab.textContent} ACTIVE`;
      
      // Load image
      tabImage.src = `textures/${tab.dataset.img}`;
      
      // Toggle panel
      if (imagePanel.style.left === '0px') {
        if (e.currentTarget === activeTab) {
          imagePanel.style.left = '-30vw';
          activeTab = null;
        } else {
          // Just update the image
        }
      } else {
        imagePanel.style.left = '0px';
      }
      
      // Show notification
      showNotification(`${tab.textContent} SECTION ACCESSED`);
    });
  });
}

// Globe Visualization System
function initializeGlobe() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('globe'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Position and orientation
  camera.position.z = 20;
  scene.rotation.y = 0.5; // Initial rotation
  
  // Globe interaction
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  
  // Mouse control for globe
  document.addEventListener('mousedown', (e) => {
    if (!systemActive) return;
    
    isDragging = true;
    previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!systemActive) return;
    
    // Update coordinates display
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const x = (e.clientX / viewportWidth) * 360 - 180;
    const y = 90 - (e.clientY / viewportHeight) * 180;
    coordsDisplay.textContent = `LAT: ${y.toFixed(4)} LON: ${x.toFixed(4)}`;
    
    // Show reticle on globe hover
    if (e.target === globe) {
      reticle.style.display = 'block';
      reticle.style.left = (e.clientX - 20) + 'px';
      reticle.style.top = (e.clientY - 20) + 'px';
    } else {
      reticle.style.display = 'none';
    }
    
    // Rotate globe when dragging
    if (isDragging) {
      rotating = false;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      scene.rotation.y += deltaMove.x * 0.005;
      scene.rotation.x += deltaMove.y * 0.005;
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    }
  });
  
  // Double click to re-enable auto rotation
  document.addEventListener('dblclick', () => {
    if (systemActive) {
      rotating = !rotating;
      showNotification(rotating ? 'AUTO-ROTATION ENABLED' : 'AUTO-ROTATION DISABLED');
    }
  });
  
  // GeoJSON Loader
  function loadGeoData(url, color) {
    fetch(url)
      .then(r => r.json())
      .then(data => {
        data.features.forEach(feature => {
          if (feature.geometry && feature.geometry.coordinates) {
            // Handle different geometry types
            const geometryType = feature.geometry.type;
            const coordinates = feature.geometry.coordinates;
            
            if (geometryType === 'MultiLineString') {
              coordinates.forEach(lineString => {
                createLine(lineString, color);
              });
            } else if (geometryType === 'LineString') {
              createLine(coordinates, color);
            } else if (geometryType === 'MultiPolygon') {
              coordinates.forEach(polygon => {
                polygon.forEach(ring => {
                  createLine(ring, color);
                });
              });
            } else if (geometryType === 'Polygon') {
              coordinates.forEach(ring => {
                createLine(ring, color);
              });
            }
          }
        });
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
      });
  }
  
  function createLine(coordinates, color) {
    const points = [];
    coordinates.forEach(point => {
      const [lon, lat] = point;
      const phi = (90 - lat) * Math.PI/180;
      const theta = (lon + 180) * Math.PI/180;
      points.push(new THREE.Vector3(
        -10 * Math.sin(phi) * Math.cos(theta),
        10 * Math.cos(phi),
        10 * Math.sin(phi) * Math.sin(theta)
      ));
    });
    
    if (points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 1,
      });
      scene.add(new THREE.Line(geometry, material));
    }
  }
  
  // Load Data
  loadGeoData('data/countries.geojson', 0x4b9fff);
  loadGeoData('data/ne_110_coastline.json', 0x5a8aba);
  
  // Add some points of interest
  function addPOI(lat, lon, color) {
    const phi = (90 - lat) * Math.PI/180;
    const theta = (lon + 180) * Math.PI/180;
    
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const poi = new THREE.Mesh(geometry, material);
    
    poi.position.x = -10 * Math.sin(phi) * Math.cos(theta);
    poi.position.y = 10 * Math.cos(phi);
    poi.position.z = 10 * Math.sin(phi) * Math.sin(theta);
    
    scene.add(poi);
  }
  
  // Add some example POIs
  addPOI(38.9072, -77.0369, 0xff3a3a); // Washington DC
  addPOI(51.5074, -0.1278, 0xff3a3a);  // London
  addPOI(55.7558, 37.6173, 0xff3a3a);  // Moscow
  addPOI(39.9042, 116.4074, 0xff3a3a); // Beijing
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    if (rotating) {
      scene.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
  }
  animate();
  
  // Window Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Utility Functions
function fadeOut(element, duration) {
  let opacity = 1;
  const interval = 10;
  const delta = interval / duration;
  
  const fadeEffect = setInterval(() => {
    if (opacity <= 0) {
      element.style.display = 'none';
      clearInterval(fadeEffect);
    } else {
      opacity -= delta;
      element.style.opacity = opacity;
    }
  }, interval);
}

function showNotification(text) {
  notification.textContent = text;
  notification.style.display = 'block';
  
  setTimeout(() => {
    fadeOut(notification, 1000);
  }, 3000);
}

function updateDateTime() {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  dateTimeDisplay.textContent = `${hours}:${minutes}:${seconds} UTC`;
}

// Volume Control
volumeSlider.addEventListener('input', (e) => {
  if (music.readyState >= 2) {
    music.volume = e.target.value;
  }
});

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
  initializeBootSequence();
  initializeTabSystem();
  initializeGlobe();
});

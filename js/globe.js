const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer with a transparent background
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('globe'),
  antialias: true,
  alpha: true
});
renderer.setClearColor(0x000000, 0); // Set background to transparent
renderer.setSize(window.innerWidth, window.innerHeight);

// Load starfield texture
const textureLoader = new THREE.TextureLoader();
const starfieldTexture = textureLoader.load('textures/starfield.png');

// Create starfield background
const starfieldGeometry = new THREE.SphereGeometry(500, 64, 64);
const starfieldMaterial = new THREE.MeshBasicMaterial({
  map: starfieldTexture,
  side: THREE.BackSide
});
const starfield = new THREE.Mesh(starfieldGeometry, starfieldMaterial);
scene.add(starfield);

// Load land and ocean data
const landGeometry = new THREE.SphereGeometry(5, 64, 64);
const landMaterial = new THREE.MeshBasicMaterial({
  color: 0x2E8B57, // Green for land
  wireframe: false
});
const land = new THREE.Mesh(landGeometry, landMaterial);
scene.add(land);

const oceanGeometry = new THREE.SphereGeometry(5, 64, 64);
const oceanMaterial = new THREE.MeshBasicMaterial({
  color: 0x1E90FF, // Blue for ocean
  wireframe: false,
  transparent: true,
  opacity: 0.5
});
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
scene.add(ocean);

// Load country borders
fetch('data/countries.json')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White borders
      const lineGeometry = new THREE.BufferGeometry();
      const points = [];

      coordinates.forEach(polygon => {
        polygon.forEach(point => {
          const lat = point[1];
          const lon = point[0];
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          const x = -5 * Math.sin(phi) * Math.cos(theta);
          const y = 5 * Math.cos(phi);
          const z = 5 * Math.sin(phi) * Math.sin(theta);
          points.push(new THREE.Vector3(x, y, z));
        });
      });

      lineGeometry.setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });
  });

// Load rivers
fetch('data/rivers.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00BFFF }); // Blue for rivers
      const lineGeometry = new THREE.BufferGeometry();
      const points = [];

      coordinates.forEach(point => {
        const lat = point[1];
        const lon = point[0];
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -5 * Math.sin(phi) * Math.cos(theta);
        const y = 5 * Math.cos(phi);
        const z = 5 * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      });

      lineGeometry.setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });
  });

// Load highways
fetch('data/world_highways.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFD700 }); // Yellow for highways
      const lineGeometry = new THREE.BufferGeometry();
      const points = [];

      coordinates.forEach(point => {
        const lat = point[1];
        const lon = point[0];
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -5 * Math.sin(phi) * Math.cos(theta);
        const y = 5 * Math.cos(phi);
        const z = 5 * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      });

      lineGeometry.setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });
  });

// Position the camera
camera.position.z = 15;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  starfield.rotation.y += 0.0005; // Rotate the starfield
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
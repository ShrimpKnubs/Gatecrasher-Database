const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer with transparent background
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('globe'),
  antialias: true,
  alpha: true
});
renderer.setClearColor(0x000000, 0); // Transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/earth.jpg', () => {
  console.log('Earth texture loaded successfully!');
}, undefined, (error) => {
  console.error('Error loading Earth texture:', error);
});

// Globe material (matte, non-reflective)
const material = new THREE.MeshLambertMaterial({
  map: texture, // Use the loaded texture
  transparent: true,
  opacity: 0.95
});

// Create the globe
const geometry = new THREE.SphereGeometry(3, 64, 64); // High-resolution sphere
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Lighting (minimal, no specular highlights)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

// Camera position
camera.position.z = 7;

// Auto-rotation
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002; // Slower rotation
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
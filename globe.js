// globe.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer with a transparent background
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('globe'),
  antialias: true,
  alpha: true // Enable transparency
});
renderer.setClearColor(0x000000, 0); // Set background to transparent
renderer.setSize(window.innerWidth, window.innerHeight);

// Create the globe
const geometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('textures/earth.jpg'); // Path to your Earth texture
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Position the camera
camera.position.z = 10;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.001; // Slower rotation
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
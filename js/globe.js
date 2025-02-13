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

// Globe material (light gray with subtle shading)
const material = new THREE.MeshPhongMaterial({
  color: 0xd3d3d3, // Light gray
  emissive: 0x000000,
  specular: 0x555555,
  shininess: 30,
  transparent: true,
  opacity: 0.95
});

// Create the globe
const geometry = new THREE.SphereGeometry(3, 64, 64); // High-resolution sphere
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 3, 5); // Light from top-right
scene.add(directionalLight);

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
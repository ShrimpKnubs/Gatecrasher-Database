// globe.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('globe'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('textures/earth.jpg'); // Path to your Earth texture
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Add a darker background sphere
const backgroundGeometry = new THREE.SphereGeometry(5.1, 32, 32); // Slightly larger than the globe
const backgroundMaterial = new THREE.MeshBasicMaterial({
  color: 0x333333, // Dark gray color
  side: THREE.BackSide // Render the inside of the sphere
});
const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundSphere);

camera.position.z = 10;

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
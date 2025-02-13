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

// Load textures
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/earth.jpg');
const earthNormalMap = textureLoader.load('textures/earth_normal.tif');
const earthSpecularMap = textureLoader.load('textures/earth_specular.tif');

// Create the globe
const globeGeometry = new THREE.SphereGeometry(5, 64, 64); // Larger globe
const globeMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  normalMap: earthNormalMap,
  specularMap: earthSpecularMap,
  shininess: 10
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Position the camera
camera.position.z = 15; // Move camera closer

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.001; // Rotate the globe
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
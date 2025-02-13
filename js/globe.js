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
const cloudTexture = textureLoader.load('textures/earth_clouds.jpg');

// Create the globe
const globeGeometry = new THREE.SphereGeometry(3, 64, 64);
const globeMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  normalMap: earthNormalMap,
  specularMap: earthSpecularMap,
  shininess: 10
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Create the clouds
const cloudGeometry = new THREE.SphereGeometry(3.05, 64, 64); // Slightly larger than the globe
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.8
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Position the camera
camera.position.z = 10;

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
  clouds.rotation.y += 0.0008; // Rotate clouds slightly slower
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
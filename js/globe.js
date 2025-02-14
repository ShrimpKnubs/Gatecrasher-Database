const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('globe'),
  antialias: true,
  alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);

// Function to create geographic lines
function createGeoLines(url, color) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      data.features.forEach(feature => {
        const geometryType = feature.geometry.type;
        const coordinates = feature.geometry.coordinates;
        const lines = (geometryType === 'MultiLineString') ? coordinates : [coordinates];
        lines.forEach(line => {
          const points = [];
          line.forEach(point => {
            const [lon, lat] = point;
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lon + 180) * Math.PI / 180;
            points.push(new THREE.Vector3(
              -10 * Math.sin(phi) * Math.cos(theta),
              10 * Math.cos(phi),
              10 * Math.sin(phi) * Math.sin(theta)
            ));
          });
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color });
          scene.add(new THREE.Line(geometry, material));
        });
      });
    });
}

// Load geographic data
createGeoLines('data/countries.geojson', 0xffffff); // White borders
createGeoLines('data/coastline.geojson', 0xFFD700); // Yellow coastlines

// Position the camera
camera.position.z = 20;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
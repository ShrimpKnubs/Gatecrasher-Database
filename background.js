// background.js
const backgroundCanvas = document.getElementById('background');
const backgroundContext = backgroundCanvas.getContext('2d');

// Set canvas size
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

// Draw the terminal grid
function drawGrid() {
  const gridSize = 20;
  backgroundContext.strokeStyle = 'rgba(0, 255, 0, 0.1)';
  backgroundContext.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= backgroundCanvas.width; x += gridSize) {
    backgroundContext.beginPath();
    backgroundContext.moveTo(x, 0);
    backgroundContext.lineTo(x, backgroundCanvas.height);
    backgroundContext.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= backgroundCanvas.height; y += gridSize) {
    backgroundContext.beginPath();
    backgroundContext.moveTo(0, y);
    backgroundContext.lineTo(backgroundCanvas.width, y);
    backgroundContext.stroke();
  }
}

// Draw the falling code effect
function drawFallingCode() {
  const text = '01010101010101010101010101010101';
  const fontSize = 16;
  const columns = Math.floor(backgroundCanvas.width / fontSize);
  const drops = Array(columns).fill(0);

  function rain() {
    backgroundContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
    backgroundContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundContext.fillStyle = '#00ff00';
    backgroundContext.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      backgroundContext.fillText(text, x, y);

      if (y > backgroundCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(rain, 50);
}

// Initialize
drawGrid();
drawFallingCode();

// Handle window resizing
window.addEventListener('resize', () => {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  drawGrid();
});
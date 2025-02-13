const background = document.getElementById('terminal-background');
const colors = {
  background: '#1a1c1a',
  numbers: '#2a2c2a',
  triangles: '#4d663f'
};

// Generate random numbers
function generateNumbers() {
  const numbers = '0123456789';
  let content = '';
  for (let i = 0; i < 1000; i++) {
    content += numbers[Math.floor(Math.random() * numbers.length)] + ' ';
  }
  return content;
}

// Create the background
function createBackground() {
  background.style.backgroundColor = colors.background;
  background.style.position = 'fixed';
  background.style.top = '0';
  background.style.left = '0';
  background.style.width = '100%';
  background.style.height = '100%';
  background.style.zIndex = '-1';
  background.style.overflow = 'hidden';

  // Add numbers
  const numbers = document.createElement('div');
  numbers.style.position = 'absolute';
  numbers.style.top = '0';
  numbers.style.left = '0';
  numbers.style.width = '100%';
  numbers.style.height = '100%';
  numbers.style.color = colors.numbers;
  numbers.style.fontFamily = 'monospace';
  numbers.style.fontSize = '14px';
  numbers.style.lineHeight = '1.5';
  numbers.style.opacity = '0.5';
  numbers.style.whiteSpace = 'pre-wrap';
  numbers.textContent = generateNumbers();
  background.appendChild(numbers);

  // Add triangles
  setInterval(() => {
    const triangle = document.createElement('div');
    triangle.style.position = 'absolute';
    triangle.style.top = `${Math.random() * 100}%`;
    triangle.style.left = `${Math.random() * 100}%`;
    triangle.style.width = `${Math.random() * 50 + 20}px`;
    triangle.style.height = `${Math.random() * 50 + 20}px`;
    triangle.style.backgroundColor = 'transparent';
    triangle.style.borderLeft = `solid ${colors.triangles}`;
    triangle.style.borderRight = `solid transparent`;
    triangle.style.borderBottom = `solid transparent`;
    triangle.style.transform = 'rotate(45deg)';
    triangle.style.opacity = '0';
    triangle.style.transition = 'opacity 2s ease-in-out';
    background.appendChild(triangle);

    // Fade in and out
    setTimeout(() => {
      triangle.style.opacity = '0.5';
    }, 100);
    setTimeout(() => {
      triangle.style.opacity = '0';
    }, 2000);
    setTimeout(() => {
      triangle.remove();
    }, 4000);
  }, 1000); // Add a new triangle every second
}

// Initialize the background
createBackground();
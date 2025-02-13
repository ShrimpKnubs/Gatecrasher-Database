const background = document.getElementById('terminal-background');
const colors = {
  background: '#1a1c1a',
  numbers: '#2a2c2a'
};

// Generate random numbers
function generateNumbers() {
  const numbers = '0123456789';
  let content = '';
  for (let i = 0; i < 2000; i++) { // Increase the number of characters
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
  numbers.style.fontFamily = 'Britannic, monospace'; // Use custom font
  numbers.style.fontSize = '14px';
  numbers.style.lineHeight = '1.5';
  numbers.style.opacity = '0.5';
  numbers.style.whiteSpace = 'pre-wrap';
  numbers.textContent = generateNumbers();
  background.appendChild(numbers);

  // Update numbers every second
  setInterval(() => {
    numbers.textContent = generateNumbers();
  }, 1000);
}

// Initialize the background
createBackground();
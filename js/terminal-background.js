const background = document.getElementById('terminal-background');
const colors = {
  background: '#1a1c1a',
  numbers: '#2a2c2a'
};

// Generate random numbers (dense enough to fill the screen)
function generateNumbers() {
  const numbers = '0123456789'.repeat(2000); // Increase density
  let content = '';
  for (let i = 0; i < numbers.length; i++) {
    content += numbers[Math.floor(Math.random() * numbers.length)] + ' ';
    if (i % 100 === 0) content += '\n'; // Add line breaks
  }
  return content;
}

// Create the background
function createBackground() {
  background.style.position = 'fixed';
  background.style.top = '0';
  background.style.left = '0';
  background.style.width = '100vw';
  background.style.height = '100vh';
  background.style.zIndex = '-1';
  background.style.overflow = 'hidden';

  // Add numbers
  const numbers = document.createElement('div');
  numbers.style.position = 'absolute';
  numbers.style.width = '100%';
  numbers.style.height = '100%';
  numbers.style.color = colors.numbers;
  numbers.style.fontFamily = 'Britannic, monospace';
  numbers.style.fontSize = '14px';
  numbers.style.lineHeight = '1.2';
  numbers.style.opacity = '0.5';
  numbers.style.whiteSpace = 'pre-wrap';
  numbers.textContent = generateNumbers();
  background.appendChild(numbers);

  // Update numbers every 0.5 seconds (faster refresh)
  setInterval(() => {
    numbers.textContent = generateNumbers();
  }, 20000);
}

createBackground();
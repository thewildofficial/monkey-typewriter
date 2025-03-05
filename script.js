// DOM Elements
const elements = {
  paragraph: document.getElementById('paragraph'),
  alphabet: document.getElementById('alphabet'),
  speed: document.getElementById('speed'),
  startButton: document.getElementById('start-button'),
  resetButton: document.getElementById('reset-button'),
  timer: document.getElementById('timer'),
  targetParagraph: document.getElementById('target-paragraph'),
  typingStream: document.getElementById('typing-stream'),
  simulationSection: document.getElementById('simulation-section'),
  statsSection: document.getElementById('stats-section'),
  totalTime: document.getElementById('total-time'),
  totalKeystrokes: document.getElementById('total-keystrokes'),
  keystrokesPerChar: document.getElementById('keystrokes-per-char'),
  expectedKeystrokes: document.getElementById('expected-keystrokes'),
  numRuns: document.getElementById('num-runs'),
  multiRunButton: document.getElementById('multi-run-button'),
  loadingIndicator: document.querySelector('.loading-indicator'),
  multiRunChart: document.querySelector('.multi-run-chart'),
  multiRunStats: document.querySelector('.multi-run-stats'),
  meanKeystrokes: document.getElementById('mean-keystrokes'),
  stdDev: document.getElementById('std-dev'),
  theoreticalExpected: document.getElementById('theoretical-expected'),
  themeSwitch: document.getElementById('theme-switch'),
  charCount: document.getElementById('char-count'),
  speedValue: document.getElementById('speed-value'),
  progressFill: document.getElementById('progress-fill'),
  progressPercent: document.getElementById('progress-percent'),
  currentKeystrokes: document.getElementById('current-keystrokes'),
  pauseButton: document.getElementById('pause-button'),
  speedUpButton: document.getElementById('speed-up-button'),
  autoScrollToggle: document.getElementById('auto-scroll-toggle'),
  runProgress: document.getElementById('run-progress'),
  runTotal: document.getElementById('run-total'),
  alphabetSize: document.getElementById('alphabet-size'),
  expectedTries: document.getElementById('expected-tries'),
  funFactsSection: document.getElementById('fun-facts'),
  textLength: document.getElementById('text-length'),
  totalProbability: document.getElementById('total-probability'),
  timeEstimate: document.getElementById('time-estimate'),
  notification: document.getElementById('notification'),
  shareResults: document.getElementById('share-results'),
  confettiContainer: document.getElementById('confetti-container'),
  mathAlphabetSize: document.getElementById('math-alphabet-size'),
  mathExpected: document.getElementById('math-expected'),
  probabilityExplanation: document.querySelector('.probability-explanation')
};

// Simulation state
let state = {
  targetText: '',
  currentIndex: 0,
  keystrokes: 0,
  keystrokesByCharacter: [],
  startTime: 0,
  endTime: 0,
  timerInterval: null,
  typingInterval: null,
  isRunning: false,
  isPaused: false,
  alphabetSize: 0,
  originalSpeed: 10,
  autoScroll: true,
  darkMode: false
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners
  elements.startButton.addEventListener('click', startSimulation);
  elements.resetButton.addEventListener('click', resetSimulation);
  elements.multiRunButton.addEventListener('click', runMultipleSimulations);
  elements.pauseButton.addEventListener('click', togglePause);
  elements.speedUpButton.addEventListener('click', speedUp);
  elements.autoScrollToggle.addEventListener('click', toggleAutoScroll);
  elements.themeSwitch.addEventListener('change', toggleTheme);
  elements.shareResults.addEventListener('click', shareResults);
  elements.paragraph.addEventListener('input', updateCharCount);
  elements.speed.addEventListener('input', updateSpeedDisplay);
  elements.alphabet.addEventListener('input', updateAlphabetInfo);

  // Initial setup
  updateCharCount();
  updateSpeedDisplay();
  updateAlphabetInfo();
  loadThemePreference();

  // Apply animations
  animateHeader();
});

// Update character count
function updateCharCount() {
  const text = elements.paragraph.value;
  const alphabet = elements.alphabet.value;
  const validChars = text.split('').filter(char => alphabet.includes(char)).length;
  elements.charCount.textContent = validChars;
}

// Update speed display
function updateSpeedDisplay() {
  const speed = elements.speed.value;
  elements.speedValue.textContent = speed;
}

// Update alphabet info
function updateAlphabetInfo() {
  const alphabet = elements.alphabet.value;
  const size = alphabet.length;
  
  if (elements.alphabetSize) {
    elements.alphabetSize.textContent = size;
  }
  
  if (elements.expectedTries) {
    elements.expectedTries.textContent = size;
  }
  
  if (elements.mathAlphabetSize) {
    elements.mathAlphabetSize.textContent = size;
  }
  
  if (elements.mathExpected) {
    elements.mathExpected.textContent = size;
  }
}

// Toggle dark/light theme
function toggleTheme() {
  state.darkMode = elements.themeSwitch.checked;
  document.body.classList.toggle('dark-mode', state.darkMode);
  localStorage.setItem('darkMode', state.darkMode);
}

// Load theme preference
function loadThemePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  elements.themeSwitch.checked = darkMode;
  state.darkMode = darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
}

// Animate header elements
function animateHeader() {
  gsap.from('.logo-container', { 
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'
  });
  
  gsap.from('h1', { 
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });
  
  gsap.from('.tagline', { 
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
  });
}

// Preprocess the paragraph for simulation
function preprocessParagraph(text, alphabet) {
  // Convert to lowercase and filter only characters in the alphabet
  return text.toLowerCase()
    .split('')
    .filter(char => alphabet.includes(char))
    .join('');
}

// Start the simulation
function startSimulation() {
  if (state.isRunning) return;
  
  // Get and validate input
  const inputText = elements.paragraph.value.trim();
  const alphabet = elements.alphabet.value;
  const speed = parseInt(elements.speed.value);
  
  if (!inputText) {
    showNotification('⚠️ Please enter a paragraph to match.');
    return;
  }
  
  if (!alphabet) {
    showNotification('⚠️ Please specify an alphabet.');
    return;
  }
  
  if (isNaN(speed) || speed < 1) {
    showNotification('⚠️ Please enter a valid typing speed.');
    return;
  }
  
  // Preprocess the paragraph
  state.targetText = preprocessParagraph(inputText, alphabet);
  if (!state.targetText) {
    showNotification('⚠️ After preprocessing, there are no valid characters in your paragraph. Please check your alphabet and paragraph.');
    return;
  }
  
  // Initialize simulation state
  state.currentIndex = 0;
  state.keystrokes = 0;
  state.keystrokesByCharacter = Array(state.targetText.length).fill(0);
  state.alphabetSize = alphabet.length;
  state.isRunning = true;
  state.isPaused = false;
  state.originalSpeed = speed;
  
  // Display the target paragraph
  displayTargetParagraph();
  
  // Clear typing stream
  elements.typingStream.innerHTML = '';
  
  // Show simulation section with animation
  elements.simulationSection.classList.remove('hidden');
  elements.statsSection.classList.add('hidden');
  
  // Start timer
  state.startTime = Date.now();
  updateTimer();
  state.timerInterval = setInterval(updateTimer, 1000);
  
  // Start typing simulation
  const typingDelay = 1000 / speed;
  state.typingInterval = setInterval(() => simulateTyping(alphabet), typingDelay);
  
  // Disable start button
  elements.startButton.disabled = true;
}

// Display the target paragraph with each character in a span
function displayTargetParagraph() {
  elements.targetParagraph.innerHTML = state.targetText
    .split('')
    .map(char => `<span class="unmatched">${char}</span>`)
    .join('');
}

// Update the timer display
function updateTimer() {
  const elapsedMs = Date.now() - state.startTime;
  elements.timer.textContent = formatTime(elapsedMs);
}

// Format time in HH:MM:SS format
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes % 60).padStart(2, '0');
  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Simulate a monkey typing a random character
function simulateTyping(alphabet) {
  if (state.currentIndex >= state.targetText.length) {
    completeSimulation();
    return;
  }
  
  // Generate a random character from the alphabet
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  const randomChar = alphabet[randomIndex];
  
  // Increment keystrokes
  state.keystrokes++;
  state.keystrokesByCharacter[state.currentIndex]++;
  
  // Check if the character matches the current target character
  const targetChar = state.targetText[state.currentIndex];
  const isMatch = randomChar === targetChar;
  
  // Create a span element for the typed character
  const span = document.createElement('span');
  span.textContent = randomChar;
  span.className = isMatch ? 'matched' : 'unmatched';
  elements.typingStream.appendChild(span);
  
  // If there's a match, advance to the next character and update the target display
  if (isMatch) {
    const targetSpans = elements.targetParagraph.querySelectorAll('span');
    targetSpans[state.currentIndex].className = 'matched';
    state.currentIndex++;
    
    // Auto-scroll the typing stream if it gets too long
    if (elements.typingStream.scrollHeight > elements.typingStream.clientHeight) {
      elements.typingStream.scrollTop = elements.typingStream.scrollHeight;
    }
  }
  updateProgressBar();
}

// Complete the simulation and show statistics
function completeSimulation() {
  clearInterval(state.timerInterval);
  clearInterval(state.typingInterval);
  
  state.endTime = Date.now();
  state.isRunning = false;
  elements.startButton.disabled = false;
  
  // Calculate statistics
  const totalTime = state.endTime - state.startTime;
  const averageKeystrokesPerChar = state.keystrokes / state.targetText.length;
  const expectedKeystrokesPerChar = state.alphabetSize;
  
  // Update statistics display
  elements.totalTime.textContent = formatTime(totalTime);
  elements.totalKeystrokes.textContent = state.keystrokes;
  elements.keystrokesPerChar.textContent = averageKeystrokesPerChar.toFixed(2);
  elements.expectedKeystrokes.textContent = expectedKeystrokesPerChar.toFixed(2);
  
  // Show statistics section
  elements.statsSection.classList.remove('hidden');
  
  // Create keystrokes chart
  createKeystrokesChart();
}

// Reset the simulation
function resetSimulation() {
  clearInterval(state.timerInterval);
  clearInterval(state.typingInterval);
  
  elements.timer.textContent = '00:00:00';
  elements.typingStream.innerHTML = '';
  elements.targetParagraph.innerHTML = '';
  
  elements.simulationSection.classList.add('hidden');
  elements.statsSection.classList.add('hidden');
  
  state.isRunning = false;
  elements.startButton.disabled = false;
}

// Create a bar chart showing keystrokes per character
function createKeystrokesChart() {
  const ctx = document.getElementById('keystrokes-chart').getContext('2d');
  
  // Create labels (target characters)
  const labels = state.targetText.split('');
  
  // Destroy existing chart if it exists
  if (window.keystrokesChart instanceof Chart) {
    window.keystrokesChart.destroy();
  }
  
  // Create new chart
  window.keystrokesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Keystrokes per Character',
        data: state.keystrokesByCharacter,
        backgroundColor: 'rgba(74, 78, 105, 0.7)',
        borderColor: 'rgba(74, 78, 105, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Keystrokes'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Target Characters'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function(context) {
              return `Character: "${context[0].label}"`;
            },
            label: function(context) {
              return `Keystrokes: ${context.raw}`;
            }
          }
        }
      }
    }
  });
}

// Run multiple simulations
async function runMultipleSimulations() {
  const numRuns = parseInt(elements.numRuns.value);
  const alphabet = elements.alphabet.value;
  const inputText = elements.paragraph.value.trim();
  
  if (isNaN(numRuns) || numRuns < 1) {
    alert('Please enter a valid number of runs.');
    return;
  }
  
  if (!inputText) {
    alert('Please enter a paragraph to match.');
    return;
  }
  
  if (!alphabet) {
    alert('Please specify an alphabet.');
    return;
  }
  
  const preprocessedText = preprocessParagraph(inputText, alphabet);
  if (!preprocessedText) {
    alert('After preprocessing, there are no valid characters in your paragraph. Please check your alphabet and paragraph.');
    return;
  }
  
  // Show loading indicator
  elements.multiRunButton.disabled = true;
  elements.loadingIndicator.classList.remove('hidden');
  
  // Use setTimeout to allow the UI to update before running simulations
  setTimeout(async () => {
    // Run simulations
    const results = await performMultipleSimulations(preprocessedText, alphabet, numRuns);
    
    // Calculate statistics
    const mean = calculateMean(results);
    const stdDev = calculateStandardDeviation(results, mean);
    const theoreticalExpected = preprocessedText.length * alphabet.length;
    
    // Update statistics display
    elements.meanKeystrokes.textContent = mean.toFixed(2);
    elements.stdDev.textContent = stdDev.toFixed(2);
    elements.theoreticalExpected.textContent = theoreticalExpected;
    
    // Create histogram
    createHistogram(results);
    
    // Show results
    elements.multiRunChart.classList.remove('hidden');
    elements.multiRunStats.classList.remove('hidden');
    elements.loadingIndicator.classList.add('hidden');
    elements.multiRunButton.disabled = false;
  }, 50);
}

// Perform multiple simulations and return the results
function performMultipleSimulations(targetText, alphabet, numRuns) {
  return new Promise(resolve => {
    const results = [];
    const totalChars = targetText.length;
    
    for (let i = 0; i < numRuns; i++) {
      let totalKeystrokes = 0;
      let currentIndex = 0;
      
      while (currentIndex < totalChars) {
        // Generate a random character from the alphabet
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomChar = alphabet[randomIndex];
        totalKeystrokes++;
        
        // Check if the character matches the current target character
        if (randomChar === targetText[currentIndex]) {
          currentIndex++;
        }
      }
      
      results.push(totalKeystrokes);
    }
    
    resolve(results);
  });
}

// Calculate the mean of an array of values
function calculateMean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Calculate the standard deviation of an array of values
function calculateStandardDeviation(values, mean) {
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(variance);
}

// Create a histogram of simulation results
function createHistogram(results) {
  const ctx = document.getElementById('multi-run-chart').getContext('2d');
  
  // Determine appropriate bin size
  const min = Math.min(...results);
  const max = Math.max(...results);
  const range = max - min;
  const binSize = Math.max(1, Math.ceil(range / 20)); // Maximum of 20 bins
  
  // Create bins
  const bins = {};
  for (let i = Math.floor(min / binSize) * binSize; i <= max; i += binSize) {
    bins[i] = 0;
  }
  
  // Fill bins
  results.forEach(result => {
    const binIndex = Math.floor(result / binSize) * binSize;
    bins[binIndex] = (bins[binIndex] || 0) + 1;
  });
  
  // Convert bins to arrays
  const labels = Object.keys(bins).map(bin => `${bin} - ${parseInt(bin) + binSize - 1}`);
  const data = Object.values(bins);
  
  // Destroy existing chart if it exists
  if (window.histogramChart instanceof Chart) {
    window.histogramChart.destroy();
  }
  
  // Create new chart
  window.histogramChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frequency',
        data: data,
        backgroundColor: 'rgba(154, 140, 152, 0.7)',
        borderColor: 'rgba(154, 140, 152, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Total Keystrokes'
          }
        }
      }
    }
  });
}

// Toggle pause/resume simulation
function togglePause() {
  if (!state.isRunning) return;
  
  state.isPaused = !state.isPaused;
  const pauseButton = elements.pauseButton;
  
  if (state.isPaused) {
    clearInterval(state.typingInterval);
    clearInterval(state.timerInterval);
    pauseButton.innerHTML = '<i class="fas fa-play button-icon"></i> Resume';
  } else {
    state.timerInterval = setInterval(updateTimer, 1000);
    const typingDelay = 1000 / parseInt(elements.speed.value);
    state.typingInterval = setInterval(() => simulateTyping(elements.alphabet.value), typingDelay);
    pauseButton.innerHTML = '<i class="fas fa-pause button-icon"></i> Pause';
  }
}

// Speed up simulation
function speedUp() {
  if (!state.isRunning || state.isPaused) return;
  
  // Double the current speed
  const currentSpeed = parseInt(elements.speed.value);
  const newSpeed = currentSpeed * 2;
  
  // Update speed slider and display
  elements.speed.value = newSpeed;
  elements.speedValue.textContent = newSpeed;
  
  // Update typing interval
  clearInterval(state.typingInterval);
  const typingDelay = 1000 / newSpeed;
  state.typingInterval = setInterval(() => simulateTyping(elements.alphabet.value), typingDelay);
  
  // Show notification
  showNotification('🚀 Speed doubled!');
}

// Toggle auto-scroll in typing stream
function toggleAutoScroll() {
  state.autoScroll = !state.autoScroll;
  elements.autoScrollToggle.classList.toggle('active', state.autoScroll);
  
  if (state.autoScroll && elements.typingStream.scrollHeight > elements.typingStream.clientHeight) {
    elements.typingStream.scrollTop = elements.typingStream.scrollHeight;
  }
}

// Show a temporary notification
function showNotification(message) {
  if (!elements.notification) return;
  
  const notificationMessage = elements.notification.querySelector('.notification-message');
  if (notificationMessage) {
    notificationMessage.textContent = message;
  }
  
  elements.notification.classList.add('visible');
  
  setTimeout(() => {
    elements.notification.classList.remove('visible');
  }, 3000);
}

// Share results to social media or copy to clipboard
function shareResults() {
  if (!state.endTime) return;
  
  const text = elements.paragraph.value.trim();
  const alphabet = elements.alphabet.value;
  const keystrokes = state.keystrokes;
  const time = formatTime(state.endTime - state.startTime);
  
  const shareText = `I just simulated the Infinite Monkey Theorem! 🐒💻\n\n` +
    `My monkey typed "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" ` +
    `using an alphabet of ${alphabet.length} characters.\n\n` +
    `It took ${keystrokes} keystrokes and ${time} to complete.\n\n` +
    `Try it yourself at MonkeyTypewriter.io`;
  
  // Try to use the Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'Infinite Monkey Theorem Simulation',
      text: shareText
    }).catch(() => {
      // Fallback to clipboard copy
      copyToClipboard(shareText);
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareText);
  }
}

// Copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('📋 Results copied to clipboard!');
      createConfetti();
    })
    .catch(() => {
      showNotification('⚠️ Failed to copy results. Please try again.');
    });
}

// Create confetti effect
function createConfetti() {
  const confettiSettings = {
    target: elements.confettiContainer,
    max: 80,
    size: 1.5,
    animate: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
    clock: 25,
    start_from_edge: true,
    respawn: false
  };
  
  if (window.confetti) {
    const confetti = new window.confetti.create(confettiSettings);
    confetti();
    
    setTimeout(() => {
      confetti.clear();
    }, 3000);
  }
}

// Update the progress bar
function updateProgressBar() {
  if (!state.isRunning) return;
  
  const progress = (state.currentIndex / state.targetText.length) * 100;
  elements.progressFill.style.width = `${progress}%`;
  elements.progressPercent.textContent = `${Math.floor(progress)}%`;
  elements.currentKeystrokes.textContent = state.keystrokes;
}

// Update probability and time estimates based on input
function updateProbabilityEstimates() {
  const text = elements.paragraph.value.trim();
  const alphabet = elements.alphabet.value;
  const speed = parseInt(elements.speed.value) || 10;
  
  if (!text || !alphabet) return;
  
  const preprocessedText = preprocessParagraph(text, alphabet);
  const textLength = preprocessedText.length;
  const alphabetSize = alphabet.length;
  
  // Calculate probability
  const probability = Math.pow(1/alphabetSize, textLength);
  
  // Calculate expected keystrokes
  const expectedKeystrokes = alphabetSize * textLength;
  
  // Calculate estimated time (in seconds) based on speed
  const estimatedTimeSeconds = expectedKeystrokes / speed;
  
  // Update UI
  if (elements.textLength) {
    elements.textLength.textContent = textLength;
  }
  
  if (elements.totalProbability) {
    elements.totalProbability.textContent = probability.toExponential(6);
  }
  
  if (elements.timeEstimate) {
    const timeString = formatEstimatedTime(estimatedTimeSeconds);
    elements.timeEstimate.textContent = timeString;
  }
}

// Format estimated time in a human-readable way
function formatEstimatedTime(seconds) {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutes`;
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} hours`;
  } else if (seconds < 31536000) {
    return `${Math.round(seconds / 86400)} days`;
  } else if (seconds < 3153600000) {
    return `${Math.round(seconds / 31536000)} years`;
  } else {
    return `${(seconds / 31536000).toExponential(2)} years`;
  }
}

// Update the fun facts based on input
function updateFunFacts() {
  const text = elements.paragraph.value.trim();
  const alphabet = elements.alphabet.value;
  
  if (!text || !alphabet || !elements.funFactsSection) return;
  
  const preprocessedText = preprocessParagraph(text, alphabet);
  const textLength = preprocessedText.length;
  const alphabetSize = alphabet.length;
  
  // Calculate comparative statistics
  const compareWithShakespeare = calculateComparison(textLength, alphabetSize, 5_000_000);
  const compareWithBible = calculateComparison(textLength, alphabetSize, 3_000_000);
  
  // Generate fun facts HTML
  const factsHTML = `
    <div class="fun-fact">
      <h3>Did you know?</h3>
      <p>The probability of a monkey randomly typing your text is 1 in ${Math.pow(alphabetSize, textLength).toExponential(2)}.</p>
    </div>
    <div class="fun-fact">
      <h3>Shakespeare Comparison</h3>
      <p>Your text is approximately ${compareWithShakespeare} times ${compareWithShakespeare > 1 ? 'easier' : 'harder'} for a monkey to randomly type than the complete works of Shakespeare.</p>
    </div>
    <div class="fun-fact">
      <h3>Bible Comparison</h3>
      <p>Your text is approximately ${compareWithBible} times ${compareWithBible > 1 ? 'easier' : 'harder'} for a monkey to randomly type than the Bible.</p>
    </div>
  `;
  
  elements.funFactsSection.innerHTML = factsHTML;
}

// Calculate comparison ratio between text and reference
function calculateComparison(textLength, alphabetSize, referenceLength) {
  const textProb = Math.pow(1/alphabetSize, textLength);
  const referenceProb = Math.pow(1/alphabetSize, referenceLength);
  return (referenceProb / textProb).toExponential(2);
}

// Listen for input changes to update estimates
elements.paragraph.addEventListener('input', () => {
  updateCharCount();
  updateProbabilityEstimates();
  updateFunFacts();
});

elements.alphabet.addEventListener('input', () => {
  updateAlphabetInfo();
  updateProbabilityEstimates();
  updateFunFacts();
});

elements.speed.addEventListener('input', () => {
  updateSpeedDisplay();
  updateProbabilityEstimates();
});
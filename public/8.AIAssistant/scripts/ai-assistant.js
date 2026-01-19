/* ========================================
   AI Assistant JavaScript Functions
   Handles voice control, language selection,
   and emergency assistance features
   ======================================== */

// Language Selection
function selectLanguage(language) {
  alert(`You selected: ${language}\n\nLanguage preference saved! The interface will now adapt to ${language}.`);
  
  // Save to localStorage
  localStorage.setItem('selectedLanguage', language);
  
  // Optional: Redirect to main assistant page
  // window.location.href = 'MedicalHelp.html';
}

// Get saved language
function getSavedLanguage() {
  return localStorage.getItem('selectedLanguage') || 'English';
}

// Voice Control Functions
let recognition = null;
let isListening = false;

// Initialize Speech Recognition
function initializeSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      updateVoiceOutput('Listening... Please speak now.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      updateVoiceOutput(`Error: ${event.error}. Please try again.`);
      isListening = false;
    };

    recognition.onend = () => {
      isListening = false;
      if (document.getElementById('voiceOutput')) {
        const output = document.getElementById('voiceOutput');
        if (output.textContent === 'Listening... Please speak now.') {
          output.textContent = 'No speech detected. Click "Start Voice Control" to try again.';
        }
      }
    };
  } else {
    alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
  }
}

// Start voice control
function startVoiceControl() {
  if (!recognition) {
    initializeSpeechRecognition();
  }

  if (recognition && !isListening) {
    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      updateVoiceOutput('Error starting voice control. Please try again.');
    }
  } else if (isListening) {
    updateVoiceOutput('Already listening...');
  }
}

// Stop voice control
function stopVoiceControl() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    updateVoiceOutput('Voice control stopped.');
  }
}

// Handle voice commands
function handleVoiceCommand(command) {
  const lowerCommand = command.toLowerCase().trim();
  updateVoiceOutput(`You said: "${command}"`);

  // Define voice command responses
  const responses = {
    'hello': 'Hello! How can I help you today?',
    'help': 'Emergency services have been notified. Stay calm, help is on the way.',
    'evacuate': 'Evacuation protocol initiated. Please move to the nearest safe exit.',
    'call for help': 'Calling emergency services now...',
    'medical emergency': 'Medical emergency detected. Dispatching ambulance.',
    'fire': 'Fire emergency detected. Fire department has been alerted.',
    'stop': 'Voice control stopped.',
    'status': 'All systems operational. Emergency services are standing by.'
  };

  // Check for matching commands
  let responseFound = false;
  for (const [key, response] of Object.entries(responses)) {
    if (lowerCommand.includes(key)) {
      setTimeout(() => {
        updateVoiceOutput(`${command}\n\nResponse: ${response}`);
      }, 500);
      responseFound = true;
      break;
    }
  }

  if (!responseFound) {
    setTimeout(() => {
      updateVoiceOutput(`${command}\n\nCommand not recognized. Try: "help", "evacuate", "call for help", or "medical emergency".`);
    }, 500);
  }

  // Auto-stop after processing
  if (lowerCommand.includes('stop')) {
    stopVoiceControl();
  }
}

// Update voice output display
function updateVoiceOutput(message) {
  const output = document.getElementById('voiceOutput');
  if (output) {
    output.textContent = message;
    output.classList.add('fade-in');
  }
}

// Emergency Call Functions
function callEmergency() {
  const confirmed = confirm(
    'Emergency call will be triggered!\n\n' +
    'You will be connected to emergency services.\n' +
    'Your location will be shared automatically.\n\n' +
    'Do you want to proceed?'
  );

  if (confirmed) {
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(
            `Emergency call initiated!\n\n` +
            `Your location:\n` +
            `Latitude: ${position.coords.latitude.toFixed(6)}\n` +
            `Longitude: ${position.coords.longitude.toFixed(6)}\n\n` +
            `Connecting to emergency services...`
          );
        },
        (error) => {
          alert(
            'Emergency call initiated!\n\n' +
            'Location unavailable, but call is still being connected.\n' +
            'Please provide your location verbally to the operator.'
          );
        }
      );
    } else {
      alert('Emergency call initiated! Please wait while we connect you.');
    }

    // Log the emergency call
    logEmergencyEvent('Emergency Call', 'Medical emergency call initiated');
  }
}

// Request medical advice
function requestMedicalAdvice() {
  const advice = `
Basic First-Aid Guidelines:

🩹 For Bleeding:
- Apply direct pressure with clean cloth
- Elevate the wound above heart level
- Do not remove embedded objects

🔥 For Burns:
- Cool with running water (10-20 minutes)
- Do not apply ice directly
- Cover with clean, dry cloth

🦴 For Fractures:
- Immobilize the area
- Do not try to realign bones
- Apply ice pack to reduce swelling

💊 For Poisoning:
- Call poison control immediately
- Do not induce vomiting unless instructed
- Bring container/label if possible

⚠️ Always call emergency services for serious injuries!
  `;

  alert(advice);
}

// Back navigation
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '../index.html';
  }
}

// Log emergency events
function logEmergencyEvent(type, description) {
  const events = JSON.parse(localStorage.getItem('emergencyEvents') || '[]');
  events.push({
    type: type,
    description: description,
    timestamp: new Date().toISOString(),
    language: getSavedLanguage()
  });
  localStorage.setItem('emergencyEvents', JSON.stringify(events));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize speech recognition if on voice control page
  if (document.getElementById('voiceOutput')) {
    initializeSpeechRecognition();
  }

  // Display saved language if present
  const savedLang = getSavedLanguage();
  if (savedLang !== 'English') {
    console.log(`Language preference: ${savedLang}`);
  }
});

// Export functions for global use
window.selectLanguage = selectLanguage;
window.getSavedLanguage = getSavedLanguage;
window.startVoiceControl = startVoiceControl;
window.stopVoiceControl = stopVoiceControl;
window.callEmergency = callEmergency;
window.requestMedicalAdvice = requestMedicalAdvice;
window.goBack = goBack;

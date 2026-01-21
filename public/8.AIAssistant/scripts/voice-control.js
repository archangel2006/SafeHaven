const startVoiceBtn = document.getElementById('startVoiceBtn');
const voiceOutput = document.getElementById('voiceOutput');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // You can change this based on the selected language
  
  startVoiceBtn.addEventListener('click', () => {
    voiceOutput.textContent = 'Listening...';
    recognition.start();
  });
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    voiceOutput.textContent = "You said: " + transcript;
    // Generate a simulated AI response
    const response = getFallbackResponse(transcript);
    setTimeout(() => {
      voiceOutput.textContent += "\nAssistant: " + response;
    }, 1500);
  };
  
  recognition.onerror = function(event) {
    voiceOutput.textContent = 'Error occurred: ' + event.error;
  };
} else {
  startVoiceBtn.disabled = true;
  voiceOutput.textContent = "Voice recognition not supported in this browser.";
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello! How can I assist you today?";
  } else if (msg.includes("evacuate")) {
    return "Please follow the evacuation instructions and remain calm.";
  } else if (msg.includes("medical")) {
    return "For medical emergencies, please call 911 immediately.";
  } else if (msg.includes("help")) {
    return "I'm here to help! Could you please provide more details?";
  } else if (msg.includes("thank")) {
    return "You're welcome! Stay safe.";
  } else {
    return "I'm sorry, I didn't understand that. Could you please rephrase?";
  }
}

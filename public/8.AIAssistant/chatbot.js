const chatbotHTML = `
<div id="chatbot-container">
  <!-- Floating circular button with custom image -->
  <button id="chatbot-toggle" title="Chat with SafeHaven">
    <img src="https://i.pinimg.com/474x/84/8a/66/848a6696ad98779868a826290b7b8dbd.jpg" 
         alt="AI Assistant" id="chatbot-icon" />
  </button>

  <!-- Chat popup -->
  <div id="chatbot-popup">
    <div id="chatbot-header">
      <span>🚨 Disaster Help Bot</span>
      <button id="chatbot-close">✖</button>
    </div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-container">
      <input type="text" id="chatbot-input" placeholder="Ask about disaster safety, help, or donations..." />
      <button id="chatbot-send">➡️</button>
    </div>
  </div>
</div>

<style>
/* Container & Floating button */
#chatbot-container {
  position: fixed;
  bottom: 25px;
  right: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 9999;
}

/* Floating circular button */
#chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  transition: all 0.3s;
}
#chatbot-toggle:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

/* Chat popup */
#chatbot-popup {
  display: none;
  position: fixed;
  bottom: 95px;
  right: 25px;
  width: 360px;
  max-height: 500px;
  background-color: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

/* Header */
#chatbot-header {
  background-color: #007bff;
  color: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  cursor: default;
}
#chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
}
#chatbot-close:hover { color: #ffdddd; }

/* Messages */
#chatbot-messages {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

/* Message bubbles */
.message {
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 75%;
  word-wrap: break-word;
  position: relative;
  font-size: 14px;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 0;
  animation: fadeIn 0.3s;
}

.bot-message {
  align-self: flex-start;
  background-color: #e2e3e5;
  color: #333;
  border-bottom-left-radius: 0;
  animation: fadeIn 0.3s;
}

/* Input container */
#chatbot-input-container {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 8px;
  background-color: #f1f3f5;
}
#chatbot-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
}
#chatbot-send {
  background-color: #007bff;
  border: none;
  color: white;
  margin-left: 8px;
  padding: 0 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s, transform 0.2s;
}
#chatbot-send:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
#chatbot-container {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 9999;
}

/* Button with image */
#chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent; /* background hidden, image shows */
}
#chatbot-toggle:hover {
  transform: scale(1.1);
}

/* Image inside button */
#chatbot-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}


#chatbot-popup {
  display: none;
  position: fixed;
  bottom: 95px;
  right: 25px;
  width: 600px;
  max-height: 650px;
  height: 80vh;
  background-color: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  overflow: hidden;
 
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}
#chatbot-header {
  background-color: #007bff;
  color: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
#chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
}
#chatbot-close:hover { color: #ffdddd; }

/* Messages */
#chatbot-messages {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

/* Message bubbles */
.message {
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 75%;
  word-wrap: break-word;
  position: relative;
  font-size: 14px;
}
.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 0;
  animation: fadeIn 0.3s;
}
.bot-message {
  align-self: flex-start;
  background-color: #e2e3e5;
  color: #333;
  border-bottom-left-radius: 0;
  animation: fadeIn 0.3s;
}

/* Input container */
#chatbot-input-container {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 8px;
  background-color: #f1f3f5;
}
#chatbot-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
}
#chatbot-send {
  background-color: #007bff;
  border: none;
  color: white;
  margin-left: 8px;
  padding: 0 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s, transform 0.2s;
}
#chatbot-send:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Animations */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 420px) {
  #chatbot-popup { width: 90%; right: 5%; bottom: 90px; }
}
/* Animations */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 420px) {
  #chatbot-popup { width: 90%; right: 5%; bottom: 90px; }
}
</style>
`;
// Insert chatbot into page
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

// 1️⃣ Get elements
const toggleBtn = document.getElementById('chatbot-toggle');
const popup = document.getElementById('chatbot-popup');
const closeBtn = document.getElementById('chatbot-close');
const sendBtn = document.getElementById('chatbot-send');
const input = document.getElementById('chatbot-input');
const messagesDiv = document.getElementById('chatbot-messages');

// 2️⃣ Add default SafeHaven welcome message
const welcomeMessage = document.createElement('div');
welcomeMessage.className = 'message bot-message';
welcomeMessage.innerHTML = `
  Hello! 👋 I am the SafeHaven Disaster Help Bot. 
  I can assist you 
`;
messagesDiv.appendChild(welcomeMessage);

// 3️⃣ Conversation history for AI
let conversation = [
  {
    role: 'system',
    content: `
You are an AI assistant for the SafeHaven Disaster Management Platform.

ROLE:
• Help users during disasters
• Guide users to SafeHaven platform features
• Assume disaster urgency by default
• Be calm, reassuring, action-focused

FEATURES:
• Emergency SOS and help requests
• Disaster alerts & risk info
• Evacuation & safety guidance
• Community updates & coordination
• Volunteer participation
• Donations for disaster relief

RULES:
• Keep responses short (2–4 lines)
• Use bullet points only for steps/options
• Avoid technical language or long explanations
• Always refer to SafeHaven features
`
  },
  {
    role: 'assistant',
    content: welcomeMessage.textContent // include default bot message
  }
];

// 4️⃣ Toggle popup
toggleBtn.addEventListener('click', () => {
  popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
  if (popup.style.display === 'flex') input.focus();
});

// 5️⃣ Close popup
closeBtn.addEventListener('click', () => popup.style.display = 'none');

// 6️⃣ Send message
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message
  const userP = document.createElement('div');
  userP.className = 'message user-message';
  userP.textContent = userMessage;
  messagesDiv.appendChild(userP);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  input.value = '';

  // Push to conversation
  conversation.push({ role: 'user', content: userMessage });

  try {
    const res = await fetch('http://localhost:3000/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation })
    });
    const data = await res.json();

    const botP = document.createElement('div');
    botP.className = 'message bot-message';
    botP.textContent = data.text;
    messagesDiv.appendChild(botP);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    conversation.push({ role: 'assistant', content: data.text });
  } catch (err) {
    const errP = document.createElement('div');
    errP.className = 'message bot-message';
    errP.textContent = '⚠️ Sorry, something went wrong.';
    messagesDiv.appendChild(errP);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

// 7️⃣ Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

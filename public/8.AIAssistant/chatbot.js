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
#chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#chatbot-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}
#chatbot-toggle:hover {
  transform: scale(1.1);
}

#chatbot-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}


#chatbot-popup {
  position: fixed;
  bottom: 90px;
  right: 20px;

  width: clamp(720px, 40vw, 420px);
  height: clamp(420px, 70vh, 600px);

  background-color: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);

  display: none;
  flex-direction: column;
  overflow: hidden;

  animation: slideUp 0.3s ease-out;
}


#chatbot-header {
  background-color: #007bff;
  color: white;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 15px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

#chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}


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
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-message {
  align-self: flex-start;
  background-color: #e2e3e5;
  color: #333;
  border-bottom-left-radius: 4px;
}


#chatbot-input-container {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #f1f3f5;
}

#chatbot-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}

#chatbot-send {
  padding: 0 16px;
  border-radius: 20px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
@media (max-width: 600px) {
  #chatbot-popup {
    position: fixed;
    bottom: env(safe-area-inset-bottom, 0);
    left: 0;
    right: 0;

    width: 100%;
    height: auto;          
    max-height: 60vh;      

    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }

  #chatbot-messages {
    overflow-y: auto;     
  }

  #chatbot-header {
    position: sticky;
    top: 0;
    z-index: 10;
    font-size: 15px;
  }
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

// Expose SafeBot opener for external buttons (Home Page)
window.openChatbot = function () {
  popup.style.display = 'flex';
  input.focus();
};

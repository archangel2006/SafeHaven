// SafeHaven AI Chatbot - Advanced Customization Examples

// ============================================
// 1. BASIC INTEGRATION (Easiest)
// ============================================

/*
Just add these two lines to any HTML file:

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
<script src="../js/chatbot.js"></script>

That's it! The chatbot will automatically initialize.
*/


// ============================================
// 2. CUSTOM INITIALIZATION
// ============================================

/*
If you want more control, modify chatbot.js:

// Option A: Extend the class
class CustomChatbot extends SafeHavenChatbot {
  handleBotResponse(userMessage) {
    // Your custom logic here
    const response = this.getCustomResponse(userMessage);
    this.addBotMessage(response);
  }

  getCustomResponse(message) {
    // Your custom response logic
    return "Custom response based on: " + message;
  }
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
  new CustomChatbot();
});
*/


// ============================================
// 3. MODIFY COLOR SCHEME
// ============================================

/*
In chatbot.js, find the injectStyles() method and change:

:root {
  --chatbot-primary: #52caec;      // Light blue
  --chatbot-secondary: #4a00e0;    // Purple
  --chatbot-accent: #8e2de2;       // Pink-purple
  --chatbot-success: #52d273;      // Green
  --chatbot-danger: #ff3b30;       // Red
  --chatbot-warning: #ff9500;      // Orange
}

Example themes:

// Dark Mode
--chatbot-primary: #1a1a2e;
--chatbot-secondary: #16213e;
--chatbot-accent: #0f3460;

// Nature Theme
--chatbot-primary: #27ae60;
--chatbot-secondary: #16a085;
--chatbot-accent: #f39c12;

// Professional Blue
--chatbot-primary: #2980b9;
--chatbot-secondary: #3498db;
--chatbot-accent: #1abc9c;
*/


// ============================================
// 4. ADD CUSTOM EMERGENCY RESPONSES
// ============================================

/*
In chatbot.js, find handleBotResponse() method and add:

const responses = {
  // Existing responses...
  
  // Add your custom types:
  'tsunami': 'Tsunami Safety:\n• Move to high ground immediately\n• Stay away from beaches\n• Follow official evacuation orders\n• Keep emergency supplies ready',
  
  'tornado': 'Tornado Safety:\n• Take shelter in basement or interior room\n• Stay away from windows\n• Get under sturdy furniture\n• Listen to weather alerts\n• Never open windows during tornado',
  
  'hazmat': 'Chemical/Hazmat Emergency:\n• Evacuate immediately\n• Move upwind from the danger\n• Don\'t touch containers\n• Call 911\n• Seek medical attention if exposed',
  
  'power': 'Power Outage Response:\n• Check if power is out in your area\n• Use flashlights, not candles\n• Keep refrigerator closed\n• Avoid open flames\n• Use emergency hotlines for info',
  
  'custom': 'Your custom response here'
};

// Then add logic to match these:
if (lowerMessage.includes('tsunami')) {
  response = responses.tsunami;
} else if (lowerMessage.includes('tornado')) {
  response = responses.tornado;
}
// ... and so on
*/


// ============================================
// 5. INTEGRATE WITH BACKEND API
// ============================================

/*
Replace the handleBotResponse method with API call:

async handleBotResponse(userMessage) {
  try {
    const response = await fetch('https://your-api.com/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        message: userMessage,
        userId: getUserId(),  // Get user ID from your app
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('API response was not ok');
    }

    const data = await response.json();
    this.addBotMessage(data.response);
    
    // Optional: Handle quick replies
    if (data.quickReplies) {
      this.showQuickReplies(data.quickReplies);
    }
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    this.addBotMessage(
      'Sorry, I encountered an error. Please try again or contact support.'
    );
  }
}
*/


// ============================================
// 6. ADD QUICK REPLY BUTTONS
// ============================================

/*
Add this method to SafeHavenChatbot class:

showQuickReplies(replies) {
  const messagesContainer = document.getElementById('chatMessages');
  const quickReplyDiv = document.createElement('div');
  quickReplyDiv.className = 'quick-replies';

  replies.forEach(reply => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply-btn';
    btn.textContent = reply.text;
    btn.onclick = () => {
      this.addUserMessage(reply.text);
      this.sendMessage(reply.text);
      quickReplyDiv.remove();
    };
    quickReplyDiv.appendChild(btn);
  });

  messagesContainer.appendChild(quickReplyDiv);
  this.scrollToBottom();
}

// Usage in response:
if (lowerMessage.includes('help')) {
  this.addBotMessage('What would you like help with?');
  this.showQuickReplies([
    { text: 'Emergency' },
    { text: 'Evacuation' },
    { text: 'Medical' }
  ]);
}
*/


// ============================================
// 7. ADD MULTI-LANGUAGE SUPPORT
// ============================================

/*
Add language support:

class SafeHavenChatbot {
  constructor(language = 'en') {
    this.language = language;
    this.translations = {
      'en': {
        welcome: 'Welcome to SafeHaven AI Assistant!',
        emergency: 'Emergency detected. Please call 911.',
        // ... more translations
      },
      'es': {
        welcome: '¡Bienvenido al Asistente de IA de SafeHaven!',
        emergency: 'Emergencia detectada. Llame al 911.',
        // ... more translations
      },
      'fr': {
        welcome: 'Bienvenue sur l\'assistant IA SafeHaven!',
        emergency: 'Urgence détectée. Appelez le 911.',
        // ... more translations
      }
    };
    this.init();
  }

  translate(key) {
    return this.translations[this.language][key] || key;
  }

  setLanguage(lang) {
    this.language = lang;
    // Reinitialize or reload messages
  }
}

// Usage:
const chatbot = new SafeHavenChatbot('es');  // Spanish
chatbot.setLanguage('fr');  // Switch to French
*/


// ============================================
// 8. ADD USER AUTHENTICATION
// ============================================

/*
Track users and their conversations:

class SafeHavenChatbot {
  constructor(userId = null) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.init();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async saveConversation() {
    if (!this.userId) return;
    
    try {
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          messages: this.conversationHistory,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  addUserMessage(text) {
    super.addUserMessage(text);
    this.conversationHistory.push({
      sender: 'user',
      message: text,
      timestamp: new Date().toISOString()
    });
  }

  addBotMessage(text) {
    super.addBotMessage(text);
    this.conversationHistory.push({
      sender: 'bot',
      message: text,
      timestamp: new Date().toISOString()
    });
    this.saveConversation();
  }
}

// Usage:
const userChat = new SafeHavenChatbot('user123');
*/


// ============================================
// 9. ADD ANALYTICS TRACKING
// ============================================

/*
Track chatbot interactions:

class SafeHavenChatbot {
  trackEvent(eventName, eventData = {}) {
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    // Send to analytics
    if (window.gtag) {
      gtag('event', eventName, eventData);
    }

    // Or send to your own analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => console.log('Analytics error:', err));
  }

  openChatbot() {
    super.openChatbot();
    this.trackEvent('chatbot_opened', { timestamp: new Date() });
  }

  sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
      this.trackEvent('message_sent', {
        messageLength: message.length,
        messageType: this.detectMessageType(message)
      });
    }

    super.sendMessage();
  }

  detectMessageType(message) {
    if (message.includes('emergency')) return 'emergency';
    if (message.includes('evacuat')) return 'evacuation';
    if (message.includes('medical')) return 'medical';
    return 'general';
  }
}
*/


// ============================================
// 10. ADD SENTIMENT ANALYSIS
// ============================================

/*
Detect user sentiment and respond appropriately:

class SafeHavenChatbot {
  analyzeSentiment(text) {
    const negativeWords = [
      'help', 'emergency', 'danger', 'urgent', 'scared',
      'panic', 'afraid', 'hurt', 'pain', 'injured'
    ];
    
    const positiveWords = [
      'thank', 'good', 'great', 'thanks', 'appreciate',
      'helpful', 'excellent', 'amazing', 'wonderful'
    ];

    const lowerText = text.toLowerCase();
    let negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
    let positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;

    if (negativeCount > positiveCount) {
      return 'urgent';
    } else if (positiveCount > negativeCount) {
      return 'positive';
    }
    return 'neutral';
  }

  handleBotResponse(userMessage) {
    const sentiment = this.analyzeSentiment(userMessage);

    if (sentiment === 'urgent') {
      // Provide immediate emergency resources
      this.addBotMessage(
        'I detected this might be urgent! ' +
        'If this is a life-threatening emergency, please call 911 immediately. ' +
        'How can I assist you right now?'
      );
    } else {
      // Normal response flow
      super.handleBotResponse(userMessage);
    }
  }
}
*/


// ============================================
// 11. ADD FILE UPLOAD CAPABILITY
// ============================================

/*
Allow users to upload documents:

class SafeHavenChatbot {
  setupFileUpload() {
    const chatInput = document.getElementById('chatInput');
    
    // Add file upload button
    const fileBtn = document.createElement('button');
    fileBtn.innerHTML = '<i class="fas fa-paperclip"></i>';
    fileBtn.className = 'file-upload-btn';
    fileBtn.onclick = () => this.triggerFileUpload();

    chatInput.parentElement.insertBefore(fileBtn, chatInput);
  }

  triggerFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => this.handleFileUpload(e.target.files[0]);
    input.click();
  }

  async handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      this.addBotMessage(`File received: ${file.name}. ${data.message}`);
    } catch (error) {
      this.addBotMessage('Failed to upload file. Please try again.');
    }
  }
}
*/


// ============================================
// 12. POSITIONING CUSTOMIZATION
// ============================================

/*
Change chatbot position and size:

Modify the CSS in injectStyles():

// Bottom-left corner
.chatbot-toggle-btn {
  bottom: 30px;
  right: auto;
  left: 30px;
}

.chatbot-modal {
  bottom: 100px;
  right: auto;
  left: 30px;
}

// Top-right corner
.chatbot-toggle-btn {
  top: 30px;
  bottom: auto;
  right: 30px;
}

.chatbot-modal {
  top: 100px;
  bottom: auto;
  right: 30px;
}

// Custom size
.chatbot-modal {
  width: 500px;      // Wider
  height: 700px;     // Taller
}

// Mobile-specific
@media (max-width: 480px) {
  .chatbot-modal {
    width: calc(100vw - 20px);
    height: 80vh;
  }
}
*/


// ============================================
// 13. EVENT HOOKS
// ============================================

/*
Add custom event handling:

class SafeHavenChatbot {
  // Add these properties in constructor
  this.onBeforeSendMessage = null;
  this.onAfterSendMessage = null;
  this.onChatbotOpen = null;
  this.onChatbotClose = null;

  // Modify sendMessage to use hooks
  sendMessage() {
    if (this.onBeforeSendMessage) {
      this.onBeforeSendMessage();
    }

    // Original logic...

    if (this.onAfterSendMessage) {
      this.onAfterSendMessage();
    }
  }

  openChatbot() {
    super.openChatbot();
    if (this.onChatbotOpen) {
      this.onChatbotOpen();
    }
  }

  closeChatbot() {
    super.closeChatbot();
    if (this.onChatbotClose) {
      this.onChatbotClose();
    }
  }
}

// Usage:
const chatbot = new SafeHavenChatbot();
chatbot.onChatbotOpen = () => {
  console.log('Chatbot opened!');
  // Your custom logic
};
*/


// ============================================
// 14. KEYBOARD SHORTCUTS
// ============================================

/*
Add custom keyboard shortcuts:

document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to toggle chatbot
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('chatbotToggle').click();
  }

  // Esc to close chatbot
  if (e.key === 'Escape') {
    const modal = document.getElementById('chatbotModal');
    if (modal.classList.contains('active')) {
      chatbotInstance.closeChatbot();
    }
  }
});
*/


// ============================================
// 15. TESTING & DEBUGGING
// ============================================

/*
Test the chatbot with console commands:

// In browser console:

// Open chatbot
document.getElementById('chatbotToggle').click();

// Send test message
document.getElementById('chatInput').value = 'Test message';
document.getElementById('sendBtn').click();

// Check conversation history
console.log(document.querySelectorAll('.chat-message').length);

// Test specific response
const test = new SafeHavenChatbot();
test.handleBotResponse('earthquake');

// Change language (if implemented)
// chatbot.setLanguage('es');

// Get chatbot state
console.log('Is open:', document.getElementById('chatbotModal').classList.contains('active'));
*/

console.log('SafeHaven Chatbot - Advanced Customization Guide');
console.log('See comments above for 15 different customization examples');
console.log('For more info, see: CHATBOT_IMPLEMENTATION.md');

// SafeHaven AI Chatbot - Pop-up Modal Implementation
class SafeHavenChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createChatbotModal();
    this.attachEventListeners();
    this.loadWelcomeMessage();
  }

  createChatbotModal() {
    // Create chatbot modal HTML
    const chatbotHTML = `
      <!-- Chatbot Modal -->
      <div id="chatbotOverlay" class="chatbot-overlay"></div>
      
      <div id="chatbotModal" class="chatbot-modal">
        <!-- Chatbot Header -->
        <div class="chatbot-header">
          <div class="header-content">
            <i class="fas fa-robot"></i>
            <span class="header-title">SafeHaven AI</span>
            <span class="status-indicator"></span>
          </div>
          <button id="closeChatbot" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Chat Messages Area -->
        <div id="chatMessages" class="chat-messages">
          <!-- Messages will appear here -->
        </div>

        <!-- Chat Input Area -->
        <div class="chat-input-area">
          <input 
            type="text" 
            id="chatInput" 
            class="chat-input-field" 
            placeholder="Ask about safety, evacuation, or get help..."
            autocomplete="off"
          >
          <button id="sendBtn" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- Chatbot Toggle Button (Fixed Position) -->
      <button id="chatbotToggle" class="chatbot-toggle-btn" title="Chat with SafeHaven AI">
        <i class="fas fa-comments"></i>
        <span class="notification-badge">1</span>
      </button>
    `;

    // Inject into body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Inject CSS
    this.injectStyles();
  }

  injectStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      /* Chatbot Styles */
      :root {
        --chatbot-primary: #52caec;
        --chatbot-secondary: #4a00e0;
        --chatbot-accent: #8e2de2;
        --chatbot-success: #52d273;
        --chatbot-danger: #ff3b30;
        --chatbot-warning: #ff9500;
      }

      /* Chatbot Toggle Button */
      .chatbot-toggle-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-secondary));
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(74, 0, 224, 0.4);
        transition: all 0.3s ease;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chatbot-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(74, 0, 224, 0.6);
      }

      .chatbot-toggle-btn:active {
        transform: scale(0.95);
      }

      /* Notification Badge */
      .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--chatbot-danger);
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      /* Overlay */
      .chatbot-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .chatbot-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      /* Chatbot Modal */
      .chatbot-modal {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 420px;
        height: 600px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .chatbot-modal.active {
        opacity: 1;
        transform: translateY(0) scale(1);
        visibility: visible;
      }

      /* Chatbot Header */
      .chatbot-header {
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-secondary));
        color: white;
        padding: 20px;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .header-content i {
        font-size: 24px;
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .status-indicator {
        width: 10px;
        height: 10px;
        background: var(--chatbot-success);
        border-radius: 50%;
        margin-left: auto;
        animation: blink 2s infinite;
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .close-btn {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        transition: transform 0.2s ease;
      }

      .close-btn:hover {
        transform: rotate(90deg);
      }

      /* Chat Messages */
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f9f9f9;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: rgba(82, 202, 236, 0.5);
        border-radius: 3px;
      }

      .chat-message {
        display: flex;
        gap: 10px;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chat-message.user {
        justify-content: flex-end;
      }

      .chat-message.bot {
        justify-content: flex-start;
      }

      .message-content {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 12px;
        word-wrap: break-word;
        font-size: 14px;
        line-height: 1.4;
      }

      .user .message-content {
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-secondary));
        color: white;
        border-bottom-right-radius: 4px;
      }

      .bot .message-content {
        background: #e8e8e8;
        color: #333;
        border-bottom-left-radius: 4px;
      }

      .message-time {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
        text-align: right;
      }

      .user .message-time {
        text-align: right;
      }

      .bot .message-time {
        text-align: left;
      }

      /* Typing Indicator */
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: #e8e8e8;
        border-radius: 12px;
        width: fit-content;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #999;
        animation: typing 1.4s infinite;
      }

      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { opacity: 0.5; }
        30% { opacity: 1; }
      }

      /* Chat Input Area */
      .chat-input-area {
        display: flex;
        padding: 15px;
        gap: 10px;
        background: white;
        border-top: 1px solid #e0e0e0;
        border-radius: 0 0 15px 15px;
      }

      .chat-input-field {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 25px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.3s ease;
      }

      .chat-input-field:focus {
        border-color: var(--chatbot-primary);
        box-shadow: 0 0 0 3px rgba(82, 202, 236, 0.1);
      }

      .send-btn {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--chatbot-primary), var(--chatbot-secondary));
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .send-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(74, 0, 224, 0.3);
      }

      .send-btn:active {
        transform: scale(0.95);
      }

      .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: scale(1);
      }

      /* Quick Reply Buttons */
      .quick-replies {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 10px 0;
      }

      .quick-reply-btn {
        padding: 8px 12px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .quick-reply-btn:hover {
        background: var(--chatbot-primary);
        color: white;
        border-color: var(--chatbot-primary);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .chatbot-modal {
          bottom: 80px;
          right: 15px;
          width: calc(100vw - 30px);
          height: 500px;
          max-width: 500px;
        }

        .chatbot-toggle-btn {
          bottom: 20px;
          right: 20px;
        }

        .message-content {
          max-width: 80%;
        }
      }

      @media (max-width: 480px) {
        .chatbot-modal {
          bottom: 70px;
          right: 10px;
          left: 10px;
          width: auto;
          height: 450px;
        }

        .header-title {
          font-size: 16px;
        }

        .message-content {
          max-width: 85%;
          font-size: 13px;
        }

        .chat-input-field {
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('closeChatbot');
    const overlay = document.getElementById('chatbotOverlay');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    toggleBtn.addEventListener('click', () => this.toggleChatbot());
    closeBtn.addEventListener('click', () => this.closeChatbot());
    overlay.addEventListener('click', () => this.closeChatbot());
    sendBtn.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChatbot() {
    if (this.isOpen) {
      this.closeChatbot();
    } else {
      this.openChatbot();
    }
  }

  openChatbot() {
    this.isOpen = true;
    const modal = document.getElementById('chatbotModal');
    const overlay = document.getElementById('chatbotOverlay');
    const badge = document.querySelector('.notification-badge');

    modal.classList.add('active');
    overlay.classList.add('active');
    badge.style.display = 'none';

    document.getElementById('chatInput').focus();
  }

  closeChatbot() {
    this.isOpen = false;
    const modal = document.getElementById('chatbotModal');
    const overlay = document.getElementById('chatbotOverlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
  }

  loadWelcomeMessage() {
    setTimeout(() => {
      this.addBotMessage(
        "Welcome to SafeHaven! 🛡️ I'm your AI emergency assistant. I can help you with:\n\n" +
        "• Emergency guidance & safety tips\n" +
        "• Disaster information & alerts\n" +
        "• Evacuation procedures\n" +
        "• Medical assistance\n\n" +
        "How can I assist you today?"
      );
    }, 500);
  }

  addBotMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.id = 'typingIndicator';
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    messageDiv.appendChild(indicatorDiv);
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addUserMessage(message);
    input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      this.removeTypingIndicator();
      this.handleBotResponse(message);
    }, 1000);
  }

  handleBotResponse(userMessage) {
    const responses = {
      emergency: "If you're facing an immediate emergency, please call 911 or your local emergency number. SafeHaven can provide additional support and resources.",
      evacuation: "Here are the evacuation guidelines:\n\n1. Follow official evacuation orders\n2. Plan your route in advance\n3. Take important documents & medications\n4. Stay calm and help others\n\nWould you like specific evacuation instructions for your area?",
      earthquake: "Earthquake Safety:\n• DROP, COVER, and HOLD ON\n• Stay away from windows\n• Move to the nearest sturdy shelter\n• Don't use elevators\n\nAfter the earthquake, check for injuries and exit if safe.",
      flood: "Flood Safety:\n• Move to higher ground immediately\n• Never drive through flooded areas\n• Stay away from power lines\n• Avoid contaminated water\n• Keep emergency supplies handy",
      fire: "Fire Safety:\n• Alert others if safe\n• Evacuate immediately\n• Feel doors before opening (may be hot)\n• Crawl under smoke\n• Don't use elevators\n• Meet at designated assembly point",
      hurricane: "Hurricane Preparedness:\n• Secure outdoor items\n• Prepare emergency kit\n• Know your evacuation route\n• Board windows if necessary\n• Stock food, water & medications\n• Keep battery-powered radio ready",
      medical: "For medical emergencies:\n• Call 911 immediately\n• Perform CPR if trained\n• Use AED if available\n• Keep injured person calm\n\nWhat specific medical assistance do you need?",
      volunteer: "Great! We'd love to have you volunteer. Visit our 'Get Involved' section to:\n• Register as a volunteer\n• Choose your area of expertise\n• Join our community response team",
      donate: "Your donation can save lives! You can:\n• Make monetary donations\n• Provide material donations\n• Become a monthly supporter\n\nVisit our 'Get Involved' section to donate.",
      default: "Thank you for your message. I'm here to help with emergency guidance, safety information, and disaster preparedness. Please let me know if you have specific questions about:\n\n• Emergencies & first aid\n• Disaster types & safety\n• Evacuation procedures\n• Community support"
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      response = responses.emergency;
    } else if (lowerMessage.includes('evacuat')) {
      response = responses.evacuation;
    } else if (lowerMessage.includes('earthquake')) {
      response = responses.earthquake;
    } else if (lowerMessage.includes('flood')) {
      response = responses.flood;
    } else if (lowerMessage.includes('fire')) {
      response = responses.fire;
    } else if (lowerMessage.includes('hurricane')) {
      response = responses.hurricane;
    } else if (lowerMessage.includes('medical') || lowerMessage.includes('health') || lowerMessage.includes('injury')) {
      response = responses.medical;
    } else if (lowerMessage.includes('volunteer')) {
      response = responses.volunteer;
    } else if (lowerMessage.includes('donat')) {
      response = responses.donate;
    }

    this.addBotMessage(response);
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SafeHavenChatbot();
});

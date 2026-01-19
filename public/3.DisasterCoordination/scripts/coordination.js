/* ========================================
   Disaster Coordination Platform JavaScript
   Enhanced functionality for coordination features
   ======================================== */

// Global state management
const CoordinationState = {
  resources: {
    ambulances: { available: 5, total: 8, deployed: [] },
    fireTrucks: { available: 3, total: 5, deployed: [] },
    rescueTeams: { available: 7, total: 10, deployed: [] },
    helicopters: { available: 2, total: 3, deployed: [] }
  },
  incidents: [],
  currentLocation: null,
  emergencyContacts: []
};

// Utility Functions
const Utils = {
  // Generate unique ID
  generateId: () => {
    return 'INC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  },

  // Format timestamp
  formatTime: (date = new Date()) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  // Format date
  formatDate: (date = new Date()) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Get location
  getLocation: (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          CoordinationState.currentLocation = location;
          callback(location);
        },
        (error) => {
          console.error('Location error:', error);
          callback(null);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      callback(null);
    }
  },

  // Save to localStorage
  saveToStorage: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  // Load from localStorage
  loadFromStorage: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  }
};

// Navigation Functions
function goBack() {
  window.location.href = "DisasterCoordination.html";
}

function navigateTo(page) {
  window.location.href = page;
}

// Resource Management
const ResourceManager = {
  // Update resource counts
  updateResources: () => {
    const resources = CoordinationState.resources;
    
    // Simulate dynamic updates
    resources.ambulances.available = Math.floor(Math.random() * 6) + 3;
    resources.fireTrucks.available = Math.floor(Math.random() * 3) + 2;
    resources.rescueTeams.available = Math.floor(Math.random() * 8) + 5;
    resources.helicopters.available = Math.floor(Math.random() * 2) + 1;
    
    ResourceManager.displayResources();
    Utils.saveToStorage('resources', resources);
  },

  // Display resources
  displayResources: () => {
    const resources = CoordinationState.resources;
    
    if (document.getElementById('ambulanceCount')) {
      document.getElementById('ambulanceCount').textContent = resources.ambulances.available;
    }
    if (document.getElementById('fireTruckCount')) {
      document.getElementById('fireTruckCount').textContent = resources.fireTrucks.available;
    }
    if (document.getElementById('rescueTeamCount')) {
      document.getElementById('rescueTeamCount').textContent = resources.rescueTeams.available;
    }
    if (document.getElementById('helicopterCount')) {
      document.getElementById('helicopterCount').textContent = resources.helicopters.available;
    }
  },

  // Get resource status
  getResourceStatus: (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return 'available';
    if (percentage > 30) return 'limited';
    return 'unavailable';
  },

  // Allocate resource
  allocateResource: (type, incidentId) => {
    const resource = CoordinationState.resources[type];
    if (resource && resource.available > 0) {
      resource.available--;
      resource.deployed.push({
        incidentId: incidentId,
        timestamp: new Date()
      });
      ResourceManager.displayResources();
      return true;
    }
    return false;
  }
};

// Incident Management
const IncidentManager = {
  // Create new incident
  createIncident: (type, location, priority, description) => {
    const incident = {
      id: Utils.generateId(),
      type: type,
      location: location,
      priority: priority,
      description: description,
      status: 'reported',
      timestamp: new Date(),
      updates: []
    };
    
    CoordinationState.incidents.push(incident);
    Utils.saveToStorage('incidents', CoordinationState.incidents);
    return incident;
  },

  // Update incident status
  updateIncidentStatus: (incidentId, newStatus, note) => {
    const incident = CoordinationState.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = newStatus;
      incident.updates.push({
        status: newStatus,
        note: note,
        timestamp: new Date()
      });
      Utils.saveToStorage('incidents', CoordinationState.incidents);
      return true;
    }
    return false;
  },

  // Get incidents by priority
  getIncidentsByPriority: (priority) => {
    return CoordinationState.incidents.filter(i => i.priority === priority);
  },

  // Display incidents
  displayIncidents: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (CoordinationState.incidents.length === 0) {
      container.innerHTML = '<p class="info">No active incidents</p>';
      return;
    }
    
    CoordinationState.incidents.forEach(incident => {
      const incidentEl = document.createElement('div');
      incidentEl.className = 'incident-item';
      incidentEl.innerHTML = `
        <div class="incident-header">
          <span class="incident-id">${incident.id}</span>
          <span class="status-badge ${incident.priority}">${incident.priority.toUpperCase()}</span>
        </div>
        <div><strong>Type:</strong> ${incident.type}</div>
        <div><strong>Status:</strong> ${incident.status}</div>
        <div><strong>Location:</strong> ${incident.location?.latitude ? 
          `${incident.location.latitude.toFixed(4)}, ${incident.location.longitude.toFixed(4)}` : 
          'Location unavailable'}</div>
        <div class="incident-time">${Utils.formatDate(new Date(incident.timestamp))} at ${Utils.formatTime(new Date(incident.timestamp))}</div>
      `;
      container.appendChild(incidentEl);
    });
  }
};

// SOS Functions
const SOSManager = {
  // Activate SOS with location
  activateSOS: (emergencyType = 'general') => {
    Utils.getLocation((location) => {
      if (location) {
        const incident = IncidentManager.createIncident(
          emergencyType,
          location,
          'critical',
          'SOS activated - immediate assistance required'
        );
        
        // Display location
        const locationDisplay = document.getElementById('locationDisplay');
        if (locationDisplay) {
          locationDisplay.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <strong>Your Location:</strong><br>
            Latitude: ${location.latitude.toFixed(6)}<br>
            Longitude: ${location.longitude.toFixed(6)}<br>
            <small>Accuracy: ±${location.accuracy.toFixed(0)}m</small>
          `;
          locationDisplay.style.display = 'block';
        }
        
        alert(`Emergency services have been notified!\nIncident ID: ${incident.id}\nLocation: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
        
        // Show instructions
        const instructions = document.getElementById('instructions');
        if (instructions) {
          instructions.style.display = 'block';
        }
        
        // Simulate resource allocation
        ResourceManager.allocateResource('ambulances', incident.id);
        
      } else {
        const incident = IncidentManager.createIncident(
          emergencyType,
          { latitude: null, longitude: null },
          'critical',
          'SOS activated - location unavailable'
        );
        alert(`Emergency services have been notified!\nIncident ID: ${incident.id}\nNote: Location could not be determined. Please provide your location manually.`);
      }
    });
  },

  // Handle emergency type selection
  handleEmergencyType: () => {
    const select = document.getElementById('emergencyType');
    if (select) {
      const type = select.value;
      if (type) {
        SOSManager.activateSOS(type);
      }
    }
  }
};

// Communication Functions
const CommunicationManager = {
  messages: [],

  // Get responder response based on message
  getResponderResponse: (message) => {
    const msg = message.toLowerCase();
    
    const responses = {
      help: "We're here to assist you. Please remain calm. Emergency services are on the way.",
      injured: "If you're injured, please stay still and avoid movement. Apply pressure to any bleeding wounds. Help is coming.",
      evacuate: "Please evacuate using the safest available route. Move to higher ground if flooding, or outdoors if earthquake.",
      location: "Thank you for sharing your location. Emergency responders have been dispatched to your area.",
      thank: "You're welcome. Stay safe and follow emergency protocols.",
      status: "Current status: Emergency response team dispatched. ETA: 5-10 minutes.",
      fire: "If there's a fire, evacuate immediately. Stay low to avoid smoke. Do not use elevators.",
      water: "If you need water, conserve what you have. Emergency supplies are being dispatched.",
      medical: "Medical assistance is on the way. For immediate concerns, describe your symptoms."
    };
    
    // Check for keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (msg.includes(keyword)) {
        return response;
      }
    }
    
    return "Please remain calm. Help is on the way. Provide more details if possible.";
  },

  // Send message
  sendMessage: () => {
    const input = document.getElementById('chatInput');
    const message = input?.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Create user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
      <div>You: ${message}</div>
      <div class="message-timestamp">${Utils.formatTime()}</div>
    `;
    chatMessages.appendChild(userMsg);
    
    // Save message
    CommunicationManager.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate rescuer response
    setTimeout(() => {
      const response = CommunicationManager.getResponderResponse(message);
      const rescuerMsg = document.createElement('div');
      rescuerMsg.className = 'message rescuer';
      rescuerMsg.innerHTML = `
        <div>Rescuer: ${response}</div>
        <div class="message-timestamp">${Utils.formatTime()}</div>
      `;
      chatMessages.appendChild(rescuerMsg);
      
      CommunicationManager.messages.push({
        sender: 'rescuer',
        text: response,
        timestamp: new Date()
      });
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Save to storage
      Utils.saveToStorage('chatMessages', CommunicationManager.messages);
    }, 1000);
  },

  // Load chat history
  loadChatHistory: () => {
    const messages = Utils.loadFromStorage('chatMessages');
    if (messages && messages.length > 0) {
      CommunicationManager.messages = messages;
      const chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        messages.forEach(msg => {
          const msgEl = document.createElement('div');
          msgEl.className = `message ${msg.sender}`;
          msgEl.innerHTML = `
            <div>${msg.sender === 'user' ? 'You' : 'Rescuer'}: ${msg.text}</div>
            <div class="message-timestamp">${Utils.formatTime(new Date(msg.timestamp))}</div>
          `;
          chatMessages.appendChild(msgEl);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  },

  // Clear chat
  clearChat: () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      CommunicationManager.messages = [];
      Utils.saveToStorage('chatMessages', []);
      const chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        chatMessages.innerHTML = '';
      }
    }
  }
};

// Emergency Contacts
function placeCall(org) {
  alert(`Calling ${org}...\n\nYou will be connected shortly. Please have your incident details ready.`);
  
  // Log call in incidents
  const incident = IncidentManager.createIncident(
    'manual-call',
    CoordinationState.currentLocation,
    'high',
    `Manual call placed to ${org}`
  );
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data
  const savedResources = Utils.loadFromStorage('resources');
  if (savedResources) {
    CoordinationState.resources = savedResources;
  }
  
  const savedIncidents = Utils.loadFromStorage('incidents');
  if (savedIncidents) {
    CoordinationState.incidents = savedIncidents;
  }
  
  // Display resources if elements exist
  ResourceManager.displayResources();
  
  // Load chat history if on rescue page
  if (document.getElementById('chatMessages')) {
    CommunicationManager.loadChatHistory();
  }
  
  // Display incidents if tracker exists
  if (document.getElementById('incidentTracker')) {
    IncidentManager.displayIncidents('incidentTracker');
  }
  
  // Auto-refresh resources every 30 seconds
  setInterval(() => {
    if (document.getElementById('ambulanceCount')) {
      ResourceManager.updateResources();
    }
  }, 30000);
});

// Export functions for global use
window.goBack = goBack;
window.navigateTo = navigateTo;
window.updateResources = ResourceManager.updateResources;
window.activateSOS = SOSManager.activateSOS;
window.handleEmergencyType = SOSManager.handleEmergencyType;
window.sendMessage = CommunicationManager.sendMessage;
window.clearChat = CommunicationManager.clearChat;
window.placeCall = placeCall;

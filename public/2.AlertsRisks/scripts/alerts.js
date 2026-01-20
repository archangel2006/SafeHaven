/* ============================================
   ALERTS & RISKS JAVASCRIPT
   Core functionality for disaster alerts and risk assessment
   ============================================ */

// Alert Data Structure
class AlertManager {
  constructor() {
    this.alerts = this.loadAlerts();
    this.filters = {
      search: '',
      severity: 'all',
      type: 'all'
    };
  }

  loadAlerts() {
    const stored = localStorage.getItem('disasterAlerts');
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultAlerts();
  }

  saveAlerts() {
    localStorage.setItem('disasterAlerts', JSON.stringify(this.alerts));
  }

  getDefaultAlerts() {
    return [
      {
        id: 'alert-001',
        type: 'flood',
        title: 'Severe Flood Warning',
        description: 'Heavy rainfall causing severe flooding in Osaka region. Residents advised to evacuate immediately.',
        severity: 'critical',
        location: 'Osaka',
        timestamp: Date.now() - 3600000,
        icon: 'fa-water',
        affected: '50,000+ people'
      },
      {
        id: 'alert-002',
        type: 'earthquake',
        title: 'Earthquake Detected',
        description: '6.2 magnitude earthquake detected near Tokyo. Aftershocks expected in the next 48 hours.',
        severity: 'high',
        location: 'Tokyo',
        timestamp: Date.now() - 7200000,
        icon: 'fa-house-crack',
        affected: '2M+ people'
      },
      {
        id: 'alert-003',
        type: 'typhoon',
        title: 'Typhoon Approaching',
        description: 'Category 3 typhoon approaching Okinawa, expected landfall in 24 hours. Prepare emergency supplies.',
        severity: 'high',
        location: 'Okinawa',
        timestamp: Date.now() - 1800000,
        icon: 'fa-wind',
        affected: '150,000 people'
      },
      {
        id: 'alert-004',
        type: 'wildfire',
        title: 'Forest Fire Alert',
        description: 'Forest fire spreading rapidly in Hokkaido due to dry conditions and strong winds.',
        severity: 'medium',
        location: 'Hokkaido',
        timestamp: Date.now() - 5400000,
        icon: 'fa-fire',
        affected: '5,000 people'
      },
      {
        id: 'alert-005',
        type: 'volcanic',
        title: 'Volcanic Activity Increased',
        description: 'Increased seismic activity detected at Mount Sakurajima. Alert level raised to 3.',
        severity: 'medium',
        location: 'Kagoshima',
        timestamp: Date.now() - 10800000,
        icon: 'fa-mountain',
        affected: '30,000 people'
      },
      {
        id: 'alert-006',
        type: 'landslide',
        title: 'Landslide Risk',
        description: 'Heavy rains triggering landslides in mountainous areas of Nagano. Roads closed.',
        severity: 'medium',
        location: 'Nagano',
        timestamp: Date.now() - 14400000,
        icon: 'fa-mountain-sun',
        affected: '8,000 people'
      },
      {
        id: 'alert-007',
        type: 'tsunami',
        title: 'Tsunami Warning',
        description: 'Tsunami alert issued along the Fukushima coast following undersea tremor. Move to higher ground.',
        severity: 'critical',
        location: 'Fukushima',
        timestamp: Date.now() - 900000,
        icon: 'fa-water',
        affected: '100,000+ people'
      },
      {
        id: 'alert-008',
        type: 'heatwave',
        title: 'Extreme Heat Advisory',
        description: 'Temperatures exceeding 38°C expected in Kyoto. Stay hydrated and avoid outdoor activities.',
        severity: 'low',
        location: 'Kyoto',
        timestamp: Date.now() - 21600000,
        icon: 'fa-temperature-high',
        affected: '1.5M people'
      }
    ];
  }

  filterAlerts() {
    return this.alerts.filter(alert => {
      const matchesSearch = !this.filters.search || 
        alert.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        alert.description.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        alert.location.toLowerCase().includes(this.filters.search.toLowerCase());
      
      const matchesSeverity = this.filters.severity === 'all' || 
        alert.severity === this.filters.severity;
      
      const matchesType = this.filters.type === 'all' || 
        alert.type === this.filters.type;
      
      return matchesSearch && matchesSeverity && matchesType;
    });
  }

  formatTimestamp(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  renderAlerts() {
    const alertsList = document.getElementById('alertsList');
    const filteredAlerts = this.filterAlerts();

    if (filteredAlerts.length === 0) {
      alertsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No alerts found</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }

    alertsList.innerHTML = filteredAlerts.map(alert => `
      <li class="alert-item ${alert.severity}">
        <div class="alert-icon">
          <i class="fas ${alert.icon}"></i>
        </div>
        <div class="alert-content">
          <div class="alert-header">
            <span class="alert-title">${alert.title}</span>
            <span class="alert-severity severity-${alert.severity}">${alert.severity}</span>
          </div>
          <p class="alert-description">${alert.description}</p>
          <div class="alert-meta">
            <span><i class="fas fa-location-dot"></i> ${alert.location}</span>
            <span><i class="fas fa-clock"></i> ${this.formatTimestamp(alert.timestamp)}</span>
            <span><i class="fas fa-users"></i> ${alert.affected}</span>
          </div>
          <div class="alert-actions">
            <button class="btn-details" onclick="viewAlertDetails('${alert.id}')">
              <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="btn-share" onclick="shareAlert('${alert.id}')">
              <i class="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>
      </li>
    `).join('');
  }

  setFilter(type, value) {
    this.filters[type] = value;
    this.renderAlerts();
  }
}

// Risk Assessment Manager
class RiskManager {
  constructor() {
    this.risks = this.getRiskData();
  }

  getRiskData() {
    return [
      { name: 'Flood', value: 85, color: '#dc3545', location: 'Osaka' },
      { name: 'Earthquake', value: 62, color: '#ffc107', location: 'Tokyo' },
      { name: 'Typhoon', value: 78, color: '#17a2b8', location: 'Okinawa' },
      { name: 'Wildfire', value: 45, color: '#ff6b35', location: 'Hokkaido' },
      { name: 'Volcanic', value: 58, color: '#fd7e14', location: 'Kagoshima' },
      { name: 'Tsunami', value: 72, color: '#0056b3', location: 'Fukushima' }
    ];
  }

  renderRiskMeters() {
    const riskGrid = document.getElementById('riskGrid');
    
    riskGrid.innerHTML = this.risks.map(risk => `
      <div class="risk-card">
        <h3><i class="fas fa-chart-pie"></i> ${risk.name}</h3>
        <div class="risk-meter" style="background: conic-gradient(${risk.color} ${risk.value * 3.6}deg, #eee 0deg)">
          <div class="center-label">${risk.value}%</div>
        </div>
        <p class="risk-location">
          <i class="fas fa-location-dot"></i> ${risk.location}
        </p>
      </div>
    `).join('');
  }

  initializeChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Flood Risk (%)',
            data: [75, 80, 78, 85, 82, 85],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Earthquake Risk (%)',
            data: [58, 60, 62, 61, 63, 62],
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Typhoon Risk (%)',
            data: [70, 72, 75, 78, 76, 78],
            borderColor: '#17a2b8',
            backgroundColor: 'rgba(23, 162, 184, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 14, family: 'Poppins' },
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Risk Trends (6 Months)',
            font: { size: 18, family: 'Poppins', weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
}

// Tab Navigation
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-target');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === target) {
          content.classList.add('active');
        }
      });
    });
  });
}

// Alert Action Handlers
function viewAlertDetails(alertId) {
  const alert = alertManager.alerts.find(a => a.id === alertId);
  if (alert) {
    alert(`
      Alert Details:
      
      Title: ${alert.title}
      Type: ${alert.type}
      Severity: ${alert.severity}
      Location: ${alert.location}
      Affected: ${alert.affected}
      
      Description: ${alert.description}
      
      Time: ${alertManager.formatTimestamp(alert.timestamp)}
    `);
  }
}

function shareAlert(alertId) {
  const alert = alertManager.alerts.find(a => a.id === alertId);
  if (alert) {
    const shareText = `🚨 ${alert.title}\n${alert.description}\nLocation: ${alert.location}\n#DisasterAlert #SafeHaven`;
    
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: shareText
      }).catch(err => console.log('Share failed:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Alert copied to clipboard!');
      });
    }
  }
}

function refreshAlerts() {
  const btn = document.querySelector('.alert-controls button[onclick="refreshAlerts()"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
  
  setTimeout(() => {
    alertManager.renderAlerts();
    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    showNotification('Alerts refreshed successfully!');
  }, 1000);
}

function showNotification(message) {
  // Simple notification (could be enhanced with a notification library)
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Emergency Contacts
function callEmergency(number) {
  if (confirm(`Call ${number}?`)) {
    window.location.href = `tel:${number}`;
  }
}

// Initialize on page load
let alertManager, riskManager;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  alertManager = new AlertManager();
  riskManager = new RiskManager();

  // Initialize tabs
  initializeTabs();

  // Render initial content
  alertManager.renderAlerts();
  riskManager.renderRiskMeters();
  riskManager.initializeChart();

  // Setup filter listeners
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    alertManager.setFilter('search', e.target.value);
  });

  document.getElementById('severityFilter')?.addEventListener('change', (e) => {
    alertManager.setFilter('severity', e.target.value);
  });

  document.getElementById('typeFilter')?.addEventListener('change', (e) => {
    alertManager.setFilter('type', e.target.value);
  });

  // Auto-refresh alerts every 5 minutes
  setInterval(() => {
    alertManager.renderAlerts();
  }, 300000);
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

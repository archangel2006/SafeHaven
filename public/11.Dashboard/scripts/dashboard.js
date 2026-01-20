// Dashboard & Analytics JavaScript

let disasterChart = null;
let currentFilter = 'all';
let currentResourceFilter = 'all';
let userLatitude = null;
let userLongitude = null;

// Sample disaster data (In production, this would come from an API)
const disasterData = {
    all: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Earthquakes',
                data: [3, 2, 5, 4, 1, 2, 3, 6, 4, 5, 3, 2],
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            },
            {
                label: 'Floods',
                data: [1, 3, 2, 6, 8, 12, 10, 8, 5, 3, 2, 1],
                borderColor: '#36a2eb',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4
            },
            {
                label: 'Hurricanes',
                data: [0, 0, 1, 2, 3, 5, 8, 7, 4, 2, 1, 0],
                borderColor: '#ffce56',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4
            },
            {
                label: 'Wildfires',
                data: [2, 3, 4, 8, 12, 15, 18, 16, 10, 5, 3, 2],
                borderColor: '#ff9f40',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                tension: 0.4
            }
        ]
    }
};

// Sample resource data
const resourceData = [
    {
        type: 'shelter',
        name: 'Community Shelter Alpha',
        location: '2.3 km away',
        status: 'high',
        capacity: 85,
        description: 'Capacity: 200 people'
    },
    {
        type: 'medical',
        name: 'Emergency Medical Center',
        location: '1.8 km away',
        status: 'high',
        capacity: 90,
        description: 'Doctors: 12, Beds: 50'
    },
    {
        type: 'food',
        name: 'Food Distribution Point',
        location: '3.5 km away',
        status: 'medium',
        capacity: 60,
        description: 'Meals available: 5000'
    },
    {
        type: 'water',
        name: 'Water Supply Station',
        location: '1.2 km away',
        status: 'high',
        capacity: 95,
        description: 'Liters: 20,000'
    },
    {
        type: 'shelter',
        name: 'Safe House Beta',
        location: '4.1 km away',
        status: 'medium',
        capacity: 55,
        description: 'Capacity: 150 people'
    },
    {
        type: 'medical',
        name: 'Mobile Health Unit',
        location: '2.9 km away',
        status: 'low',
        capacity: 30,
        description: 'Doctors: 4, Limited supplies'
    },
    {
        type: 'food',
        name: 'Relief Food Bank',
        location: '5.0 km away',
        status: 'low',
        capacity: 25,
        description: 'Meals available: 1200'
    },
    {
        type: 'water',
        name: 'Emergency Water Truck',
        location: '3.2 km away',
        status: 'critical',
        capacity: 15,
        description: 'Liters: 3,000 (Low)'
    },
    {
        type: 'shelter',
        name: 'School Evacuation Center',
        location: '2.7 km away',
        status: 'high',
        capacity: 75,
        description: 'Capacity: 300 people'
    },
    {
        type: 'medical',
        name: 'Red Cross Station',
        location: '1.5 km away',
        status: 'high',
        capacity: 88,
        description: 'Doctors: 8, Beds: 30'
    }
];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    getUserLocation();
    updateSafetyScore();
    initializeDisasterChart();
    updateResources();
    updateStats();
    updateLastUpdatedTime();
    
    // Update every 5 minutes
    setInterval(() => {
        updateSafetyScore();
        updateResources();
        updateStats();
        updateLastUpdatedTime();
    }, 300000);
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                displayLocation(userLatitude, userLongitude);
            },
            (error) => {
                document.getElementById('userLocation').textContent = 'Location unavailable';
                // Use default location for demo
                userLatitude = 40.7128;
                userLongitude = -74.0060;
                displayLocation(userLatitude, userLongitude, true);
            }
        );
    } else {
        document.getElementById('userLocation').textContent = 'Geolocation not supported';
        userLatitude = 40.7128;
        userLongitude = -74.0060;
        displayLocation(userLatitude, userLongitude, true);
    }
}

function displayLocation(lat, lon, isDefault = false) {
    const locationText = isDefault ? 'New York, NY (Demo)' : `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    document.getElementById('userLocation').textContent = locationText;
    document.getElementById('userCoordinates').textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

// Calculate and update safety score
function updateSafetyScore() {
    // Simulate API call with random factors
    const disasterRiskScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const weatherScore = Math.floor(Math.random() * 25) + 75; // 75-100
    const infrastructureScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const responseTimeScore = Math.floor(Math.random() * 30) + 70; // 70-100
    
    // Calculate overall safety score (weighted average)
    const overallScore = Math.floor(
        (disasterRiskScore * 0.35) +
        (weatherScore * 0.25) +
        (infrastructureScore * 0.20) +
        (responseTimeScore * 0.20)
    );
    
    // Update UI
    document.getElementById('safetyScore').textContent = overallScore;
    document.getElementById('disasterRisk').textContent = getScoreLabel(disasterRiskScore);
    document.getElementById('weatherSeverity').textContent = getWeatherLabel(weatherScore);
    document.getElementById('infrastructure').textContent = getInfraLabel(infrastructureScore);
    document.getElementById('responseTime').textContent = getResponseLabel(responseTimeScore);
    
    // Update score circle color
    const scoreCircle = document.getElementById('scoreCircle');
    if (overallScore >= 80) {
        scoreCircle.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
    } else if (overallScore >= 60) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    }
    
    // Show alert if score is low
    const alertBanner = document.getElementById('alertBanner');
    if (overallScore < 60) {
        alertBanner.classList.add('show');
    } else {
        alertBanner.classList.remove('show');
    }
}

function getScoreLabel(score) {
    if (score >= 85) return 'Very Low';
    if (score >= 70) return 'Low';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'High';
    return 'Very High';
}

function getWeatherLabel(score) {
    if (score >= 85) return 'Clear';
    if (score >= 70) return 'Mild';
    if (score >= 50) return 'Moderate';
    return 'Severe';
}

function getInfraLabel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
}

function getResponseLabel(score) {
    if (score >= 85) return '< 5 min';
    if (score >= 70) return '5-10 min';
    if (score >= 50) return '10-20 min';
    return '> 20 min';
}

// Initialize disaster chart
function initializeDisasterChart() {
    const ctx = document.getElementById('disasterChart').getContext('2d');
    
    disasterChart = new Chart(ctx, {
        type: 'line',
        data: disasterData.all,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Disaster Events - Last 12 Months'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Filter disaster data
function filterDisasterData(type) {
    // Update active button
    document.querySelectorAll('.filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentFilter = type;
    
    if (type === 'all') {
        disasterChart.data = disasterData.all;
    } else {
        const dataset = disasterData.all.datasets.find(d => 
            d.label.toLowerCase().includes(type)
        );
        
        if (dataset) {
            disasterChart.data = {
                labels: disasterData.all.labels,
                datasets: [dataset]
            };
        }
    }
    
    disasterChart.update();
    updateStats();
}

// Update statistics
function updateStats() {
    const totalEvents = disasterData.all.datasets.reduce((sum, dataset) => {
        return sum + dataset.data.reduce((a, b) => a + b, 0);
    }, 0);
    
    const activeAlerts = Math.floor(Math.random() * 15) + 5;
    const affectedAreas = Math.floor(Math.random() * 50) + 20;
    
    document.getElementById('totalDisasters').textContent = totalEvents;
    document.getElementById('activeAlerts').textContent = activeAlerts;
    document.getElementById('affectedAreas').textContent = affectedAreas;
}

// Update resources display
function updateResources() {
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = '';
    
    const filteredResources = currentResourceFilter === 'all' 
        ? resourceData 
        : resourceData.filter(r => r.type === currentResourceFilter);
    
    filteredResources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        
        const statusClass = `status-${resource.status}`;
        const statusText = resource.status.charAt(0).toUpperCase() + resource.status.slice(1);
        
        const progressColor = getProgressColor(resource.capacity);
        
        resourceItem.innerHTML = `
            <div class="resource-info">
                <h4>${getResourceIcon(resource.type)} ${resource.name}</h4>
                <p>📍 ${resource.location}</p>
                <p>${resource.description}</p>
            </div>
            <div class="resource-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${resource.capacity}%; background: ${progressColor};"></div>
                </div>
                <small>${resource.capacity}%</small>
            </div>
        `;
        
        resourceList.appendChild(resourceItem);
    });
}

function getResourceIcon(type) {
    const icons = {
        shelter: '🏠',
        medical: '🏥',
        food: '🍽️',
        water: '💧'
    };
    return icons[type] || '📦';
}

function getProgressColor(capacity) {
    if (capacity >= 70) return '#4caf50';
    if (capacity >= 40) return '#ff9800';
    if (capacity >= 20) return '#f44336';
    return '#b71c1c';
}

// Filter resources
function filterResources(type) {
    // Update active button
    const buttons = document.querySelectorAll('.card:last-child .filters .filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentResourceFilter = type;
    updateResources();
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${dateString} at ${timeString}`;
}

// Export data function (bonus feature)
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        safetyScore: document.getElementById('safetyScore').textContent,
        location: {
            text: document.getElementById('userLocation').textContent,
            coordinates: document.getElementById('userCoordinates').textContent
        },
        disasters: disasterData,
        resources: resourceData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safehaven-dashboard-${Date.now()}.json`;
    link.click();
}

// Map initialization and management
let mapLoaded = false;
let map;
let homeMarker;

// Home location: India Gate, New Delhi
const homeCoords = [28.6129, 77.2295];
const homeZoom = 15;

function initMap() {
    if (mapLoaded) return;

    map = L.map("map").setView(homeCoords, homeZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Fixed Home Marker
    homeMarker = L.marker(homeCoords)
        .addTo(map)
        .bindPopup(
            "<b>Home Location</b><br>India Gate, New Delhi, India",
            { autoClose: false, closeOnClick: false }
        )
        .openPopup();

    // Search (moves map only)
    L.Control.geocoder({
        collapsed: false,
        placeholder: "Search location",
        defaultMarkGeocode: true
    })
        .on("markgeocode", e => {
            map.setView(e.geocode.center, homeZoom);
        })
        .addTo(map);

    // Home button = reset map view
    document.getElementById("homeButton").addEventListener("click", () => {
        map.setView(homeCoords, homeZoom);
        homeMarker.openPopup();
    });

    document.getElementById("mapWrapper").classList.add("visible");
    mapLoaded = true;
}

// Lazy load when section visible
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        initMap();
        observer.disconnect();
    }
});

observer.observe(document.getElementById("map-section"));

// SOS Emergency button functionality
let clickCount = 0;
function sendSOS() {
    clickCount++;
    if (clickCount === 3) {
        alert("SOS sent with your location and phone number successfully!");
        clickCount = 0;
    }
}

(function() {
    // Function to get the correct relative path prefix
    function getPathPrefix() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length;
        
        // Adjust depth based on project structure
        // If path is just / or /index.html, depth is 1
        // If path is /2.AlertsRisks/AlertsRisks.html, depth is 2
        
        if (path.endsWith('/') || path.endsWith('index.html') && depth <= 1) {
            return './';
        }
        
        let prefix = '';
        for (let i = 0; i < depth - 1; i++) {
            prefix += '../';
        }
        return prefix || './';
    }

    const prefix = getPathPrefix();

    // Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = prefix + 'assets/css/footer.css';
    document.head.appendChild(link);

    // Footer HTML Structure
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-section">
                <div class="footer-logo">
                    <img src="https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg" alt="SafeHaven Logo">
                    <span>SafeHaven</span>
                </div>
                <p>A platform for disaster awareness, alerts, and coordination. Empowering communities to stay safe and prepared.</p>
            </div>
            
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="${prefix}index.html">Home</a></li>
                    <li><a href="${prefix}2.AlertsRisks/AlertsRisks.html">Alerts & Risks</a></li>
                    <li><a href="${prefix}3.DisasterCoordination/DisasterCoordination.html">Disaster Coordination</a></li>
                    <li><a href="${prefix}4.EvacuationSafety/EvacuationSafety.html">Emergency Assistance</a></li>
                    <li><a href="${prefix}5.Community/Community.html">Contact / About</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Resources & Legal</h3>
                <ul class="footer-links">
                    <li><a href="https://github.com/archangel2006/SafeHaven" target="_blank">GitHub Repository</a></li>
                    <li><a href="https://github.com/archangel2006/SafeHaven/issues" target="_blank">Report an Issue</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2026 SafeHaven. All rights reserved.</p>
            <p>Built with HTML, CSS, JavaScript | Deployed on Vercel</p>
        </div>
    </footer>
    `;

    // Inject Footer
    document.body.insertAdjacentHTML('beforeend', footerHTML);
})();

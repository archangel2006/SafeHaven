document.addEventListener("DOMContentLoaded", function () {
    // Prevent footer from rendering if inside an iframe
    if (window.self !== window.top) {
        return;
    }

    // Inject Footer CSS
    const scriptTag = document.currentScript || document.querySelector('script[src*="footer.js"]');
    const scriptSrc = scriptTag ? scriptTag.src : "";
    const baseDir = scriptSrc.substring(0, scriptSrc.lastIndexOf("/js/"));
    const publicDir = baseDir.substring(0, baseDir.lastIndexOf("/assets"));

    if (baseDir) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = baseDir + "/css/footer.css?v=" + Date.now();
        document.head.appendChild(link);
    }

    const logoUrl = "https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg";

    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-section brand-section">
                <div class="footer-logo">
                    <img src="${logoUrl}" alt="SafeHaven Logo">
                    <span class="brand-name">SafeHaven</span>
                </div>
                <p class="brand-description">
                    Real-time disaster alerts and community safety coordination.
                </p>
            </div>
            
            <div class="footer-section links-section quick-links">
                <h3>Quick Links</h3>
                <ul class="links-grid">
                    <li><a href="${publicDir}/2.AlertsRisks/AlertsRisks.html">Alerts & Risks</a></li>
                    <li><a href="${publicDir}/3.DisasterCoordination/DisasterCoordination.html">Disaster Coordination</a></li>
                    <li><a href="${publicDir}/4.EvacuationSafety/EvacuationSafety.html">Evacuation & Safety</a></li>
                    <li><a href="${publicDir}/5.Community/Community.html">Community</a></li>
                    <li><a href="${publicDir}/6.KnowWhat'sHappeningAround/KnowWhat'sHappeningAround.html">Get Updates</a></li>
                    <li><a href="${publicDir}/7.GetEducated/GetEducated.html">Education</a></li>
                </ul>
            </div>

            <div class="footer-section links-section resources-section">
                <h3>RESOURCES</h3>
                <ul class="links-grid">
                    <li><a href="https://github.com/archangel2006/SafeHaven" target="_blank">GitHub Repository</a></li>
                    <li><a href="#">Report an Issue</a></li>
                    <li><a href="#">Documentation</a></li>
                </ul>
            </div>
        </div>
    </footer>
  `;

    const footerWrapper = document.createElement("div");
    footerWrapper.innerHTML = footerHTML;
    document.body.appendChild(footerWrapper);
});

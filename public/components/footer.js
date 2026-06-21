// components/footer.js - Professional Footer
(function () {
    'use strict';

    var LOGO = 'https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg';

    var FOOTER_LINKS = [
        { id: 'home', label: 'Home', path: 'index.html' },
        { id: 'alerts', label: 'Alerts & Risks', path: '2.AlertsRisks/AlertsRisks.html' },
        { id: 'coordination', label: 'Disaster Coordination', path: '3.DisasterCoordination/DisasterCoordination.html' },
        { id: 'evacuation', label: 'Evacuation Safety', path: '4.EvacuationSafety/EvacuationSafety.html' },
        { id: 'community', label: 'Community', path: '5.Community/Community.html' },
        { id: 'updates', label: 'Disaster Updates', path: '6.DisasterUpdates/DisasterUpdates.html' },
        { id: 'educated', label: 'Get Educated', path: '7.GetEducated/GetEducated.html' },
        { id: 'donate', label: 'Donate', path: '9.GetInvolved/Donate.html' },
        { id: 'volunteer', label: 'Volunteer', path: '9.GetInvolved/Volunteer.html' }
    ];

    function cfg() {
        var s = document.currentScript || document.querySelector('script[data-sh-footer]');
        if (!s) return {};
        return {
            title: s.getAttribute('data-page-title') || 'Safe Haven',
            base: s.getAttribute('data-base') || ''
        };
    }

    function root(base) {
        if (base) return base;
        var segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
        if (segs.length && segs[segs.length - 1].endsWith('.html')) segs.pop();
        return segs.length ? '../'.repeat(segs.length) : './';
    }

    function buildFooterLinks(r) {
        var container = document.createElement('ul');
        container.className = 'sh-footer__nav-links';

        FOOTER_LINKS.forEach(function (item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = r + item.path;
            a.textContent = item.label;
            li.appendChild(a);
            container.appendChild(li);
        });

        return container;
    }

    function build(c, r) {
        var footer = document.createElement('footer');
        footer.className = 'sh-footer';

        var container = document.createElement('div');
        container.className = 'sh-footer__container';

        // Left: Logo + Brand Name
        var brand = document.createElement('a');
        brand.href = r + 'index.html';
        brand.className = 'sh-footer__brand';
        brand.setAttribute('aria-label', 'Home');

        var logoLink = document.createElement('span');
        logoLink.className = 'sh-footer__logo-link';

        var logoImg = document.createElement('img');
        logoImg.src = LOGO;
        logoImg.alt = c.title;
        logoImg.className = 'sh-footer__logo-img';
        logoLink.appendChild(logoImg);

        var title = document.createElement('span');
        title.className = 'sh-footer__title';
        title.textContent = c.title;

        brand.appendChild(logoLink);
        brand.appendChild(title);

        // Right: Navigation Links
        var nav = document.createElement('nav');
        nav.className = 'sh-footer__nav';
        nav.appendChild(buildFooterLinks(r));

        container.appendChild(brand);
        container.appendChild(nav);

        // Bottom Bar
        var bottom = document.createElement('div');
        bottom.className = 'sh-footer__bottom';

        var copyright = document.createElement('p');
        copyright.className = 'sh-footer__copyright';
        var year = new Date().getFullYear();
        copyright.textContent = '\u00A9 ' + year + ' ' + c.title + '. All rights reserved.';

        var bottomLinks = document.createElement('ul');
        bottomLinks.className = 'sh-footer__bottom-links';

        var bottomLinkItems = [
            { label: 'Privacy', url: '#' },
            { label: 'Terms', url: '#' },
            { label: 'Cookies', url: '#' }
        ];

        bottomLinkItems.forEach(function (item, index) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.label;
            li.appendChild(a);
            bottomLinks.appendChild(li);

            if (index < bottomLinkItems.length - 1) {
                var sep = document.createElement('span');
                sep.className = 'sh-footer__bottom-sep';
                sep.textContent = '|';
                bottomLinks.appendChild(sep);
            }
        });

        bottom.appendChild(copyright);
        bottom.appendChild(bottomLinks);

        footer.appendChild(container);
        footer.appendChild(bottom);

        return footer;
    }

    function init() {
        var c = cfg();
        var r = root(c.base);
        var mount = document.getElementById('sh-footer-root');
        var footer = build(c, r);

        if (mount) {
            mount.replaceWith(footer);
        } else {
            document.body.appendChild(footer);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
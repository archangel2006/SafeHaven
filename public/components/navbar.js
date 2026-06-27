(function () {
    'use strict';

    var LOGO = 'https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg';

    var LINKS = [
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
        var s = document.currentScript || document.querySelector('script[data-sh-navbar]');
        if (!s) return {};
        return {
            title: s.getAttribute('data-page-title') || 'Safe Haven',
            active: s.getAttribute('data-active') || '',
            base: s.getAttribute('data-base') || '',
            showStatus: s.getAttribute('data-show-status') === 'true',
            location: s.getAttribute('data-location') || 'Delhi, IN'
        };
    }

    function root(base) {
        if (base) return base;
        var segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
        if (segs.length && segs[segs.length - 1].endsWith('.html')) segs.pop();
        return segs.length ? '../'.repeat(segs.length) : './';
    }

    function activeId(set) {
        if (set) return set;
        var p = location.pathname.replace(/\\/g, '/').toLowerCase();
        if (p.endsWith('/index.html') || p.endsWith('/') || p.split('/').pop() === 'index.html') return 'home';
        if (p.includes('2.alertsrisks')) return 'alerts';
        if (p.includes('3.disastercoordination')) return 'coordination';
        if (p.includes('4.evacuationsafety')) return 'evacuation';
        if (p.includes('5.community')) return 'community';
        if (p.includes('6.disasterupdates')) return 'updates';
        if (p.includes('7.geteducated')) return 'educated';
        if (p.includes('9.getinvolved')) {
            if (p.includes('volunteer.html')) return 'volunteer';
            return 'donate';
        }
        return '';
    }

    function linkList(items, r, cur, mobile) {
        var el = document.createElement(mobile ? 'ul' : 'div');
        el.className = mobile ? 'sh-navbar__mobile-links' : 'sh-navbar__desktop-links';
        if (mobile) el.id = 'sh-navbar-menu';

        items.forEach(function (item) {
            var a = document.createElement('a');
            a.href = r + item.path;
            a.textContent = item.label;
            if (item.id === cur) {
                a.className = 'is-active';
                a.setAttribute('aria-current', 'page');
            }
            if (mobile) {
                var li = document.createElement('li');
                li.appendChild(a);
                el.appendChild(li);
            } else {
                el.appendChild(a);
            }
        });
        return el;
    }

    function statusHTML(loc) {
    return '<span class="sh-navbar__status-item" style="user-select: none; cursor: default;">📍 ' + loc + '</span>' +
           '<span class="sh-navbar__status-item" style="user-select: none; cursor: default;">🔔 Alerts On</span>';
}

    function build(c, r, cur) {
        var shell = document.createElement('div');
        shell.className = 'sh-navbar-shell';

        var nav = document.createElement('nav');
        nav.className = 'sh-navbar';
        if (c.showStatus) nav.classList.add('sh-navbar--has-status');

        var main = document.createElement('div');
        main.className = 'sh-navbar__main';
        main.innerHTML =
            '<div class="sh-navbar__left">' +
            '<a href="' + r + 'index.html" class="sh-navbar__logo-link" aria-label="Home">' +
            '<span class="sh-navbar__logo-wrap"><img src="' + LOGO + '" alt="Safe Haven"></span></a></div>' +
            '<div class="sh-navbar__center"><h1>' + c.title + '</h1></div>' +
            '<div class="sh-navbar__right">' +
            '<a href="' + r + '10.Auth/Login.html" class="sh-navbar__profile" aria-label="Profile">' +
            '<i class="far fa-user-circle"></i></a></div>';

        var toggle = document.createElement('button');
        toggle.className = 'sh-navbar__toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'sh-navbar-menu');
        toggle.innerHTML = '<span class="sh-navbar__toggle-bar"></span><span class="sh-navbar__toggle-bar"></span><span class="sh-navbar__toggle-bar"></span>';
        main.querySelector('.sh-navbar__right').appendChild(toggle);

        nav.appendChild(main);
        nav.appendChild(linkList(LINKS, r, cur, false));
        nav.appendChild(linkList(LINKS, r, cur, true));

        if (c.showStatus) {
            var sd = document.createElement('div');
            sd.className = 'sh-navbar__status sh-navbar__status--desktop';
            sd.innerHTML = statusHTML(c.location);
            nav.appendChild(sd);

            var sm = document.createElement('div');
            sm.className = 'sh-navbar__status sh-navbar__status--mobile';
            sm.innerHTML = statusHTML(c.location);
            shell.appendChild(nav);
            shell.appendChild(sm);
        } else {
            shell.appendChild(nav);
        }
        return shell;
    }

    function menu(shell) {
        var btn = shell.querySelector('.sh-navbar__toggle');
        var list = shell.querySelector('.sh-navbar__mobile-links');
        if (!btn || !list) return;

        function close() {
            list.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open menu');
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
        document.addEventListener('click', function (e) { if (!shell.contains(e.target)) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        window.addEventListener('resize', function () { if (innerWidth > 1024) close(); });
    }

    function init() {
        var c = cfg();
        var r = root(c.base);
        var cur = activeId(c.active);
        var mount = document.getElementById('sh-navbar-root');
        var bar = build(c, r, cur);
        if (mount) mount.replaceWith(bar);
        else document.body.insertBefore(bar, document.body.firstChild);
        menu(bar);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

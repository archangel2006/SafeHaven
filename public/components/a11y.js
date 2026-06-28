(function () {
    'use strict';

    var style = document.createElement('style');
    style.textContent = '.nav-back{background:none;border:none;color:inherit;cursor:pointer;padding:0;font-size:inherit;line-height:1;}';
    document.head.appendChild(style);

    document.querySelectorAll('.card-header[onclick]').forEach(function (header) {
        if (header.getAttribute('role')) return;
        var title = header.querySelector('h3, h4, span, strong');
        var label = title ? title.textContent.trim() : 'Toggle section';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', header.parentElement.classList.contains('open') ? 'true' : 'false');
        header.setAttribute('aria-label', 'Toggle ' + label + ' section');
        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    var originalToggle = window.toggleAccordion;
    if (typeof originalToggle === 'function') {
        window.toggleAccordion = function (el) {
            originalToggle(el);
            document.querySelectorAll('.card-header[role="button"]').forEach(function (header) {
                header.setAttribute('aria-expanded', header.parentElement.classList.contains('open') ? 'true' : 'false');
            });
        };
    }
})();

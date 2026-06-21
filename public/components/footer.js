// components/footer.js - Final Clean Version (Maintainer Approved)
(function () {
  "use strict";

  var LOGO =
    "https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg";

  function cfg() {
    var s =
      document.currentScript ||
      document.querySelector("script[data-sh-footer]");
    if (!s) return {};
    return {
      title: s.getAttribute("data-page-title") || "Safe Haven",
      base: s.getAttribute("data-base") || "",
    };
  }

  function root(base) {
    if (base) return base;
    var segs = location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
    if (segs.length && segs[segs.length - 1].endsWith(".html")) segs.pop();
    return segs.length ? "../".repeat(segs.length) : "./";
  }

  function build(c, r) {
    var footer = document.createElement("footer");
    footer.className = "sh-footer";

    var container = document.createElement("div");
    container.className = "sh-footer__container";

    // BRAND SECTION
    var brandWrap = document.createElement("div");
    brandWrap.className = "sh-footer__brand-wrap";

    var brand = document.createElement("a");
    brand.href = r + "index.html";
    brand.className = "sh-footer__brand";

    var logoImg = document.createElement("img");
    logoImg.src = LOGO;
    logoImg.alt = c.title;
    logoImg.className = "sh-footer__logo-img sh-footer__logo-square";

    var title = document.createElement("span");
    title.className = "sh-footer__title";
    title.textContent = c.title;

    brand.appendChild(logoImg);
    brand.appendChild(title);

    var desc = document.createElement("p");
    desc.className = "sh-footer__desc";
    desc.textContent =
      "A modern disaster management platform built to keep communities safe and informed.";

    brandWrap.appendChild(brand);
    brandWrap.appendChild(desc);

    // QUICK LINKS (ONLY REQUIRED ONES)
    var quickLinks = document.createElement("div");
    quickLinks.className = "sh-footer__quick-links";

    var links = [
      { label: "GitHub", url: "https://github.com/archangel2006/SafeHaven" },
      { label: "Discord", url: "https://discord.com" },
      {
        label: "License",
        url: "https://github.com/archangel2006/SafeHaven/blob/main/LICENSE.md",
      },
    ];

    links.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url;
      a.textContent = item.label;
      a.target = "_blank";
      quickLinks.appendChild(a);
    });

    container.appendChild(brandWrap);
    container.appendChild(quickLinks);

    // BOTTOM SECTION (CENTERED COPYRIGHT)
    var bottom = document.createElement("div");
    bottom.className = "sh-footer__bottom";

    var copyright = document.createElement("p");
    copyright.className = "sh-footer__copyright";
    copyright.textContent =
      "© " +
      new Date().getFullYear() +
      " " +
      c.title +
      ". All rights reserved.";

    bottom.appendChild(copyright);

    footer.appendChild(container);
    footer.appendChild(bottom);

    return footer;
  }

  function init() {
    var c = cfg();
    var r = root(c.base);
    var mount = document.getElementById("sh-footer-root");
    var footer = build(c, r);

    if (mount) mount.replaceWith(footer);
    else document.body.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

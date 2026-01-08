(function () {
  const type = document.body.dataset.nav;
  const title = document.body.dataset.title || "";

  const left = document.getElementById("nav-left");
  const center = document.getElementById("nav-center");
  const right = document.getElementById("nav-right");

  if (!left || !right) return;

  /* ================= HOME PAGE ================= */
  if (type === "home") {
    /* LEFT: LOGO → HOME */
    left.innerHTML = `
      <a href="index.html" class="logo-link">
        <img 
          src="https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg"
          class="logo-img"
          alt="Safe Haven Logo"
        />
        <span class="logo-text">SAFE HAVEN</span>
      </a>
    `;

    /* RIGHT: LOCATION + ALERT + PROFILE */
    right.innerHTML = `
      <div class="nav-item">
        <span class="material-symbols-outlined">location_on</span>
        <span id="nav-location">Delhi, IN</span>
      </div>

      <div class="nav-item">
        <span class="material-symbols-outlined">notifications</span>
        <span>Alerts On</span>
      </div>

      <a href="./10.Auth/Login.html" class="profile-link">
        <span class="material-symbols-outlined profile-icon">
          account_circle
        </span>
      </a>
    `;
  }

  /* ================= PRIMARY PAGES ================= */
  if (type === "primary") {
    left.innerHTML = `
      <a href="index.html" class="logo-link">
        <img 
          src="https://i.pinimg.com/474x/f4/79/4a/f4794a6bc83c46af8a4f287d45dc5f6f.jpg"
          class="logo-img"
          alt="Safe Haven Logo"
        />
      </a>
    `;

    center.innerHTML = `<span class="nav-title">${title}</span>`;

    right.innerHTML = `
      <a href="../10.Auth/Login.html" class="profile-link">
        <span class="material-symbols-outlined profile-icon">
          account_circle
        </span>
      </a>
    `;
  }

  /* ================= INTERNAL PAGES ================= */
  if (type === "internal") {
    left.innerHTML = `
      <button class="back-btn" onclick="location.href='index.html'">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
    `;

    center.innerHTML = `<span class="nav-title">${title}</span>`;

    right.innerHTML = `
      <a href="../10.Auth/Login.html" class="profile-link">
        <span class="material-symbols-outlined profile-icon">
          account_circle
        </span>
      </a>
    `;
  }
})();

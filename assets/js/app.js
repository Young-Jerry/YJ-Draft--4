/* ============================================================================
   app.js – Homepage + Ads rendering
   ============================================================================ */
(function () {
  "use strict";

  // ------------------ RENDER ADS ------------------
  function renderAds() {
    const adsContainer = document.getElementById("adsContainer");
    const ads = StorageAPI.ads();

    // Clear expired ads (auto-expire after 7 days)
    const now = Date.now();
    const validAds = ads.filter((ad) => ad.expiry > now);
    StorageAPI.saveAds(validAds);

    // Render
    adsContainer.innerHTML = "";
    validAds.forEach((ad) => {
      const el = document.createElement("div");
      el.className = "ad-card";
      el.innerHTML = `
        <div class="ad-image">
          <img src="${ad.images[0] || 'assets/images/placeholder.png'}" alt="${ad.title}" />
        </div>
        <div class="ad-info">
          <h3>${ad.title}</h3>
          <p>${ad.description}</p>
          <small>Category: ${ad.category} / ${ad.subcategory}</small>
          <br/>
          <small>Posted by ${ad.username}</small>
        </div>
      `;
      adsContainer.appendChild(el);
    });
  }

  // ------------------ SEARCH ------------------
  function initSearch() {
    const searchInput = document.getElementById("searchBar");
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".ad-card");
      cards.forEach((c) => {
        const text = c.innerText.toLowerCase();
        c.style.display = text.includes(term) ? "block" : "none";
      });
    });
  }

  // ------------------ NAV BAR ------------------
  function initNav() {
    const user = SessionAPI.currentUser();
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");
    const adminLink = document.getElementById("adminLink");

    if (user) {
      loginLink.style.display = "none";
      logoutLink.style.display = "inline";
      if (user.role === "admin") {
        adminLink.style.display = "inline";
      }
    }

    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to logout?")) {
        AuthAPI.logout();
      }
    });
  }

  // ------------------ INIT ------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderAds();
    initSearch();
    initNav();
  });
})();

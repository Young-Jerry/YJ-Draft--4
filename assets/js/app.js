/* ==========================================================================
   app.js – Homepage ads display and search
   ========================================================================== */
(function () {
  "use strict";

  const currentUser = Session.getCurrentUser();
  const adsContainer = document.getElementById("adsContainer");
  const searchInput = document.getElementById("searchInput");
  const loginLogoutBtn = document.getElementById("loginLogoutBtn");
  const profileLink = document.getElementById("profileLink");
  const adminLink = document.getElementById("adminLink");

  const adModal = document.getElementById("adModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalCategory = document.getElementById("modalCategory");
  const modalPhone = document.getElementById("modalPhone");
  const modalExpiry = document.getElementById("modalExpiry");
  const modalImages = document.getElementById("modalImages");

  // Handle login/logout button
  if (currentUser) {
    loginLogoutBtn.textContent = "Logout";
    profileLink.style.display = "inline-block";
    if (currentUser.role === "admin") {
      adminLink.style.display = "inline-block";
    }
  } else {
    profileLink.style.display = "none";
  }

  loginLogoutBtn.addEventListener("click", function () {
    if (currentUser) {
      if (confirm("Are you sure you want to logout?")) {
        Session.clear();
        window.location.href = "login.html";
      }
    } else {
      window.location.href = "login.html";
    }
  });

  // Render all ads
  function renderAds(filter = "") {
    const ads = Storage.get("nb_ads_v1") || [];

    // Filter expired ads
    const now = new Date();
    const activeAds = ads.filter(ad => new Date(ad.expiry) >= now);

    // Filter by search
    const filteredAds = activeAds.filter(ad => {
      const text = (ad.title + ad.description + ad.category + ad.subcategory).toLowerCase();
      return text.includes(filter.toLowerCase());
    });

    adsContainer.innerHTML = "";
    if (filteredAds.length === 0) {
      adsContainer.innerHTML = "<p>No ads found.</p>";
      return;
    }

    filteredAds.forEach(ad => {
      const adEl = document.createElement("div");
      adEl.className = "ad-card";
      adEl.innerHTML = `
        <h3>${ad.title}</h3>
        <p>${ad.category} ${ad.subcategory ? " - " + ad.subcategory : ""}</p>
        <p><small>Expires: ${ad.expiry}</small></p>
        <div class="ad-thumbnails">
          ${ad.images.map(img => `<img src="${img}" alt="Ad Image">`).join("")}
        </div>
      `;
      adEl.addEventListener("click", () => openModal(ad));
      adsContainer.appendChild(adEl);
    });
  }

  // Open modal
  function openModal(ad) {
    modalTitle.textContent = ad.title;
    modalDescription.textContent = ad.description;
    modalCategory.textContent = ad.category + (ad.subcategory ? " - " + ad.subcategory : "");
    modalPhone.textContent = ad.phone || "-";
    modalExpiry.textContent = ad.expiry;
    modalImages.innerHTML = ad.images.map(img => `<img src="${img}" alt="Ad Image">`).join("");

    adModal.classList.remove("hidden");
  }

  // Close modal
  closeModal.addEventListener("click", () => adModal.classList.add("hidden"));
  adModal.addEventListener("click", e => {
    if (e.target === adModal) adModal.classList.add("hidden");
  });

  // Search input
  searchInput.addEventListener("input", () => renderAds(searchInput.value));

  // Init
  renderAds();
})();

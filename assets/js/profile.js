/* ==========================================================================
   profile.js – User profile management
   ========================================================================== */
(function () {
  "use strict";

  const currentUser = Session.getCurrentUser();
  if (!currentUser) {
    alert("You must be logged in to view your profile.");
    window.location.href = "login.html";
    return;
  }

  // Elements
  const profileUsername = document.getElementById("profileUsername");
  const profilePhone = document.getElementById("profilePhone");
  const profileAvatar = document.getElementById("profileAvatar");
  const phoneInput = document.getElementById("phoneInput");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const myAdsContainer = document.getElementById("myAdsContainer");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminLink = document.getElementById("adminLink");

  // Show profile info
  function renderProfile() {
    profileUsername.textContent = currentUser.username;
    profilePhone.textContent = `Phone: ${currentUser.phone || "-"}`;
    phoneInput.value = currentUser.phone || "";

    // Avatar = first initial
    profileAvatar.textContent = currentUser.username.charAt(0).toUpperCase();

    if (currentUser.role === "admin") {
      adminLink.style.display = "inline-block";
    }
  }

  // Save profile changes
  saveProfileBtn.addEventListener("click", function () {
    const users = Storage.get("nb_users_v1") || [];
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) return;

    users[userIndex].phone = phoneInput.value.trim();
    if (newPasswordInput.value.trim() !== "") {
      users[userIndex].password = newPasswordInput.value.trim();
    }

    Storage.set("nb_users_v1", users);
    Session.setCurrentUser(users[userIndex]);

    alert("Profile updated successfully.");
    renderProfile();
    newPasswordInput.value = "";
  });

  // Load user's ads
  function renderMyAds() {
    const ads = Storage.get("nb_ads_v1") || [];
    const myAds = ads.filter(a => a.owner === currentUser.username);

    myAdsContainer.innerHTML = "";
    if (myAds.length === 0) {
      myAdsContainer.innerHTML = "<p>No ads yet.</p>";
      return;
    }

    myAds.forEach(ad => {
      const adEl = document.createElement("div");
      adEl.className = "ad-card";
      adEl.innerHTML = `
        <h4>${ad.title}</h4>
        <p>${ad.description}</p>
        <p><small>Expires: ${ad.expiry}</small></p>
        <button class="edit-ad" data-id="${ad.id}">Edit</button>
        <button class="delete-ad" data-id="${ad.id}">Delete</button>
      `;
      myAdsContainer.appendChild(adEl);
    });

    // Delete
    document.querySelectorAll(".delete-ad").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this ad?")) {
          let ads = Storage.get("nb_ads_v1") || [];
          ads = ads.filter(a => a.id !== btn.dataset.id);
          Storage.set("nb_ads_v1", ads);
          renderMyAds();
        }
      });
    });

    // Edit (redirect to sell.html with ad id)
    document.querySelectorAll(".edit-ad").forEach(btn => {
      btn.addEventListener("click", () => {
        window.location.href = `sell.html?edit=${btn.dataset.id}`;
      });
    });
  }

  // Logout
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
      Session.clear();
      window.location.href = "login.html";
    }
  });

  // Init
  renderProfile();
  renderMyAds();
})();

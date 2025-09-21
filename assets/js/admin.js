/* ============================================================================
   admin.js – Admin-only dashboard
   ============================================================================ */
(function () {
  "use strict";

  function requireAdmin() {
    const user = AuthAPI.requireAuth();
    if (user.role !== "admin") {
      alert("Access denied. Admins only.");
      window.location.href = "index.html";
    }
    return user;
  }

  // ------------------ STATS ------------------
  function renderStats() {
    const users = StorageAPI.users();
    const ads = StorageAPI.ads();
    document.getElementById("stats").innerText =
      `Total Users: ${users.length} | Total Ads: ${ads.length}`;
  }

  // ------------------ INVITE CODES ------------------
  function renderCodes() {
    const codesList = document.getElementById("codesList");
    const codes = StorageAPI.codes();

    codesList.innerHTML = codes
      .map(c => `<div>${c.code} ${c.used ? "(used)" : ""}</div>`)
      .join("");
  }

  function generateCodes() {
    if (!confirm("This will replace old codes. Continue?")) return;

    const newCodes = [];
    for (let i = 0; i < 10; i++) {
      newCodes.push({ code: NB.uid("code"), used: false });
    }
    StorageAPI.saveCodes(newCodes);
    renderCodes();
  }

  // ------------------ USERS ------------------
  function renderUsers() {
    const usersList = document.getElementById("usersList");
    const users = StorageAPI.users();

    usersList.innerHTML = users.map(u => `
      <div class="user-item">
        <strong>${u.username}</strong> (${u.role}) - ${u.phone}
        <button data-action="deleteUser" data-id="${u.id}">Delete</button>
      </div>
    `).join("");
  }

  // ------------------ ADS ------------------
  function renderAds() {
    const adsList = document.getElementById("adsList");
    const ads = StorageAPI.ads();

    adsList.innerHTML = ads.map(ad => `
      <div class="ad-item">
        <strong>${ad.title}</strong> by ${ad.username}
        <button data-action="deleteAd" data-id="${ad.id}">Delete</button>
      </div>
    `).join("");
  }

  function handleActions(e) {
    const btn = e.target;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "deleteUser") {
      if (confirm("Delete this user?")) {
        let users = StorageAPI.users();
        users = users.filter(u => u.id !== id);
        StorageAPI.saveUsers(users);
        renderUsers();
      }
    }

    if (action === "deleteAd") {
      if (confirm("Delete this ad?")) {
        let ads = StorageAPI.ads();
        ads = ads.filter(ad => ad.id !== id);
        StorageAPI.saveAds(ads);
        renderAds();
      }
    }
  }

  // ------------------ INIT ------------------
  document.addEventListener("DOMContentLoaded", () => {
    requireAdmin();
    renderStats();
    renderCodes();
    renderUsers();
    renderAds();

    document.getElementById("generateCodes")
      .addEventListener("click", generateCodes);

    document.body.addEventListener("click", handleActions);
  });
})();

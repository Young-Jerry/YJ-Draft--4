/* ============================================================================
   storage.js – localStorage wrapper + seeding
   ============================================================================ */
(function () {
  "use strict";

  const { USERS_KEY, ADS_KEY, CODES_KEY, SETTINGS_KEY } = window.NB_CONFIG;

  // ------------------ UTILITIES ------------------
  function get(key) {
    const raw = localStorage.getItem(key);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Error parsing storage for key:", key, e);
      return null;
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function initKey(key, defaultVal) {
    if (!get(key)) {
      set(key, defaultVal);
    }
  }

  // ------------------ SEED USERS ------------------
  const seedUsers = [
    {
      id: "u-1",
      username: "sohaum",
      password: "sohaum",
      phone: "9748275795",
      role: "admin",
      createdAt: Date.now(),
      ads: []
    },
    {
      id: "u-2",
      username: "sneha",
      password: "sneha",
      phone: "9748275795",
      role: "user",
      createdAt: Date.now(),
      ads: []
    }
  ];

  // Initialize on first load
  initKey(USERS_KEY, seedUsers);
  initKey(ADS_KEY, []);
  initKey(CODES_KEY, []);
  initKey(SETTINGS_KEY, { theme: "light" });

  // ------------------ EXPORT ------------------
  window.StorageAPI = {
    get,
    set,
    initKey,
    users: () => get(USERS_KEY),
    saveUsers: (arr) => set(USERS_KEY, arr),
    ads: () => get(ADS_KEY),
    saveAds: (arr) => set(ADS_KEY, arr),
    codes: () => get(CODES_KEY),
    saveCodes: (arr) => set(CODES_KEY, arr),
    settings: () => get(SETTINGS_KEY),
    saveSettings: (obj) => set(SETTINGS_KEY, obj)
  };
})();

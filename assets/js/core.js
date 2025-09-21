/* ============================================================================
   core.js – Global constants, helpers
   ============================================================================ */
(function () {
  "use strict";

  // ------------------ CONFIG ------------------
  window.NB_CONFIG = {
    USERS_KEY: "nb_users",
    ADS_KEY: "nb_ads",
    CODES_KEY: "nb_codes",
    SESSION_KEY: "nb_session",
    SETTINGS_KEY: "nb_settings"
  };

  // ------------------ HELPERS ------------------
  window.NB = {
    // Unique ID generator
    uid(prefix = "id") {
      return (
        prefix +
        "-" +
        Math.random().toString(36).substring(2, 10) +
        Date.now().toString(36)
      );
    },

    // Current timestamp
    now() {
      return Date.now();
    },

    // Future timestamp (days from now)
    daysFromNow(days) {
      return Date.now() + days * 24 * 60 * 60 * 1000;
    },

    // Expiry check
    isExpired(timestamp) {
      return Date.now() > timestamp;
    }
  };
})();

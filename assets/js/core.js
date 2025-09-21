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
    uid: function (prefix = "id") {
      return prefix + "-" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    },
    now: function () {
      return Date.now();
    },
    daysFromNow: function (days) {
      return Date.now() + days * 24 * 60 * 60 * 1000;
    },
    isExpired: function (timestamp) {
      return Date.now() > timestamp;
    }
  };
})();

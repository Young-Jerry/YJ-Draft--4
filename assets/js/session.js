/* ============================================================================
   session.js – persistent session handling
   ============================================================================ */
(function () {
  "use strict";

  const { SESSION_KEY } = window.NB_CONFIG;

  function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function saveSession(sessionObj) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function setCurrentUser(userId) {
    saveSession({
      currentUserId: userId,
      token: "tok-" + Math.random().toString(36).substring(2),
      expiresAt: null // persistent until logout
    });
  }

  function currentUser() {
    const session = getSession();
    if (!session) return null;
    const users = StorageAPI.users();
    return users.find((u) => u.id === session.currentUserId) || null;
  }

  // Export
  window.SessionAPI = {
    getSession,
    saveSession,
    clearSession,
    setCurrentUser,
    currentUser
  };
})();

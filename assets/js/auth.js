/* ============================================================================
   auth.js – Login, signup, logout
   ============================================================================ */
(function () {
  "use strict";

  // ------------------ LOGIN ------------------
  function login(username, password) {
    const users = StorageAPI.users();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return { success: false, message: "Invalid credentials" };

    SessionAPI.setCurrentUser(user.id);
    return { success: true, user };
  }

  // ------------------ SIGNUP ------------------
  function signup(username, password, phone, inviteCode) {
    const users = StorageAPI.users();

    if (users.find((u) => u.username === username)) {
      return { success: false, message: "Username already taken" };
    }

    // Validate invite code
    const codes = StorageAPI.codes();
    const codeObj = codes.find((c) => c.code === inviteCode && !c.used);
    if (!codeObj) {
      return { success: false, message: "Invalid or used invite code" };
    }

    const newUser = {
      id: NB.uid("u"),
      username,
      password,
      phone,
      role: "user",
      createdAt: Date.now(),
      ads: []
    };

    users.push(newUser);
    StorageAPI.saveUsers(users);

    // Mark code as used
    codeObj.used = true;
    StorageAPI.saveCodes(codes);

    SessionAPI.setCurrentUser(newUser.id);
    return { success: true, user: newUser };
  }

  // ------------------ LOGOUT ------------------
  function logout() {
    SessionAPI.clearSession();
    window.location.href = "login.html";
  }

  // ------------------ HELPERS ------------------
  function requireAuth() {
    const user = SessionAPI.currentUser();
    if (!user) {
      window.location.href = "login.html";
    }
    return user;
  }

  // ------------------ EXPORT ------------------
  window.AuthAPI = {
    login,
    signup,
    logout,
    requireAuth
  };
})();

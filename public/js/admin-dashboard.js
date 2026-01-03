// public/js/admin-dashboard.js

(function () {
  /* -------------------------
   * Helpers
   * ------------------------- */
  function decodeJwt(token) {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /* -------------------------
   * API Health
   * ------------------------- */
  async function loadHealth() {
    try {
      const res = await fetch("/health");
      const data = await res.json();

      document.getElementById("api-status").textContent =
        data.status === "ok" ? "🟢 Healthy" : "🔴 Unhealthy";

      document.getElementById("api-uptime").textContent =
        Math.floor(data.uptime) + " sec";
    } catch {
      document.getElementById("api-status").textContent = "Unavailable";
    }
  }

  /* -------------------------
   * System Meta
   * ------------------------- */
  async function loadSystem() {
    try {
      const res = await fetch("/internal/meta/system");
      const data = await res.json();
      document.getElementById("api-env").textContent = data.environment;
    } catch {
      document.getElementById("api-env").textContent = "—";
    }
  }

  /* -------------------------
   * Auth Context
   * ------------------------- */
  function loadAuthContext() {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload) return;

    document.getElementById("user-email").textContent =
      payload.email || "—";

    document.getElementById("auth-provider").textContent =
      payload.app_metadata?.provider || "supabase";
  }

  /* -------------------------
   * Init
   * ------------------------- */
  loadHealth();
  loadSystem();
  loadAuthContext();
})();

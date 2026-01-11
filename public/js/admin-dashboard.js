// public/js/admin-dashboard.js
(function () {
  /* -------------------------
   * Load Health
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

      document.getElementById("api-env").textContent =
        data.environment || "—";
    } catch {
      document.getElementById("api-env").textContent = "—";
    }
  }

  /* -------------------------
   * API Count
   * ------------------------- */
  async function loadApiCount() {
    try {
      const res = await fetch("/internal/meta/apis");
      const data = await res.json();
      document.getElementById("api-count").textContent =
        data.apis?.length || "—";
    } catch {
      document.getElementById("api-count").textContent = "—";
    }
  }

  /* -------------------------
   * Init
   * ------------------------- */
  loadHealth();
  loadSystem();
  loadApiCount();
})();

// public/js/home-metrics.js
(function () {
  async function loadHealth() {
    try {
      const res = await fetch("/health");
      const data = await res.json();

      const statusEl = document.getElementById("api-status");
      const uptimeEl = document.getElementById("api-uptime");

      if (statusEl) {
        statusEl.textContent =
          data.status === "ok" ? "🟢 Healthy" : "🔴 Unhealthy";
      }

      if (uptimeEl) {
        uptimeEl.textContent = Math.floor(data.uptime) + " sec";
      }
    } catch {
      const statusEl = document.getElementById("api-status");
      if (statusEl) statusEl.textContent = "Unavailable";
    }
  }

  async function loadSystem() {
    try {
      const res = await fetch("/internal/meta/system");
      const data = await res.json();

      const envEl = document.getElementById("api-env");
      if (envEl) envEl.textContent = data.environment || "—";
    } catch {
      const envEl = document.getElementById("api-env");
      if (envEl) envEl.textContent = "—";
    }
  }

  async function loadApiCount() {
    try {
      const res = await fetch("/internal/meta/apis");
      const data = await res.json();

      const countEl = document.getElementById("api-count");
      if (countEl) countEl.textContent = data.apis?.length ?? "—";
    } catch {
      const countEl = document.getElementById("api-count");
      if (countEl) countEl.textContent = "—";
    }
  }

  function init() {
    loadHealth();
    loadSystem();
    loadApiCount();

    // Optional auto-refresh every 60s
    setInterval(loadHealth, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

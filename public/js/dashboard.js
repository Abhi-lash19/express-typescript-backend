// public/js/dashboard.js

(async function () {
  try {
    const res = await apiFetch("/internal/meta/system");
    const data = await res.json();

    document.getElementById("status").textContent =
      data.status === "healthy" ? "🟢 Healthy" : "🔴 Unhealthy";

    document.getElementById("uptime").textContent =
      Math.floor(data.uptime) + " sec";

    document.getElementById("env").textContent = data.environment;
    document.getElementById("node").textContent = data.nodeVersion;
  } catch (err) {
    console.error("Failed to load system metrics", err);
  }
})();

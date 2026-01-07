// public/js/app.js

(function () {
  const TOKEN_KEY = "auth_token";

  /* -------------------------
   * Theme Handling
   * ------------------------- */
  const storedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const theme = storedTheme || systemTheme;
  document.documentElement.setAttribute("data-theme", theme);

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  /* -------------------------
   * Auth Helpers
   * ------------------------- */
  window.getToken = function () {
    return localStorage.getItem(TOKEN_KEY);
  };

  window.logout = function () {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/admin/login";
  };

  /* -------------------------
   * Signup Helper (Phase 1B)
   * ------------------------- */
  window.signupUser = async function (email, password) {
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  };

  /* -------------------------
   * Fetch Wrapper
   * ------------------------- */
  window.apiFetch = async function (url, options = {}) {
    const token = getToken();

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }

    return res;
  };
})();

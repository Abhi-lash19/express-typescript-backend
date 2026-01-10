// public/js/app.js

(function () {
  /* -------------------------
   * Modal Controls
   * ------------------------- */
  window.openAuthModal = function () {
    document.getElementById("auth-modal").style.display = "flex";
  };

  window.closeAuthModal = function () {
    document.getElementById("auth-modal").style.display = "none";
    document.getElementById("auth-message").textContent = "";
  };

  /* -------------------------
   * Signup Handler
   * ------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("auth-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("auth-email").value;
      const password = document.getElementById("auth-password").value;
      const msg = document.getElementById("auth-message");

      msg.textContent = "Creating account...";

      try {
        const res = await fetch("/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          msg.textContent = data?.error?.message || "Signup failed";
          return;
        }

        msg.textContent =
          "Account created successfully. You can now use the API Playground.";

        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      } catch {
        msg.textContent = "Network error. Please try again.";
      }
    });
  });
})();

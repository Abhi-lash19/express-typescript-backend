// public/js/app.js

(function () {
  /* -------------------------
   * Theme Handling
   * ------------------------- */
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // notify all listeners (dashboard, docs, etc.)
  window.dispatchEvent(new Event("themechange"));

  /* -------------------------
   * Modal Controls
   * ------------------------- */
  window.openAuthModal = function () {
    document.getElementById("auth-modal").style.display = "flex";
  };

  window.closeAuthModal = function () {
    document.getElementById("auth-modal").style.display = "none";
    document.getElementById("auth-message").textContent = "";
    document.getElementById("password-hints").innerHTML = "";
  };

  window.togglePasswordVisibility = function () {
    const input = document.getElementById("auth-password");
    input.type = input.type === "password" ? "text" : "password";
  };

  /* -------------------------
   * Password Validation
   * ------------------------- */
  function validatePassword(password) {
    const errors = [];

    if (password.length < 10) errors.push("At least 10 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter required");
    if (!/[0-9]/.test(password)) errors.push("One number required");
    if (!/[!@#$%^&*]/.test(password)) errors.push("One symbol required");
    if (/\s/.test(password)) errors.push("No spaces allowed");

    return errors;
  }

  /* -------------------------
   * Signup Handler
   * ------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("auth-form");
    if (!form) return;

    const passwordInput = document.getElementById("auth-password");
    const hints = document.getElementById("password-hints");
    const msg = document.getElementById("auth-message");

    passwordInput.addEventListener("input", () => {
      const errors = validatePassword(passwordInput.value);
      hints.innerHTML = "";
      errors.forEach((e) => {
        const li = document.createElement("li");
        li.textContent = e;
        hints.appendChild(li);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("auth-email").value;
      const password = passwordInput.value;

      const errors = validatePassword(password);
      if (errors.length) {
        msg.className = "error-text";
        msg.textContent = "Please fix password issues above.";
        return;
      }

      msg.className = "muted";
      msg.textContent = "Creating account...";

      try {
        const res = await fetch("/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          msg.className = "error-text";
          msg.textContent = data?.error?.message || "Signup failed";
          return;
        }

        /* -------------------------
         * AUTO LOGIN AFTER SIGNUP
         * ------------------------- */
        localStorage.setItem("auth_token", data.token);
        window.dispatchEvent(new Event("storage"));

        msg.className = "success-text";
        msg.textContent =
          "Account created successfully. You can now use the API Playground.";

        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      } catch {
        msg.className = "error-text";
        msg.textContent = "Network error. Please try again.";
      }
    });
  });
})();

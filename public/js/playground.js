// public/js/playground.js

// Reuses same UX as login modal
window.togglePlaygroundPassword = function () {
  const input = document.getElementById("pg-password");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
};

(async function () {
  const els = {
    list: document.getElementById("endpoint-list"),
    method: document.getElementById("method"),
    endpoint: document.getElementById("endpoint"),
    pathParams: document.getElementById("path-params"),
    queryParams: document.getElementById("query-params"),
    body: document.getElementById("body"),
    bodyType: document.getElementById("bodyType"),
    token: document.getElementById("token"),
    status: document.getElementById("status"),
    time: document.getElementById("time"),
    rate: document.getElementById("rate"),
    response: document.getElementById("response"),
    schema: document.getElementById("schema"),
    responsePanel: document.getElementById("response-panel"),
    authTypeSelect: document.getElementById("authType"),
    bearerPanel: document.getElementById("bearer-panel"),
  };

  /* -------------------------
   * Restore Token
   * ------------------------- */
  const storedToken = localStorage.getItem("playground_token");
  if (storedToken) {
    els.token.value = storedToken;
    els.authTypeSelect.value = "bearer";
  }

  const METHOD_COLOR = {
    GET: "#4da3ff",
    POST: "#4caf50",
    PUT: "#ff9800",
    DELETE: "#f44336",
  };

  const res = await fetch("/internal/meta/apis");
  const { apis } = await res.json();

  let activeApi = null;

  /* -------------------------
   * Helpers
   * ------------------------- */

  function syncEndpointFromParams() {
    if (!activeApi) return;

    let path = activeApi.path;

    els.pathParams.querySelectorAll("input").forEach((i) => {
      path = path.replace(`{${i.dataset.name}}`, i.value || "");
    });

    els.endpoint.value = path;
  }

  function syncPathParamsFromEndpoint() {
    if (!activeApi) return;

    const templateParts = activeApi.path.split("/");
    const valueParts = els.endpoint.value.split("/");

    els.pathParams.querySelectorAll("input").forEach((input) => {
      const idx = templateParts.indexOf(`{${input.dataset.name}}`);
      if (idx !== -1 && valueParts[idx]) {
        input.value = valueParts[idx];
      }
    });
  }

  /* -------------------------
   * Render Params
   * ------------------------- */
  function renderParams(api) {
    els.pathParams.innerHTML = "";
    els.queryParams.innerHTML = "";

    api.params?.forEach((p) => {
      const row = document.createElement("div");
      row.className = "grid";

      const label = document.createElement("small");
      label.textContent = p.name;

      const input = document.createElement("input");
      input.placeholder = p.example ?? "";
      input.dataset.name = p.name;

      if (p.in === "path") {
        input.addEventListener("input", syncEndpointFromParams);
        els.pathParams.appendChild(row);
      } else {
        els.queryParams.appendChild(row);
      }

      row.append(label, input);
    });
  }

  /* -------------------------
   * Endpoint List
   * ------------------------- */
  apis.forEach((api) => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";

    li.innerHTML = `
      <span style="color:${METHOD_COLOR[api.method]};font-weight:600">
        ${api.method}
      </span>
      <code>${api.path}</code>
      <span class="muted">— ${api.description}</span>
    `;

    li.onclick = () => {
      activeApi = api;
      els.method.value = api.method;
      els.endpoint.value = api.path;

      renderParams(api);

      els.bodyType.value = api.requestBody?.type || "none";
      els.body.value = api.requestBody?.example
        ? JSON.stringify(api.requestBody.example, null, 2)
        : "";

      // Schema is documentation only
      els.schema.textContent = JSON.stringify(
        api.responseExample || {},
        null,
        2
      );
    };

    els.list.appendChild(li);
  });

  /* -------------------------
   * Authorization UX
   * ------------------------- */
  function updateAuthUI() {
    els.bearerPanel.style.display =
      els.authTypeSelect.value === "bearer" ? "block" : "none";
  }

  els.authTypeSelect.addEventListener("change", updateAuthUI);
  updateAuthUI();

  els.token.addEventListener("input", () => {
    localStorage.setItem("playground_token", els.token.value);
  });

  /* -------------------------
   * Endpoint manual edit → sync params
   * ------------------------- */
  els.endpoint.addEventListener("input", syncPathParamsFromEndpoint);

  /* -------------------------
   * Send Request
   * ------------------------- */
  document.getElementById("send").onclick = async () => {
    if (!activeApi) {
      alert("Please select an endpoint first.");
      return;
    }

    const start = performance.now();
    const headers = {};

    if (els.authTypeSelect.value === "bearer" && els.token.value) {
      headers.Authorization = `Bearer ${els.token.value}`;
    }

    if (els.bodyType.value === "json") {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(els.endpoint.value, {
      method: els.method.value,
      headers,
      body: els.bodyType.value === "json" ? els.body.value : undefined,
    });

    els.status.textContent = res.status;
    els.time.textContent = Math.round(performance.now() - start);
    els.rate.textContent =
      res.headers.get("x-ratelimit-remaining") || "N/A";

    els.response.textContent = JSON.stringify(await res.json(), null, 2);

    els.responsePanel.scrollIntoView({ behavior: "smooth" });
  };

  /* -------------------------
   * Beautify JSON
   * ------------------------- */
  document.getElementById("beautify").onclick = () => {
    try {
      els.body.value = JSON.stringify(JSON.parse(els.body.value), null, 2);
    } catch {
      alert("Invalid JSON");
    }
  };

  /* -------------------------
   * Generate Token (Auth → Playground)
   * ------------------------- */
  document.getElementById("generate-token")?.addEventListener("click", async () => {
      const email = document.getElementById("pg-email").value;
      const password = document.getElementById("pg-password").value;
      const msg = document.getElementById("pg-auth-message");

      msg.textContent = "Generating token...";

      try {
        const res = await fetch("/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          msg.textContent = data?.error?.message || "Invalid credentials";
          return;
        }

        els.token.value = data.token;
        localStorage.setItem("playground_token", data.token);
        els.authTypeSelect.value = "bearer";
        updateAuthUI();

        msg.textContent = "Token generated and applied successfully.";
      } catch {
        msg.textContent = "Network error while generating token.";
      }
    });

  /* -------------------------
   * Tabs
   * ------------------------- */
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.onclick = (e) => {
      e.preventDefault();
      const target = tab.dataset.tab;

      document.querySelectorAll("[data-panel]").forEach((p) => {
        p.hidden = p.dataset.panel !== target;
      });
    };
  });
})();

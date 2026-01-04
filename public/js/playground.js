// public/js/playground.js

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
  };

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
   * Render Params (Postman-like)
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

      row.append(label, input);

      p.in === "path"
        ? els.pathParams.appendChild(row)
        : els.queryParams.appendChild(row);
    });
  }

  /* -------------------------
   * Build Final Endpoint
   * ------------------------- */
  function buildEndpoint() {
    let path = activeApi.path;

    els.pathParams.querySelectorAll("input").forEach((i) => {
      path = path.replace(`{${i.dataset.name}}`, i.value || "");
    });

    const query = [];
    els.queryParams.querySelectorAll("input").forEach((i) => {
      if (i.value) query.push(`${i.dataset.name}=${encodeURIComponent(i.value)}`);
    });

    return query.length ? `${path}?${query.join("&")}` : path;
  }

  /* -------------------------
   * Render Endpoint List
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

      els.schema.textContent = JSON.stringify(api.responseExample || {}, null, 2);
    };

    els.list.appendChild(li);
  });

  /* -------------------------
   * Send Request
   * ------------------------- */
  document.getElementById("send").onclick = async () => {
    els.endpoint.value = buildEndpoint();
    const start = performance.now();

    const headers = {};
    if (els.token.value) headers.Authorization = `Bearer ${els.token.value}`;
    if (els.bodyType.value === "json") headers["Content-Type"] = "application/json";

    const res = await fetch(els.endpoint.value, {
      method: els.method.value,
      headers,
      body: els.bodyType.value === "json" ? els.body.value : undefined,
    });

    els.status.textContent = res.status;
    els.time.textContent = Math.round(performance.now() - start);
    els.rate.textContent = res.headers.get("x-ratelimit-remaining") || "N/A";

    els.response.textContent = JSON.stringify(await res.json(), null, 2);

    els.responsePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
   * Tabs Logic
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

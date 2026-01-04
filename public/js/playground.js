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
  };

  const res = await fetch("/internal/meta/apis");
  const { apis } = await res.json();

  let activeApi = null;

  function renderParams(api) {
    els.pathParams.innerHTML = "";
    els.queryParams.innerHTML = "";

    api.params?.forEach(p => {
      const input = document.createElement("input");
      input.placeholder = p.name;
      input.dataset.name = p.name;

      if (p.in === "path") {
        els.pathParams.append(`Path param (${p.name})`, input);
      } else {
        els.queryParams.append(`Query param (${p.name})`, input);
      }
    });
  }

  function buildEndpoint() {
    let path = activeApi.path;
    els.pathParams.querySelectorAll("input").forEach(i => {
      path = path.replace(`{${i.dataset.name}}`, i.value || "");
    });

    const query = [];
    els.queryParams.querySelectorAll("input").forEach(i => {
      if (i.value) query.push(`${i.dataset.name}=${i.value}`);
    });

    return query.length ? `${path}?${query.join("&")}` : path;
  }

  apis.forEach(api => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${api.method}</strong> ${api.path} — ${api.description}`;
    li.onclick = () => {
      activeApi = api;
      els.method.value = api.method;
      renderParams(api);
      els.endpoint.value = buildEndpoint();
      els.body.value = api.requestBody?.example
        ? JSON.stringify(api.requestBody.example, null, 2)
        : "";
      els.schema.textContent = JSON.stringify(api.responseExample || {}, null, 2);
    };
    els.list.appendChild(li);
  });

  document.getElementById("send").onclick = async () => {
    els.endpoint.value = buildEndpoint();
    const start = performance.now();

    const headers = {};
    if (els.token.value) headers.Authorization = `Bearer ${els.token.value}`;
    if (els.bodyType.value === "json") headers["Content-Type"] = "application/json";

    const r = await fetch(els.endpoint.value, {
      method: els.method.value,
      headers,
      body: els.bodyType.value === "json" ? els.body.value : undefined,
    });

    els.status.textContent = r.status;
    els.time.textContent = Math.round(performance.now() - start);
    els.rate.textContent = r.headers.get("x-ratelimit-remaining") || "N/A";
    els.response.textContent = JSON.stringify(await r.json(), null, 2);

    document.getElementById("response-panel").scrollIntoView({ behavior: "smooth" });
  };

  document.getElementById("beautify").onclick = () => {
    els.body.value = JSON.stringify(JSON.parse(els.body.value), null, 2);
  };
})();

// public/js/playground.js

(async function () {
  const apiListEl = document.getElementById("endpoint-list");
  const methodEl = document.getElementById("method");
  const endpointEl = document.getElementById("endpoint");
  const bodyEl = document.getElementById("body");
  const bodyTypeEl = document.getElementById("bodyType");
  const tokenEl = document.getElementById("token");

  const statusEl = document.getElementById("status");
  const timeEl = document.getElementById("time");
  const rateEl = document.getElementById("rate");
  const responseEl = document.getElementById("response");

  const sendBtn = document.getElementById("send");
  const beautifyBtn = document.getElementById("beautify");
  const copyCurlBtn = document.getElementById("copyCurl");

  const metaRes = await fetch("/internal/meta/apis");
  const { apis } = await metaRes.json();

  function methodColor(method) {
    return {
      GET: "blue",
      POST: "green",
      PUT: "orange",
      DELETE: "red"
    }[method] || "gray";
  }

  apis.forEach(api => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong style="color:${methodColor(api.method)}">${api.method}</strong>
      ${api.path} — ${api.description}
    `;
    li.style.cursor = "pointer";

    li.onclick = () => {
      methodEl.value = api.method;
      endpointEl.value = api.path.replace("{id}", api.params?.[0]?.example || "1");
      bodyTypeEl.value = api.requestBody?.type || "none";
      bodyEl.value = api.requestBody?.example
        ? JSON.stringify(api.requestBody.example, null, 2)
        : "";
    };

    apiListEl.appendChild(li);
  });

  beautifyBtn.onclick = () => {
    try {
      bodyEl.value = JSON.stringify(JSON.parse(bodyEl.value), null, 2);
    } catch {
      alert("Invalid JSON");
    }
  };

  sendBtn.onclick = async () => {
    const start = performance.now();
    const headers = {};

    if (tokenEl.value) {
      headers["Authorization"] = `Bearer ${tokenEl.value}`;
    }

    if (bodyTypeEl.value === "json") {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(endpointEl.value, {
      method: methodEl.value,
      headers,
      body:
        bodyTypeEl.value === "json" && bodyEl.value
          ? bodyEl.value
          : undefined
    });

    const end = performance.now();

    statusEl.textContent = res.status;
    timeEl.textContent = Math.round(end - start);
    rateEl.textContent =
      res.headers.get("x-ratelimit-remaining") || "N/A";

    responseEl.textContent = JSON.stringify(await res.json(), null, 2);
  };

  copyCurlBtn.onclick = () => {
    const curl = `curl -X ${methodEl.value} "${location.origin}${endpointEl.value}" \\
  -H "Authorization: Bearer ${tokenEl.value}"`;
    navigator.clipboard.writeText(curl);
    alert("cURL copied");
  };
})();

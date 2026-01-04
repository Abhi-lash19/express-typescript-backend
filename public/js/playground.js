// public/js/playground.js

(function () {
  const methodEl = document.getElementById("method");
  const endpointEl = document.getElementById("endpoint");
  const bodyEl = document.getElementById("body");

  const statusEl = document.getElementById("status");
  const timeEl = document.getElementById("time");
  const rateEl = document.getElementById("rate");
  const responseEl = document.getElementById("response");
  const recentEl = document.getElementById("recent");

  const sendBtn = document.getElementById("send");
  const copyCurlBtn = document.getElementById("copyCurl");

  let recentRequests = [];

  function getToken() {
    return localStorage.getItem("auth_token");
  }

  function addRecent(method, endpoint) {
    recentRequests.unshift(`${method} ${endpoint}`);
    recentRequests = recentRequests.slice(0, 5);

    recentEl.innerHTML = "";
    recentRequests.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      recentEl.appendChild(li);
    });
  }

  async function sendRequest() {
    const method = methodEl.value;
    const endpoint = endpointEl.value.trim();
    const body = bodyEl.value.trim();

    if (!endpoint.startsWith("/")) {
      alert("Endpoint must start with /");
      return;
    }

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    };

    if (body && method !== "GET") {
      try {
        options.body = JSON.stringify(JSON.parse(body));
      } catch {
        alert("Invalid JSON body");
        return;
      }
    }

    const start = performance.now();

    try {
      const res = await fetch(endpoint, options);
      const end = performance.now();

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = text;
      }

      statusEl.textContent = res.status;
      timeEl.textContent = Math.round(end - start);

      const limit = res.headers.get("x-ratelimit-limit");
      const remaining = res.headers.get("x-ratelimit-remaining");
      rateEl.textContent = limit
        ? `${remaining}/${limit}`
        : "N/A";

      responseEl.textContent = JSON.stringify(json, null, 2);
      addRecent(method, endpoint);
    } catch (err) {
      responseEl.textContent = err.message;
    }
  }

  function copyAsCurl() {
    const method = methodEl.value;
    const endpoint = endpointEl.value.trim();
    const body = bodyEl.value.trim();
    const token = getToken();

    let curl = `curl -X ${method} "${window.location.origin}${endpoint}" \\\n  -H "Authorization: Bearer ${token}" \\\n  -H "Content-Type: application/json"`;

    if (body && method !== "GET") {
      curl += ` \\\n  -d '${body}'`;
    }

    navigator.clipboard.writeText(curl);
    alert("cURL copied to clipboard");
  }

  sendBtn.addEventListener("click", sendRequest);
  copyCurlBtn.addEventListener("click", copyAsCurl);
})();

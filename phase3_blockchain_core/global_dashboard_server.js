// phase3_blockchain_core/global_dashboard_server.js
const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.GLOBAL_DASHBOARD_PORT || 9000;

// 🟢 List all monitor servers here
const nodes = [
  { id: "Node-6001", url: "http://localhost:9090/stats" },
  { id: "Node-6002", url: "http://localhost:9091/stats" },
  { id: "Node-6003", url: "http://localhost:9092/stats" },
];

// Serve small web dashboard
app.get("/", async (req, res) => {
  const data = await Promise.all(
    nodes.map(async (n) => {
      try {
        const r = await fetch(n.url);
        const js = await r.json();
        return { id: n.id, ...js };
      } catch {
        return { id: n.id, error: "Offline" };
      }
    })
  );

  const active = data.filter((n) => !n.error);
  const avgHeight =
    active.reduce((s, n) => s + (n.height || 0), 0) / (active.length || 1);
  const avgTps =
    active.reduce((s, n) => s + (n.avgTps || 0), 0) / (active.length || 1);
  const avgLatency =
    active.reduce((s, n) => s + (n.avgLatency || 0), 0) / (active.length || 1);

  const html = `
  <html>
  <head>
    <title>SYNAPSE Global Dashboard</title>
    <meta http-equiv="refresh" content="5">
    <style>
      body { background:#0a0a0a; color:#eee; font-family:sans-serif; text-align:center; }
      table { margin:auto; border-collapse:collapse; }
      th,td { padding:8px 16px; border:1px solid #333; }
      th { background:#1a1a1a; }
      h1 { color:#00b7ff; }
    </style>
  </head>
  <body>
    <h1>🛰 SYNAPSE Global Dashboard</h1>
    <table>
      <tr><th>Node</th><th>Height</th><th>TPS</th><th>Latency (ms)</th><th>Delegates</th><th>Block Size</th><th>Status</th></tr>
      ${data
        .map(
          (n) =>
            `<tr>
              <td>${n.id}</td>
              <td>${n.height || "-"}</td>
              <td>${n.avgTps || "-"}</td>
              <td>${n.avgLatency || "-"}</td>
              <td>${n.delegates ? n.delegates.length : "-"}</td>
              <td>${n.blockSize || "-"}</td>
              <td>${n.error ? "🔴 Offline" : "🟢 Online"}</td>
            </tr>`
        )
        .join("")}
    </table>

    <h3 style="margin-top:30px;">🌍 Network Averages</h3>
    <p>Block Height ≈ <b>${avgHeight.toFixed(1)}</b> | TPS ≈ <b>${avgTps.toFixed(
    2
  )}</b> | Latency ≈ <b>${avgLatency.toFixed(2)} ms</b></p>
  </body></html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(
    `🌍 Global Dashboard running → http://localhost:${PORT} (auto-refresh 5 s)`
  );
});

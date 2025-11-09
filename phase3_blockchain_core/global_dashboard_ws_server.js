// phase3_blockchain_core/global_dashboard_ws_server.js
// Aggregator + WebSocket broadcaster for the Global Dashboard

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.GLOBAL_DASHBOARD_PORT || 9000;

// Configure your node monitors here (edit if you run different ports)
const nodes = [
  { id: "Node-6001", url: "http://localhost:9090/stats" },
  { id: "Node-6002", url: "http://localhost:9091/stats" },
  { id: "Node-6003", url: "http://localhost:9092/stats" },
];

app.get("/", (_req, res) => {
  res.send(
    `<html><body style="background:#0b1221;color:#fff;font-family:sans-serif">
      <h2 style="color:#00b7ff">SYNAPSE Global Dashboard WS Server</h2>
      <p>Connect a WebSocket client to <b>ws://localhost:${PORT}</b> to receive live aggregated metrics (every 2s).</p>
      <p>Or visit <a style="color:#4dd0e1" href="/nodes">/nodes</a> for a quick JSON snapshot.</p>
    </body></html>`
  );
});

app.get("/nodes", async (_req, res) => {
  const data = await Promise.all(
    nodes.map(async (n) => {
      try {
        const r = await fetch(n.url);
        const js = await r.json();
        return { id: n.id, ok: true, stats: js };
      } catch (e) {
        return { id: n.id, ok: false, error: String(e) };
      }
    })
  );
  res.json({ time: Date.now(), nodes: data });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🔌 Dashboard client connected");
  // On connect, send an immediate snapshot
  sendSnapshotTo(ws);
  ws.on("close", () => console.log("🔌 Dashboard client disconnected"));
});

// fetch & aggregate nodes, then broadcast to all clients
async function collectAndBroadcast() {
  const raw = await Promise.all(
    nodes.map(async (n) => {
      try {
        const r = await fetch(n.url, { timeout: 2000 });
        const js = await r.json();
        return { id: n.id, ok: true, stats: js };
      } catch (e) {
        return { id: n.id, ok: false, error: String(e) };
      }
    })
  );

  const active = raw.filter((r) => r.ok).map((r) => ({
    id: r.id,
    height: r.stats.height || 0,
    avgTps: r.stats.avgTps || 0,
    avgLatency: r.stats.avgLatency || 0,
    delegates: r.stats.delegates ? r.stats.delegates.length : 0,
    blockSize: r.stats.blockSize || 0,
    time: r.stats.time || Date.now(),
  }));

  const avgHeight = active.reduce((s, n) => s + n.height, 0) / (active.length || 1);
  const avgTps = active.reduce((s, n) => s + n.avgTps, 0) / (active.length || 1);
  const avgLatency = active.reduce((s, n) => s + n.avgLatency, 0) / (active.length || 1);

  const payload = {
    type: "GLOBAL_STATS",
    ts: Date.now(),
    nodes: active,
    aggregates: { avgHeight, avgTps, avgLatency },
  };

  // broadcast to all connected WS clients
  const msg = JSON.stringify(payload);
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}

async function sendSnapshotTo(ws) {
  const raw = await Promise.all(
    nodes.map(async (n) => {
      try {
        const r = await fetch(n.url, { timeout: 2000 });
        const js = await r.json();
        return { id: n.id, ok: true, stats: js };
      } catch (e) {
        return { id: n.id, ok: false, error: String(e) };
      }
    })
  );

  const active = raw.filter((r) => r.ok).map((r) => ({
    id: r.id,
    height: r.stats.height || 0,
    avgTps: r.stats.avgTps || 0,
    avgLatency: r.stats.avgLatency || 0,
    delegates: r.stats.delegates ? r.stats.delegates.length : 0,
    blockSize: r.stats.blockSize || 0,
    time: r.stats.time || Date.now(),
  }));

  const payload = {
    type: "GLOBAL_STATS",
    ts: Date.now(),
    nodes: active,
    aggregates: {
      avgHeight:
        active.reduce((s, n) => s + n.height, 0) / (active.length || 1),
      avgTps: active.reduce((s, n) => s + n.avgTps, 0) / (active.length || 1),
      avgLatency:
        active.reduce((s, n) => s + n.avgLatency, 0) / (active.length || 1),
    },
  };

  ws.send(JSON.stringify(payload));
}

// polling interval (every 2000ms) — tweak if you want faster/slower updates
setInterval(collectAndBroadcast, 2000);

server.listen(PORT, () => {
  console.log(`🌍 Global Dashboard WS server running → http://localhost:${PORT} (ws://${"localhost:" + PORT})`);
});

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4001 });

wss.on("headers", (headers) => {
  headers.push("Access-Control-Allow-Origin: *");
});

wss.on("connection", (ws) => {
  console.log("🌐 WebSocket client connected");
  ws.send(JSON.stringify({ type: "SYSTEM", message: "Connected to Synapse metric stream", timestamp: Date.now() }));

  ws.on("close", () => console.log("🔌 WebSocket client disconnected"));
});

console.log("📡 WebSocket metric stream active on port 4001");

export function broadcastMetrics(eventType, payload) {
  const packet = { type: eventType, data: payload, timestamp: Date.now() };
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(packet));
  });
}

import axios from "axios";

const EDGE_URL = "http://localhost:4000/ingest";

function generateSensorData() {
  return {
    deviceId: "dev1",
    ts: Date.now(),
    temp: 20 + Math.random() * 10,
    humidity: 40 + Math.random() * 20
  };
}

async function sendToEdge(data) {
  try {
    const res = await axios.post(EDGE_URL, data, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("✅ Sent to Edge:", res.data);
  } catch (err) {
    console.error("❌ Failed to send:", err.message);
  }
}

async function main() {
  console.log("🌐 SYNAPSE Phase-1: IoT Data Simulation Started...");
  while (true) {
    const data = generateSensorData();
    console.log("📡 Generated:", data);
    await sendToEdge(data);
    await new Promise(r => setTimeout(r, 2000)); // send every 2s
  }
}

main();

import axios from "axios";
import { broadcastMetrics } from "./metricStream.js";
import { recordEvent } from "./performanceMonitor.js";

export async function edgePreprocess({ sensorId, payload }) {
  const start = Date.now();

  try {
    const response = await axios.post("http://localhost:5002/ingest", payload, {
      headers: { "x-signature": "dev-bypass" },
      timeout: 3000,
    });

    const latency = Date.now() - start; // time taken for edge validation

    const validated = {
      sensorId,
      validated: response.data.validated,
      latency,
      timestamp: Date.now(),
    };

    // 🔹 Push to dashboard & log file
    broadcastMetrics("EDGE_VALIDATED", validated);
    recordEvent("EDGE_VALIDATED", validated);

    return response.data;
  } catch (err) {
    console.error("❌ Edge Gateway unreachable:", err.message);
    throw err;
  }
}

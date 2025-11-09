import { broadcastMetrics } from "./metricStream.js";
import { recordEvent } from "./performanceMonitor.js";

export async function addBlock({ sensorId, data }) {
  const hash = "blk_" + Math.random().toString(36).substring(2, 8);
  const block = { sensorId, data, hash, timestamp: Date.now() };

  console.log("🧱 Block Added:", hash);

  // ✅ send event to frontend
  broadcastMetrics("BLOCK_ADDED", block);
  recordEvent("BLOCK_ADDED", block);

  return { hash, status: "added_to_chain" };
}

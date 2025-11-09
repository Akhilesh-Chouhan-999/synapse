import fs from "fs";
import path from "path";
import { broadcastMetrics } from "./metricStream.js";

const logPath = path.join(process.cwd(), "performance_logs.json");
let metrics = []; // in-memory store

export function recordEvent(eventType, payload) {
  const now = Date.now();
  const entry = { eventType, timestamp: now, ...payload };
  metrics.push(entry);

  // live feed for dashboard
  broadcastMetrics("PERFORMANCE_UPDATE", entry);

  // persist every 20 events
  if (metrics.length % 20 === 0) {
    fs.writeFileSync(logPath, JSON.stringify(metrics, null, 2));
  }
}

// optional helper
export function getRecentMetrics(limit = 100) {
  return metrics.slice(-limit);
}

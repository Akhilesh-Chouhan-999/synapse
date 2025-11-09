import { broadcastMetrics } from "./metricStream.js";
import { recordEvent } from "./performanceMonitor.js";

export async function updateMetrics({ layer, cid, size }) {
  const feedback = {
    layer,
    cid,
    size,
    action: size > 5000 ? "increase_block_size" : "decrease_block_size",
    timestamp: Date.now(),
  };

  console.log(`🧠 Controller Feedback: ${feedback.action}`);

  // 🔹 Send feedback event to dashboard
  broadcastMetrics("CONTROLLER_FEEDBACK", feedback);
  recordEvent("CONTROLLER_FEEDBACK", { action: feedback.action, new_size: feedback.new_size });

  return { message: "Controller metrics updated", feedback };
}

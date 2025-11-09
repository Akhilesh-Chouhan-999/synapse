import { useEffect, useState } from "react";

export default function SystemHealth({ events }) {
  const [tps, setTps] = useState(0);
  const [avgLatency, setAvgLatency] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;

    // ✅ Compute TPS based on BLOCK_ADDED timestamps
    const blockEvents = events
      .filter(e => e.type === "BLOCK_ADDED" && e.data?.timestamp)
      .map(e => e.data.timestamp);

    if (blockEvents.length > 1) {
      const newest = Math.max(...blockEvents);
      const oldest = Math.min(...blockEvents);
      const timeWindow = (newest - oldest) / 1000 || 1; // seconds
      const transactions = blockEvents.length;
      const tpsValue = (transactions / timeWindow).toFixed(2);
      setTps(tpsValue);
    }

    // ✅ Compute average latency from EDGE_VALIDATED events
    const latencies = events
      .filter(e => e.type === "EDGE_VALIDATED" && e.data?.latency)
      .map(e => e.data.latency);

    if (latencies.length) {
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      setAvgLatency(avg.toFixed(1));
    }
  }, [events]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-green-500 shadow-md text-green-300">
      <h2 className="text-xl mb-2">System Health Metrics</h2>
      <p>TPS (approx): <b>{tps}</b></p>
      <p>Average Latency (ms): <b>{avgLatency}</b></p>
    </div>
  );
}

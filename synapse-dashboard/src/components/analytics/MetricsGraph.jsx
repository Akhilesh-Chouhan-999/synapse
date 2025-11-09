import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MetricsGraph({ events }) {
  const [tpsData, setTpsData] = useState([]);

  useEffect(() => {
    if (!events.length) return;

    // 🔹 Filter both BLOCK_ADDED and PERFORMANCE_UPDATE (BLOCK_ADDED)
    const blocks = events.filter(
      e =>
        e.type === "BLOCK_ADDED" ||
        (e.type === "PERFORMANCE_UPDATE" && e.data?.eventType === "BLOCK_ADDED")
    );

    // 🔹 Group events per second
    const grouped = {};
    blocks.forEach((e) => {
      const ts =
        e.data?.timestamp || e.timestamp || Date.now();
      const timeKey = new Date(ts).toLocaleTimeString();
      grouped[timeKey] = (grouped[timeKey] || 0) + 1;
    });

    const formatted = Object.entries(grouped).map(([time, tps]) => ({
      time,
      tps,
    }));

    console.log("✅ TPS Chart Data →", formatted);
    setTpsData(formatted.slice(-15)); // show last 15 entries
  }, [events]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-blue-500 shadow-md">
      <h2 className="text-xl text-blue-400 mb-2">TPS (Transactions per Second)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={tpsData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="tps" stroke="#60a5fa" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

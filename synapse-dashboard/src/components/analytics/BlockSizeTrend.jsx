import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BlockSizeTrend({ events }) {
  const [blockSizeData, setBlockSizeData] = useState([]);

  useEffect(() => {
    if (!events.length) return;

    // take CONTROLLER_FEEDBACK events (AI adjustments)
    const feedbacks = events.filter(e => e.type === "CONTROLLER_FEEDBACK");

    const formatted = feedbacks.map((e) => ({
      time: new Date(e.data?.timestamp || e.timestamp || Date.now()).toLocaleTimeString(),
      size: e.data?.new_size || 10,
    }));

    setBlockSizeData(formatted.slice(-15));
  }, [events]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-violet-500 shadow-md">
      <h2 className="text-xl text-violet-400 mb-2">AI-Driven Block Size Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={blockSizeData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="size" stroke="#a78bfa" fill="#8b5cf6" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

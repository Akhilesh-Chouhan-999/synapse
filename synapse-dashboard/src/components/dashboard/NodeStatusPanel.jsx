import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

export default function NodeStatusPanel() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sample = Array.from({ length: 5 }).map((_, i) => ({
        id: `Node-${i + 1}`,
        status: ["active", "idle", "down"][Math.floor(Math.random() * 3)],
        latency: (Math.random() * 80).toFixed(1),
      }));
      setNodes(sample);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (s) =>
    s === "active" ? "text-green-400" : s === "idle" ? "text-yellow-400" : "text-red-400";

  return (
    <Card className="mt-10 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">Node Status Panel</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2">Node ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Latency (ms)</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => (
                <tr key={n.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                  <td className="py-2">{n.id}</td>
                  <td className={`py-2 font-semibold ${statusColor(n.status)}`}>
                    {n.status.toUpperCase()}
                  </td>
                  <td className="py-2">{n.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

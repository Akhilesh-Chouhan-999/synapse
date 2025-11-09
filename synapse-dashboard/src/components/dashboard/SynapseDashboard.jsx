import React, { useContext } from "react";
import { WebSocketContext } from "@/context/WebSocketContext";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NodeStatusPanel from "./NodeStatusPanel"; // ✅ Add this import

export default function SynapseDashboard() {
  const { tps, latency, cpu } = useContext(WebSocketContext);

  const data = [
    { name: "Now", tps },
    { name: "Next", tps: tps + 1 },
    { name: "Future", tps: tps - 1 },
  ];

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-gray-950 to-black text-white">
      <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
        Synapse Live Dashboard
      </h1>

      {/* Metric Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center">
            <h2 className="text-lg text-gray-400">TPS</h2>
            <p className="text-3xl font-bold text-blue-400">
              {tps.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <h2 className="text-lg text-gray-400">Latency (ms)</h2>
            <p className="text-3xl font-bold text-purple-400">
              {latency.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <h2 className="text-lg text-gray-400">CPU Usage (%)</h2>
            <p className="text-3xl font-bold text-pink-400">
              {cpu.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TPS Chart */}
      <div className="mt-10 bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl text-center mb-4 text-teal-400">
          TPS Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="tps"
              stroke="#38bdf8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 👇 Add the Node Status Table here */}
      <NodeStatusPanel />
    </div>
  );
}

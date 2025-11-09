import { Card, CardContent } from "./components/ui/card";
import { ArrowRight, Cpu, Network, HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SynapseArchitecture() {
  const [stats, setStats] = useState({
    height: 0,
    avgTps: 0,
    avgLatency: 0,
  });
  const [data, setData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9090");
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      const { type, data: payload } = JSON.parse(msg.data);
      if (type === "new_block") {
        setStats((prev) => ({ ...prev, height: payload.block.index }));
      }
      if (type === "ai_adjust") {
        const entry = {
          time: new Date().toLocaleTimeString(),
          tps: Number(payload.avgTps.toFixed(2)),
          latency: Number(payload.avgLatency.toFixed(2)),
        };
        setStats({
          height: payload.newStats.height,
          avgTps: entry.tps,
          avgLatency: entry.latency,
        });
        setData((prev) => [...prev.slice(-20), entry]); // keep last 20 points
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:9090/stats");
        const js = await res.json();
        setStats(js);
      } catch (_) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          SYNAPSE System Architecture
        </h1>
        <p className="text-gray-400">
          A Unified AI-Assisted Blockchain Framework for IoT Data Management
        </p>
        <div className="mt-4 text-sm text-gray-300">
          <p>📦 Blocks: {stats.height}</p>
          <p>⚙️ TPS: {stats.avgTps}</p>
          <p>⏱ Latency: {stats.avgLatency} ms</p>
        </div>
      </div>

      {/* Real-time Performance Chart */}
      <Card className="bg-gray-900 border border-violet-500 shadow-lg mb-10">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold text-violet-400 mb-2 text-center">
            Network Performance (TPS vs Latency)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis yAxisId="left" stroke="#60a5fa" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f87171"
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tps"
                stroke="#60a5fa"
                dot={false}
                name="TPS"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="latency"
                stroke="#f87171"
                dot={false}
                name="Latency (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Existing architecture diagram remains unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 mb-20">
        <Card className="bg-gray-800 border border-blue-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Cpu size={40} className="text-blue-400 mb-2" />
            <h2 className="text-lg font-semibold">IoT Device Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Sensors and smart devices generate raw data streams.
            </p>
          </CardContent>
        </Card>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight size={40} className="text-blue-400" />
        </motion.div>

        <Card className="bg-gray-800 border border-purple-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Network size={40} className="text-purple-400 mb-2" />
            <h2 className="text-lg font-semibold">Edge Gateway Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Performs data pre-validation, compression, and sends metrics to AI module.
            </p>
          </CardContent>
        </Card>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight size={40} className="text-blue-400" />
        </motion.div>

        <Card className="bg-gray-800 border border-pink-500 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Cpu size={40} className="text-pink-400 mb-2" />
            <h2 className="text-lg font-semibold">Blockchain Core Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Adaptive DPoS consensus adjusts dynamically based on AI metrics.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowRight size={40} className="text-blue-400 rotate-90 md:rotate-0" />
        </motion.div>

        <Card className="bg-gray-800 border border-teal-500 shadow-xl w-80">
          <CardContent className="flex flex-col items-center p-4">
            <HardDrive size={40} className="text-teal-400 mb-2" />
            <h2 className="text-lg font-semibold">IPFS Storage Layer</h2>
            <p className="text-sm text-gray-400 text-center">
              Stores encrypted IoT data off-chain; blockchain holds content hash (CID).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

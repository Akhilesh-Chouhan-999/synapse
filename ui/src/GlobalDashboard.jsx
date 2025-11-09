import { useEffect, useRef, useState } from "react";
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

export default function GlobalDashboard() {
  const wsRef = useRef(null);
  const [nodes, setNodes] = useState([]); // array of {id, height, avgTps, avgLatency...}
  const [history, setHistory] = useState([]); // time-series aggregated per node
  const [aggregates, setAggregates] = useState({ avgHeight: 0, avgTps: 0, avgLatency: 0 });

  useEffect(() => {
    const url = `ws://localhost:9000`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => console.log("🌐 GlobalDashboard connected to", url);
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "GLOBAL_STATS") {
        setNodes(msg.nodes);
        setAggregates(msg.aggregates);

        // push a history sample keyed by time; flatten nodes into fields
        const timeKey = new Date(msg.ts).toLocaleTimeString();
        const sample = { time: timeKey };
        msg.nodes.forEach((n) => {
          // safe keys: replace non-alphanum
          const keyTps = `${n.id}_tps`.replace(/[^a-zA-Z0-9_]/g, "");
          const keyLat = `${n.id}_lat`.replace(/[^a-zA-Z0-9_]/g, "");
          sample[keyTps] = Number(n.avgTps);
          sample[keyLat] = Number(n.avgLatency);
        });
        setHistory((h) => [...h.slice(-30), sample]); // keep last 30 points
      }
    };
    ws.onclose = () => console.log("🌐 GlobalDashboard WS closed");
    return () => ws.close();
  }, []);

  // Build list of dynamic lines to render: TPS lines for each node and Latency on another chart
  const nodeIds = nodes.map((n) => n.id);
  const colors = ["#60a5fa", "#34d399", "#f87171", "#fbbf24", "#a78bfa", "#06b6d4"];
  return (
    <div style={{ padding: 20, background: "#060611", color: "#e6eef6", minHeight: "100vh" }}>
      <h1 style={{ color: "#7dd3fc" }}>SYNAPSE — Global Analytics Dashboard</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        <div style={{ flex: 1, padding: 12, background: "#0b1221", borderRadius: 8 }}>
          <h3>Network Aggregates</h3>
          <p>Block Height ≈ <b>{aggregates.avgHeight.toFixed(1)}</b></p>
          <p>TPS ≈ <b>{aggregates.avgTps.toFixed(2)}</b></p>
          <p>Latency ≈ <b>{aggregates.avgLatency.toFixed(2)} ms</b></p>
        </div>

        <div style={{ width: 420, padding: 12, background: "#0b1221", borderRadius: 8 }}>
          <h4>Nodes</h4>
          <table style={{ width: "100%", color: "#fff" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#9ca3af" }}>
                <th>Node</th><th>Height</th><th>TPS</th><th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.height}</td>
                  <td>{n.avgTps}</td>
                  <td>{n.avgLatency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {/* TPS Chart */}
        <div style={{ flex: 1, height: 300, background: "#071028", borderRadius: 8, padding: 8 }}>
          <h4 style={{ color: "#93c5fd" }}>TPS — per node (last samples)</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={history}>
              <CartesianGrid stroke="#203040" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              {nodeIds.map((id, idx) => {
                const key = `${id}_tps`.replace(/[^a-zA-Z0-9_]/g, "");
                return <Line key={key} type="monotone" dataKey={key} name={`${id} TPS`} stroke={colors[idx % colors.length]} dot={false} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Chart */}
        <div style={{ flex: 1, height: 300, background: "#071028", borderRadius: 8, padding: 8 }}>
          <h4 style={{ color: "#fb7185" }}>Latency (ms) — per node</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={history}>
              <CartesianGrid stroke="#203040" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              {nodeIds.map((id, idx) => {
                const key = `${id}_lat`.replace(/[^a-zA-Z0-9_]/g, "");
                return <Line key={key} type="monotone" dataKey={key} name={`${id} Lat`} stroke={colors[idx % colors.length]} dot={false} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    console.log("Connecting to ws://localhost:4001 ...");
    const socket = new WebSocket("ws://localhost:4001");

    socket.onopen = () => {
      console.log("📡 Connected to metrics stream");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received metric:", data);
        setMetrics(prev => [data, ...prev].slice(0, 20));
      } catch (e) {
        console.error("Bad WS message:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-4">🔹 Synapse Live Metrics Dashboard</h1>
      {metrics.length === 0 ? (
        <p className="text-gray-400">Waiting for data from controller...</p>
      ) : (
        metrics.map((m, i) => (
          <div key={i} className="border p-3 my-2 rounded bg-gray-800">
            <p><b>Layer:</b> {m.layer}</p>
            <p><b>CID:</b> {m.cid}</p>
            <p><b>Size:</b> {m.size} bytes</p>
            <p><b>Time:</b> {new Date(m.timestamp).toLocaleTimeString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import MetricsGraph from "./analytics/MetricsGraph";
import BlockSizeTrend from "./analytics/BlockSizeTrend";
import SystemHealth from "./analytics/SystemHealth";


export default function LiveDashboard() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4001");

    socket.onopen = () => setStatus("Connected");
    socket.onmessage = (event) => {
      console.log("🔹 Received:", JSON.parse(event.data));

      const msg = JSON.parse(event.data);
      setEvents(prev => [msg, ...prev.slice(0, 50)]); // store recent 50 events
    };
    socket.onerror = () => setStatus("Error");
    socket.onclose = () => setStatus("Disconnected");

    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">🔹 Synapse Live Analytics</h1>
      <p className={`mb-4 ${status === "Connected" ? "text-green-400" : "text-red-400"}`}>
        ● WebSocket Status: {status}
      </p>

<button
  onClick={() => window.open("http://localhost:4000/metrics/download")}
  className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white shadow-md"
>
  ⬇️ Download Metrics (CSV)
</button>


      <div className="grid md:grid-cols-3 gap-6">
  <MetricsGraph events={events} />
  <BlockSizeTrend events={events} />
  <SystemHealth events={events} />
</div>

      <div className="mt-6">
        <h2 className="text-xl text-gray-300 mb-2">Recent Events</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((e, i) => (
            <div key={i} className="border border-gray-700 p-3 rounded-lg bg-gray-800">
              <p className="text-blue-300 font-semibold">{e.type}</p>
              <pre className="text-gray-300 text-sm bg-gray-950 rounded-lg p-2 mt-1 overflow-x-auto">
                {JSON.stringify(e.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

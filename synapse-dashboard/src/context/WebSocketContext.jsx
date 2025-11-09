import React, { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    tps: 0,
    latency: 0,
    cpu: 0,
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // connect later to backend
    ws.onmessage = (event) => setMetrics(JSON.parse(event.data));
    ws.onerror = (err) => console.error("WebSocket error:", err);
    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider value={metrics}>
      {children}
    </WebSocketContext.Provider>
  );
};

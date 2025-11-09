// phase3_blockchain_core/monitor_server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

function createMonitorServer(blockchain, controller, port = 9090) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Serve simple REST endpoint
  app.get('/stats', (req, res) => {
    const stats = blockchain.getStats();
    const { avgTps, avgLatency } = controller.getAverages();
    res.json({ ...stats, avgTps, avgLatency, time: Date.now() });
  });

  // Broadcast helper
  function broadcast(type, data) {
    const msg = JSON.stringify({ type, data });
    wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) c.send(msg);
    });
  }

  // Hook into controller + blockchain events
  controller.onAdjust((payload) => broadcast('ai_adjust', payload));

  // Provide method for validators to notify new blocks
  const notifier = {
    newBlock: (info) => broadcast('new_block', info),
  };

  server.listen(port, () => {
    console.log(`🛰  SYNAPSE Monitor Server running on http://localhost:${port}`);
  });

  return notifier;
}

module.exports = createMonitorServer;

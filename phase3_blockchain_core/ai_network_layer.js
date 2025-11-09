// phase3_blockchain_core/ai_network_layer.js
const WebSocket = require("ws");

/**
 * Simple distributed AI collaboration module.
 * Each node shares its metrics every few seconds and receives peers' metrics.
 * All values are aggregated to adjust local AI parameters.
 */
class AINetworkLayer {
  constructor({ controller, blockchain, networkManager, nodeId }) {
    this.controller = controller;
    this.blockchain = blockchain;
    this.network = networkManager;
    this.nodeId = nodeId;
    this.peerMetrics = new Map(); // peerId -> { avgTps, avgLatency, ts }
    this.start();
  }

  start() {
    // Send our metrics to peers every 6 s
    setInterval(() => this.broadcastMetrics(), 6000);

    // Hook network messages
    this.network.sockets.forEach((sock) => this.attachListener(sock));
    this.network.broadcast = this.network.broadcast.bind(this.network);
    this.network.onNewConnection = (sock) => this.attachListener(sock);
  }

  attachListener(socket) {
    socket.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === "AI_METRICS" && data.nodeId !== this.nodeId) {
          this.peerMetrics.set(data.nodeId, data.metrics);
          this.recalculateGlobalState();
        }
      } catch (_) {}
    });
  }

  broadcastMetrics() {
    const { avgTps, avgLatency } = this.controller.getAverages();
    const payload = {
      type: "AI_METRICS",
      nodeId: this.nodeId,
      metrics: {
        avgTps,
        avgLatency,
        delegates: this.blockchain.delegates.length,
        blockSize: this.blockchain.blockSize,
        ts: Date.now(),
      },
    };
    this.network.broadcast(payload);
  }

  recalculateGlobalState() {
    // Combine local + peer metrics
    const all = Array.from(this.peerMetrics.values());
    if (all.length === 0) return;

    const avgTps =
      (this.controller.getAverages().avgTps +
        all.reduce((s, m) => s + (m.avgTps || 0), 0)) /
      (all.length + 1);
    const avgLatency =
      (this.controller.getAverages().avgLatency +
        all.reduce((s, m) => s + (m.avgLatency || 0), 0)) /
      (all.length + 1);

    // Simple cooperative adjustment logic
    if (avgLatency > 250 && this.blockchain.delegates.length < 8) {
      this.blockchain.changeDelegateCount(this.blockchain.delegates.length + 1);
      console.log(
        `🤝 ${this.nodeId} [COLLAB] Increased delegates → ${this.blockchain.delegates.length}`
      );
    } else if (avgLatency < 150 && avgTps < 8 && this.blockchain.delegates.length > 3) {
      this.blockchain.changeDelegateCount(this.blockchain.delegates.length - 1);
      console.log(
        `🤝 ${this.nodeId} [COLLAB] Decreased delegates → ${this.blockchain.delegates.length}`
      );
    }

    // Adjust block size globally
    if (avgTps < 5 && this.blockchain.blockSize < 10) {
      this.blockchain.changeBlockSize(this.blockchain.blockSize + 1);
      console.log(`🤝 ${this.nodeId} [COLLAB] Increased blockSize → ${this.blockchain.blockSize}`);
    } else if (avgTps > 15 && this.blockchain.blockSize > 2) {
      this.blockchain.changeBlockSize(this.blockchain.blockSize - 1);
      console.log(`🤝 ${this.nodeId} [COLLAB] Decreased blockSize → ${this.blockchain.blockSize}`);
    }
  }
}

module.exports = AINetworkLayer;

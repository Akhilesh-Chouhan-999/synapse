// phase3_blockchain_core/ai_controller.js
// For Phase-3: rule-based adaptive controller with simple heuristics.
// Exposes observe() (called by validators) and a periodic adjust().

class AIController {
  constructor({ blockchain, intervalMs = 5000 } = {}) {
    this.blockchain = blockchain;
    this.intervalMs = intervalMs;
    this.metricsWindow = []; // recent observations
    this.maxWindow = 20;
    this.lastAdjust = Date.now();
    this.adjustListeners = [];
    this._startPeriodicAdjust();
  }

  observe(metrics) {
    // metrics: { tps, latency, delegateId, blockHeight }
    this.metricsWindow.push({ ...metrics, ts: Date.now() });
    if (this.metricsWindow.length > this.maxWindow) this.metricsWindow.shift();
  }

  getAverages() {
    if (this.metricsWindow.length === 0) return { avgTps: 0, avgLatency: 0 };
    const avgTps = this.metricsWindow.reduce((s, m) => s + (m.tps || 0), 0) / this.metricsWindow.length;
    const avgLatency = this.metricsWindow.reduce((s, m) => s + (m.latency || 0), 0) / this.metricsWindow.length;
    return { avgTps, avgLatency };
  }

  onAdjust(fn) {
    this.adjustListeners.push(fn);
  }

  _announceAdjust(payload) {
    for (const fn of this.adjustListeners) {
      try { fn(payload); } catch (e) { /* ignore listener errors */ }
    }
  }

  _startPeriodicAdjust() {
    this._interval = setInterval(() => this.adjust(), this.intervalMs);
  }

  adjust() {
    const { avgTps, avgLatency } = this.getAverages();
    const stats = this.blockchain.getStats();
    let changed = false;
    const actions = [];

    // Simple heuristics:
    // If TPS low and latency high -> increase blockSize (batch more txs)
    if (avgTps < 5 && avgLatency > 200) {
      const newSize = Math.min(stats.blockSize + 2, 50);
      if (newSize !== stats.blockSize) {
        this.blockchain.changeBlockSize(newSize);
        changed = true;
        actions.push({ change: 'blockSize', from: stats.blockSize, to: newSize });
      }
    }

    // If TPS high and latency low -> reduce blockSize for faster propagation
    if (avgTps > 20 && avgLatency < 150) {
      const newSize = Math.max(1, stats.blockSize - 1);
      if (newSize !== stats.blockSize) {
        this.blockchain.changeBlockSize(newSize);
        changed = true;
        actions.push({ change: 'blockSize', from: stats.blockSize, to: newSize });
      }
    }

    // Delegate count tuning: if latency high, increase delegates to parallelize validation (up to 10)
    if (avgLatency > 400 && stats.delegates.length < 10) {
      const from = stats.delegates.length;
      const to = Math.min(10, from + 1);
      this.blockchain.changeDelegateCount(to);
      changed = true;
      actions.push({ change: 'delegateCount', from, to });
    }

    // If system is light, reduce delegates to save resources
    if (avgLatency < 100 && stats.delegates.length > 3 && avgTps < 5) {
      const from = stats.delegates.length;
      const to = Math.max(3, from - 1);
      this.blockchain.changeDelegateCount(to);
      changed = true;
      actions.push({ change: 'delegateCount', from, to });
    }

    this.lastAdjust = Date.now();
    if (changed) {
      const payload = {
        ts: Date.now(),
        avgTps,
        avgLatency,
        actions,
        newStats: this.blockchain.getStats(),
      };
      this._announceAdjust(payload);
      return payload;
    }
    return null;
  }

  stop() {
    clearInterval(this._interval);
  }
}

module.exports = AIController;

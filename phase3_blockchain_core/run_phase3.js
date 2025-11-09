// phase3_blockchain_core/run_phase3.js

const path = require('path');
const EventEmitter = require('events');
const TransactionPool = require('./transaction_pool');
const { Blockchain } = require('./blockchain_core');
const ValidatorNode = require('./validator_node');
const AIController = require('./ai_controller');
const ipfs = require('./ipfs_sim');
const createMonitorServer = require('./monitor_server');
const { saveChain, loadChain, saveAI, loadAI } = require('./state_manager');
const NetworkManager = require('./network_manager');
const AINetworkLayer = require("./ai_network_layer");



async function tryRequireIoTGenerator() {
  try {
    const modPath = path.join(__dirname, '..', 'phase1_iot_simulation', 'iot_data_generator.js');
    const m = require(modPath);
    if (m && m.emitter) return m.emitter;
    if (m instanceof EventEmitter) return m;
    if (typeof m.createEmitter === 'function') return m.createEmitter();
    return null;
  } catch (e) {
    return null;
  }
}

function createSimulatedIoT(ratePerSec = 5) {
  const emitter = new EventEmitter();
  setInterval(() => {
    const tx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sensor: `sensor-${Math.ceil(Math.random() * 10)}`,
      value: (Math.random() * 100).toFixed(2),
      ts: Date.now(),
    };
    emitter.emit('data', tx);
  }, Math.max(100, Math.floor(1000 / ratePerSec)));
  return emitter;
}

(async function main() {
  // === Node Identification ===
  const nodePort = process.env.NODE_PORT || 6001;
  const peerList = process.env.PEERS ? process.env.PEERS.split(',') : [];
  const monitorPort = process.env.MONITOR_PORT || 9090;
  const nodeId = `Node[${nodePort}]`;

  console.log(`🚀 ${nodeId} Starting Phase-3.4: SYNAPSE Network Node...`);

  // --- IoT Simulation / Edge Integration ---
  const iotEmitter = (await tryRequireIoTGenerator()) || createSimulatedIoT(10);
  console.log(`✅ ${nodeId} Connected to IoT emitter (phase1) or simulated source.`);

  // --- Transaction Pool ---
  const txPool = new TransactionPool();

  // --- Load or Initialize Blockchain ---
  let blockchain = loadChain(Blockchain);
  if (!blockchain) {
    console.log(`${nodeId} No existing chain found. Creating new blockchain...`);
    blockchain = new Blockchain({ delegateCount: 3, blockSize: 5 });
  } else {
    console.log(`✅ ${nodeId} Loaded blockchain with ${blockchain.chain.length - 1} blocks`);
  }

  // --- AI Controller ---
  const controller = new AIController({ blockchain, intervalMs: 5000 });
  const prevAI = loadAI();
  controller.metricsWindow.push({ tps: prevAI.avgTps, latency: prevAI.avgLatency });

  // --- Monitoring Server ---
  const monitor = createMonitorServer(blockchain, controller, monitorPort);
  console.log(`🛰️  ${nodeId} Monitor server initialized on port ${monitorPort}`);

  // --- Periodic AI Broadcast for Visualization ---
  setInterval(() => {
    const { avgTps, avgLatency } = controller.getAverages();
    const stats = blockchain.getStats();
    const payload = {
      avgTps,
      avgLatency,
      newStats: stats,
      ts: Date.now(),
    };
    monitor.newBlock({ block: { index: stats.height }, delegateId: 'monitor' });
    controller._announceAdjust(payload);
  }, 5000);

  // --- Initialize P2P Network ---
  const network = new NetworkManager(blockchain, nodePort, peerList);
  network.start();

  // --- Validator Nodes ---
  const validators = blockchain.delegates.map(
    (id) => new ValidatorNode({ id, blockchain, transactionPool: txPool, controller })
  );

  validators.forEach((v) => {
    v.on('blockProposed', (info) => {
      console.log(`${nodeId} [BLOCK] #${info.block.index} by ${info.delegateId}`);
      monitor.newBlock(info);
      saveChain(blockchain);
      network.broadcastNewBlock(info.block);
    });
  });

  // --- Periodic Persistence ---
  setInterval(() => {
    saveAI(controller);
    saveChain(blockchain);
    console.log(`${nodeId} 💾 State checkpoint saved.`);
  }, 30000);

  // --- IoT Data Stream Handler ---
  iotEmitter.on('data', async (tx) => {
    try {
      const { cid } = await ipfs.store(tx);
      const txObj = { id: tx.id, cid, meta: { sensor: tx.sensor, ts: tx.ts } };
      txPool.addTransaction(txObj);
      if (txPool.size() % 10 === 0) {
        console.log(`${nodeId} 📡 Transaction pool size: ${txPool.size()}`);
      }
    } catch (e) {
      console.error(`${nodeId} ❌ Error storing to ipfs_sim`, e);
    }
  });

  
// --- Initialize Distributed AI Collaboration Layer ---
const aiCollab = new AINetworkLayer({
  controller,
  blockchain,
  networkManager: network,
  nodeId: nodePort,
});


  // --- Slower Round-Robin Block Proposal (from 1500ms → 3000ms) ---
  let rrIndex = 0;
  setInterval(async () => {
    const v = validators[rrIndex % validators.length];
    rrIndex++;
    await v.tryProposeBlock();
  }, 3000);
})();

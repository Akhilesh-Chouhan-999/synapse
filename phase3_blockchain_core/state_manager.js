// phase3_blockchain_core/state_manager.js
const fs = require("fs");
const path = require("path");

const stateDir = path.join(__dirname, "state");
const chainFile = path.join(stateDir, "chain_state.json");
const aiFile = path.join(stateDir, "ai_state.json");

function ensureDir() {
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
}

function saveChain(blockchain) {
  ensureDir();
  const data = {
    chain: blockchain.chain,
    delegateCount: blockchain.delegateCount,
    blockSize: blockchain.blockSize,
  };
  fs.writeFileSync(chainFile, JSON.stringify(data, null, 2));
}

function loadChain(BlockchainClass) {
  ensureDir();
  if (!fs.existsSync(chainFile)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(chainFile, "utf8"));
    const bc = new BlockchainClass({
      delegateCount: raw.delegateCount,
      blockSize: raw.blockSize,
    });
    bc.chain = raw.chain;
    return bc;
  } catch (e) {
    console.error("Error loading chain state:", e);
    return null;
  }
}

function saveAI(controller) {
  ensureDir();
  const averages = controller.getAverages();
  fs.writeFileSync(aiFile, JSON.stringify(averages, null, 2));
}

function loadAI() {
  ensureDir();
  if (!fs.existsSync(aiFile)) return { avgTps: 0, avgLatency: 0 };
  try {
    return JSON.parse(fs.readFileSync(aiFile, "utf8"));
  } catch {
    return { avgTps: 0, avgLatency: 0 };
  }
}

module.exports = { saveChain, loadChain, saveAI, loadAI };

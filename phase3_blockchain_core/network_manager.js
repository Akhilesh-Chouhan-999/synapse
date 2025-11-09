// phase3_blockchain_core/network_manager.js
const WebSocket = require("ws");

class NetworkManager {
  constructor(blockchain, port, peers = []) {
    this.blockchain = blockchain;
    this.port = port;
    this.peers = peers;
    this.sockets = [];
  }

  start() {
    const server = new WebSocket.Server({ port: this.port });
    console.log(`🌐 Node listening on ws://localhost:${this.port}`);
    server.on("connection", (socket) => this.initConnection(socket));
    this.connectToPeers();
  }

  connectToPeers() {
    this.peers.forEach((address) => {
      const socket = new WebSocket(address);
      socket.on("open", () => this.initConnection(socket));
      socket.on("error", () => console.log(`❌ Failed to connect to ${address}`));
    });
  }

  initConnection(socket) {
    this.sockets.push(socket);
    console.log("✅ Connected to peer");
    this.initMessageHandler(socket);
    this.sendChain(socket);
  }

  initMessageHandler(socket) {
    socket.on("message", (msg) => {
      const data = JSON.parse(msg);
      switch (data.type) {
        case "BLOCKCHAIN":
          this.handleBlockchain(data.chain);
          break;
        case "NEW_BLOCK":
          this.handleNewBlock(data.block);
          break;
      }
    });
  }

  broadcast(message) {
    this.sockets.forEach((s) => {
      if (s.readyState === WebSocket.OPEN) {
        s.send(JSON.stringify(message));
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({ type: "BLOCKCHAIN", chain: this.blockchain.chain }));
  }

  handleBlockchain(chain) {
    if (chain.length > this.blockchain.chain.length) {
      console.log("🔄 Syncing longer chain from peer...");
      this.blockchain.chain = chain;
    }
  }

  handleNewBlock(block) {
    const lastBlock = this.blockchain.getLatestBlock();
    if (block.previousHash === lastBlock.hash) {
      console.log(`📦 Received new block #${block.index} from peer`);
      this.blockchain.chain.push(block);
    } else {
      console.log("⚠️ Chain mismatch — requesting full sync...");
      this.broadcast({ type: "BLOCKCHAIN", chain: this.blockchain.chain });
    }
  }

  broadcastNewBlock(block) {
    this.broadcast({ type: "NEW_BLOCK", block });
  }
}

module.exports = NetworkManager;

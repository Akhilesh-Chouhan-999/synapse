// phase3_blockchain_core/blockchain_core.js
const crypto = require('crypto');

class Block {
  constructor({ index, timestamp, transactions, previousHash, delegateId, nonce = 0 }) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.delegateId = delegateId;
    this.nonce = nonce;
    this.hash = this.computeHash();
  }

  computeHash() {
    const payload = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      delegateId: this.delegateId,
      nonce: this.nonce,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

class Blockchain {
  constructor({ delegateCount = 3, blockSize = 10 } = {}) {
    this.chain = [];
    this.pendingTransactions = [];
    this.delegateCount = delegateCount;
    this.blockSize = blockSize;
    this.delegates = Array.from({ length: delegateCount }, (_, i) => `delegate-${i + 1}`);
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesis = new Block({
      index: 0,
      timestamp: Date.now(),
      transactions: [{ info: 'genesis' }],
      previousHash: '0',
      delegateId: 'genesis',
      nonce: 0,
    });
    this.chain.push(genesis);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  changeDelegateCount(n) {
    this.delegateCount = n;
    this.delegates = Array.from({ length: n }, (_, i) => `delegate-${i + 1}`);
  }

  changeBlockSize(n) {
    this.blockSize = n;
  }

  addBlock(transactions, delegateId) {
    const prev = this.getLatestBlock();
    const block = new Block({
      index: prev.index + 1,
      timestamp: Date.now(),
      transactions,
      previousHash: prev.hash,
      delegateId,
    });
    // Simple validation: proof-of-work-lite (nonce until hash starts with '00')
    while (!block.hash.startsWith('00')) {
      block.nonce += 1;
      block.hash = block.computeHash();
    }
    this.chain.push(block);
    return block;
  }

  validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const cur = this.chain[i];
      const prev = this.chain[i - 1];
      if (cur.previousHash !== prev.hash) return false;
      if (cur.computeHash() !== cur.hash) return false;
    }
    return true;
  }

  getStats() {
    return {
      height: this.chain.length - 1,
      delegates: this.delegates.slice(),
      blockSize: this.blockSize,
    };
  }
}

module.exports = { Blockchain, Block };

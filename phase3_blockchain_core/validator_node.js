// phase3_blockchain_core/validator_node.js
const { EventEmitter } = require('events');

class ValidatorNode extends EventEmitter {
  constructor({ id, blockchain, transactionPool, controller }) {
    super();
    this.id = id;
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.controller = controller;
    this.active = true;
  }

  async tryProposeBlock() {
    if (!this.active) return null;
    // get blockSize from blockchain
    const size = this.blockchain.blockSize;
    const txs = this.transactionPool.getPending(size);
    if (txs.length === 0) return null;

    // simulate validation latency
    const start = Date.now();
    // propose block
    const block = this.blockchain.addBlock(txs, this.id);
    const latency = Date.now() - start;

    // emit event for monitoring
    this.emit('blockProposed', {
      delegateId: this.id,
      block,
      txCount: txs.length,
      latency,
      timestamp: Date.now(),
    });

    // let AI controller observe
    if (this.controller && typeof this.controller.observe === 'function') {
      this.controller.observe({
        tps: txs.length,
        latency,
        delegateId: this.id,
        blockHeight: this.blockchain.chain.length - 1,
      });
    }
    return block;
  }
}

module.exports = ValidatorNode;

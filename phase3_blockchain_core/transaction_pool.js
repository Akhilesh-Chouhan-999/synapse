// phase3_blockchain_core/transaction_pool.js
class TransactionPool {
  constructor() {
    this.pool = [];
  }

  addTransaction(tx) {
    if (!tx || !tx.id) throw new Error('Transaction must have id');
    this.pool.push({ ...tx, receivedAt: Date.now() });
  }

  getPending(max = 10) {
    const slice = this.pool.splice(0, max);
    return slice;
  }

  size() {
    return this.pool.length;
  }
}

module.exports = TransactionPool;

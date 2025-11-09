// phase3_blockchain_core/ipfs_sim.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const storageDir = path.join(__dirname, 'ipfs_sim_data');

async function ensureDir() {
  try {
    await fs.mkdir(storageDir, { recursive: true });
  } catch (e) {}
}

// Store the data chunk and return a mock CID (sha256)
async function store(data) {
  await ensureDir();
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  const cid = crypto.createHash('sha256').update(payload).digest('hex');
  const filename = path.join(storageDir, `${cid}.json`);
  await fs.writeFile(filename, payload, 'utf8');
  return { cid, path: filename };
}

async function fetch(cid) {
  const filename = path.join(storageDir, `${cid}.json`);
  const content = await fs.readFile(filename, 'utf8');
  return content;
}

module.exports = { store, fetch, storageDir };

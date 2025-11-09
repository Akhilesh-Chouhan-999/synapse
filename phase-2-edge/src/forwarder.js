const axios = require('axios');
const { AI_CONTROLLER_URL } = require('./config');

// send to AI controller (could be Python microservice)
async function forwardToController(payload) {
  // non-blocking fire-and-forget optionally, but here we await to know result
  try {
    const resp = await axios.post(AI_CONTROLLER_URL, payload, { timeout: 5000 });
    // resp might contain enrichments/decisions
    // forward to blockchain or IPFS here using their APIs
    console.log('controller responded', resp.data);
    return resp.data;
  } catch (err) {
    console.error('forward fail', err.message);
    // fallback: queue locally, retry later
    throw err;
  }
}

module.exports = { forwardToController };

// phase3_blockchain_core/api_server.js
const express = require("express");
const bodyParser = require("body-parser");
const { Blockchain } = require("./blockchain_core");

const app = express();
app.use(bodyParser.json());

// Single blockchain instance in memory
const chain = new Blockchain({ delegateCount: 3, blockSize: 10 });

// Health check
app.get("/health", (req, res) =>
  res.json({ ok: true, height: chain.getStats().height })
);

// Endpoint Phase-6 will call
app.post("/blockchain/addBlock", (req, res) => {
  try {
    const { sensorId, data } = req.body;
    if (!sensorId || !data) {
      return res.status(400).json({ error: "Missing sensorId or data" });
    }

    app.post("/blockchain/updateConfig", (req, res) => {
  try {
    const { action, new_size } = req.body;
    if (action === "increase_block_size" || action === "decrease_block_size") {
      chain.changeBlockSize(new_size);
      console.log(`⚙️ Block size updated → ${new_size}`);
      return res.json({ status: "updated", new_size });
    }
    return res.json({ status: "no_change" });
  } catch (err) {
    console.error("❌ Config update error:", err);
    res.status(500).json({ error: "update failed" });
  }
});


    // Add a transaction and forge a block
    const tx = { sensorId, payload: data };
    const delegateId =
      chain.delegates[Math.floor(Math.random() * chain.delegates.length)];
    const block = chain.addBlock([tx], delegateId);

    console.log(`🧱 Block added by ${delegateId}: ${block.hash}`);

    res.json({
      status: "added",
      hash: block.hash,
      height: chain.chain.length - 1,
      delegateId,
      timestamp: block.timestamp,
    });
  } catch (err) {
    console.error("❌ Blockchain addBlock error:", err);
    res.status(500).json({ error: "blockchain internal error" });
  }
});

// Optional stats endpoint for your dashboard
app.get("/blockchain/stats", (req, res) => res.json(chain.getStats()));

const PORT = 5003;
app.listen(PORT, () =>
  console.log(`🔗 Blockchain Core API running on port ${PORT}`)
);

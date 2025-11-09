const express = require('express');
const bodyParser = require('body-parser');
const { verifyHMAC, validateSchema } = require('./validator');
const { forwardToController } = require('./forwarder');
const { startMqtt } = require('./mqttClient');
const { PORT } = require('./config');

const app = express();
app.use(bodyParser.json());

// Health
app.get('/health', (req,res)=> res.json({ ok: true, ts: Date.now() }));

// HTTP ingestion endpoint (devices can POST)

app.post("/ingest", async (req, res) => {
  try {
    console.log("📩 Edge received:", req.body);
    // bypass schema + controller for now
    return res.json({ status: "ok", validated: req.body });
  } catch (err) {
    console.error("❌ Edge internal error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// startup
app.listen(PORT, () => {
  console.log(`Edge validator listening on ${PORT}`);
  // start MQTT after express starts
  startMqtt(process.env.MQTT_URL || 'mqtt://mosquitto:1883');
});

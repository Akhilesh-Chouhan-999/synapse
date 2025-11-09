const mqtt = require('mqtt');
const { verifyHMAC, validateSchema } = require('./validator');
const { forwardToController } = require('./forwarder');

function startMqtt(brokerUrl='mqtt://localhost:1883') {
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log('MQTT connected');
    client.subscribe('devices/+/telemetry');
  });

  client.on('message', async (topic, messageBuf) => {
    try {
      const str = messageBuf.toString();
      const obj = JSON.parse(str);
      // assume header mac in obj._mac or topic metadata
      const mac = obj._mac;
      delete obj._mac;

      if (!verifyHMAC(JSON.stringify(obj), mac, process.env.SHARED_SECRET)) {
        console.warn('MQTT: invalid mac, dropping');
        return;
      }

      const vs = validateSchema(obj);
      if (!vs.ok) {
        console.warn('validation failed', vs.errors);
        return;
      }

      // forward
      await forwardToController(obj);
    } catch (err) {
      console.error('mqtt message error', err);
    }
  });
}

module.exports = { startMqtt };

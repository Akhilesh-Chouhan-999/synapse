const crypto = require('crypto');
const Ajv = require('ajv');
const ajv = new Ajv();

// Example schema for a sensor payload
const sensorSchema = {
  type: 'object',
  properties: {
    deviceId: { type: 'string' },
    ts: { type: 'number' },
    temp: { type: 'number' },
    humidity: { type: 'number' }
  },
  required: ['deviceId','ts','temp'],
  additionalProperties: false
};

function verifyHMAC(payloadString, receivedMac, secret) {
  const h = crypto.createHmac('sha256', secret);
  h.update(payloadString);
  const calc = h.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(receivedMac));
}

// Example: ECDSA/RSA verification (if devices sign using private key)
// function verifySignature(payloadString, receivedSig, publicKey, algorithm='sha256') {
//   const verify = crypto.createVerify(algorithm);
//   verify.update(payloadString);
//   verify.end();
//   return verify.verify(publicKey, Buffer.from(receivedSig, 'base64'));
// }

function validateSchema(obj) {
  const validate = ajv.compile(sensorSchema);
  return validate(obj) ? { ok: true } : { ok: false, errors: validate.errors };
}

module.exports = { verifyHMAC, validateSchema };

module.exports = {
  PORT: process.env.PORT || 5002 ,
  SHARED_SECRET: process.env.SHARED_SECRET || 'supersecret', // for HMAC
  AI_CONTROLLER_URL: process.env.AI_CONTROLLER_URL || 'http://ai:5000/analyze'
}

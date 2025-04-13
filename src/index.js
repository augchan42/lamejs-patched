// Re-export everything from Lame.js
var Lame = require('./Lame.js');

// Export the main Lame class
module.exports = Lame;

// Export Mp3Encoder for convenience
module.exports.Mp3Encoder = Lame.Mp3Encoder; 
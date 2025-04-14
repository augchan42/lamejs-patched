// Re-export everything from Lame.js
var Lame = require('./Lame.js');

// Define MPEGMode enum
const MPEGMode = {
    STEREO: 0,
    JOINT_STEREO: 1,
    DUAL_CHANNEL: 2,
    MONO: 3,
    NOT_SET: 4
};

// Mp3Encoder class that matches the expected interface
class Mp3Encoder {
    constructor(configOrChannels, sampleRate, kbps) {
        if (typeof configOrChannels === 'object') {
            // Handle config object constructor
            const config = configOrChannels;
            this.channels = config.channels;
            this.sampleRate = config.sampleRate;
            this.bitRate = config.bitRate;
            this.mode = config.mode || MPEGMode.STEREO;
            this.quality = config.quality || 3;
            this.maxBuffer = config.maxBuffer;
            
            // Create internal encoder
            this.encoder = new Lame.Mp3Encoder(
                this.channels,
                this.sampleRate,
                this.bitRate
            );
        } else {
            // Handle traditional constructor
            this.channels = configOrChannels;
            this.sampleRate = sampleRate;
            this.bitRate = kbps;
            
            // Create internal encoder
            this.encoder = new Lame.Mp3Encoder(
                this.channels,
                this.sampleRate,
                this.bitRate
            );
        }
    }

    encodeBuffer(left, right) {
        return this.encoder.encodeBuffer(left, right);
    }

    flush() {
        return this.encoder.flush();
    }

    close() {
        // No-op as the original doesn't have this
    }
}

// Export everything
module.exports = {
    ...Lame,  // Export all original lamejs exports
    Mp3Encoder: Mp3Encoder,  // Export our wrapped Mp3Encoder
    MPEGMode: MPEGMode  // Export the MPEGMode enum
}; 
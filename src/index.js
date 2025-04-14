var Lame = require('./Lame.js');
var Presets = require('./Presets.js');
var GainAnalysis = require('./GainAnalysis.js');
var QuantizePVT = require('./QuantizePVT.js');
var Quantize = require('./Quantize.js');
var Takehiro = require('./Takehiro.js');
var Reservoir = require('./Reservoir.js');
var MPEGMode = require('./MPEGMode.js');
var BitStream = require('./BitStream.js');
var Encoder = require('./Encoder.js');
var Version = require('./Version.js');
var VBRTag = require('./VBRTag.js');
var common = require('./common.js');
var new_byte = common.new_byte;
var assert = common.assert;

function GetAudio() {
    var parse;
    var mpg;

    this.setModules = function (parse2, mpg2) {
        parse = parse2;
        mpg = mpg2;
    }
}

function Parse() {
    var ver;
    var id3;
    var pre;

    this.setModules = function (ver2, id32, pre2) {
        ver = ver2;
        id3 = id32;
        pre = pre2;
    }
}

function MPGLib() {
}

function ID3Tag() {
    var bits;
    var ver;

    this.setModules = function (_bits, _ver) {
        bits = _bits;
        ver = _ver;
    }
}

function Mp3Encoder(configOrChannels, sampleRate, kbps) {
    // Handle both constructor styles
    let channels, samplerate, bitrate;
    
    if (typeof configOrChannels === 'object') {
        channels = configOrChannels.channels;
        samplerate = configOrChannels.sampleRate;
        bitrate = configOrChannels.bitRate;
    } else {
        channels = configOrChannels;
        samplerate = sampleRate;
        bitrate = kbps;
    }

    // Set defaults if not specified
    if (arguments.length === 0) {
        console.error('WARN: Mp3Encoder(channels, samplerate, kbps) not specified');
        channels = 1;
        samplerate = 44100;
        bitrate = 128;
    }

    var lame = new Lame();
    var gaud = new GetAudio();
    var ga = new GainAnalysis();
    var bs = new BitStream();
    var p = new Presets();
    var qupvt = new QuantizePVT();
    var qu = new Quantize();
    var vbr = new VBRTag();
    var ver = new Version();
    var id3 = new ID3Tag();
    var rv = new Reservoir();
    var tak = new Takehiro();
    var parse = new Parse();
    var mpg = new MPGLib();

    lame.setModules(ga, bs, p, qupvt, qu, vbr, ver, id3, mpg);
    bs.setModules(ga, mpg, ver, vbr);
    id3.setModules(bs, ver);
    p.setModules(lame);
    qu.setModules(bs, rv, qupvt, tak);
    qupvt.setModules(tak, rv, lame.enc.psy);
    rv.setModules(bs);
    tak.setModules(qupvt);
    vbr.setModules(lame, bs, ver);
    gaud.setModules(parse, mpg);
    parse.setModules(ver, id3, p);

    var gfp = lame.lame_init();

    gfp.num_channels = channels;
    gfp.in_samplerate = samplerate;
    gfp.brate = bitrate;
    gfp.mode = MPEGMode.STEREO;
    gfp.quality = 3;
    gfp.bWriteVbrTag = false;
    gfp.disable_reservoir = true;
    gfp.write_id3tag_automatic = false;

    var retcode = lame.lame_init_params(gfp);
    assert(0 == retcode);
    var maxSamples = 1152;
    var mp3buf_size = 0 | (1.25 * maxSamples + 7200);
    var mp3buf = new_byte(mp3buf_size);

    this.encodeBuffer = function (left, right) {
        if (channels == 1) {
            right = left;
        }
        assert(left.length == right.length);
        if (left.length > maxSamples) {
            maxSamples = left.length;
            mp3buf_size = 0 | (1.25 * maxSamples + 7200);
            mp3buf = new_byte(mp3buf_size);
        }

        var _sz = lame.lame_encode_buffer(gfp, left, right, left.length, mp3buf, 0, mp3buf_size);
        return new Int8Array(mp3buf.subarray(0, _sz));
    };

    this.flush = function () {
        var _sz = lame.lame_encode_flush(gfp, mp3buf, 0, mp3buf_size);
        return new Int8Array(mp3buf.subarray(0, _sz));
    };

    this.close = function() {
        // No-op as the original doesn't have this
    };
}

// Export everything
module.exports = {
    Mp3Encoder: Mp3Encoder,
    MPEGMode: MPEGMode
}; 
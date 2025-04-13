# lamejs-patched

A patched version of [lamejs](https://github.com/zhuker/lamejs) that fixes circular dependencies issues. This package is a drop-in replacement for the original lamejs package.

## Why this fork?

The original lamejs package has some circular dependency issues that can cause problems in certain build environments. This patched version fixes those issues by properly importing missing dependencies in several key files:

- Added `Lame` import to BitStream.js
- Added `MPEGMode` import to Encoder.js, Lame.js, and PsyModel.js
- Added `BitStream` import to QuantizePVT.js

## Installation

```bash
npm install lamejs-patched
```

## Usage

Use it exactly the same way as you would use the original lamejs package:

```javascript
const lamejs = require('lamejs-patched');

// Use it just like the original lamejs
const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
```

## Changes from Original

This package uses patch-package to apply the necessary fixes. You can find the exact changes in the `patches/lamejs+1.2.1.patch` file.

## License

This project is licensed under the LGPL-3.0 License - see the original lamejs project for more details.

## Credits

- Original package: [lamejs](https://github.com/zhuker/lamejs)
- Patch contributors: [Your name/username here] 
declare module 'lamejs-patched' {
    export class BitStream {
        static EQ(a: number, b: number): boolean;
        static NEQ(a: number, b: number): boolean;
        EQ(a: number, b: number): boolean;
        NEQ(a: number, b: number): boolean;
    }

    export class Mp3Encoder {
        constructor(channels: number, sampleRate: number, kbps: number);
        encodeBuffer(buffer: Int16Array): Int8Array;
        flush(): Int8Array;
    }

    export enum MPEGMode {
        STEREO = 0,
        JOINT_STEREO = 1,
        DUAL_CHANNEL = 2,
        MONO = 3,
        NOT_SET = 4
    }

    export const Lame: any;
    export const WavHeader: any;
} 
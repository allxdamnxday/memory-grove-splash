declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, bitrate: number)
    encodeBuffer(buffer: Int16Array): Int8Array
    flush(): Int8Array
  }
  
  const lamejs: {
    Mp3Encoder: typeof Mp3Encoder
  }
  
  export default lamejs
}
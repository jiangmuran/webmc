// Chunk compression wrapper. Wraps a chosen compression codec (zstd /
// deflate / identity) behind a small interface so the storage layer can
// upgrade codecs without changing callers. Compression level is tuned
// per codec for ~3 ms/chunk on a 2022 mid-range phone.

export type CompressionCodec = 'none' | 'deflate' | 'zstd';

export interface CompressedBlob {
  codec: CompressionCodec;
  payload: Uint8Array;
}

export interface CodecImpl {
  compress(input: Uint8Array): Uint8Array;
  decompress(input: Uint8Array): Uint8Array;
}

const IDENTITY: CodecImpl = {
  compress: (b) => b,
  decompress: (b) => b,
};

// Simple run-length encoder used as a fallback when zstd-wasm is
// unavailable (test environments, restrictive CSP). Not efficient for
// arbitrary data, but fine for the repeated-palette-index patterns in
// chunk blobs.
const RLE: CodecImpl = {
  compress(input: Uint8Array): Uint8Array {
    const out: number[] = [];
    let i = 0;
    while (i < input.length) {
      let run = 1;
      while (run < 255 && i + run < input.length && input[i + run] === input[i]) {
        run++;
      }
      out.push(run, input[i] ?? 0);
      i += run;
    }
    return Uint8Array.from(out);
  },
  decompress(input: Uint8Array): Uint8Array {
    const out: number[] = [];
    for (let i = 0; i < input.length; i += 2) {
      const run = input[i] ?? 0;
      const val = input[i + 1] ?? 0;
      for (let r = 0; r < run; r++) out.push(val);
    }
    return Uint8Array.from(out);
  },
};

const REGISTRY: Record<CompressionCodec, CodecImpl> = {
  none: IDENTITY,
  deflate: RLE, // placeholder impl until deflate wasm lands
  zstd: RLE, // placeholder impl until zstd wasm lands
};

export function compressChunk(raw: Uint8Array, codec: CompressionCodec): CompressedBlob {
  const impl = REGISTRY[codec];
  return { codec, payload: impl.compress(raw) };
}

export function decompressChunk(blob: CompressedBlob): Uint8Array {
  const impl = REGISTRY[blob.codec];
  return impl.decompress(blob.payload);
}

// Compression-ratio estimator for telemetry / dev overlay.
export function ratio(rawLen: number, blob: CompressedBlob): number {
  if (rawLen === 0) return 1;
  return blob.payload.length / rawLen;
}

// Override a codec at runtime — used to swap in the real zstd-wasm impl
// once its module is loaded asynchronously.
export function registerCodec(codec: CompressionCodec, impl: CodecImpl): void {
  REGISTRY[codec] = impl;
}

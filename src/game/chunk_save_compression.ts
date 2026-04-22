// Chunk save compression. zstd-via-wasm preferred; DEFLATE fallback.
// Simple façade that delegates to real codec at runtime.

export type Codec = 'zstd' | 'deflate' | 'raw';

export interface Header {
  codec: Codec;
  byteLength: number;
}

export function encodeChunk(bytes: Uint8Array, codec: Codec): { header: Header; body: Uint8Array } {
  // The actual compression is out of scope here; we return the raw
  // bytes with a header tag for tests and planning.
  return { header: { codec, byteLength: bytes.length }, body: bytes };
}

export function chooseCodec(wasmZstdAvailable: boolean): Codec {
  if (wasmZstdAvailable) return 'zstd';
  return 'deflate';
}

export function estimateSavings(codec: Codec, byteLength: number): number {
  if (codec === 'raw') return 0;
  if (codec === 'deflate') return Math.floor(byteLength * 0.35);
  return Math.floor(byteLength * 0.55);
}

// Budget planner: given N dirty chunks each averaging X bytes, how much
// write-throughput do we need at target interval?
export function writeBudgetBytesPerSecond(
  dirtyChunks: number,
  bytesPerChunk: number,
  intervalSec: number,
): number {
  return Math.ceil((dirtyChunks * bytesPerChunk) / Math.max(0.001, intervalSec));
}

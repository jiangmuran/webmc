import { decodeNbt, type NbtRoot } from './nbt_decode';

// Decompress a gzipped byte stream using the browser's DecompressionStream.
// Used for vanilla level.dat (always gzipped) and Anvil chunk payloads with
// compression type 1 (gzip).
export async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('gzip');
  const w = ds.writable.getWriter();
  // Copy to a fresh ArrayBuffer to avoid SharedArrayBuffer/ArrayBufferView
  // typing surprises across runtimes.
  const buf = new Uint8Array(bytes.byteLength);
  buf.set(bytes);
  await w.write(buf);
  await w.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}

// Same for raw zlib (used by Anvil chunk payloads with compression type 2).
export async function inflateZlib(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate');
  const w = ds.writable.getWriter();
  const buf = new Uint8Array(bytes.byteLength);
  buf.set(bytes);
  await w.write(buf);
  await w.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}

// Convenience: gunzip + decodeNbt.
export async function decodeGzippedNbt(bytes: Uint8Array): Promise<NbtRoot> {
  const raw = await gunzip(bytes);
  return decodeNbt(raw);
}

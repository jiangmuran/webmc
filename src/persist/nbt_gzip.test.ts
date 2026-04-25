import { describe, it, expect } from 'vitest';
import { gunzip, inflateZlib, decodeGzippedNbt } from './nbt_gzip';

async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('gzip');
  const w = cs.writable.getWriter();
  const buf = new Uint8Array(bytes.byteLength);
  buf.set(bytes);
  await w.write(buf);
  await w.close();
  const reader = cs.readable.getReader();
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

async function deflate(bytes: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('deflate');
  const w = cs.writable.getWriter();
  const buf = new Uint8Array(bytes.byteLength);
  buf.set(bytes);
  await w.write(buf);
  await w.close();
  const reader = cs.readable.getReader();
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

describe('NBT gzip decoder helpers', () => {
  it('round-trips arbitrary bytes through gzip', async () => {
    const original = new TextEncoder().encode('hello world '.repeat(50));
    const gz = await gzip(original);
    const back = await gunzip(gz);
    expect(Array.from(back)).toEqual(Array.from(original));
  });

  it('round-trips through deflate (zlib)', async () => {
    const original = new TextEncoder().encode('the quick brown fox '.repeat(20));
    const z = await deflate(original);
    const back = await inflateZlib(z);
    expect(Array.from(back)).toEqual(Array.from(original));
  });

  it('decodeGzippedNbt parses gzipped NBT', async () => {
    // Tiny NBT: COMPOUND "" { "x": INT 7 } END
    const nbt = new Uint8Array([10, 0, 0, 3, 0, 1, 120, 0, 0, 0, 7, 0]);
    const gz = await gzip(nbt);
    const root = await decodeGzippedNbt(gz);
    expect(root.value.type).toBe('compound');
    if (root.value.type !== 'compound') return;
    expect(root.value.value['x']).toEqual({ type: 'int', value: 7 });
  });
});

import { describe, it, expect } from 'vitest';
import { writeRegion } from './anvil_region_write';
import { extractChunkFromRegion } from './anvil_chunk_extract';
import { encodeNbt } from './nbt_encode';
import type { NbtRoot } from './nbt_decode';

async function gzipBytes(bytes: Uint8Array): Promise<Uint8Array> {
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

const root: NbtRoot = {
  name: '',
  value: {
    type: 'compound',
    value: { x: { type: 'int', value: 7 } },
  },
};

describe('Anvil region writer', () => {
  it('round-trips a single gzipped chunk through writeRegion + extractChunkFromRegion', async () => {
    const nbt = encodeNbt(root);
    const gz = await gzipBytes(nbt);
    const bytes = writeRegion([{ localX: 3, localZ: 7, body: gz, compression: 1 }]);
    const decoded = await extractChunkFromRegion(bytes, 3, 7);
    expect(decoded).not.toBeNull();
    if (!decoded) return;
    if (decoded.value.type !== 'compound') throw new Error('not compound');
    expect(decoded.value.value['x']).toEqual({ type: 'int', value: 7 });
  });

  it('returns null for unset slots in the same region', async () => {
    const nbt = encodeNbt(root);
    const gz = await gzipBytes(nbt);
    const bytes = writeRegion([{ localX: 0, localZ: 0, body: gz, compression: 1 }]);
    const decoded = await extractChunkFromRegion(bytes, 5, 5);
    expect(decoded).toBeNull();
  });

  it('writes multiple chunks with correct offsets', async () => {
    const nbtA = encodeNbt({
      name: '',
      value: { type: 'compound', value: { tag: { type: 'string', value: 'A' } } },
    });
    const nbtB = encodeNbt({
      name: '',
      value: { type: 'compound', value: { tag: { type: 'string', value: 'B' } } },
    });
    const [gzA, gzB] = await Promise.all([gzipBytes(nbtA), gzipBytes(nbtB)]);
    const bytes = writeRegion([
      { localX: 0, localZ: 0, body: gzA, compression: 1 },
      { localX: 1, localZ: 0, body: gzB, compression: 1 },
    ]);
    const a = await extractChunkFromRegion(bytes, 0, 0);
    const b = await extractChunkFromRegion(bytes, 1, 0);
    if (!a || !b) throw new Error('missing chunk');
    if (a.value.type !== 'compound' || b.value.type !== 'compound') throw new Error('not compound');
    expect(a.value.value['tag']).toEqual({ type: 'string', value: 'A' });
    expect(b.value.value['tag']).toEqual({ type: 'string', value: 'B' });
  });

  it('rejects out-of-range local coordinates', () => {
    expect(() =>
      writeRegion([{ localX: 32, localZ: 0, body: new Uint8Array(1), compression: 1 }]),
    ).toThrow();
    expect(() =>
      writeRegion([{ localX: 0, localZ: -1, body: new Uint8Array(1), compression: 1 }]),
    ).toThrow();
  });
});

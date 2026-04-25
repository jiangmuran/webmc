import { describe, it, expect } from 'vitest';
import { readChunkPayload, decodeChunkNbt, extractChunkFromRegion } from './anvil_chunk_extract';
import { parseHeader, SECTOR_SIZE } from './anvil_import_stub';

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

// Build a minimal region file with one chunk at (0,0) holding a tiny gzipped NBT.
async function buildOneChunkRegion(): Promise<Uint8Array> {
  // Tiny NBT: COMPOUND "" { "x": INT 7 } END
  const nbt = new Uint8Array([10, 0, 0, 3, 0, 1, 120, 0, 0, 0, 7, 0]);
  const gz = await gzipBytes(nbt);
  const sectorCount = Math.ceil((gz.length + 5) / SECTOR_SIZE);
  const fileSize = (2 + sectorCount) * SECTOR_SIZE;
  const out = new Uint8Array(fileSize);
  // Header: chunk (0,0) at sector 2, sectorCount sectors.
  // Offsets table: idx 0 → (offset << 8) | count
  const dv = new DataView(out.buffer);
  dv.setUint32(0, (2 << 8) | sectorCount, false);
  // Timestamp at offset SECTOR_SIZE+0 — leave 0.
  // Payload at sector 2.
  const payloadOff = 2 * SECTOR_SIZE;
  dv.setUint32(payloadOff, gz.length + 1, false); // total length: body + 1 (compression byte)
  out[payloadOff + 4] = 1; // compression = gzip
  out.set(gz, payloadOff + 5);
  return out;
}

describe('Anvil chunk extract', () => {
  it('reads a gzipped chunk payload from a synthetic region', async () => {
    const region = await buildOneChunkRegion();
    const header = parseHeader(region);
    const payload = readChunkPayload(region, header, 0, 0);
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.compression).toBe(1);
    const root = await decodeChunkNbt(payload);
    expect(root.value.type).toBe('compound');
    if (root.value.type !== 'compound') return;
    expect(root.value.value['x']).toEqual({ type: 'int', value: 7 });
  });

  it('extractChunkFromRegion does the full pipeline', async () => {
    const region = await buildOneChunkRegion();
    const root = await extractChunkFromRegion(region, 0, 0);
    expect(root).not.toBeNull();
    if (!root) return;
    expect(root.value.type).toBe('compound');
  });

  it('returns null for an unset chunk slot', async () => {
    const region = await buildOneChunkRegion();
    const root = await extractChunkFromRegion(region, 5, 5);
    expect(root).toBeNull();
  });
});

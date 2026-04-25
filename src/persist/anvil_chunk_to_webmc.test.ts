import { describe, it, expect } from 'vitest';
import { importVanillaChunk } from './anvil_chunk_to_webmc';
import { SECTOR_SIZE } from './anvil_import_stub';
import { createDefaultRegistry } from '../blocks/registry';

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

function strBytes(s: string): number[] {
  const enc = new TextEncoder().encode(s);
  return [0, enc.length, ...enc];
}

// Build a synthetic chunk NBT with a single section at Y=0, palette=[stone].
// List items are tag-less; the list header specifies the item tag.
function buildSingleStoneChunk(): Uint8Array {
  // One palette entry: COMPOUND-without-name { Name: "minecraft:stone" } END
  const palEntry = [8, ...strBytes('Name'), ...strBytes('minecraft:stone'), 0];
  // Inner block_states compound (with name "block_states", added by caller).
  const blockStatesBody = [9, ...strBytes('palette'), 10, 0, 0, 0, 1, ...palEntry, 0];
  // One list-item section (tag-less, no name) with fields Y + block_states.
  const oneSection = [
    3,
    ...strBytes('Y'),
    0,
    0,
    0,
    0, // INT Y = 0
    10,
    ...strBytes('block_states'),
    ...blockStatesBody,
    0, // end of section compound
  ];
  return new Uint8Array([
    10,
    ...strBytes(''),
    9,
    ...strBytes('sections'),
    10,
    0,
    0,
    0,
    1, // LIST<COMPOUND>, length 1
    ...oneSection,
    0, // end of root
  ]);
}

async function buildOneChunkRegion(nbt: Uint8Array): Promise<Uint8Array> {
  const gz = await gzipBytes(nbt);
  const sectorCount = Math.ceil((gz.length + 5) / SECTOR_SIZE);
  const fileSize = (2 + sectorCount) * SECTOR_SIZE;
  const out = new Uint8Array(fileSize);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, (2 << 8) | sectorCount, false);
  const off = 2 * SECTOR_SIZE;
  dv.setUint32(off, gz.length + 1, false);
  out[off + 4] = 1;
  out.set(gz, off + 5);
  return out;
}

describe('importVanillaChunk end-to-end', () => {
  it('produces a webmc id array of all-stone for a single-stone chunk', async () => {
    const r = createDefaultRegistry();
    const airId = r.byName('webmc:air');
    const stoneId = r.byName('webmc:stone');
    expect(airId).toBeDefined();
    expect(stoneId).toBeDefined();
    if (airId === undefined || stoneId === undefined) return;

    const chunkNbt = buildSingleStoneChunk();
    const region = await buildOneChunkRegion(chunkNbt);
    const out = await importVanillaChunk(region, 0, 0, {
      byName: (n) => r.byName(n),
      airId,
      fallbackId: stoneId,
    });
    expect(out).not.toBeNull();
    if (!out) return;
    expect(out.paletteSize).toBe(1);
    // Single section → ids.length = 4096; all entries should be stone.
    expect(out.ids.length).toBe(16 * 16 * 16);
    for (let i = 0; i < out.ids.length; i++) expect(out.ids[i]).toBe(stoneId);
  });

  it('returns null when chunk is missing', async () => {
    const r = createDefaultRegistry();
    const airId = r.byName('webmc:air')!;
    const stoneId = r.byName('webmc:stone')!;
    const region = await buildOneChunkRegion(buildSingleStoneChunk());
    const out = await importVanillaChunk(region, 5, 5, {
      byName: (n) => r.byName(n),
      airId,
      fallbackId: stoneId,
    });
    expect(out).toBeNull();
  });
});

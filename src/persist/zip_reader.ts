// Minimal ZIP central-directory reader for browser (stored + deflate).
// Not a general-purpose lib; intended for resource-pack loading.

export interface ZipEntry {
  name: string;
  uncompressedSize: number;
  data: () => Promise<Uint8Array>;
}

const EOCD_SIGNATURE = 0x06054b50;
const CEN_SIGNATURE = 0x02014b50;
const LFH_SIGNATURE = 0x04034b50;

// Shared decoder for ZIP entry names — was a fresh TextDecoder per
// entry. A typical resource-pack ZIP has 100s of entries; reusing one
// decoder cuts allocs without changing semantics (TextDecoder has no
// per-call state when no streams are active).
const SHARED_NAME_DECODER = new TextDecoder();

function findEOCD(bytes: Uint8Array): number {
  for (let i = bytes.length - 22; i >= 0; i--) {
    const sig = bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24);
    if (sig === EOCD_SIGNATURE) return i;
  }
  throw new Error('zip: EOCD not found');
}

function u16(b: Uint8Array, off: number): number {
  return b[off]! | (b[off + 1]! << 8);
}
function u32(b: Uint8Array, off: number): number {
  return (b[off]! | (b[off + 1]! << 8) | (b[off + 2]! << 16) | (b[off + 3]! << 24)) >>> 0;
}

async function inflate(raw: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate-raw');
  const ab = raw.slice().buffer;
  const blob = new Blob([ab]).stream().pipeThrough(ds);
  const buf = await new Response(blob).arrayBuffer();
  return new Uint8Array(buf);
}

export async function readZip(bytes: Uint8Array): Promise<readonly ZipEntry[]> {
  const eocd = findEOCD(bytes);
  const totalEntries = u16(bytes, eocd + 10);
  const cdSize = u32(bytes, eocd + 12);
  const cdOff = u32(bytes, eocd + 16);
  const entries: ZipEntry[] = [];
  let p = cdOff;
  for (let i = 0; i < totalEntries; i++) {
    if (u32(bytes, p) !== CEN_SIGNATURE) throw new Error('zip: bad CEN at ' + String(p));
    const method = u16(bytes, p + 10);
    const compressedSize = u32(bytes, p + 20);
    const uncompressedSize = u32(bytes, p + 24);
    const nameLen = u16(bytes, p + 28);
    const extraLen = u16(bytes, p + 30);
    const commentLen = u16(bytes, p + 32);
    const localHeaderOff = u32(bytes, p + 42);
    const nameBytes = bytes.subarray(p + 46, p + 46 + nameLen);
    const name = SHARED_NAME_DECODER.decode(nameBytes);
    p += 46 + nameLen + extraLen + commentLen;

    const lh = localHeaderOff;
    if (u32(bytes, lh) !== LFH_SIGNATURE) throw new Error('zip: bad LFH at ' + String(lh));
    const lhNameLen = u16(bytes, lh + 26);
    const lhExtraLen = u16(bytes, lh + 28);
    const dataStart = lh + 30 + lhNameLen + lhExtraLen;
    const dataEnd = dataStart + compressedSize;
    const chunk = bytes.subarray(dataStart, dataEnd);

    entries.push({
      name,
      uncompressedSize,
      data: async () => {
        if (method === 0) return chunk.slice();
        if (method === 8) return inflate(chunk);
        throw new Error(`zip: unsupported compression method ${String(method)}`);
      },
    });
  }
  cdSize satisfies number;
  return entries;
}

export function pngEntriesUnder(entries: readonly ZipEntry[], prefix: string): readonly ZipEntry[] {
  return entries.filter((e) => e.name.startsWith(prefix) && e.name.toLowerCase().endsWith('.png'));
}

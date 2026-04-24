export interface ChunkHeader {
  magic: number;
  version: number;
  checksum: number;
}

export const CHUNK_MAGIC = 0x7c6d6300;

export function validateHeader(
  h: ChunkHeader,
  expectedVersion: number,
): 'ok' | 'bad_magic' | 'wrong_version' | 'checksum_missing' {
  if (h.magic !== CHUNK_MAGIC) return 'bad_magic';
  if (h.version !== expectedVersion) return 'wrong_version';
  if (h.checksum === 0) return 'checksum_missing';
  return 'ok';
}

export function computeSimpleChecksum(bytes: Uint8Array): number {
  let hash = 5381;
  for (const b of bytes) {
    hash = ((hash << 5) + hash + b) | 0;
  }
  return hash >>> 0;
}

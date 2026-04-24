import { describe, it, expect } from 'vitest';
import { validateHeader, computeSimpleChecksum, CHUNK_MAGIC } from './chunk_save_corruption_check';

describe('chunk save corruption check', () => {
  it('valid header passes', () => {
    expect(validateHeader({ magic: CHUNK_MAGIC, version: 1, checksum: 123 }, 1)).toBe('ok');
  });

  it('bad magic rejected', () => {
    expect(validateHeader({ magic: 0xdeadbeef, version: 1, checksum: 1 }, 1)).toBe('bad_magic');
  });

  it('wrong version rejected', () => {
    expect(validateHeader({ magic: CHUNK_MAGIC, version: 2, checksum: 1 }, 1)).toBe(
      'wrong_version',
    );
  });

  it('missing checksum rejected', () => {
    expect(validateHeader({ magic: CHUNK_MAGIC, version: 1, checksum: 0 }, 1)).toBe(
      'checksum_missing',
    );
  });

  it('checksum deterministic', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    expect(computeSimpleChecksum(bytes)).toBe(computeSimpleChecksum(bytes));
  });

  it('different bytes different checksums', () => {
    const a = computeSimpleChecksum(new Uint8Array([1, 2, 3]));
    const b = computeSimpleChecksum(new Uint8Array([1, 2, 4]));
    expect(a).not.toBe(b);
  });
});

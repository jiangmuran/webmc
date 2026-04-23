import { describe, it, expect } from 'vitest';
import { validate } from './resource_pack_zip';

describe('resource pack zip', () => {
  it('valid pack', () => {
    const r = validate([
      { path: 'pack.mcmeta', sizeBytes: 100 },
      { path: 'assets/minecraft/textures/block/stone.png', sizeBytes: 1024 },
      { path: 'assets/minecraft/models/block/stone.json', sizeBytes: 256 },
    ]);
    expect(r.valid).toBe(true);
    expect(r.texturesFound).toBe(1);
    expect(r.modelsFound).toBe(1);
  });

  it('missing mcmeta fails', () => {
    const r = validate([{ path: 'assets/foo.png', sizeBytes: 100 }]);
    expect(r.valid).toBe(false);
  });

  it('path traversal rejected', () => {
    const r = validate([
      { path: 'pack.mcmeta', sizeBytes: 1 },
      { path: '../etc/passwd', sizeBytes: 100 },
    ]);
    expect(r.valid).toBe(false);
  });

  it('size cap enforced', () => {
    const r = validate([
      { path: 'pack.mcmeta', sizeBytes: 1 },
      { path: 'big.png', sizeBytes: 600 * 1024 * 1024 },
    ]);
    expect(r.valid).toBe(false);
  });
});

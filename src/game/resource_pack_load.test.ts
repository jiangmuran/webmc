import { describe, it, expect } from 'vitest';
import { ResourcePackStack, isSupported } from './resource_pack_load';

describe('resource pack', () => {
  it('format support', () => {
    expect(isSupported(15)).toBe(true);
    expect(isSupported(3)).toBe(false);
  });

  it('rejects unsupported pack', () => {
    const s = new ResourcePackStack();
    const ok = s.add({
      manifest: { format: 3, description: '', name: 'old' },
      files: new Map(),
      priority: 0,
    });
    expect(ok).toBe(false);
    expect(s.size).toBe(0);
  });

  it('resolves highest priority', () => {
    const s = new ResourcePackStack();
    s.add({
      manifest: { format: 15, description: '', name: 'base' },
      files: new Map([['assets/x.png', new Uint8Array([1])]]),
      priority: 0,
    });
    s.add({
      manifest: { format: 15, description: '', name: 'over' },
      files: new Map([['assets/x.png', new Uint8Array([2])]]),
      priority: 10,
    });
    expect(s.resolve('assets/x.png')?.[0]).toBe(2);
  });

  it('fallback to lower when higher lacks file', () => {
    const s = new ResourcePackStack();
    s.add({
      manifest: { format: 15, description: '', name: 'base' },
      files: new Map([['a.png', new Uint8Array([9])]]),
      priority: 0,
    });
    s.add({
      manifest: { format: 15, description: '', name: 'over' },
      files: new Map(),
      priority: 5,
    });
    expect(s.resolve('a.png')?.[0]).toBe(9);
  });

  it('missing = null', () => {
    const s = new ResourcePackStack();
    expect(s.resolve('missing')).toBeNull();
  });
});

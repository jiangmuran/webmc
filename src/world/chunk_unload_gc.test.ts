import { describe, it, expect } from 'vitest';
import { gcChunks } from './chunk_unload_gc';

describe('chunk gc', () => {
  it('unloads out-of-view chunks', () => {
    const r = gcChunks({
      chunks: [{ cx: 100, cz: 100, lastAccessMs: 0, dirty: false, refCount: 0 }],
      players: [{ cx: 0, cz: 0, viewRadius: 12 }],
      nowMs: 10_000,
      graceMs: 5_000,
    });
    expect(r.toUnload.length).toBe(1);
    expect(r.toSave.length).toBe(0);
  });

  it('keeps in-view chunks', () => {
    const r = gcChunks({
      chunks: [{ cx: 5, cz: 5, lastAccessMs: 0, dirty: false, refCount: 0 }],
      players: [{ cx: 0, cz: 0, viewRadius: 12 }],
      nowMs: 10_000,
      graceMs: 0,
    });
    expect(r.toUnload.length).toBe(0);
  });

  it('saves dirty before unload', () => {
    const r = gcChunks({
      chunks: [{ cx: 100, cz: 100, lastAccessMs: 0, dirty: true, refCount: 0 }],
      players: [{ cx: 0, cz: 0, viewRadius: 12 }],
      nowMs: 10_000,
      graceMs: 0,
    });
    expect(r.toSave.length).toBe(1);
    expect(r.toUnload.length).toBe(1);
  });

  it('refCount > 0 stays', () => {
    const r = gcChunks({
      chunks: [{ cx: 100, cz: 100, lastAccessMs: 0, dirty: false, refCount: 1 }],
      players: [],
      nowMs: 10_000,
      graceMs: 0,
    });
    expect(r.toUnload.length).toBe(0);
  });

  it('respects grace period', () => {
    const r = gcChunks({
      chunks: [{ cx: 100, cz: 100, lastAccessMs: 9_000, dirty: false, refCount: 0 }],
      players: [],
      nowMs: 10_000,
      graceMs: 5_000,
    });
    expect(r.toUnload.length).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { MeshRequestBatcher } from './chunk_mesh_worker_batch';

describe('mesh batcher', () => {
  it('collates duplicate requests', () => {
    const b = new MeshRequestBatcher();
    b.submit({ cx: 0, cz: 0, paletteId: 1, priority: 1 });
    b.submit({ cx: 0, cz: 0, paletteId: 1, priority: 5 });
    expect(b.size).toBe(1);
  });

  it('drain respects batch size', () => {
    const b = new MeshRequestBatcher(2);
    for (let i = 0; i < 5; i++) b.submit({ cx: i, cz: 0, paletteId: 1, priority: i });
    expect(b.drain().length).toBe(2);
    expect(b.size).toBe(3);
  });

  it('drain priority order', () => {
    const b = new MeshRequestBatcher();
    b.submit({ cx: 0, cz: 0, paletteId: 1, priority: 1 });
    b.submit({ cx: 1, cz: 0, paletteId: 1, priority: 10 });
    const d = b.drain();
    expect(d[0]?.cx).toBe(1);
  });

  it('cancel removes', () => {
    const b = new MeshRequestBatcher();
    b.submit({ cx: 1, cz: 2, paletteId: 1, priority: 1 });
    expect(b.cancel(1, 2)).toBe(true);
    expect(b.size).toBe(0);
  });
});

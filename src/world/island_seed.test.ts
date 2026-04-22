import { describe, it, expect } from 'vitest';
import { anchorsAt, makeSubRng, subSeed } from './island_seed';

describe('sub seed', () => {
  it('deterministic for same input', () => {
    const a = subSeed({ worldSeed: 42n, kind: 'village', cx: 10, cz: 20 });
    const b = subSeed({ worldSeed: 42n, kind: 'village', cx: 10, cz: 20 });
    expect(a).toBe(b);
  });

  it('different kinds = different seeds', () => {
    const a = subSeed({ worldSeed: 42n, kind: 'village', cx: 0, cz: 0 });
    const b = subSeed({ worldSeed: 42n, kind: 'temple', cx: 0, cz: 0 });
    expect(a).not.toBe(b);
  });

  it('different chunks = different seeds', () => {
    const a = subSeed({ worldSeed: 42n, kind: 'village', cx: 0, cz: 0 });
    const b = subSeed({ worldSeed: 42n, kind: 'village', cx: 1, cz: 0 });
    expect(a).not.toBe(b);
  });

  it('rng deterministic per seed', () => {
    const a = makeSubRng(42n);
    const b = makeSubRng(42n);
    expect(a()).toBe(b());
  });

  it('anchorsAt deterministic', () => {
    const q = { worldSeed: 42n, kind: 'village', cx: 0, cz: 0, probability: 0.5 };
    const a = anchorsAt(q);
    const b = anchorsAt(q);
    expect(a).toBe(b);
  });

  it('p=0 never anchors; p=1 always', () => {
    expect(anchorsAt({ worldSeed: 42n, kind: 'x', cx: 0, cz: 0, probability: 0 })).toBe(false);
    expect(anchorsAt({ worldSeed: 42n, kind: 'x', cx: 0, cz: 0, probability: 1 })).toBe(true);
  });
});

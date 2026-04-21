import { describe, it, expect } from 'vitest';
import { AIR_ID } from './state';
import { BlockRegistry, createDefaultRegistry } from './registry';

describe('BlockRegistry', () => {
  it('air is pre-registered at id 0', () => {
    const r = new BlockRegistry();
    expect(r.size).toBe(1);
    expect(r.byName('webmc:air')).toBe(AIR_ID);
    expect(r.get(AIR_ID).name).toBe('webmc:air');
  });

  it('assigns sequential ids on register', () => {
    const r = new BlockRegistry();
    const a = r.register({
      name: 'test:a',
      solid: true,
      opaque: true,
      lightEmission: 0,
      color: [1, 2, 3],
      hardness: 1,
    });
    const b = r.register({
      name: 'test:b',
      solid: true,
      opaque: true,
      lightEmission: 0,
      color: [4, 5, 6],
      hardness: 1,
    });
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(r.size).toBe(3);
  });

  it('rejects duplicate names', () => {
    const r = new BlockRegistry();
    r.register({
      name: 'test:dup',
      solid: true,
      opaque: true,
      lightEmission: 0,
      color: [0, 0, 0],
      hardness: 1,
    });
    expect(() =>
      r.register({
        name: 'test:dup',
        solid: true,
        opaque: true,
        lightEmission: 0,
        color: [0, 0, 0],
        hardness: 1,
      }),
    ).toThrow(/duplicate/);
  });

  it('throws on unknown id', () => {
    const r = new BlockRegistry();
    expect(() => r.get(999)).toThrow(/no block/);
  });

  it('byName returns undefined for unknown name', () => {
    const r = new BlockRegistry();
    expect(r.byName('nope:nope')).toBeUndefined();
  });

  it('default registry has the M1 block set', () => {
    const r = createDefaultRegistry();
    expect(r.byName('webmc:stone')).toBeDefined();
    expect(r.byName('webmc:dirt')).toBeDefined();
    expect(r.byName('webmc:grass_block')).toBeDefined();
    expect(r.byName('webmc:cobblestone')).toBeDefined();
    expect(r.byName('webmc:oak_log')).toBeDefined();
    expect(r.byName('webmc:glowstone')).toBeDefined();
    expect(r.size).toBeGreaterThanOrEqual(7);
    const glowId = r.byName('webmc:glowstone');
    if (glowId === undefined) throw new Error('missing glowstone');
    expect(r.get(glowId).lightEmission).toBe(15);
  });
});

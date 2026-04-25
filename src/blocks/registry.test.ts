import { describe, it, expect } from 'vitest';
import { AIR_ID } from './state';
import { type BlockDef, BlockRegistry, type RGB, createDefaultRegistry } from './registry';

function def(name: string, color: RGB = [100, 100, 100]): BlockDef {
  return {
    name,
    solid: true,
    opaque: true,
    lightEmission: 0,
    color,
    faceColors: { top: color, bottom: color, side: color },
    hardness: 1,
  };
}

describe('BlockRegistry', () => {
  it('air is pre-registered at id 0', () => {
    const r = new BlockRegistry();
    expect(r.size).toBe(1);
    expect(r.byName('webmc:air')).toBe(AIR_ID);
    expect(r.get(AIR_ID).name).toBe('webmc:air');
  });

  it('assigns sequential ids on register', () => {
    const r = new BlockRegistry();
    const a = r.register(def('test:a', [1, 2, 3]));
    const b = r.register(def('test:b', [4, 5, 6]));
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(r.size).toBe(3);
  });

  it('returns existing id for duplicate names (idempotent)', () => {
    const r = new BlockRegistry();
    const first = r.register(def('test:dup'));
    const again = r.register(def('test:dup'));
    expect(again).toBe(first);
  });

  it('throws on unknown id', () => {
    const r = new BlockRegistry();
    expect(() => r.get(999)).toThrow(/no block/);
  });

  it('byName returns undefined for unknown name', () => {
    const r = new BlockRegistry();
    expect(r.byName('nope:nope')).toBeUndefined();
  });

  it('default registry has the expanded block set', () => {
    const r = createDefaultRegistry();
    for (const name of [
      'webmc:stone',
      'webmc:dirt',
      'webmc:grass_block',
      'webmc:cobblestone',
      'webmc:oak_log',
      'webmc:oak_planks',
      'webmc:oak_leaves',
      'webmc:sand',
      'webmc:water',
      'webmc:lava',
      'webmc:glowstone',
      'webmc:diamond_ore',
    ]) {
      expect(r.byName(name)).toBeDefined();
    }
    expect(r.size).toBeGreaterThanOrEqual(25);
    const glowId = r.byName('webmc:glowstone');
    if (glowId === undefined) throw new Error('missing glowstone');
    expect(r.get(glowId).lightEmission).toBe(15);
    const grass = r.get(r.byName('webmc:grass_block') ?? 0).faceColors;
    expect(grass.top).not.toEqual(grass.bottom);
    expect(grass.top).not.toEqual(grass.side);
  });
});

import { describe, it, expect } from 'vitest';
import { BlockEntityWorld } from './block_entities';

interface ChestState {
  slots: (null | { itemId: number; count: number; damage: number })[];
}

describe('BlockEntityWorld', () => {
  it('places and retrieves an entity', () => {
    const w = new BlockEntityWorld();
    const slot: ChestState = { slots: [null, null] };
    w.place('chest', { x: 1, y: 2, z: 3 }, slot);
    const e = w.get<ChestState>({ x: 1, y: 2, z: 3 });
    expect(e?.kind).toBe('chest');
    expect(e?.state).toBe(slot);
  });

  it('remove clears an entity', () => {
    const w = new BlockEntityWorld();
    w.place('sign', { x: 0, y: 0, z: 0 }, { lines: ['hi'] });
    w.remove({ x: 0, y: 0, z: 0 });
    expect(w.get({ x: 0, y: 0, z: 0 })).toBeNull();
  });

  it('serialize + hydrate round-trips state', () => {
    const a = new BlockEntityWorld();
    a.place('furnace', { x: 5, y: 60, z: 5 }, { fuelRemainingSec: 10 });
    a.place('sign', { x: 0, y: 64, z: 0 }, { lines: ['line1'] });
    const b = new BlockEntityWorld();
    b.hydrate(a.serialize());
    expect(b.size).toBe(2);
    expect(b.get({ x: 0, y: 64, z: 0 })?.kind).toBe('sign');
  });

  it('get returns null for unknown position', () => {
    const w = new BlockEntityWorld();
    expect(w.get({ x: 0, y: 0, z: 0 })).toBeNull();
  });
});

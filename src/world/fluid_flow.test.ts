import { describe, it, expect } from 'vitest';
import { computeFlow, fluidReaction, type FlowLookup, maxFlowDistance } from './fluid_flow';

const ALL_AIR: FlowLookup = {
  get: () => null,
  isSolid: () => false,
  isReplaceable: () => true,
};

describe('fluid flow', () => {
  it('water flows 7 blocks', () => {
    expect(maxFlowDistance('water', 'overworld')).toBe(7);
  });

  it('lava flows 3 blocks overworld', () => {
    expect(maxFlowDistance('lava', 'overworld')).toBe(3);
  });

  it('lava flows 7 blocks in nether', () => {
    expect(maxFlowDistance('lava', 'nether')).toBe(7);
  });

  it('flow prefers downward', () => {
    const events = computeFlow({
      pos: { x: 0, y: 5, z: 0 },
      state: { kind: 'water', level: 0, falling: false },
      lookup: ALL_AIR,
      dimension: 'overworld',
    });
    expect(events.length).toBe(1);
    expect(events[0]?.pos.y).toBe(4);
    expect(events[0]?.next.falling).toBe(true);
  });

  it('horizontal flow when floor is solid', () => {
    const l: FlowLookup = {
      get: () => null,
      isSolid: () => true,
      isReplaceable: (_, y) => y !== 4, // floor blocked
    };
    const events = computeFlow({
      pos: { x: 0, y: 5, z: 0 },
      state: { kind: 'water', level: 0, falling: false },
      lookup: l,
      dimension: 'overworld',
    });
    expect(events.length).toBe(4);
    for (const e of events) expect(e.next.level).toBe(1);
  });

  it('flow stops at max distance', () => {
    const l: FlowLookup = {
      get: () => null,
      isSolid: () => true,
      isReplaceable: (_, y) => y !== 4,
    };
    const events = computeFlow({
      pos: { x: 0, y: 5, z: 0 },
      state: { kind: 'water', level: 7, falling: false },
      lookup: l,
      dimension: 'overworld',
    });
    expect(events).toEqual([]);
  });

  it('water source + lava flowing = obsidian', () => {
    expect(fluidReaction('water', 'lava', true)).toBe('webmc:obsidian');
  });

  it('water flow + lava flow = cobblestone', () => {
    expect(fluidReaction('water', 'lava', false)).toBe('webmc:cobblestone');
  });

  it('same fluids do not react', () => {
    expect(fluidReaction('water', 'water', true)).toBeNull();
  });
});

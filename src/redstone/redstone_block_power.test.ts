import { describe, it, expect } from 'vitest';
import {
  craftRedstoneBlock,
  powerFromRedstoneBlockAt,
  REDSTONE_BLOCK_PISTON_MOVABLE,
  REDSTONE_BLOCK_SIGNAL,
  uncraftRedstoneBlock,
} from './redstone_block_power';

describe('redstone block', () => {
  it('always powers at 15', () => {
    expect(REDSTONE_BLOCK_SIGNAL).toBe(15);
  });

  it('adjacent neighbor powered', () => {
    const q = { isRedstoneBlockAt: () => true };
    expect(powerFromRedstoneBlockAt(q, 1, 0, 0)).toBe(15);
  });

  it('diagonal not powered', () => {
    const q = { isRedstoneBlockAt: () => true };
    expect(powerFromRedstoneBlockAt(q, 1, 1, 0)).toBe(0);
  });

  it('absent block = no power', () => {
    const q = { isRedstoneBlockAt: () => false };
    expect(powerFromRedstoneBlockAt(q, 1, 0, 0)).toBe(0);
  });

  it('craft 9:1', () => {
    expect(craftRedstoneBlock({ redstoneDust: 9 })?.count).toBe(1);
    expect(craftRedstoneBlock({ redstoneDust: 18 })?.count).toBe(2);
    expect(craftRedstoneBlock({ redstoneDust: 5 })).toBeNull();
  });

  it('uncraft 1:9', () => {
    expect(uncraftRedstoneBlock(3).count).toBe(27);
  });

  it('piston can push', () => {
    expect(REDSTONE_BLOCK_PISTON_MOVABLE).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  overworldToNether,
  netherToOverworld,
  convert,
  endSpawnPad,
} from './dimension_travel_ratio';

describe('dimension travel ratio', () => {
  it('ow→nether divides 8', () => {
    expect(overworldToNether(800)).toBe(100);
  });

  it('nether→ow multiplies 8', () => {
    expect(netherToOverworld(100)).toBe(800);
  });

  it('identity same dim', () => {
    expect(convert('overworld', 'overworld', 42)).toBe(42);
  });

  it('end 1:1', () => {
    expect(convert('overworld', 'the_end', 42)).toBe(42);
  });

  it('end spawn pad roughly at 100/49/0', () => {
    const p = endSpawnPad();
    expect(p.x).toBe(100);
    expect(p.y).toBe(49);
  });
});

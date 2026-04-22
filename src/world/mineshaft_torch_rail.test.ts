import { describe, it, expect } from 'vitest';
import {
  torchPositions,
  isCobweb,
  spawnsChestMinecart,
  hasCaveSpiderSpawner,
  CORRIDOR_LEN,
} from './mineshaft_torch_rail';

describe('mineshaft', () => {
  it('torches every 5 blocks', () => {
    const seg = {
      kind: 'corridor' as const,
      orientation: 'x' as const,
      x: 0,
      y: 20,
      z: 0,
      length: 20,
    };
    const t = torchPositions(seg);
    expect(t.length).toBeGreaterThan(0);
    const first = t[0];
    if (!first) throw new Error('empty');
    expect(t[1]?.x).toBe(first.x + 5);
  });

  it('cobweb roll', () => {
    expect(isCobweb(() => 0)).toBe(true);
    expect(isCobweb(() => 0.99)).toBe(false);
  });

  it('chest minecart roll', () => {
    expect(spawnsChestMinecart(() => 0)).toBe(true);
  });

  it('cave spider spawner roll', () => {
    expect(hasCaveSpiderSpawner(() => 0)).toBe(true);
  });

  it('corridor length constant', () => {
    expect(CORRIDOR_LEN).toBeGreaterThan(0);
  });
});

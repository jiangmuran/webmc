import { describe, it, expect } from 'vitest';
import { onCreakingDeath, accumulate, harvest, canCraftResinBrick } from './resin_clump';

describe('resin clump', () => {
  it('spawns size 1', () => {
    expect(onCreakingDeath().size).toBe(1);
  });

  it('accumulates up to 4', () => {
    let s = onCreakingDeath();
    for (let i = 0; i < 10; i++) s = accumulate(s);
    expect(s.size).toBe(4);
  });

  it('harvest yields size resin', () => {
    expect(harvest({ size: 3 }).resin).toBe(3);
  });

  it('resin brick needs 4', () => {
    expect(canCraftResinBrick(3)).toBe(false);
    expect(canCraftResinBrick(4)).toBe(true);
  });
});

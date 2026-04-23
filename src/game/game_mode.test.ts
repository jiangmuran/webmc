import { describe, it, expect } from 'vitest';
import { rulesOf } from './game_mode';

describe('game mode', () => {
  it('survival takes damage, cannot fly', () => {
    const r = rulesOf('survival');
    expect(r.takesDamage).toBe(true);
    expect(r.canFly).toBe(false);
  });

  it('creative flies + immune', () => {
    const r = rulesOf('creative');
    expect(r.canFly).toBe(true);
    expect(r.takesDamage).toBe(false);
  });

  it('adventure cannot break blocks', () => {
    expect(rulesOf('adventure').canBreakBlocks).toBe(false);
  });

  it('spectator noClip + immune', () => {
    const r = rulesOf('spectator');
    expect(r.noClip).toBe(true);
    expect(r.takesDamage).toBe(false);
    expect(r.canBreakBlocks).toBe(false);
  });

  it('creative has infinite items', () => {
    expect(rulesOf('creative').infiniteItems).toBe(true);
    expect(rulesOf('survival').infiniteItems).toBe(false);
  });
});

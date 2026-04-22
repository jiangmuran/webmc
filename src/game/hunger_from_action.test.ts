import { describe, it, expect } from 'vitest';
import { applyAction, costOf, EXHAUSTION_ROLLOVER } from './hunger_from_action';

describe('hunger actions', () => {
  it('sprint > walk', () => {
    expect(costOf({ kind: 'sprint_block' })).toBeGreaterThan(costOf({ kind: 'walk_block' }));
  });

  it('rolls over at threshold', () => {
    const p = { exhaustion: 0, saturation: 5, hunger: 20 };
    for (let i = 0; i < 40; i++) applyAction(p, { kind: 'sprint_block' });
    expect(p.saturation).toBeLessThan(5);
  });

  it('reduces hunger after saturation gone', () => {
    const p = { exhaustion: 0, saturation: 0, hunger: 20 };
    applyAction(p, { kind: 'heal_1hp' });
    expect(p.hunger).toBeLessThan(20);
  });

  it('walk doesnt tick', () => {
    const p = { exhaustion: 0, saturation: 5, hunger: 20 };
    applyAction(p, { kind: 'walk_block' });
    expect(p.exhaustion).toBe(0);
  });

  it('rollover constant', () => {
    expect(EXHAUSTION_ROLLOVER).toBe(4);
  });
});

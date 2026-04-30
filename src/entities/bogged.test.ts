import { describe, it, expect } from 'vitest';
import { BOGGED_MAX_HEALTH, boggedArrow, makeBogged, tickBogged } from './bogged';

describe('bogged', () => {
  it('spawns at 16 HP', () => {
    expect(BOGGED_MAX_HEALTH).toBe(16);
    expect(makeBogged(1, { x: 0, y: 0, z: 0 }).health).toBe(16);
  });

  it('resets draw when no target', () => {
    const b = makeBogged(1, { x: 0, y: 0, z: 0 });
    b.drawTicks = 10;
    tickBogged(b, { hasTarget: false });
    expect(b.drawTicks).toBe(0);
  });

  it('fires after 30 ticks with a target', () => {
    const b = makeBogged(1, { x: 0, y: 0, z: 0 });
    let fired = false;
    for (let i = 0; i < 30; i++) {
      const r = tickBogged(b, { hasTarget: true });
      if (r.fireArrow) fired = true;
    }
    expect(fired).toBe(true);
  });

  it('arrow is poison-tipped for 4 seconds (wiki)', () => {
    const a = boggedArrow();
    expect(a.tip).toBe('poison');
    expect(a.durationSec).toBe(4);
  });
});

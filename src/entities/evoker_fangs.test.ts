import { describe, it, expect } from 'vitest';
import { FANG_CHARGE_SEC, FANG_DAMAGE, summonFangLine, tickFang } from './evoker_fangs';

describe('evoker fangs', () => {
  it('summons 16 fangs along direction (wiki)', () => {
    // Wiki: "The evoker typically summons sixteen fangs in a
    // straight line toward the target."
    const fangs = summonFangLine({ x: 0, y: 0, z: 0 }, { x: 1, z: 0 }, 42);
    expect(fangs.length).toBe(16);
    expect(fangs[0]?.position.x).toBe(1);
    expect(fangs[15]?.position.x).toBe(16);
  });

  it('warmup delays strike', () => {
    const [first, last] = summonFangLine({ x: 0, y: 0, z: 0 }, { x: 1, z: 0 }, 42);
    if (!first || !last) throw new Error();
    expect(last.warmupSec).toBeGreaterThan(first.warmupSec);
  });

  it('strike fires once after full 1.25s warmup (wiki)', () => {
    // Wiki: "Each fang individually rises out of the ground, charges
    // for 1.25 seconds (25 ticks), then strikes downward."
    const fangs = summonFangLine({ x: 0, y: 0, z: 0 }, { x: 1, z: 0 }, 42);
    const f = fangs[0];
    if (!f) throw new Error();
    // Halfway through wiki charge time: no strike yet.
    expect(tickFang(f, { dtSec: 0.5, entityOnFang: 5 }).strike).toBe(false);
    // Past 1.25s total: strike fires.
    const r = tickFang(f, { dtSec: 1, entityOnFang: 5 });
    expect(r.strike).toBe(true);
    expect(r.targetEntity).toBe(5);
    const r2 = tickFang(f, { dtSec: 0.1, entityOnFang: 5 });
    expect(r2.strike).toBe(false);
  });

  it('first fang charges at least 1.25s (wiki)', () => {
    const fangs = summonFangLine({ x: 0, y: 0, z: 0 }, { x: 1, z: 0 }, 42);
    const f = fangs[0];
    if (!f) throw new Error();
    expect(f.warmupSec).toBeGreaterThanOrEqual(FANG_CHARGE_SEC);
    expect(FANG_CHARGE_SEC).toBeCloseTo(1.25);
  });

  it('damage is 6', () => {
    expect(FANG_DAMAGE).toBe(6);
  });
});

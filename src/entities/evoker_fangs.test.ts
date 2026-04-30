import { describe, it, expect } from 'vitest';
import { FANG_DAMAGE, summonFangLine, tickFang } from './evoker_fangs';

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

  it('strike fires once after warmup', () => {
    const fangs = summonFangLine({ x: 0, y: 0, z: 0 }, { x: 1, z: 0 }, 42);
    const f = fangs[0];
    if (!f) throw new Error();
    const r = tickFang(f, { dtSec: 1, entityOnFang: 5 });
    expect(r.strike).toBe(true);
    expect(r.targetEntity).toBe(5);
    const r2 = tickFang(f, { dtSec: 0.1, entityOnFang: 5 });
    expect(r2.strike).toBe(false);
  });

  it('damage is 6', () => {
    expect(FANG_DAMAGE).toBe(6);
  });
});

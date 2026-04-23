import { describe, it, expect } from 'vitest';
import { sinksSlowly, freezeTicks, takesFreezingDamage, FREEZE_TICKS } from './powder_snow_sink';

describe('powder snow sink', () => {
  it('barefoot sinks', () => {
    expect(sinksSlowly({ inPowderSnow: true, wearingLeatherBoots: false, ticksInSnow: 0 })).toBe(
      true,
    );
  });

  it('leather boots no sink', () => {
    expect(sinksSlowly({ inPowderSnow: true, wearingLeatherBoots: true, ticksInSnow: 0 })).toBe(
      false,
    );
  });

  it('freeze accumulates', () => {
    expect(freezeTicks({ inPowderSnow: true, wearingLeatherBoots: false, ticksInSnow: 10 })).toBe(
      11,
    );
  });

  it('leather boots thaw', () => {
    expect(freezeTicks({ inPowderSnow: true, wearingLeatherBoots: true, ticksInSnow: 10 })).toBe(8);
  });

  it('damage at threshold', () => {
    expect(takesFreezingDamage(FREEZE_TICKS)).toBe(true);
    expect(takesFreezingDamage(FREEZE_TICKS - 1)).toBe(false);
  });
});

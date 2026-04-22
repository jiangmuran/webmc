import { describe, it, expect } from 'vitest';
import {
  hoglinAvoidsWarpedFungus,
  tickOverworldHoglin,
  piglinNoticesGold,
  hoglinPiglinEngage,
  HOGLIN_ZOMBIFY_TICKS,
  PIGLIN_GOLD_PICKUP_RADIUS,
} from './hoglin_piglin_hostility';

describe('hoglin-piglin', () => {
  it('hoglin avoids warped fungus', () => {
    expect(hoglinAvoidsWarpedFungus()).toBe(true);
  });

  it('zombifies in overworld', () => {
    const h = {
      inOverworld: true,
      ticksSinceLastAvoid: 0,
      ticksInOverworld: HOGLIN_ZOMBIFY_TICKS - 1,
    };
    expect(tickOverworldHoglin(h).zombified).toBe(true);
  });

  it('not in nether', () => {
    const h = { inOverworld: false, ticksSinceLastAvoid: 0, ticksInOverworld: 0 };
    expect(tickOverworldHoglin(h).zombified).toBe(false);
  });

  it('piglin notices gold within radius', () => {
    expect(piglinNoticesGold(PIGLIN_GOLD_PICKUP_RADIUS)).toBe(true);
    expect(piglinNoticesGold(PIGLIN_GOLD_PICKUP_RADIUS + 1)).toBe(false);
  });

  it('engage only in nether', () => {
    expect(hoglinPiglinEngage(true)).toBe(true);
    expect(hoglinPiglinEngage(false)).toBe(false);
  });
});

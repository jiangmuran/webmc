import { describe, it, expect } from 'vitest';
import {
  launchRocket,
  tickRocket,
  rocketDamageAt,
  ELYTRA_BOOST_FORWARD,
} from './firework_rocket_flight';

describe('rocket flight', () => {
  it('maxAge at least 20', () => {
    const r = launchRocket(1, () => 0);
    expect(r.maxAgeTicks).toBeGreaterThanOrEqual(20);
  });

  it('3-dur lasts longer', () => {
    expect(launchRocket(3, () => 0).maxAgeTicks).toBeGreaterThan(
      launchRocket(1, () => 0).maxAgeTicks,
    );
  });

  it('explodes at end', () => {
    const r = launchRocket(1, () => 0);
    let last: ReturnType<typeof tickRocket> = { exploded: false };
    for (let i = 0; i < r.maxAgeTicks; i++) last = tickRocket(r);
    expect(last.exploded).toBe(true);
  });

  it('damage falloff', () => {
    const r = launchRocket(1, () => 0, 2);
    expect(rocketDamageAt(r, 0)).toBeGreaterThan(rocketDamageAt(r, 4));
    expect(rocketDamageAt(r, 100)).toBe(0);
  });

  it('elytra boost constant', () => {
    expect(ELYTRA_BOOST_FORWARD).toBeGreaterThan(1);
  });
});

import { describe, it, expect } from 'vitest';
import { makeArrow, onHit, shouldCallLightning } from './projectile_pass_through';

describe('projectile pierce', () => {
  it('normal arrow stops on first', () => {
    const p = makeArrow(0);
    const r = onHit(p, { entityId: 'a' });
    expect(r.stops).toBe(true);
  });

  it('pierce 2 passes through 2', () => {
    const p = makeArrow(2);
    expect(onHit(p, { entityId: 'a' }).stops).toBe(false);
    expect(onHit(p, { entityId: 'b' }).stops).toBe(false);
    expect(onHit(p, { entityId: 'c' }).stops).toBe(true);
  });

  it('cannot hit same entity twice', () => {
    const p = makeArrow(3);
    onHit(p, { entityId: 'a' });
    expect(onHit(p, { entityId: 'a' }).hit).toBe(false);
  });

  it('channeling requirements', () => {
    expect(
      shouldCallLightning({ enchantLevel: 1, thunderstorm: true, targetInOpenSky: true }),
    ).toBe(true);
    expect(
      shouldCallLightning({ enchantLevel: 1, thunderstorm: false, targetInOpenSky: true }),
    ).toBe(false);
  });
});

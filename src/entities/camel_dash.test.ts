import { describe, it, expect } from 'vitest';
import {
  CAMEL_MAX_PASSENGERS,
  canMount,
  makeCamel,
  sit,
  stand,
  tickCamel,
  tryDash,
} from './camel_dash';

describe('camel dash', () => {
  it('dashes with jump + riding', () => {
    const c = makeCamel();
    const r = tryDash(c, { jumpPressed: true, riding: true });
    expect(r.dashed).toBe(true);
    expect(r.horizontalBoost).toBeGreaterThan(0);
  });

  it('no dash if not riding', () => {
    const c = makeCamel();
    expect(tryDash(c, { jumpPressed: true, riding: false }).dashed).toBe(false);
  });

  it('cooldown blocks repeat dash', () => {
    const c = makeCamel();
    tryDash(c, { jumpPressed: true, riding: true });
    expect(tryDash(c, { jumpPressed: true, riding: true }).dashed).toBe(false);
  });

  it('cooldown ticks down', () => {
    const c = makeCamel();
    tryDash(c, { jumpPressed: true, riding: true });
    for (let i = 0; i < 60; i++) tickCamel(c);
    expect(tryDash(c, { jumpPressed: true, riding: true }).dashed).toBe(true);
  });

  it('sit/stand toggles', () => {
    const c = makeCamel();
    expect(sit(c)).toBe(true);
    expect(sit(c)).toBe(false);
    expect(stand(c)).toBe(true);
  });

  it('sitting camel cannot dash', () => {
    const c = makeCamel();
    sit(c);
    expect(tryDash(c, { jumpPressed: true, riding: true }).dashed).toBe(false);
  });

  it('2-passenger mount cap', () => {
    const c = makeCamel();
    expect(canMount(c, 0)).toBe(true);
    expect(canMount(c, CAMEL_MAX_PASSENGERS)).toBe(false);
  });

  it('sitting camel cannot be mounted', () => {
    const c = makeCamel();
    sit(c);
    expect(canMount(c, 0)).toBe(false);
  });
});

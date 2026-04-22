import { describe, it, expect } from 'vitest';
import {
  makeCamel,
  sit,
  stand,
  tryMount,
  dismount,
  tryDash,
  DASH_COOLDOWN_MS,
  MAX_RIDERS,
} from './camel_sit_stand';

describe('camel', () => {
  it('mount up to 2', () => {
    const c = makeCamel();
    expect(tryMount(c, 'a')).toBe(true);
    expect(tryMount(c, 'b')).toBe(true);
    expect(tryMount(c, 'c')).toBe(false);
    expect(c.riders.length).toBe(MAX_RIDERS);
  });

  it('dismount', () => {
    const c = makeCamel();
    tryMount(c, 'a');
    expect(dismount(c, 'a')).toBe(true);
    expect(dismount(c, 'a')).toBe(false);
  });

  it('dash cooldown', () => {
    const c = makeCamel();
    expect(tryDash(c, { nowMs: 0, jumpHeld: true, forward: true })).toBe(true);
    expect(tryDash(c, { nowMs: 100, jumpHeld: true, forward: true })).toBe(false);
    expect(tryDash(c, { nowMs: DASH_COOLDOWN_MS + 1, jumpHeld: true, forward: true })).toBe(true);
  });

  it('sitting blocks dash', () => {
    const c = makeCamel();
    sit(c);
    expect(tryDash(c, { nowMs: 0, jumpHeld: true, forward: true })).toBe(false);
    stand(c);
    expect(tryDash(c, { nowMs: 0, jumpHeld: true, forward: true })).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  makeMob,
  feed,
  canBreedTogether,
  consummate,
  IN_LOVE_DURATION_MS,
  BREED_COOLDOWN_MS,
} from './breeding_cooldown_love';

describe('breeding', () => {
  it('feed enters love', () => {
    const m = makeMob(['webmc:wheat']);
    expect(feed(m, { foodId: 'webmc:wheat', nowMs: 0 })).toBe('entered_love');
  });

  it('wrong food rejected', () => {
    const m = makeMob(['webmc:wheat']);
    expect(feed(m, { foodId: 'webmc:apple', nowMs: 0 })).toBe('wrong_food');
  });

  it('pair within radius', () => {
    const a = makeMob(['wheat']);
    const b = makeMob(['wheat']);
    feed(a, { foodId: 'wheat', nowMs: 0 });
    feed(b, { foodId: 'wheat', nowMs: 0 });
    expect(
      canBreedTogether({
        a,
        b,
        aPos: { x: 0, y: 0, z: 0 },
        bPos: { x: 5, y: 0, z: 0 },
        nowMs: 100,
      }),
    ).toBe(true);
  });

  it('too far', () => {
    const a = makeMob(['wheat']);
    const b = makeMob(['wheat']);
    feed(a, { foodId: 'wheat', nowMs: 0 });
    feed(b, { foodId: 'wheat', nowMs: 0 });
    expect(
      canBreedTogether({
        a,
        b,
        aPos: { x: 0, y: 0, z: 0 },
        bPos: { x: 100, y: 0, z: 0 },
        nowMs: 100,
      }),
    ).toBe(false);
  });

  it('consummate sets cooldown', () => {
    const a = makeMob(['wheat']);
    const b = makeMob(['wheat']);
    feed(a, { foodId: 'wheat', nowMs: 0 });
    feed(b, { foodId: 'wheat', nowMs: 0 });
    consummate(a, b, 100);
    expect(a.breedCooldownUntilMs).toBe(100 + BREED_COOLDOWN_MS);
  });

  it('cooldown blocks feed', () => {
    const m = makeMob(['wheat']);
    feed(m, { foodId: 'wheat', nowMs: 0 });
    consummate(m, makeMob(['wheat']), 100);
    expect(feed(m, { foodId: 'wheat', nowMs: 200 })).toBe('on_cooldown');
    expect(feed(m, { foodId: 'wheat', nowMs: 100 + BREED_COOLDOWN_MS + 1 })).toBe('entered_love');
  });

  it('love duration limit', () => {
    const m = makeMob(['wheat']);
    feed(m, { foodId: 'wheat', nowMs: 0 });
    expect(m.inLoveUntilMs).toBe(IN_LOVE_DURATION_MS);
  });
});

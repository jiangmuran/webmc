import { describe, it, expect } from 'vitest';
import { tryTame, toggleSit, isPersistent, type Tameable } from './tame_mob_persistent';

const wild: Tameable = { id: 'wolf', sitting: false, collar: 'red' };

describe('tame mob persistent', () => {
  it('lucky taming succeeds', () => {
    expect(tryTame(wild, 'p', () => 0.001, 0.5).tamed).toBe(true);
  });

  it('unlucky tame fails', () => {
    expect(tryTame(wild, 'p', () => 0.99, 0.1).tamed).toBe(false);
  });

  it('already tamed rejects', () => {
    expect(tryTame({ ...wild, tamedByUuid: 'x' }, 'y', () => 0, 1).tamed).toBe(false);
  });

  it('owner toggles sit', () => {
    const tamed = { ...wild, tamedByUuid: 'p' };
    expect(toggleSit(tamed, 'p').sitting).toBe(true);
  });

  it('stranger cannot toggle sit', () => {
    const tamed = { ...wild, tamedByUuid: 'p', sitting: true };
    expect(toggleSit(tamed, 'other').sitting).toBe(true);
  });

  it('wild not persistent', () => {
    expect(isPersistent(wild)).toBe(false);
  });

  it('tamed is persistent', () => {
    expect(isPersistent({ ...wild, tamedByUuid: 'p' })).toBe(true);
  });
});

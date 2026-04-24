import { describe, it, expect } from 'vitest';
import { canSaddle, removeByShears, dropsOnDeath } from './saddle_equip';

describe('saddle equip', () => {
  it('pig saddleable', () => {
    expect(canSaddle('pig')).toBe(true);
  });

  it('cow not saddleable', () => {
    expect(canSaddle('cow')).toBe(false);
  });

  it('camel saddleable', () => {
    expect(canSaddle('camel')).toBe(true);
  });

  it('shears remove saddle', () => {
    const r = removeByShears('pig', true);
    expect(r.removedItem).toBe('saddle');
  });

  it('no-op if no saddle', () => {
    expect(removeByShears('pig', false).removedItem).toBeUndefined();
  });

  it('saddled drops', () => {
    expect(dropsOnDeath('pig', true)).toContain('saddle');
  });

  it('unsaddled drops nothing', () => {
    expect(dropsOnDeath('pig', false)).toEqual([]);
  });
});

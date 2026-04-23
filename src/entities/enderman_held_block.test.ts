import { describe, it, expect } from 'vitest';
import { canPickUp, onDeath, mayPlace } from './enderman_held_block';

describe('enderman held block', () => {
  it('grass pickup', () => {
    expect(canPickUp('grass_block')).toBe(true);
  });

  it('stone blocked', () => {
    expect(canPickUp('stone')).toBe(false);
  });

  it('drops on death', () => {
    expect(onDeath('sand')).toBe('sand');
    expect(onDeath(null)).toBeNull();
  });

  it('place only with held + air', () => {
    expect(mayPlace('sand', true)).toBe(true);
    expect(mayPlace(null, true)).toBe(false);
    expect(mayPlace('sand', false)).toBe(false);
  });
});

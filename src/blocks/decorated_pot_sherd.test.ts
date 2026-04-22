import { describe, it, expect } from 'vitest';
import { craftPot, breakDrops, isValidSherd } from './decorated_pot_sherd';

describe('decorated pot', () => {
  it('valid sherd names', () => {
    expect(isValidSherd('heart')).toBe(true);
    expect(isValidSherd('xyz')).toBe(false);
  });

  it('craft accepts bricks', () => {
    const pot = craftPot(
      { kind: 'brick' },
      { kind: 'brick' },
      { kind: 'brick' },
      { kind: 'brick' },
    );
    expect(pot).not.toBeNull();
  });

  it('craft rejects bad sherd', () => {
    const pot = craftPot(
      { kind: 'sherd', pattern: 'xyz' },
      { kind: 'brick' },
      { kind: 'brick' },
      { kind: 'brick' },
    );
    expect(pot).toBeNull();
  });

  it('break drops each face', () => {
    const pot = craftPot(
      { kind: 'sherd', pattern: 'heart' },
      { kind: 'brick' },
      { kind: 'brick' },
      { kind: 'brick' },
    );
    if (pot) {
      const drops = breakDrops(pot);
      expect(drops.length).toBe(4);
      expect(drops.find((d) => d.id === 'webmc:pottery_sherd_heart')).toBeTruthy();
    }
  });
});

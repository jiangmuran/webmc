import { describe, it, expect } from 'vitest';
import { deathMessage, makeDeathScreen } from './death_screen';

describe('death messages', () => {
  it('slain by entity', () => {
    expect(deathMessage('alice', { kind: 'entity_attack', attacker: 'zombie' })).toBe(
      'alice was slain by zombie',
    );
  });

  it('close arrow vs far', () => {
    const close = deathMessage('bob', { kind: 'arrow', attacker: 'skeleton', distance: 5 });
    const far = deathMessage('bob', { kind: 'arrow', attacker: 'skeleton', distance: 100 });
    expect(close).not.toContain('from afar');
    expect(far).toContain('from afar');
  });

  it('fall message', () => {
    expect(deathMessage('a', { kind: 'fall' })).toContain('fell');
  });

  it('explosion with and without attacker', () => {
    expect(deathMessage('a', { kind: 'explosion', attacker: 'creeper' })).toContain('creeper');
    expect(deathMessage('a', { kind: 'explosion', attacker: null })).toBe('a was blown up');
  });

  it('death screen wraps message', () => {
    const ds = makeDeathScreen('x', { kind: 'void' }, 42);
    expect(ds.scoreAtDeath).toBe(42);
    expect(ds.respawnEnabled).toBe(true);
    expect(ds.message).toContain('out of the world');
  });
});

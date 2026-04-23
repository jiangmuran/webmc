import { describe, it, expect } from 'vitest';
import { deathMessage } from './death_message_format';

describe('death message format', () => {
  it('fall', () => {
    expect(deathMessage('alice', { kind: 'fall' })).toContain('ground');
  });

  it('drown', () => {
    expect(deathMessage('alice', { kind: 'drown' })).toContain('drowned');
  });

  it('mob includes name', () => {
    expect(deathMessage('alice', { kind: 'mob', mobName: 'Zombie' })).toContain('Zombie');
  });

  it('player with weapon', () => {
    const m = deathMessage('alice', { kind: 'player', playerName: 'bob', weapon: 'Sharp Sword' });
    expect(m).toContain('bob');
    expect(m).toContain('Sharp Sword');
  });

  it('explosion no source', () => {
    expect(deathMessage('alice', { kind: 'explosion' })).toBe('alice was blown up');
  });

  it('freeze', () => {
    expect(deathMessage('alice', { kind: 'freeze' })).toContain('froze');
  });

  it('void', () => {
    expect(deathMessage('alice', { kind: 'void' })).toContain('out of the world');
  });
});

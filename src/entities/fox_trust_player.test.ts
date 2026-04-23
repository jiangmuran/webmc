import { describe, it, expect } from 'vitest';
import { inheritsTrust, willNotFleeFrom } from './fox_trust_player';

describe('fox trust player', () => {
  it('child inherits trust', () => {
    const child = inheritsTrust(
      [
        { trustedPlayers: ['a'], bornFromTame: false },
        { trustedPlayers: ['b'], bornFromTame: false },
      ],
      { trustedPlayers: [], bornFromTame: false },
    );
    expect(child.trustedPlayers.sort()).toEqual(['a', 'b']);
    expect(child.bornFromTame).toBe(true);
  });

  it('trusted player not fled', () => {
    expect(willNotFleeFrom({ trustedPlayers: ['a'], bornFromTame: true }, 'a')).toBe(true);
  });

  it('untrusted fled', () => {
    expect(willNotFleeFrom({ trustedPlayers: ['a'], bornFromTame: true }, 'b')).toBe(false);
  });
});

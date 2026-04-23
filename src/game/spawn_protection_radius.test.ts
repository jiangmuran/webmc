import { describe, it, expect } from 'vitest';
import { canModifyAt, blockInteractAllowed } from './spawn_protection_radius';

const ctx = {
  worldSpawnX: 0,
  worldSpawnZ: 0,
  protectionRadius: 16,
  isHost: false,
};

describe('spawn protection radius', () => {
  it('close blocked', () => {
    expect(canModifyAt(ctx, 5, 5)).toBe(false);
  });

  it('far allowed', () => {
    expect(canModifyAt(ctx, 100, 100)).toBe(true);
  });

  it('host bypasses', () => {
    expect(canModifyAt({ ...ctx, isHost: true }, 0, 0)).toBe(true);
  });

  it('interact mirrors modify', () => {
    expect(blockInteractAllowed(ctx, 100, 100)).toBe(true);
  });
});

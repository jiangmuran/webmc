import { describe, it, expect } from 'vitest';
import { preferredSource, dimensionForRespawn } from './player_respawn_block_choose';

describe('player respawn block choose', () => {
  it('anchor wins over bed', () => {
    expect(
      preferredSource({
        bedValid: true,
        anchorValid: true,
        bedDimension: 'overworld',
        anchorDimension: 'nether',
      }),
    ).toBe('anchor');
  });

  it('bed when no anchor', () => {
    expect(
      preferredSource({
        bedValid: true,
        anchorValid: false,
        bedDimension: 'overworld',
        anchorDimension: 'nether',
      }),
    ).toBe('bed');
  });

  it('world spawn fallback', () => {
    expect(
      preferredSource({
        bedValid: false,
        anchorValid: false,
        bedDimension: 'overworld',
        anchorDimension: 'overworld',
      }),
    ).toBe('world_spawn');
  });

  it('dimension from anchor', () => {
    expect(
      dimensionForRespawn({
        bedValid: true,
        anchorValid: true,
        bedDimension: 'overworld',
        anchorDimension: 'nether',
      }),
    ).toBe('nether');
  });
});

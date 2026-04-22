import { describe, it, expect } from 'vitest';
import { speedMultiplier, onHelmet, UNDERWATER_MINE_PENALTY } from './aqua_affinity';

describe('aqua affinity', () => {
  it('dry full speed', () => {
    expect(speedMultiplier({ underwater: false, onGround: true, aquaAffinity: false })).toBe(1);
  });

  it('underwater floating penalised', () => {
    expect(speedMultiplier({ underwater: true, onGround: false, aquaAffinity: false })).toBe(
      UNDERWATER_MINE_PENALTY,
    );
  });

  it('aqua affinity restores', () => {
    expect(speedMultiplier({ underwater: true, onGround: false, aquaAffinity: true })).toBe(1);
  });

  it('on ground underwater still 1', () => {
    expect(speedMultiplier({ underwater: true, onGround: true, aquaAffinity: false })).toBe(1);
  });

  it('helmet slot', () => {
    expect(onHelmet()).toBe(true);
  });
});

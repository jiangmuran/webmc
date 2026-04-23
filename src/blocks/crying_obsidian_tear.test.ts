import { describe, it, expect } from 'vitest';
import {
  emitsParticleThisTick,
  isRespawnAnchorComponent,
  blastResistance,
  EMIT_PARTICLE,
} from './crying_obsidian_tear';

describe('crying obsidian', () => {
  it('emits tear particle', () => {
    expect(EMIT_PARTICLE).toContain('obsidian');
  });

  it('respawn anchor uses it', () => {
    expect(isRespawnAnchorComponent()).toBe(true);
  });

  it('low rng triggers particle', () => {
    expect(emitsParticleThisTick(() => 0)).toBe(true);
  });

  it('high rng suppresses particle', () => {
    expect(emitsParticleThisTick(() => 0.99)).toBe(false);
  });

  it('blast resist high', () => {
    expect(blastResistance()).toBeGreaterThan(100);
  });
});

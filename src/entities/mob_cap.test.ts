import { describe, it, expect } from 'vitest';
import {
  CAP_PER_PLAYER_CHUNKS,
  canSpawn,
  fillPercent,
  makeMobCap,
  noteDespawn,
  noteSpawn,
} from './mob_cap';

describe('mob cap', () => {
  it('allows spawning when below cap', () => {
    expect(canSpawn(makeMobCap(), 'hostile')).toBe(true);
  });

  it('refuses when cap reached', () => {
    const s = makeMobCap();
    for (let i = 0; i < CAP_PER_PLAYER_CHUNKS.hostile; i++) noteSpawn(s, 'hostile');
    expect(canSpawn(s, 'hostile')).toBe(false);
  });

  it('despawning re-enables spawning', () => {
    const s = makeMobCap();
    for (let i = 0; i < CAP_PER_PLAYER_CHUNKS.passive; i++) noteSpawn(s, 'passive');
    noteDespawn(s, 'passive');
    expect(canSpawn(s, 'passive')).toBe(true);
  });

  it('fill percent scales', () => {
    const s = makeMobCap();
    for (let i = 0; i < 5; i++) noteSpawn(s, 'ambient');
    expect(fillPercent(s, 'ambient')).toBeCloseTo(5 / 15, 2);
  });
});

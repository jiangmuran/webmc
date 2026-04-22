import { describe, it, expect } from 'vitest';
import {
  aerialRootPositions,
  breakMuddyRoot,
  MAX_ROOT_REACH,
  planMangrove,
  tickPropagule,
} from './mangrove';

describe('mangrove', () => {
  it('trunk height within 8..13', () => {
    const t = planMangrove({ rng: () => 0.5, inSwamp: true });
    expect(t.trunkHeight).toBeGreaterThanOrEqual(8);
    expect(t.trunkHeight).toBeLessThanOrEqual(13);
  });

  it('swamp tree has wider root ball', () => {
    const swamp = planMangrove({ rng: () => 0.5, inSwamp: true });
    const dry = planMangrove({ rng: () => 0.5, inSwamp: false });
    expect(swamp.rootBallRadius).toBeGreaterThanOrEqual(dry.rootBallRadius);
  });

  it('propagule advances on low roll', () => {
    const p: { age: 0 | 1 | 2 | 3 | 4; hanging: boolean } = { age: 0, hanging: true };
    expect(tickPropagule(p, 0.01)).toBe(true);
    expect(p.age).toBe(1);
  });

  it('propagule caps at 4', () => {
    const p: { age: 0 | 1 | 2 | 3 | 4; hanging: boolean } = { age: 4, hanging: true };
    expect(tickPropagule(p, 0.001)).toBe(false);
  });

  it('aerial roots clamped to max reach', () => {
    const roots = aerialRootPositions({ x: 0, y: 0, z: 0 }, 100);
    expect(roots.length).toBe(MAX_ROOT_REACH);
  });

  it('silk touch keeps muddy variant', () => {
    expect(breakMuddyRoot(true)[0]?.item).toBe('webmc:muddy_mangrove_roots');
    expect(breakMuddyRoot(false)[0]?.item).toBe('webmc:mangrove_roots');
  });
});

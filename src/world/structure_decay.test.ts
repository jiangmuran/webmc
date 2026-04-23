import { describe, it, expect } from 'vitest';
import { decayReplace, integrityRoll, applyIntegrity } from './structure_decay';

describe('structure decay', () => {
  it('no decay on high roll', () => {
    expect(decayReplace('stone_bricks', () => 0.9)).toBe('stone_bricks');
  });

  it('cobblestone becomes mossy', () => {
    expect(decayReplace('cobblestone', () => 0)).toBe('mossy_cobblestone');
  });

  it('random block decays to null', () => {
    expect(decayReplace('oak_planks', () => 0)).toBeNull();
  });

  it('integrity 0 never keeps', () => {
    expect(integrityRoll(0, () => 0.5)).toBe(false);
  });

  it('integrity 1 always keeps', () => {
    expect(integrityRoll(1, () => 0.5)).toBe(true);
  });

  it('applyIntegrity ties together', () => {
    // integrity 1 + high decay roll → unchanged
    expect(applyIntegrity('stone_bricks', 1, () => 0.9)).toBe('stone_bricks');
    // integrity 0 → always null
    expect(applyIntegrity('stone_bricks', 0, () => 0.9)).toBeNull();
  });
});

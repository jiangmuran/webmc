import { describe, it, expect } from 'vitest';
import { saltFor, structureRngSeed } from './structure_spawn_salt';

describe('structure spawn salt', () => {
  it('village has salt', () => {
    expect(saltFor('village')).toBeGreaterThan(0);
  });

  it('unknown undefined', () => {
    expect(saltFor('fake_thing')).toBeUndefined();
  });

  it('seed deterministic', () => {
    expect(structureRngSeed(42, 'village', 0, 0)).toBe(structureRngSeed(42, 'village', 0, 0));
  });

  it('different chunk different seed', () => {
    expect(structureRngSeed(42, 'village', 0, 0)).not.toBe(structureRngSeed(42, 'village', 1, 0));
  });

  it('different structure different seed', () => {
    expect(structureRngSeed(42, 'village', 0, 0)).not.toBe(
      structureRngSeed(42, 'stronghold', 0, 0),
    );
  });

  it('unknown structure yields undefined', () => {
    expect(structureRngSeed(42, 'unknown', 0, 0)).toBeUndefined();
  });
});

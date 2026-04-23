import { describe, it, expect } from 'vitest';
import { driesInstantly, smeltsToDry, emitsSteamParticles } from './wet_sponge_nether';

describe('wet sponge nether', () => {
  it('dries in nether', () => {
    expect(driesInstantly({ dim: 'nether', inFurnace: false })).toBe(true);
  });

  it('overworld stays wet', () => {
    expect(driesInstantly({ dim: 'overworld', inFurnace: false })).toBe(false);
  });

  it('smelts to dry', () => {
    expect(smeltsToDry({ dim: 'overworld', inFurnace: true })).toBe(true);
  });

  it('steam in nether', () => {
    expect(emitsSteamParticles({ dim: 'nether', inFurnace: false })).toBe(true);
  });
});

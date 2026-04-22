import { describe, it, expect } from 'vitest';
import {
  BEDROCK_BOTTOM_LAYERS,
  BEDROCK_CEILING_LAYERS,
  canMobSpawnAt,
  clampEntryY,
  isAboveNetherCeiling,
  isInNetherPlayableRange,
  NETHER_CEILING_Y,
  NETHER_FLOOR_Y,
  shouldPlaceBedrock,
} from './nether_ceiling';

describe('nether bounds', () => {
  it('ceiling is 127', () => {
    expect(NETHER_CEILING_Y).toBe(127);
  });

  it('floor is 0', () => {
    expect(NETHER_FLOOR_Y).toBe(0);
  });

  it('y=64 is playable', () => {
    expect(isInNetherPlayableRange({ y: 64 })).toBe(true);
  });

  it('y=130 is above ceiling', () => {
    expect(isAboveNetherCeiling({ y: 130 })).toBe(true);
  });

  it('mob cannot spawn at floor or ceiling', () => {
    expect(canMobSpawnAt(0)).toBe(false);
    expect(canMobSpawnAt(127)).toBe(false);
    expect(canMobSpawnAt(64)).toBe(true);
  });

  it('entry Y is clamped', () => {
    expect(clampEntryY(130)).toBe(NETHER_CEILING_Y - 3);
    expect(clampEntryY(-5)).toBe(NETHER_FLOOR_Y + 3);
    expect(clampEntryY(64)).toBe(64);
  });

  it('bedrock placed with probability', () => {
    expect(shouldPlaceBedrock(0, BEDROCK_BOTTOM_LAYERS, 0.5)).toBe(true);
    expect(shouldPlaceBedrock(3, BEDROCK_BOTTOM_LAYERS, 0.5)).toBe(false);
    expect(shouldPlaceBedrock(127, BEDROCK_CEILING_LAYERS, 0.5)).toBe(true);
  });

  it('non-layer y skips bedrock', () => {
    expect(shouldPlaceBedrock(50, BEDROCK_BOTTOM_LAYERS, 0.1)).toBe(false);
  });
});

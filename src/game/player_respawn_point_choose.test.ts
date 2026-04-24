import { describe, it, expect } from 'vitest';
import {
  chooseRespawn,
  preservesRespawnAfterDeath,
  type RespawnSpec,
} from './player_respawn_point_choose';

const worldSpawn = { x: 0, y: 64, z: 0 };

describe('player respawn point', () => {
  it('bed respawn in overworld', () => {
    const s: RespawnSpec = {
      dimension: 'overworld',
      x: 100,
      y: 64,
      z: 0,
      bedValid: true,
      anchorValid: false,
      anchorCharges: 0,
    };
    expect(chooseRespawn(s, worldSpawn).x).toBe(100);
  });

  it('broken bed falls back to world spawn', () => {
    const s: RespawnSpec = {
      dimension: 'overworld',
      x: 100,
      y: 64,
      z: 0,
      bedValid: false,
      anchorValid: false,
      anchorCharges: 0,
    };
    expect(chooseRespawn(s, worldSpawn).x).toBe(0);
  });

  it('anchor in nether consumes charge', () => {
    const s: RespawnSpec = {
      dimension: 'nether',
      x: 100,
      y: 64,
      z: 0,
      bedValid: false,
      anchorValid: true,
      anchorCharges: 4,
    };
    expect(chooseRespawn(s, worldSpawn).consumed).toBe('anchor_charge');
  });

  it('anchor with no charges → world spawn', () => {
    const s: RespawnSpec = {
      dimension: 'nether',
      x: 100,
      y: 64,
      z: 0,
      bedValid: false,
      anchorValid: true,
      anchorCharges: 0,
    };
    expect(chooseRespawn(s, worldSpawn).x).toBe(0);
  });

  it('preserve on survival', () => {
    const s: RespawnSpec = {
      dimension: 'overworld',
      x: 1,
      y: 2,
      z: 3,
      bedValid: true,
      anchorValid: false,
      anchorCharges: 0,
    };
    expect(preservesRespawnAfterDeath(s, true)).toBe(s);
  });

  it('dropped after hard death', () => {
    const s: RespawnSpec = {
      dimension: 'overworld',
      x: 1,
      y: 2,
      z: 3,
      bedValid: true,
      anchorValid: false,
      anchorCharges: 0,
    };
    expect(preservesRespawnAfterDeath(s, false)).toBeUndefined();
  });
});

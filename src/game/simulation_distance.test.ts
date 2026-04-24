import { describe, it, expect } from 'vitest';
import {
  clamp,
  inSimulationDistance,
  chunksInSimulationDistance,
  MIN_SIMULATION_DISTANCE,
  MAX_SIMULATION_DISTANCE,
} from './simulation_distance';

describe('simulation distance', () => {
  it('clamps low', () => {
    expect(clamp(0)).toBe(MIN_SIMULATION_DISTANCE);
  });

  it('clamps high', () => {
    expect(clamp(99)).toBe(MAX_SIMULATION_DISTANCE);
  });

  it('inSimulation central chunk', () => {
    expect(inSimulationDistance(0, 0, 0, 0, 4)).toBe(true);
  });

  it('edge included', () => {
    expect(inSimulationDistance(4, 4, 0, 0, 4)).toBe(true);
  });

  it('beyond rejected', () => {
    expect(inSimulationDistance(5, 0, 0, 0, 4)).toBe(false);
  });

  it('chunk count formula', () => {
    expect(chunksInSimulationDistance(3)).toBe(49);
  });
});

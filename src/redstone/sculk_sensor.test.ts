import { describe, it, expect } from 'vitest';
import { emitVibration, makeSculkSensor, tickSculkSensor } from './sculk_sensor';

describe('sculk sensor', () => {
  it('activates on a nearby step', () => {
    const s = makeSculkSensor({ x: 0, y: 0, z: 0 });
    const fired = emitVibration(s, 'step', { x: 2, y: 0, z: 0 });
    expect(fired).toBe(true);
    expect(s.output).toBeGreaterThan(0);
  });

  it('ignores vibrations beyond 8 blocks', () => {
    const s = makeSculkSensor({ x: 0, y: 0, z: 0 });
    const fired = emitVibration(s, 'explode', { x: 20, y: 0, z: 0 });
    expect(fired).toBe(false);
    expect(s.output).toBe(0);
  });

  it('stronger vibrations produce higher signal', () => {
    const step = makeSculkSensor({ x: 0, y: 0, z: 0 });
    const explode = makeSculkSensor({ x: 0, y: 0, z: 0 });
    emitVibration(step, 'step', { x: 1, y: 0, z: 0 });
    emitVibration(explode, 'explode', { x: 1, y: 0, z: 0 });
    expect(explode.output).toBeGreaterThan(step.output);
  });

  it('decays to 0 and enters cooldown', () => {
    const s = makeSculkSensor({ x: 0, y: 0, z: 0 });
    emitVibration(s, 'step', { x: 1, y: 0, z: 0 });
    tickSculkSensor(s, 3); // past active + into cooldown
    expect(s.output).toBe(0);
    expect(s.cooldownSec).toBeGreaterThan(0);
  });

  it('cooldown blocks subsequent vibrations', () => {
    const s = makeSculkSensor({ x: 0, y: 0, z: 0 });
    emitVibration(s, 'step', { x: 1, y: 0, z: 0 });
    tickSculkSensor(s, 2.1);
    const fired = emitVibration(s, 'step', { x: 1, y: 0, z: 0 });
    expect(fired).toBe(false);
  });
});

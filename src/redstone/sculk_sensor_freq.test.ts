import { describe, it, expect } from 'vitest';
import { calibratedMatches, frequencyOf } from './sculk_sensor_freq';

describe('sculk sensor frequency', () => {
  it('walking is freq 1', () => {
    expect(frequencyOf('step')).toBe(1);
  });

  it('explosion is freq 15', () => {
    expect(frequencyOf('explode')).toBe(15);
  });

  it('calibrated sensor matches the right filter', () => {
    expect(calibratedMatches({ event: 'container_open', filterSignal: 10 })).toBe(true);
    expect(calibratedMatches({ event: 'container_open', filterSignal: 5 })).toBe(false);
  });

  it('piston extend and retract share frequency', () => {
    expect(frequencyOf('piston_extend')).toBe(frequencyOf('piston_contract'));
  });
});

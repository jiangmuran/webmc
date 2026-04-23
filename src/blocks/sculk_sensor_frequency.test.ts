import { describe, it, expect } from 'vitest';
import { redstoneSignalForEvent, COOLDOWN_TICKS, SIGNAL_RADIUS } from './sculk_sensor_frequency';

describe('sculk sensor frequency', () => {
  it('step low', () => {
    expect(redstoneSignalForEvent('step')).toBe(1);
  });

  it('explosion max', () => {
    expect(redstoneSignalForEvent('explode')).toBeGreaterThan(redstoneSignalForEvent('step'));
  });

  it('entity die = 15', () => {
    expect(redstoneSignalForEvent('entity_die')).toBe(15);
  });

  it('cooldown + radius positive', () => {
    expect(COOLDOWN_TICKS).toBeGreaterThan(0);
    expect(SIGNAL_RADIUS).toBeGreaterThan(0);
  });
});

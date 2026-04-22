import { describe, it, expect } from 'vitest';
import { plateOutput, canProjectileTrigger } from './pressure_plate_weight';

describe('weighted plates', () => {
  it('wood full on any', () => {
    expect(plateOutput({ kind: 'wood', entityCountOnPlate: 1 })).toBe(15);
  });

  it('iron saturates', () => {
    expect(plateOutput({ kind: 'iron', entityCountOnPlate: 10 })).toBe(1);
    expect(plateOutput({ kind: 'iron', entityCountOnPlate: 150 })).toBe(15);
    expect(plateOutput({ kind: 'iron', entityCountOnPlate: 500 })).toBe(15);
  });

  it('gold 1:1', () => {
    expect(plateOutput({ kind: 'gold', entityCountOnPlate: 5 })).toBe(5);
    expect(plateOutput({ kind: 'gold', entityCountOnPlate: 50 })).toBe(15);
  });

  it('projectile triggers wood not stone', () => {
    expect(canProjectileTrigger('wood')).toBe(true);
    expect(canProjectileTrigger('stone')).toBe(false);
  });
});

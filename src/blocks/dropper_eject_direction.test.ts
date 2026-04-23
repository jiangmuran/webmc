import { describe, it, expect } from 'vitest';
import { ejectedVelocity, slotsIn } from './dropper_eject_direction';

describe('dropper eject direction', () => {
  it('east ejects +x', () => {
    expect(ejectedVelocity('east').vx).toBeGreaterThan(0);
  });

  it('up ejects +y', () => {
    expect(ejectedVelocity('up').vy).toBeGreaterThan(0);
  });

  it('down ejects -y', () => {
    expect(ejectedVelocity('down').vy).toBeLessThan(0);
  });

  it('9 slots', () => {
    expect(slotsIn()).toBe(9);
  });
});

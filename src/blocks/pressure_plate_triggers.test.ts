import { describe, it, expect } from 'vitest';
import { signalStrength } from './pressure_plate_triggers';

describe('pressure plate triggers', () => {
  it('wood triggers on any entity', () => {
    expect(signalStrength({ plate: 'wood', entities: [{ kind: 'projectile', count: 1 }] })).toBe(
      15,
    );
  });

  it('stone mobs only', () => {
    expect(signalStrength({ plate: 'stone', entities: [{ kind: 'projectile', count: 1 }] })).toBe(
      0,
    );
    expect(signalStrength({ plate: 'stone', entities: [{ kind: 'mob', count: 1 }] })).toBe(15);
  });

  it('blackstone players only', () => {
    expect(
      signalStrength({ plate: 'polished_blackstone', entities: [{ kind: 'mob', count: 1 }] }),
    ).toBe(0);
    expect(
      signalStrength({ plate: 'polished_blackstone', entities: [{ kind: 'player', count: 1 }] }),
    ).toBe(15);
  });

  it('iron scales', () => {
    expect(signalStrength({ plate: 'iron', entities: [{ kind: 'mob', count: 10 }] })).toBe(1);
    expect(signalStrength({ plate: 'iron', entities: [{ kind: 'mob', count: 150 }] })).toBe(15);
  });

  it('gold 1:1 capped 15', () => {
    expect(signalStrength({ plate: 'gold', entities: [{ kind: 'mob', count: 3 }] })).toBe(3);
    expect(signalStrength({ plate: 'gold', entities: [{ kind: 'mob', count: 20 }] })).toBe(15);
  });
});

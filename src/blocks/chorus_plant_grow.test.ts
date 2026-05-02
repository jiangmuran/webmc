import { describe, it, expect } from 'vitest';
import { chorusGrow, chorusTeleport, MAX_HEIGHT } from './chorus_plant_grow';

describe('chorus plant', () => {
  it('stops at max height', () => {
    expect(
      chorusGrow({ heightBelow: MAX_HEIGHT, neighborsHorizontal: 0, rand: () => 0 }).kind,
    ).toBe('stop');
  });

  it('stops when 2 neighbors', () => {
    expect(chorusGrow({ heightBelow: 1, neighborsHorizontal: 2, rand: () => 0 }).kind).toBe('stop');
  });

  it('branch when roll below threshold', () => {
    expect(chorusGrow({ heightBelow: 1, neighborsHorizontal: 0, rand: () => 0 }).kind).toBe(
      'branch',
    );
  });

  it('grow up when above threshold', () => {
    expect(chorusGrow({ heightBelow: 1, neighborsHorizontal: 0, rand: () => 0.99 }).kind).toBe(
      'grow_up',
    );
  });
});

describe('chorus teleport', () => {
  it('finds valid landing', () => {
    const r = chorusTeleport({
      from: { x: 0, y: 64, z: 0 },
      rand: () => 0.5,
      validLanding: () => true,
    });
    expect(r).not.toBeNull();
  });

  it('null when no landing', () => {
    const r = chorusTeleport({
      from: { x: 0, y: 0, z: 0 },
      rand: () => 0.5,
      validLanding: () => false,
    });
    expect(r).toBeNull();
  });

  it('range is ±8 inclusive on each axis (wiki: 17-value cube)', () => {
    // The teleport offset must be able to hit -8 AND +8 on each axis.
    let sawNeg8 = false;
    let sawPos8 = false;
    let i = 0;
    const seq = [0, 0.999999, 0.5, 0, 0, 0, 0, 0, 0, 0.999999, 0.5, 0.5, 0, 0, 0, 0, 0, 0];
    chorusTeleport({
      from: { x: 0, y: 64, z: 0 },
      rand: () => seq[i++ % seq.length] ?? 0,
      validLanding: (x) => {
        if (x === -8) sawNeg8 = true;
        if (x === 8) sawPos8 = true;
        return false;
      },
    });
    expect(sawNeg8).toBe(true);
    expect(sawPos8).toBe(true);
  });
});

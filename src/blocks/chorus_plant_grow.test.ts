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
});

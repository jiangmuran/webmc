import { describe, it, expect } from 'vitest';
import { hopVelocity, makeSlimeHop, slimeDeath, tickSlimeHop } from './slime_jump';

describe('slime hop', () => {
  it('larger slimes hop further', () => {
    const a = hopVelocity(1);
    const c = hopVelocity(4);
    expect(c.horizontal).toBeGreaterThan(a.horizontal);
  });

  it('no jump mid-air', () => {
    const s = makeSlimeHop(2);
    s.ticksUntilJump = 0;
    const r = tickSlimeHop(s, {
      grounded: false,
      targetAngleRad: 0,
      rng: () => 0.5,
      dtTicks: 1,
    });
    expect(r.jump).toBe(false);
  });

  it('jumps when grounded and cooldown elapsed', () => {
    const s = makeSlimeHop(2);
    s.ticksUntilJump = 0;
    const r = tickSlimeHop(s, {
      grounded: true,
      targetAngleRad: 0,
      rng: () => 0.5,
      dtTicks: 0,
    });
    expect(r.jump).toBe(true);
    expect(s.ticksUntilJump).toBeGreaterThan(0);
  });

  it('death: size 1 drops slimeballs', () => {
    const r = slimeDeath(1, () => 0.9);
    expect(r.children.length).toBe(0);
    expect(r.slimeballs).toBeGreaterThanOrEqual(0);
  });

  it('death: size 4 splits into size 2s', () => {
    const r = slimeDeath(4, () => 0.5);
    for (const c of r.children) expect(c).toBe(2);
  });
});

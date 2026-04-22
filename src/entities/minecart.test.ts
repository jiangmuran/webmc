import { describe, it, expect } from 'vitest';
import { tickMinecart, type Minecart, type RailKind, type RailLookup } from './minecart';

class FlatRail implements RailLookup {
  constructor(
    private readonly kind: RailKind,
    private readonly powered: boolean,
  ) {}
  railAt(): RailKind | null {
    return this.kind;
  }
  isPowered(): boolean {
    return this.powered;
  }
}

class NoRail implements RailLookup {
  railAt(): RailKind | null {
    return null;
  }
  isPowered(): boolean {
    return false;
  }
}

function cart(vx = 0, vz = 0): Minecart {
  return {
    id: 1,
    position: { x: 0.5, y: 0.1, z: 0.5 },
    velocity: { x: vx, y: 0, z: vz },
  };
}

describe('minecart', () => {
  it('accelerates along a powered flat rail', () => {
    const rails = new FlatRail('flat_ew', true);
    const c = cart(0.1, 0); // gentle push east
    for (let i = 0; i < 10; i++) tickMinecart(c, 1 / 20, rails);
    expect(c.velocity.x).toBeGreaterThan(0.1);
    expect(c.position.x).toBeGreaterThan(0.5);
  });

  it('decelerates on an unpowered rail', () => {
    const rails = new FlatRail('flat_ew', false);
    const c = cart(5, 0);
    for (let i = 0; i < 40; i++) tickMinecart(c, 1 / 20, rails);
    expect(c.velocity.x).toBeLessThan(5);
  });

  it('stays snapped to the rail axis', () => {
    const rails = new FlatRail('flat_ns', true);
    const c = cart(2, 2);
    tickMinecart(c, 1 / 20, rails);
    expect(Math.abs(c.velocity.x)).toBeLessThan(0.01);
    expect(c.velocity.z).not.toBe(0);
  });

  it('falls under gravity off-rail', () => {
    const rails = new NoRail();
    const c = cart();
    for (let i = 0; i < 10; i++) tickMinecart(c, 1 / 20, rails);
    expect(c.velocity.y).toBeLessThan(0);
  });

  it('ascending rail pushes the cart upward', () => {
    const rails = new FlatRail('ascending_e', true);
    const c = cart(1, 0);
    for (let i = 0; i < 30; i++) tickMinecart(c, 1 / 20, rails);
    expect(c.position.y).toBeGreaterThan(0.1);
  });

  it('respects the 8 block/sec max speed', () => {
    const rails = new FlatRail('flat_ew', true);
    const c = cart(0.1, 0);
    for (let i = 0; i < 100; i++) tickMinecart(c, 1 / 20, rails);
    expect(Math.abs(c.velocity.x)).toBeLessThanOrEqual(8.001);
  });
});

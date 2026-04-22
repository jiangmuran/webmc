import { describe, it, expect } from 'vitest';
import { ItemRegistry } from '@/items/item';
import { Inventory } from '@/items/Inventory';
import { MAX_HEALTH, MAX_HUNGER, PlayerState } from './PlayerState';

function build(): PlayerState {
  const r = new ItemRegistry();
  r.register({ name: 'webmc:apple', maxStack: 64, durability: 0 });
  const inv = new Inventory(r);
  return new PlayerState({ inventory: inv });
}

describe('PlayerState', () => {
  it('starts at full health and hunger', () => {
    const p = build();
    expect(p.health).toBe(MAX_HEALTH);
    expect(p.hunger).toBe(MAX_HUNGER);
    expect(p.isDead).toBe(false);
  });

  it('takeDamage reduces health and triggers respawn at zero', () => {
    const p = build();
    p.takeDamage({ amount: 5 });
    expect(p.health).toBe(15);
    p.takeDamage({ amount: 100 });
    // Lethal damage immediately triggers respawn → back to full HP.
    expect(p.health).toBe(MAX_HEALTH);
    expect(p.isDead).toBe(false);
  });

  it('eat restores hunger + saturation without exceeding caps', () => {
    const p = build();
    p.hunger = 10;
    p.saturation = 0;
    p.eat(8, 6);
    expect(p.hunger).toBe(18);
    expect(p.saturation).toBe(6);
    p.eat(50, 50);
    expect(p.hunger).toBe(MAX_HUNGER);
    expect(p.saturation).toBeLessThanOrEqual(MAX_HUNGER);
  });

  it('tick regenerates HP when hunger high and saturation > 0', () => {
    const p = build();
    p.health = 10;
    p.hunger = MAX_HUNGER;
    p.saturation = 5;
    p.tick(5);
    expect(p.health).toBeGreaterThan(10);
  });

  it('sprinting drains hunger faster', () => {
    const a = build();
    const b = build();
    a.sprinting = true;
    a.saturation = 0;
    b.saturation = 0;
    a.tick(10);
    b.tick(10);
    expect(a.hunger).toBeLessThan(b.hunger);
  });

  it('respawn resets health, hunger, and clears inventory', () => {
    const p = build();
    p.inventory.add({ itemId: 1, count: 5, damage: 0 });
    p.health = 0;
    p.respawn();
    expect(p.health).toBe(MAX_HEALTH);
    expect(p.inventory.count(1)).toBe(0);
  });

  it('dead player ignores further damage', () => {
    const p = build();
    p.health = 0;
    p.takeDamage({ amount: 5 });
    expect(p.health).toBe(0);
  });

  it('lava contact deals continuous damage', () => {
    const p = build();
    const before = p.health;
    p.tick(1, { inFluid: 'lava' });
    expect(p.health).toBeLessThan(before);
  });

  it('breath drains underwater and damages after depletion', () => {
    const p = build();
    p.breath = 0.5;
    p.tick(1, { inFluid: 'water' });
    expect(p.breath).toBe(0);
    expect(p.health).toBeLessThan(MAX_HEALTH);
  });

  it('breath refills out of water', () => {
    const p = build();
    p.breath = 0;
    p.tick(2, { inFluid: null });
    expect(p.breath).toBeGreaterThan(0);
  });
});

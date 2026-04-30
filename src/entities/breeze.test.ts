import { describe, it, expect } from 'vitest';
import { BREEZE_MAX_HEALTH, breezeDrops, damageBreeze, makeBreeze, tickBreeze } from './breeze';

describe('breeze', () => {
  it('starts at max health, idle', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    expect(b.health).toBe(BREEZE_MAX_HEALTH);
    expect(b.stance).toBe('idle');
  });

  it('jumps when target close', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    b.target = { x: 3, y: 0, z: 0 };
    const r = tickBreeze(b, 0.1);
    expect(r.shouldJump).toBe(true);
    expect(b.velocity.y).toBeGreaterThan(0);
  });

  it('shoots when target in mid range', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    b.target = { x: 15, y: 0, z: 0 };
    const r = tickBreeze(b, 0.1);
    expect(r.shouldShoot).toBe(true);
  });

  it('does nothing past shoot range', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    b.target = { x: 100, y: 0, z: 0 };
    const r = tickBreeze(b, 0.1);
    expect(r.shouldShoot).toBe(false);
    expect(r.shouldJump).toBe(false);
  });

  it('damage reduces health; kill transitions to dying', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    damageBreeze(b, 10);
    expect(b.health).toBe(20);
    damageBreeze(b, 100);
    expect(b.stance).toBe('dying');
  });

  it('dying breeze stops ticking', () => {
    const b = makeBreeze(1, { x: 0, y: 0, z: 0 });
    damageBreeze(b, 999);
    const r = tickBreeze(b, 0.1);
    expect(r.shouldShoot).toBe(false);
    expect(r.shouldJump).toBe(false);
  });

  it('drops breeze rod', () => {
    const d = breezeDrops(0);
    expect(d[0]?.item).toBe('webmc:breeze_rod');
  });

  it('drops 1-2 base (wiki quantity=1-2)', () => {
    expect(breezeDrops(0, () => 0)[0]?.count).toBe(1);
    expect(breezeDrops(0, () => 0.999)[0]?.count).toBe(2);
  });

  it('Looting +1-2 per level (wiki lootingquantity=1-2)', () => {
    // Looting III at min roll: 1 + 1+1+1 = 4. At max: 2 + 2+2+2 = 8.
    expect(breezeDrops(3, () => 0)[0]?.count).toBe(4);
    expect(breezeDrops(3, () => 0.999)[0]?.count).toBe(8);
  });
});

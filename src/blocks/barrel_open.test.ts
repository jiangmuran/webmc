import { describe, it, expect } from 'vitest';
import {
  asInventoryLike,
  BARREL_SLOTS,
  breakBarrel,
  closeBarrel,
  isOpen,
  makeBarrel,
  openBarrel,
} from './barrel_open';

describe('barrel', () => {
  it('has 27 slots', () => {
    expect(makeBarrel().slots.length).toBe(BARREL_SLOTS);
  });

  it('open/close tracks viewers', () => {
    const b = makeBarrel();
    expect(openBarrel(b, 'p1')).toBe(true);
    expect(isOpen(b)).toBe(true);
    expect(closeBarrel(b, 'p1')).toBe(true);
    expect(isOpen(b)).toBe(false);
  });

  it('double-open by same player = no-op', () => {
    const b = makeBarrel();
    openBarrel(b, 'p1');
    expect(openBarrel(b, 'p1')).toBe(false);
  });

  it('break drops barrel + contents', () => {
    const b = makeBarrel();
    b.slots[0] = { item: 'webmc:diamond', count: 3, damage: 0 };
    const drops = breakBarrel(b);
    expect(drops.find((d) => d.item === 'webmc:barrel')).toBeDefined();
    expect(drops.find((d) => d.item === 'webmc:diamond')?.count).toBe(3);
  });

  it('adapter exposes inventory', () => {
    const b = makeBarrel();
    const inv = asInventoryLike(b);
    expect(inv.slots.length).toBe(BARREL_SLOTS);
    expect(inv.maxStack('webmc:any')).toBe(64);
  });
});

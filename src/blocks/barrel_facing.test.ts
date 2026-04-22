import { describe, it, expect } from 'vitest';
import {
  facingForPlacement,
  makeBarrel,
  openBarrel,
  closeBarrel,
  BARREL_SIZE,
} from './barrel_facing';

describe('barrel', () => {
  it('faces opposite to click', () => {
    expect(facingForPlacement('up')).toBe('down');
    expect(facingForPlacement('north')).toBe('south');
  });

  it('27 slots', () => {
    const b = makeBarrel('up');
    expect(b.slots.length).toBe(BARREL_SIZE);
  });

  it('opens when unobstructed', () => {
    const b = makeBarrel('up');
    expect(openBarrel(b, false)).toBe('opened');
    expect(b.open).toBe(true);
  });

  it('blocked by obstruction', () => {
    const b = makeBarrel('up');
    expect(openBarrel(b, true)).toBe('blocked');
    expect(b.open).toBe(false);
  });

  it('close', () => {
    const b = makeBarrel('up');
    openBarrel(b, false);
    closeBarrel(b);
    expect(b.open).toBe(false);
  });
});

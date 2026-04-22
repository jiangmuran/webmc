import { describe, it, expect } from 'vitest';
import { makeCauldron, fill, drawBottle } from './cauldron_level';

describe('cauldron', () => {
  it('bucket fills to 3', () => {
    const c = makeCauldron();
    expect(fill(c, { kind: 'water_bucket' })).toBe(true);
    expect(c.level).toBe(3);
  });

  it('bottle fills by 1', () => {
    const c = makeCauldron();
    fill(c, { kind: 'water_bottle' });
    fill(c, { kind: 'water_bottle' });
    expect(c.level).toBe(2);
  });

  it('cannot mix water and lava', () => {
    const c = makeCauldron();
    fill(c, { kind: 'water_bucket' });
    expect(fill(c, { kind: 'lava_bucket' })).toBe(false);
  });

  it('potion must match', () => {
    const c = makeCauldron();
    expect(fill(c, { kind: 'potion', sig: 'heal' })).toBe(true);
    expect(fill(c, { kind: 'potion', sig: 'speed' })).toBe(false);
    expect(fill(c, { kind: 'potion', sig: 'heal' })).toBe(true);
  });

  it('draw bottle decrements', () => {
    const c = makeCauldron();
    fill(c, { kind: 'water_bucket' });
    drawBottle(c);
    expect(c.level).toBe(2);
  });

  it('cannot bottle lava', () => {
    const c = makeCauldron();
    fill(c, { kind: 'lava_bucket' });
    expect(drawBottle(c)).toBeNull();
  });
});

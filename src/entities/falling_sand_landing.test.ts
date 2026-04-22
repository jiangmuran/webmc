import { describe, it, expect } from 'vitest';
import {
  landFalling,
  anvilDamage,
  anvilShouldCrack,
  degradeAnvil,
  ANVIL_MAX_DAMAGE,
} from './falling_sand_landing';

describe('falling landing', () => {
  it('places on replaceable cell', () => {
    const r = landFalling({ blockId: 'webmc:sand', cellReplaceable: true, fallDistance: 3 });
    expect(r.kind).toBe('place');
  });
  it('drops when blocked', () => {
    const r = landFalling({ blockId: 'webmc:sand', cellReplaceable: false, fallDistance: 3 });
    expect(r.kind).toBe('drop_item');
  });
});

describe('anvil', () => {
  it('no damage for tiny fall', () => {
    expect(anvilDamage(0.5)).toBe(0);
  });
  it('damage scales', () => {
    expect(anvilDamage(5)).toBe(8);
  });
  it('capped', () => {
    expect(anvilDamage(1000)).toBe(ANVIL_MAX_DAMAGE);
  });
  it('crack chance', () => {
    expect(anvilShouldCrack(() => 0)).toBe(true);
    expect(anvilShouldCrack(() => 0.99)).toBe(false);
  });
  it('degrade chain', () => {
    expect(degradeAnvil('webmc:anvil')).toBe('webmc:chipped_anvil');
    expect(degradeAnvil('webmc:damaged_anvil')).toBeNull();
    expect(degradeAnvil('webmc:stone')).toBe('webmc:stone');
  });
});

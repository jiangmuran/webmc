import { describe, it, expect } from 'vitest';
import { tryFormConcrete, landingConversion } from './concrete_form';

const noWater = {
  up: false,
  down: false,
  north: false,
  south: false,
  east: false,
  west: false,
};

describe('concrete', () => {
  it('no water = no convert', () => {
    expect(tryFormConcrete({ neighborWater: noWater, powderColor: 'red' }).converted).toBe(false);
  });

  it('side water = convert', () => {
    const r = tryFormConcrete({
      neighborWater: { ...noWater, east: true },
      powderColor: 'blue',
    });
    expect(r.converted).toBe(true);
    expect(r.newBlockId).toBe('webmc:blue_concrete');
  });

  it('only above water does not convert', () => {
    expect(
      tryFormConcrete({ neighborWater: { ...noWater, up: true }, powderColor: 'red' }).converted,
    ).toBe(false);
  });

  it('landing conversion', () => {
    expect(landingConversion(true, 'red')).toBe('webmc:red_concrete');
    expect(landingConversion(false, 'red')).toBe('webmc:red_concrete_powder');
  });
});

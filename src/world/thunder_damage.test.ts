import { describe, it, expect } from 'vitest';
import { isThunderstorm, onLightningStrike, ignitesBlockAt } from './thunder_damage';

describe('thunder damage', () => {
  it('no thunder without rain', () => {
    expect(isThunderstorm({ isRaining: false, rand: () => 0 })).toBe(false);
  });

  it('thunder on tiny roll', () => {
    expect(isThunderstorm({ isRaining: true, rand: () => 0 })).toBe(true);
  });

  it('strike creeper charges', () => {
    expect(onLightningStrike('creeper')).toEqual({ kind: 'charge_creeper' });
  });

  it('strike pig converts', () => {
    expect(onLightningStrike('pig')).toEqual({ kind: 'convert', into: 'zombified_piglin' });
  });

  it('strike villager makes witch', () => {
    expect(onLightningStrike('villager')).toEqual({ kind: 'convert', into: 'witch' });
  });

  it('strike cow damage', () => {
    const r = onLightningStrike('cow');
    expect(r.kind).toBe('damage');
  });

  it('ignites treetop only', () => {
    expect(ignitesBlockAt(true)).toBe(true);
    expect(ignitesBlockAt(false)).toBe(false);
  });
});

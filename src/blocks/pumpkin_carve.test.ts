import { describe, it, expect } from 'vitest';
import {
  carvePumpkin,
  lightEmission,
  makeJackOLantern,
  preventsEndermanAggro,
} from './pumpkin_carve';

describe('pumpkin carve', () => {
  it('carving drops 4 seeds', () => {
    const r = carvePumpkin('north');
    expect(r.seedDrops).toBe(4);
    expect(r.state.facing).toBe('north');
  });

  it('placing torch inside makes jack-o-lantern', () => {
    const { state } = carvePumpkin('east');
    expect(makeJackOLantern(state)).toBe(true);
    expect(lightEmission(state)).toBe(15);
  });

  it('already-jack refuses second torch', () => {
    const { state } = carvePumpkin('east');
    makeJackOLantern(state);
    expect(makeJackOLantern(state)).toBe(false);
  });

  it('carved pumpkin head prevents enderman aggro', () => {
    expect(preventsEndermanAggro('webmc:carved_pumpkin')).toBe(true);
    expect(preventsEndermanAggro('webmc:iron_helmet')).toBe(false);
  });
});

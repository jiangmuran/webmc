import { describe, it, expect } from 'vitest';
import { FLOWER_FIXED_COLORS, plantColor, usesGrassTint } from './flower_biome_tint';

describe('flower biome tint', () => {
  it('tall grass tints with biome', () => {
    const plains = plantColor('webmc:tall_grass', 'plains');
    const swamp = plantColor('webmc:tall_grass', 'swamp');
    expect(plains).not.toEqual(swamp);
  });

  it('dandelion has fixed color', () => {
    expect(plantColor('webmc:dandelion', 'plains')).toEqual(FLOWER_FIXED_COLORS['webmc:dandelion']);
  });

  it('unknown block defaults to white', () => {
    expect(plantColor('webmc:xyz', 'plains')).toEqual([255, 255, 255]);
  });

  it('vine uses grass tint', () => {
    expect(usesGrassTint('webmc:vine')).toBe(true);
  });

  it('poppy does not use grass tint', () => {
    expect(usesGrassTint('webmc:poppy')).toBe(false);
  });
});

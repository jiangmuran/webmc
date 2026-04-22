// Firework star. Crafted from a dye + gunpowder + optional shape item
// (+ trail/flicker modifiers). Stars are stuffed into a firework rocket
// to make it detonate with custom colors and shape.

export type FireworkShape = 'small' | 'large' | 'star' | 'creeper' | 'burst';

export interface FireworkStar {
  shape: FireworkShape;
  colors: readonly [number, number, number][];
  fadeColors: readonly [number, number, number][];
  trail: boolean;
  twinkle: boolean;
}

export interface FireworkStarQuery {
  shape: FireworkShape;
  dyeRgbs: readonly [number, number, number][];
  fadeDyeRgbs?: readonly [number, number, number][];
  glowstoneDust: boolean; // adds twinkle
  diamond: boolean; // adds trail
}

export function makeFireworkStar(q: FireworkStarQuery): FireworkStar {
  return {
    shape: q.shape,
    colors: q.dyeRgbs.length > 0 ? [...q.dyeRgbs] : [[255, 255, 255]],
    fadeColors: q.fadeDyeRgbs ?? [],
    trail: q.diamond,
    twinkle: q.glowstoneDust,
  };
}

// Compose multiple stars into a final firework rocket's detonation params.
export interface RocketDetonationSpec {
  stars: readonly FireworkStar[];
}

export function composeDetonation(stars: readonly FireworkStar[]): RocketDetonationSpec {
  return { stars: [...stars] };
}

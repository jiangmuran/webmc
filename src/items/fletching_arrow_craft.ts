// Arrow crafting. 1 flint + 1 stick + 1 feather → 4 arrows.

export interface ArrowRecipe {
  flint: number;
  stick: number;
  feather: number;
}

export function canCraftArrows(r: ArrowRecipe): boolean {
  return r.flint >= 1 && r.stick >= 1 && r.feather >= 1;
}

export function arrowYield(): number {
  return 4;
}

// Spectral arrows: 4 arrows + 1 glowstone dust in '+' → 4 spectral.
export function canCraftSpectral(arrows: number, glowstone: number): boolean {
  return arrows >= 4 && glowstone >= 1;
}

export function spectralYield(): number {
  return 2; // crafting table recipe yields 2 in MC
}

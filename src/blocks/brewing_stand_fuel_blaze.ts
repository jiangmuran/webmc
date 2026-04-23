export interface BrewingFuel {
  blazePowderRemaining: number;
  brewsPerPowder: number;
}

export const BREWS_PER_POWDER = 20;

export function canBrew(b: BrewingFuel): boolean {
  return b.blazePowderRemaining > 0 || b.brewsPerPowder > 0;
}

export function consumeOneBrew(b: BrewingFuel): BrewingFuel {
  if (b.brewsPerPowder > 0) return { ...b, brewsPerPowder: b.brewsPerPowder - 1 };
  if (b.blazePowderRemaining > 0) {
    return {
      blazePowderRemaining: b.blazePowderRemaining - 1,
      brewsPerPowder: BREWS_PER_POWDER - 1,
    };
  }
  return b;
}

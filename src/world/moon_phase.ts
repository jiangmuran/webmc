// Moon phase. Cycles every 8 nights (8 days). Affects slime spawning
// in swamps and mob HP in some versions.

export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function phaseForDay(dayCount: number): MoonPhase {
  return (((dayCount % 8) + 8) % 8) as MoonPhase;
}

// Full moon boosts slime spawning in swamps.
export function slimeSpawnMultiplier(phase: MoonPhase): number {
  if (phase === 0) return 1.0; // full
  if (phase === 4) return 0.0; // new
  return 0.5;
}

export function isFullMoon(phase: MoonPhase): boolean {
  return phase === 0;
}

export function isNewMoon(phase: MoonPhase): boolean {
  return phase === 4;
}

// Moon phase. Cycles every 8 nights (8 days). Affects slime spawning
// in swamps and mob HP in some versions.

export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function phaseForDay(dayCount: number): MoonPhase {
  return (((dayCount % 8) + 8) % 8) as MoonPhase;
}

// Wiki (minecraft.wiki/w/Slime#Swamps): "[Slimes] spawn most often
// on a full moon, and never on a new moon. If the fraction of the
// moon that is bright is greater than a random number (from 0 to 1),
// [the spawn check passes]."
//
// The "fraction of the moon that is bright" follows the wiki's 8-
// phase cycle:
//   Phase 0 (full):            1.0
//   Phase 1 (waning gibbous):  0.75
//   Phase 2 (last quarter):    0.5
//   Phase 3 (waning crescent): 0.25
//   Phase 4 (new):             0.0
//   Phase 5 (waxing crescent): 0.25
//   Phase 6 (first quarter):   0.5
//   Phase 7 (waxing gibbous):  0.75
//
// Old function returned 0.5 for every non-full / non-new phase,
// flattening the wiki's 4-step brightness curve into a step function.
// Crescent phases (canon: 0.25) read as 0.5 — 2× over wiki — while
// gibbous phases (canon: 0.75) read as 0.5 — 33% under wiki.
const MOON_BRIGHTNESS: Record<MoonPhase, number> = {
  0: 1.0,
  1: 0.75,
  2: 0.5,
  3: 0.25,
  4: 0.0,
  5: 0.25,
  6: 0.5,
  7: 0.75,
};

export function slimeSpawnMultiplier(phase: MoonPhase): number {
  return MOON_BRIGHTNESS[phase];
}

export function isFullMoon(phase: MoonPhase): boolean {
  return phase === 0;
}

export function isNewMoon(phase: MoonPhase): boolean {
  return phase === 4;
}

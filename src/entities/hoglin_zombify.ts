// Wiki (minecraft.wiki/w/Hoglin#Zombification): "Hoglins in the
// Overworld or End shake and convert into zoglins after 15 seconds
// (300 game ticks)." A previous fix mistakenly inflated this to 6000
// ticks (5 minutes) — 20× too long. Sibling hoglin_zoglin.ts uses
// the correct 15 s; restoring the canonical 300 here.
export const ZOMBIFY_TICKS = 300;

export interface HoglinState {
  inOverworld: boolean;
  zombifyingTicks: number;
}

export function tickZombify(s: HoglinState): HoglinState {
  if (!s.inOverworld) return { ...s, zombifyingTicks: 0 };
  return { ...s, zombifyingTicks: s.zombifyingTicks + 1 };
}

export function shouldConvertToZoglin(s: HoglinState): boolean {
  return s.inOverworld && s.zombifyingTicks >= ZOMBIFY_TICKS;
}

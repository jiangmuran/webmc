// Wiki (minecraft.wiki/w/Hoglin): "Hoglins in the Overworld will
// zombify into zoglins after 300 seconds (6000 game ticks)." Old
// constant 300 was the same ticks-as-seconds confusion already
// fixed in siblings hoglin_zoglin.ts and piglin_brute.ts —
// 300 ticks = 15 seconds, 20× shorter than the wiki's 300 s.
export const ZOMBIFY_TICKS = 6000;

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

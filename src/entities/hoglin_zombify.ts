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

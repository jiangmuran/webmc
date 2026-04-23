export const HATCH_TICKS_NORMAL = 24000 * 10;
export const HATCH_TICKS_MOSS = 24000 * 5;

export interface SnifferEgg {
  onMoss: boolean;
  tickAge: number;
  cracks: 0 | 1 | 2;
}

export function tickEgg(e: SnifferEgg): SnifferEgg {
  const limit = e.onMoss ? HATCH_TICKS_MOSS : HATCH_TICKS_NORMAL;
  const age = e.tickAge + 1;
  const frac = age / limit;
  const cracks: 0 | 1 | 2 = frac >= 1 ? 2 : frac >= 2 / 3 ? 2 : frac >= 1 / 3 ? 1 : 0;
  return { ...e, tickAge: age, cracks };
}

export function isReady(e: SnifferEgg): boolean {
  const limit = e.onMoss ? HATCH_TICKS_MOSS : HATCH_TICKS_NORMAL;
  return e.tickAge >= limit;
}

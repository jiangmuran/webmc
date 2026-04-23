export type RaiderType = 'vindicator' | 'pillager' | 'witch' | 'evoker' | 'ravager';

export interface WaveSpec {
  waveIndex: number;
  isBadOmenII: boolean;
}

export function waveComposition(spec: WaveSpec): Record<RaiderType, number> {
  const base: Record<RaiderType, number> = {
    vindicator: 0,
    pillager: 0,
    witch: 0,
    evoker: 0,
    ravager: 0,
  };
  const w = spec.waveIndex;
  base.pillager = w <= 1 ? 3 : w <= 3 ? 5 : 7;
  base.vindicator = w === 0 ? 0 : w === 1 ? 2 : 3;
  if (w >= 2) base.witch = 1;
  if (w >= 3) base.evoker = 1;
  if (w >= 4) base.ravager = 1;
  if (spec.isBadOmenII) {
    base.pillager += 2;
    base.vindicator += 1;
  }
  return base;
}

export function totalMobs(spec: WaveSpec): number {
  const c = waveComposition(spec);
  return c.vindicator + c.pillager + c.witch + c.evoker + c.ravager;
}

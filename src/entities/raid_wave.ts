// Pillager raid wave scheduler. A raid consists of multiple waves of
// illagers; each wave's composition scales with difficulty and wave
// index. Bad Omen level determines the number of waves.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

// Wiki (minecraft.wiki/w/Raid): base waves are 3 (Easy), 5 (Normal),
// 7 (Hard). Bad Omen levels above 1 each contribute 1 BONUS wave —
// so BadOmen V on Hard yields 7 + 4 = 11 waves. Old formula used
// floor(omen/2) which under-counts bonuses for odd omen levels.
export function wavesForOmenLevel(omen: number, diff: Difficulty): number {
  if (diff === 'peaceful') return 0;
  const base = diff === 'easy' ? 3 : diff === 'normal' ? 5 : 7;
  return base + Math.max(0, omen - 1);
}

export interface WaveComposition {
  pillagers: number;
  vindicators: number;
  evokers: number;
  witches: number;
  ravagers: number;
  ravagerRiders: number; // vindicators riding ravagers
}

export function waveComposition(waveIndex: number, diff: Difficulty): WaveComposition {
  const diffMult = diff === 'easy' ? 1 : diff === 'normal' ? 1.5 : 2;
  const base: WaveComposition = {
    pillagers: 2 + Math.floor(waveIndex * 1.2),
    vindicators: waveIndex >= 2 ? 1 + Math.floor(waveIndex * 0.5) : 0,
    evokers: waveIndex >= 4 ? 1 : 0,
    witches: waveIndex >= 3 ? 1 : 0,
    ravagers: waveIndex >= 4 ? 1 : 0,
    ravagerRiders: waveIndex >= 5 ? 1 : 0,
  };
  return {
    pillagers: Math.round(base.pillagers * diffMult),
    vindicators: Math.round(base.vindicators * diffMult),
    evokers: base.evokers,
    witches: base.witches,
    ravagers: base.ravagers,
    ravagerRiders: base.ravagerRiders,
  };
}

export function isFinalWave(waveIndex: number, totalWaves: number): boolean {
  return waveIndex + 1 === totalWaves;
}

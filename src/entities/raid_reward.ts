export interface VictoryCtx {
  wavesCleared: number;
  difficulty: 'easy' | 'normal' | 'hard';
  heroOfVillageApplied: boolean;
}

export function grantsHeroEffect(c: VictoryCtx): boolean {
  return c.wavesCleared > 0 && !c.heroOfVillageApplied;
}

export function villagerGiftsOffered(c: VictoryCtx): boolean {
  return c.heroOfVillageApplied;
}

export function finalWaveWasCaptain(c: VictoryCtx): boolean {
  return c.wavesCleared >= (c.difficulty === 'hard' ? 7 : c.difficulty === 'normal' ? 5 : 3);
}

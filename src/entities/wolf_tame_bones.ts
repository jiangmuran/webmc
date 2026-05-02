export interface Wolf {
  tameProgress: number;
  isTamed: boolean;
}

// Wiki (minecraft.wiki/w/Wolf#Taming): "Each bone fed has a 1/3 chance
// of taming the wolf." Old TAME_THRESHOLD=3 required 3 separate
// 33%-roll successes (~9 bones in expectation) to tame, vs the wiki's
// single roll (~3 bones in expectation). Siblings wolf_tame_progress.ts
// and wolf_tame_progression.ts already implement the single-roll
// model; aligning this copy at threshold 1.
export const TAME_THRESHOLD = 1;
export const BONE_TAME_CHANCE = 1 / 3;

export function onFeedBone(w: Wolf, rng: () => number): Wolf {
  if (w.isTamed) return w;
  const lucky = rng() < BONE_TAME_CHANCE;
  const progress = w.tameProgress + (lucky ? 1 : 0);
  return {
    ...w,
    tameProgress: progress,
    isTamed: progress >= TAME_THRESHOLD,
  };
}

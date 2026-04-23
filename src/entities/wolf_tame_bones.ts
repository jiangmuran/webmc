export interface Wolf {
  tameProgress: number;
  isTamed: boolean;
}

export const TAME_THRESHOLD = 3;
export const BONE_TAME_CHANCE = 0.333;

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

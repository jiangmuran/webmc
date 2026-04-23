// Animal love mode. Feeding breed-food sets love state; two loving
// animals in range produce a baby with 5-minute cooldown.

export interface AnimalLove {
  inLoveUntilTick: number;
  breedCooldownUntilTick: number;
}

export const LOVE_DURATION_TICKS = 600;
export const BREED_COOLDOWN_TICKS = 6000;
export const BREED_RANGE = 8;

export function feed(a: AnimalLove, nowTick: number): AnimalLove {
  if (nowTick < a.breedCooldownUntilTick) return a;
  return { ...a, inLoveUntilTick: nowTick + LOVE_DURATION_TICKS };
}

export function isInLove(a: AnimalLove, nowTick: number): boolean {
  return nowTick < a.inLoveUntilTick;
}

export function canBreed(a: AnimalLove, b: AnimalLove, distance: number, nowTick: number): boolean {
  if (distance > BREED_RANGE) return false;
  return isInLove(a, nowTick) && isInLove(b, nowTick);
}

export function onBreedComplete(_a: AnimalLove, nowTick: number): AnimalLove {
  return {
    inLoveUntilTick: 0,
    breedCooldownUntilTick: nowTick + BREED_COOLDOWN_TICKS,
  };
}

export const BABY_GROW_TICKS = 24000;

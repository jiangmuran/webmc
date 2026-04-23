export interface Baby {
  ageTicks: number;
  recentlyFedTicks: number;
}

export const DEFAULT_GROW_TIME = 24000;
export const BREED_FEED_REDUCE_PERCENT = 0.1;

export function timeUntilAdult(b: Baby): number {
  const reduction = Math.max(0, b.recentlyFedTicks) * BREED_FEED_REDUCE_PERCENT;
  return Math.max(0, DEFAULT_GROW_TIME - b.ageTicks - reduction);
}

export function isAdult(b: Baby): boolean {
  return timeUntilAdult(b) === 0;
}

export function rideableAsBaby(mob: string): boolean {
  return mob === 'chicken';
}

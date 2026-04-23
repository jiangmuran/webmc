export interface GolemState {
  ticksSinceLastGift: number;
  hasVillagers: boolean;
}

export const GIFT_INTERVAL_MIN = 400;
export const GIFT_INTERVAL_MAX = 4000;

export function shouldGiveRose(s: GolemState, rng: () => number): boolean {
  if (!s.hasVillagers) return false;
  const threshold = GIFT_INTERVAL_MIN + Math.floor(rng() * (GIFT_INTERVAL_MAX - GIFT_INTERVAL_MIN));
  return s.ticksSinceLastGift >= threshold;
}

export function itemOffered(): string {
  return 'poppy';
}

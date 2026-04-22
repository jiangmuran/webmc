// Banner-on-shield. Crafting a banner + shield (same color as base)
// applies the banner's design to the shield. The banner is consumed;
// the shield keeps the 16-layer pattern stack and re-renders it.

import type { BannerStack } from '@/items/banner_patterns';

export interface ShieldState {
  banner: BannerStack | null;
  durability: number;
  disabledTicks: number;
}

export interface ApplyBannerQuery {
  shield: ShieldState;
  banner: BannerStack;
}

export interface ApplyBannerResult {
  accepted: boolean;
  reason?: 'already_has_banner';
}

export function applyBannerToShield(q: ApplyBannerQuery): ApplyBannerResult {
  if (q.shield.banner !== null) return { accepted: false, reason: 'already_has_banner' };
  q.shield.banner = { ...q.banner, layers: [...q.banner.layers] };
  return { accepted: true };
}

// Scraping off: a cauldron with water strips the banner back to a plain
// shield, returning the banner (only if the shield had one).
export interface StripBannerResult {
  stripped: boolean;
  returnedBanner: BannerStack | null;
}

export function stripShieldBanner(shield: ShieldState): StripBannerResult {
  if (shield.banner === null) return { stripped: false, returnedBanner: null };
  const returned = shield.banner;
  shield.banner = null;
  return { stripped: true, returnedBanner: returned };
}

export function shieldHasBanner(shield: ShieldState): boolean {
  return shield.banner !== null;
}

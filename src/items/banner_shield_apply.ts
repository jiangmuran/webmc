// Applying a banner to a shield combines them at the crafting grid.
// The shield takes on the banner's patterns; banner is consumed.

export interface Pattern {
  id: string;
  color: string;
}

export interface BannerItem {
  baseColor: string;
  patterns: Pattern[];
}

export interface ShieldItem {
  patterns: Pattern[];
  durability: number;
}

export interface CombineResult {
  shield: ShieldItem;
  bannerConsumed: true;
}

export function combine(banner: BannerItem, shield: ShieldItem): CombineResult {
  return {
    shield: {
      patterns: [{ id: 'base', color: banner.baseColor }, ...banner.patterns],
      durability: shield.durability,
    },
    bannerConsumed: true,
  };
}

export function canApply(banner: BannerItem | null, shield: ShieldItem | null): boolean {
  return banner !== null && shield !== null;
}

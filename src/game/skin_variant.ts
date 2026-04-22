// Player skin variant. Classic (4px arm) vs Slim (3px arm). Stored
// per-player. Skins loaded from resource packs or server.

export type SkinVariant = 'classic' | 'slim';

export interface SkinProfile {
  ownerId: string;
  variant: SkinVariant;
  textureUrl: string | null;
  capeUrl: string | null;
}

export function makeProfile(ownerId: string): SkinProfile {
  return { ownerId, variant: 'classic', textureUrl: null, capeUrl: null };
}

export function setVariant(p: SkinProfile, v: SkinVariant): void {
  p.variant = v;
}

export function setTexture(p: SkinProfile, url: string | null): void {
  p.textureUrl = url;
}

export function setCape(p: SkinProfile, url: string | null): void {
  p.capeUrl = url;
}

// Arm width by variant.
export function armWidthPx(v: SkinVariant): number {
  return v === 'slim' ? 3 : 4;
}

// Steve/Alex default skins.
export const DEFAULT_SKINS: Record<SkinVariant, string> = {
  classic: 'webmc:defaults/steve.png',
  slim: 'webmc:defaults/alex.png',
};

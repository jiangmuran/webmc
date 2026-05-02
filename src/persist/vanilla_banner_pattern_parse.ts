// Parse a vanilla banner_pattern JSON (1.20.5+ datapack format). Schema:
//   {
//     "asset_id": "minecraft:bricks",
//     "translation_key": "block.minecraft.banner.bricks"
//   }
//
// Source: minecraft.wiki "Banner pattern". Behavioral spec — clean-room.

export interface ParsedBannerPattern {
  assetId: string; // webmc-namespaced
  translationKey: string;
}

export class BannerPatternParseError extends Error {}

export function parseVanillaBannerPattern(text: string): ParsedBannerPattern {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new BannerPatternParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new BannerPatternParseError('banner_pattern must be an object');
  const o = json as Record<string, unknown>;
  const rawAsset = typeof o['asset_id'] === 'string' ? o['asset_id'] : '';
  return {
    assetId: rawAsset ? `webmc:${rawAsset.replace(/^minecraft:/, '')}` : '',
    translationKey: typeof o['translation_key'] === 'string' ? o['translation_key'] : '',
  };
}

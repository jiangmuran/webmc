// Parse a vanilla painting_variant JSON (1.21+ datapack format). Schema:
//   {
//     "asset_id": "minecraft:bust",
//     "width": 2,
//     "height": 2,
//     "title": <text-component>,
//     "author": <text-component>
//   }
//
// Source: minecraft.wiki "Painting variant". Behavioral spec — clean-room.

import { flattenTextComponent } from './text_component';

export interface ParsedPaintingVariant {
  assetId: string; // mapped to webmc:
  width: number;
  height: number;
  title: string;
  author: string;
}

export class PaintingVariantParseError extends Error {}

export function parseVanillaPaintingVariant(text: string): ParsedPaintingVariant {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new PaintingVariantParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new PaintingVariantParseError('painting_variant must be an object');
  const o = json as Record<string, unknown>;
  const rawAsset = typeof o['asset_id'] === 'string' ? o['asset_id'] : '';
  const assetId = rawAsset ? `webmc:${rawAsset.replace(/^minecraft:/, '')}` : '';
  return {
    assetId,
    width: typeof o['width'] === 'number' ? Math.trunc(o['width']) : 1,
    height: typeof o['height'] === 'number' ? Math.trunc(o['height']) : 1,
    title: flattenTextComponent(o['title']),
    author: flattenTextComponent(o['author']),
  };
}

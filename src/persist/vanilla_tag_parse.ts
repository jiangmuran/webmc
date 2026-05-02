// Parse a vanilla tag JSON file. Tags are unordered sets of item or block
// names referenced by '#namespace:name' in recipes and other definitions.
// Schema (since 1.13):
//   { "replace": <bool=false>, "values": [ "minecraft:foo", "#minecraft:bar", ... ] }
//
// "replace": when true, the tag overrides any prior definition rather than
// merging. webmc tracks the flag but the merge policy is the caller's job.
//
// Source: minecraft.wiki "Tag". Behavioral spec — clean-room.

import { mapVanillaItemName } from './vanilla_item_map';

export interface ParsedTag {
  replace: boolean;
  // Direct entries (mapped to webmc names).
  values: string[];
  // References to other tags ("#minecraft:logs" → "#webmc:logs").
  tagRefs: string[];
}

export class TagParseError extends Error {}

function normalize(s: string): string {
  if (s.startsWith('#')) return `#${mapVanillaItemName(s.slice(1))}`;
  return mapVanillaItemName(s);
}

export function parseVanillaTag(text: string): ParsedTag {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new TagParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new TagParseError('tag JSON must be an object');
  const obj = json as Record<string, unknown>;
  const replace = obj['replace'] === true;
  const rawValues = obj['values'];
  const values: string[] = [];
  const tagRefs: string[] = [];
  if (Array.isArray(rawValues)) {
    for (const v of rawValues) {
      let s: string | null = null;
      if (typeof v === 'string') s = v;
      else if (typeof v === 'object' && v !== null) {
        const o = v as Record<string, unknown>;
        if (typeof o['id'] === 'string') s = o['id'];
      }
      if (s === null) continue;
      const n = normalize(s);
      if (n.startsWith('#')) tagRefs.push(n);
      else values.push(n);
    }
  }
  return { replace, values, tagRefs };
}

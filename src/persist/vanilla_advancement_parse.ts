// Parse a vanilla advancement JSON. Schema (subset, since 1.13):
//   {
//     "parent": "minecraft:story/root",
//     "display": { "title": <text>, "description": <text>,
//                  "icon": { "item": "minecraft:dirt" }, "frame": "task" },
//     "criteria": { "key": { "trigger": "minecraft:impossible", "conditions": {} } },
//     "requirements": [["key"]]   // optional; defaults to AND of all keys
//   }
//
// We extract only the fields webmc currently uses for display + trigger
// type registration. Anything else is preserved as-is in `raw`.
//
// Source: minecraft.wiki "Advancement". Behavioral spec — clean-room.

import { mapVanillaItemName } from './vanilla_item_map';

export type AdvancementFrame = 'task' | 'goal' | 'challenge';

export interface AdvancementCriterion {
  trigger: string; // mapped namespace ("webmc:impossible")
}

export interface ParsedAdvancement {
  parent: string | null;
  title: string;
  description: string;
  iconItem: string | null; // webmc-namespaced
  frame: AdvancementFrame;
  criteria: Record<string, AdvancementCriterion>;
  // Each inner array is an OR group; outer is AND. Mirrors vanilla.
  requirements: string[][];
}

export class AdvancementParseError extends Error {}

function flatten(c: unknown): string {
  if (c === null || c === undefined) return '';
  if (typeof c === 'string') return c;
  if (typeof c === 'number' || typeof c === 'boolean') return String(c);
  if (Array.isArray(c)) return c.map(flatten).join('');
  if (typeof c === 'object') {
    const obj = c as Record<string, unknown>;
    let out = '';
    if (typeof obj['text'] === 'string') out += obj['text'];
    if (typeof obj['translate'] === 'string' && !out) out += obj['translate'];
    if (Array.isArray(obj['extra'])) out += flatten(obj['extra']);
    return out;
  }
  return '';
}

function asFrame(s: string): AdvancementFrame {
  return s === 'goal' || s === 'challenge' ? s : 'task';
}

export function parseVanillaAdvancement(text: string): ParsedAdvancement {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new AdvancementParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new AdvancementParseError('advancement must be an object');
  const obj = json as Record<string, unknown>;

  const parent =
    typeof obj['parent'] === 'string' ? obj['parent'].replace(/^minecraft:/, '') : null;

  const display = obj['display'];
  let title = '';
  let description = '';
  let iconItem: string | null = null;
  let frame: AdvancementFrame = 'task';
  if (typeof display === 'object' && display !== null) {
    const d = display as Record<string, unknown>;
    title = flatten(d['title']);
    description = flatten(d['description']);
    if (typeof d['frame'] === 'string') frame = asFrame(d['frame']);
    const icon = d['icon'];
    if (typeof icon === 'object' && icon !== null) {
      const io = icon as Record<string, unknown>;
      const id = typeof io['item'] === 'string' ? io['item'] : (io['id'] as string | undefined);
      if (typeof id === 'string') iconItem = mapVanillaItemName(id);
    }
  }

  const criteria: Record<string, AdvancementCriterion> = {};
  const cRaw = obj['criteria'];
  if (typeof cRaw === 'object' && cRaw !== null) {
    for (const [k, v] of Object.entries(cRaw)) {
      if (typeof v !== 'object' || v === null) continue;
      const vo = v as Record<string, unknown>;
      const trigRaw = typeof vo['trigger'] === 'string' ? vo['trigger'] : 'minecraft:impossible';
      criteria[k] = { trigger: `webmc:${trigRaw.replace(/^minecraft:/, '')}` };
    }
  }

  let requirements: string[][];
  const reqRaw = obj['requirements'];
  if (Array.isArray(reqRaw)) {
    requirements = [];
    for (const grp of reqRaw) {
      if (!Array.isArray(grp)) continue;
      const inner: string[] = [];
      for (const k of grp) if (typeof k === 'string') inner.push(k);
      requirements.push(inner);
    }
  } else {
    // Default: every criterion required (AND).
    requirements = Object.keys(criteria).map((k) => [k]);
  }

  return { parent, title, description, iconItem, frame, criteria, requirements };
}

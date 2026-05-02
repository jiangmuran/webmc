// Parse a vanilla GUI sprite scaling .mcmeta sidecar (1.20.2+ resource
// pack format). Schema:
//   { "gui": {
//       "scaling": {
//         "type": "stretch" | "tile" | "nine_slice",
//         "width": <int>, "height": <int>,
//         "border": <int> | { "left":..., "top":..., "right":..., "bottom":... }
//       }
//     }
//   }
//
// Used to control how widget sprites stretch to fit (e.g. button frames
// using nine-slice scaling).
//
// Source: minecraft.wiki "Resource pack — GUI scaling". Behavioral spec
// — clean-room.

export type GuiScalingType = 'stretch' | 'tile' | 'nine_slice';

export interface GuiBorder {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ParsedGuiSpriteMcmeta {
  scalingType: GuiScalingType;
  width: number;
  height: number;
  border: GuiBorder;
}

export class GuiSpriteMcmetaParseError extends Error {}

function readBorder(v: unknown): GuiBorder {
  const def: GuiBorder = { left: 0, top: 0, right: 0, bottom: 0 };
  if (typeof v === 'number') {
    const n = Math.max(0, Math.trunc(v));
    return { left: n, top: n, right: n, bottom: n };
  }
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  return {
    left: typeof o['left'] === 'number' ? Math.trunc(o['left']) : 0,
    top: typeof o['top'] === 'number' ? Math.trunc(o['top']) : 0,
    right: typeof o['right'] === 'number' ? Math.trunc(o['right']) : 0,
    bottom: typeof o['bottom'] === 'number' ? Math.trunc(o['bottom']) : 0,
  };
}

function asScalingType(s: string): GuiScalingType {
  return s === 'tile' || s === 'nine_slice' ? s : 'stretch';
}

export function parseVanillaGuiSpriteMcmeta(text: string): ParsedGuiSpriteMcmeta {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new GuiSpriteMcmetaParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new GuiSpriteMcmetaParseError('mcmeta must be an object');
  const guiRaw = (json as Record<string, unknown>)['gui'];
  if (typeof guiRaw !== 'object' || guiRaw === null)
    throw new GuiSpriteMcmetaParseError('missing "gui" object');
  const scalingRaw = (guiRaw as Record<string, unknown>)['scaling'];
  if (typeof scalingRaw !== 'object' || scalingRaw === null)
    throw new GuiSpriteMcmetaParseError('missing "gui.scaling" object');
  const s = scalingRaw as Record<string, unknown>;
  return {
    scalingType: asScalingType(typeof s['type'] === 'string' ? s['type'] : 'stretch'),
    width: typeof s['width'] === 'number' ? Math.max(1, Math.trunc(s['width'])) : 0,
    height: typeof s['height'] === 'number' ? Math.max(1, Math.trunc(s['height'])) : 0,
    border: readBorder(s['border']),
  };
}

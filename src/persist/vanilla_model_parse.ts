// Parse a vanilla model JSON. Models describe how a block (or item) is
// rendered. Schema (subset):
//
//   { "parent": "minecraft:block/cube_all",
//     "textures": { "all": "minecraft:block/stone", "particle": "..." },
//     "elements": [ {
//       "from": [0,0,0], "to": [16,16,16],
//       "faces": { "north": { "uv": [0,0,16,16], "texture": "#all", "rotation": 0 } }
//     } ],
//     "ambientocclusion": true,
//     "display": { "thirdperson_righthand": { "rotation": [..], "translation": [..], "scale": [..] } }
//   }
//
// We map all texture references and the parent into the webmc namespace.
//
// Source: minecraft.wiki "Model". Behavioral spec — clean-room.

export interface ModelFace {
  // Texture key (e.g. "all" or a literal path). webmc-namespaced if literal.
  texture: string;
  uv: [number, number, number, number] | null; // null = auto from from/to
  rotation: 0 | 90 | 180 | 270;
  cullface: string | null;
}

export interface ModelElement {
  from: [number, number, number];
  to: [number, number, number];
  faces: Partial<Record<'north' | 'south' | 'east' | 'west' | 'up' | 'down', ModelFace>>;
}

export interface ParsedModel {
  parent: string | null; // webmc-namespaced
  textures: Record<string, string>; // value also webmc-namespaced unless it's a "#key" reference
  elements: ModelElement[];
  ambientOcclusion: boolean;
}

export class ModelParseError extends Error {}

function mapNamespace(s: string): string {
  if (s.startsWith('#')) return s;
  return `webmc:${s.replace(/^minecraft:/, '')}`;
}

function asRotation(n: unknown): 0 | 90 | 180 | 270 {
  return n === 90 ? 90 : n === 180 ? 180 : n === 270 ? 270 : 0;
}

function readVec3(v: unknown, def: [number, number, number]): [number, number, number] {
  if (!Array.isArray(v) || v.length < 3) return def;
  return [
    typeof v[0] === 'number' ? v[0] : def[0],
    typeof v[1] === 'number' ? v[1] : def[1],
    typeof v[2] === 'number' ? v[2] : def[2],
  ];
}

function readUv(v: unknown): [number, number, number, number] | null {
  if (!Array.isArray(v) || v.length < 4) return null;
  return [
    typeof v[0] === 'number' ? v[0] : 0,
    typeof v[1] === 'number' ? v[1] : 0,
    typeof v[2] === 'number' ? v[2] : 16,
    typeof v[3] === 'number' ? v[3] : 16,
  ];
}

function readFace(v: unknown): ModelFace {
  if (typeof v !== 'object' || v === null) {
    return { texture: '', uv: null, rotation: 0, cullface: null };
  }
  const o = v as Record<string, unknown>;
  return {
    texture: typeof o['texture'] === 'string' ? o['texture'] : '',
    uv: readUv(o['uv']),
    rotation: asRotation(o['rotation']),
    cullface: typeof o['cullface'] === 'string' ? o['cullface'] : null,
  };
}

const FACE_NAMES = ['north', 'south', 'east', 'west', 'up', 'down'] as const;

export function parseVanillaModel(text: string): ParsedModel {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new ModelParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new ModelParseError('model must be an object');
  const obj = json as Record<string, unknown>;

  const parent = typeof obj['parent'] === 'string' ? mapNamespace(obj['parent']) : null;

  const textures: Record<string, string> = {};
  const tx = obj['textures'];
  if (typeof tx === 'object' && tx !== null) {
    for (const [k, v] of Object.entries(tx as Record<string, unknown>)) {
      if (typeof v === 'string') textures[k] = mapNamespace(v);
    }
  }

  const elements: ModelElement[] = [];
  const elsRaw = obj['elements'];
  if (Array.isArray(elsRaw)) {
    for (const e of elsRaw) {
      if (typeof e !== 'object' || e === null) continue;
      const eo = e as Record<string, unknown>;
      const faces: ModelElement['faces'] = {};
      const facesRaw = eo['faces'];
      if (typeof facesRaw === 'object' && facesRaw !== null) {
        for (const fn of FACE_NAMES) {
          const fv = (facesRaw as Record<string, unknown>)[fn];
          if (fv) faces[fn] = readFace(fv);
        }
      }
      elements.push({
        from: readVec3(eo['from'], [0, 0, 0]),
        to: readVec3(eo['to'], [16, 16, 16]),
        faces,
      });
    }
  }

  return {
    parent,
    textures,
    elements,
    ambientOcclusion: obj['ambientocclusion'] !== false,
  };
}

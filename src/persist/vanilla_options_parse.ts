// Parse vanilla options.txt — the client settings file written by the
// Java edition launcher. Format is key:value (note the colon, not =).
// Values may be JSON-encoded (booleans, ints, doubles, quoted strings,
// "[a,b,c]" arrays).
//
// Source: minecraft.wiki "Options.txt". Behavioral spec — clean-room.

export type OptionValue = string | number | boolean;

export interface ParsedOptionsTxt {
  fields: Record<string, OptionValue>;
  // Arrays kept separately (vanilla emits them like "[a,b,c]").
  arrayFields: Record<string, string[]>;
  // Lifted typed view of the most-used vanilla settings.
  fov: number;
  renderDistance: number;
  guiScale: number;
  fancyGraphics: boolean;
  smoothLighting: boolean | 'off' | 'minimum' | 'maximum';
  vsync: boolean;
  fullscreen: boolean;
  invertYMouse: boolean;
  mouseSensitivity: number;
  mainHand: 'left' | 'right';
  lang: string;
}

function coerce(s: string): OptionValue {
  if (s === 'true') return true;
  if (s === 'false') return false;
  // Quoted JSON string.
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      return JSON.parse(s);
    } catch {
      return s.slice(1, -1);
    }
  }
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function asString(v: OptionValue | undefined, fallback: string): string {
  return v === undefined ? fallback : typeof v === 'string' ? v : String(v);
}
function asInt(v: OptionValue | undefined, fallback: number): number {
  if (typeof v === 'number') return Math.trunc(v);
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
function asFloat(v: OptionValue | undefined, fallback: number): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
function asBool(v: OptionValue | undefined, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return fallback;
}

function asSmoothLighting(v: OptionValue | undefined): ParsedOptionsTxt['smoothLighting'] {
  if (typeof v === 'boolean') return v;
  if (v === 'off' || v === 'minimum' || v === 'maximum') return v;
  if (typeof v === 'number') {
    if (v === 0) return 'off';
    if (v === 1) return 'minimum';
    if (v === 2) return 'maximum';
  }
  return true;
}

function asMainHand(v: OptionValue | undefined): 'left' | 'right' {
  return v === 'left' ? 'left' : 'right';
}

export function parseVanillaOptionsTxt(text: string): ParsedOptionsTxt {
  const fields: Record<string, OptionValue> = {};
  const arrayFields: Record<string, string[]> = {};
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1);
    if (key.length === 0) continue;
    if (value.startsWith('[') && value.endsWith(']')) {
      // Naive array split — values are simple identifiers / quoted strings.
      const inner = value.slice(1, -1).trim();
      arrayFields[key] = inner.length === 0 ? [] : inner.split(',').map((s) => s.trim());
      continue;
    }
    fields[key] = coerce(value);
  }
  return {
    fields,
    arrayFields,
    fov: asFloat(fields['fov'], 0),
    renderDistance: asInt(fields['renderDistance'], 12),
    guiScale: asInt(fields['guiScale'], 0),
    fancyGraphics: asBool(fields['fancyGraphics'], true),
    smoothLighting: asSmoothLighting(fields['ao']),
    vsync: asBool(fields['enableVsync'], true),
    fullscreen: asBool(fields['fullscreen'], false),
    invertYMouse: asBool(fields['invertYMouse'], false),
    mouseSensitivity: asFloat(fields['mouseSensitivity'], 0.5),
    mainHand: asMainHand(fields['mainHand']),
    lang: asString(fields['lang'], 'en_us'),
  };
}

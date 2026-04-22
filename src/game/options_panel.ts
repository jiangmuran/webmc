// Options panel state + persistence. Settings are JSON-serializable
// scalars with min/max/step. Panel persists to localStorage.

export type OptionKey =
  | 'fov'
  | 'sensitivity'
  | 'render_distance'
  | 'simulation_distance'
  | 'master_volume'
  | 'music_volume'
  | 'brightness'
  | 'invert_y'
  | 'autoJump'
  | 'vsync'
  | 'particles'
  | 'chat_visibility';

export interface OptionDef {
  key: OptionKey;
  kind: 'number' | 'bool' | 'enum';
  default: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  enumValues?: string[];
}

export const OPTIONS: OptionDef[] = [
  { key: 'fov', kind: 'number', default: 70, min: 30, max: 110, step: 1 },
  { key: 'sensitivity', kind: 'number', default: 1, min: 0, max: 2, step: 0.01 },
  { key: 'render_distance', kind: 'number', default: 12, min: 2, max: 32, step: 1 },
  { key: 'simulation_distance', kind: 'number', default: 10, min: 5, max: 32, step: 1 },
  { key: 'master_volume', kind: 'number', default: 1, min: 0, max: 1, step: 0.01 },
  { key: 'music_volume', kind: 'number', default: 1, min: 0, max: 1, step: 0.01 },
  { key: 'brightness', kind: 'number', default: 0.5, min: 0, max: 1, step: 0.01 },
  { key: 'invert_y', kind: 'bool', default: false },
  { key: 'autoJump', kind: 'bool', default: false },
  { key: 'vsync', kind: 'bool', default: true },
  { key: 'particles', kind: 'enum', default: 'all', enumValues: ['minimal', 'decreased', 'all'] },
  {
    key: 'chat_visibility',
    kind: 'enum',
    default: 'shown',
    enumValues: ['shown', 'commands', 'hidden'],
  },
];

export type OptionsMap = Partial<Record<OptionKey, number | boolean | string>>;

export function defaults(): OptionsMap {
  const m: OptionsMap = {};
  for (const o of OPTIONS) m[o.key] = o.default;
  return m;
}

export function validate(key: OptionKey, value: unknown): boolean {
  const def = OPTIONS.find((o) => o.key === key);
  if (!def) return false;
  if (def.kind === 'number') {
    if (typeof value !== 'number') return false;
    if (def.min !== undefined && value < def.min) return false;
    if (def.max !== undefined && value > def.max) return false;
    return true;
  }
  if (def.kind === 'bool') return typeof value === 'boolean';
  return typeof value === 'string' && (def.enumValues ?? []).includes(value);
}

export function applyOverrides(base: OptionsMap, over: OptionsMap): OptionsMap {
  const out: OptionsMap = { ...base };
  for (const [k, v] of Object.entries(over) as [OptionKey, unknown][]) {
    if (validate(k, v)) out[k] = v as number | boolean | string;
  }
  return out;
}

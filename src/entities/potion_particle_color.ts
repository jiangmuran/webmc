// Potion particle color. Splash/lingering clouds and player-effect
// particles blend the RGB of all active effects by weighted average
// (weight = amplifier+1).

export interface ActiveEffect {
  rgb: number;
  amplifier: number;
}

const EFFECT_COLOR: Record<string, number> = {
  speed: 0x7cafc6,
  slowness: 0x5a6c81,
  strength: 0x932423,
  weakness: 0x484d48,
  regeneration: 0xcd5cab,
  poison: 0x4e9331,
  fire_resistance: 0xe49a3a,
  water_breathing: 0x2e5299,
  invisibility: 0x7f8392,
  night_vision: 0x1f1fa1,
  jump_boost: 0x22ff4c,
};

export function colorOf(name: string): number | undefined {
  return EFFECT_COLOR[name];
}

export function blendColors(effects: ActiveEffect[]): number {
  if (effects.length === 0) return 0x385dc6;
  let r = 0;
  let g = 0;
  let b = 0;
  let w = 0;
  for (const e of effects) {
    const weight = e.amplifier + 1;
    r += ((e.rgb >> 16) & 0xff) * weight;
    g += ((e.rgb >> 8) & 0xff) * weight;
    b += (e.rgb & 0xff) * weight;
    w += weight;
  }
  const rr = Math.round(r / w);
  const gg = Math.round(g / w);
  const bb = Math.round(b / w);
  return (rr << 16) | (gg << 8) | bb;
}

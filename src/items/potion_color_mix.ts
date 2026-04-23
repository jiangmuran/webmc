export const POTION_COLORS: Record<string, [number, number, number]> = {
  speed: [124, 175, 198],
  slowness: [90, 108, 129],
  strength: [147, 36, 35],
  weakness: [72, 77, 72],
  regeneration: [205, 92, 171],
  poison: [78, 147, 49],
  fire_resistance: [228, 154, 58],
  water_breathing: [46, 82, 153],
  night_vision: [31, 31, 161],
  invisibility: [127, 131, 146],
  instant_health: [249, 128, 40],
  instant_damage: [67, 10, 9],
  leaping: [34, 255, 76],
  slow_falling: [248, 245, 223],
  luck: [51, 153, 51],
  turtle_master: [34, 135, 123],
};

export function mixColors(ids: readonly string[]): [number, number, number] {
  const valid = ids.filter((id) => POTION_COLORS[id] !== undefined);
  if (valid.length === 0) return [56, 80, 150];
  let r = 0,
    g = 0,
    b = 0;
  for (const id of valid) {
    const c = POTION_COLORS[id];
    if (c === undefined) continue;
    r += c[0];
    g += c[1];
    b += c[2];
  }
  return [r / valid.length, g / valid.length, b / valid.length];
}

export function splashAreaColor(baseColor: [number, number, number]): [number, number, number] {
  return [baseColor[0] * 0.8, baseColor[1] * 0.8, baseColor[2] * 0.8];
}

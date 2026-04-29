const GLASS_RGB: Record<string, [number, number, number]> = {
  white: [249, 255, 254],
  orange: [249, 128, 29],
  magenta: [199, 78, 189],
  light_blue: [58, 179, 218],
  yellow: [254, 216, 61],
  lime: [128, 199, 31],
  pink: [243, 139, 170],
  gray: [71, 79, 82],
  light_gray: [157, 157, 151],
  cyan: [22, 156, 156],
  purple: [137, 50, 184],
  blue: [60, 68, 170],
  brown: [131, 84, 50],
  green: [94, 124, 22],
  red: [176, 46, 38],
  black: [29, 29, 33],
};

export function stainedGlassFor(id: string): string | undefined {
  const m = /^(.+?)_stained_glass(?:_pane)?$/.exec(id);
  return m?.[1];
}

// Wiki (minecraft.wiki/w/Beacon#Beam_color): each stained glass block
// the beam passes through is blended with the accumulated color via
// `mixed = (mixed + glass) / 2`. The newest glass gets ½ weight; the
// next gets ¼, then ⅛, etc. Old code averaged all glasses equally,
// which under-weights the topmost glass and over-weights the lowest.
// stackIds[0] = lowest (closest to beacon), [N-1] = highest.
export function beamColor(stackIds: readonly string[]): [number, number, number] {
  const colors: [number, number, number][] = [];
  for (const id of stackIds) {
    const name = stainedGlassFor(id);
    if (name !== undefined && GLASS_RGB[name]) colors.push(GLASS_RGB[name]);
  }
  if (colors.length === 0) return [255, 255, 255];
  const first = colors[0];
  if (!first) return [255, 255, 255];
  let r = first[0];
  let g = first[1];
  let b = first[2];
  for (let i = 1; i < colors.length; i++) {
    const c = colors[i];
    if (!c) continue;
    r = (r + c[0]) / 2;
    g = (g + c[1]) / 2;
    b = (b + c[2]) / 2;
  }
  return [r, g, b];
}

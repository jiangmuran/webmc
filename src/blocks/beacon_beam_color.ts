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

export function beamColor(stackIds: readonly string[]): [number, number, number] {
  const colors: [number, number, number][] = [];
  for (const id of stackIds) {
    const name = stainedGlassFor(id);
    if (name !== undefined && GLASS_RGB[name]) colors.push(GLASS_RGB[name]);
  }
  if (colors.length === 0) return [255, 255, 255];
  let r = 0,
    g = 0,
    b = 0;
  for (const c of colors) {
    r += c[0];
    g += c[1];
    b += c[2];
  }
  return [r / colors.length, g / colors.length, b / colors.length];
}

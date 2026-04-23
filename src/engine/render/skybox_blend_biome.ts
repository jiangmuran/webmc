export type BiomeSky = 'blue' | 'orange_desert' | 'red_badlands' | 'dark_end' | 'red_nether';

export const SKY_COLORS: Record<BiomeSky, [number, number, number]> = {
  blue: [0.47, 0.65, 1],
  orange_desert: [0.85, 0.7, 0.4],
  red_badlands: [0.95, 0.5, 0.3],
  dark_end: [0.02, 0.01, 0.04],
  red_nether: [0.3, 0.05, 0.05],
};

export function blendSky(a: BiomeSky, b: BiomeSky, t: number): [number, number, number] {
  const ca = SKY_COLORS[a];
  const cb = SKY_COLORS[b];
  const f = Math.max(0, Math.min(1, t));
  return [ca[0] + (cb[0] - ca[0]) * f, ca[1] + (cb[1] - ca[1]) * f, ca[2] + (cb[2] - ca[2]) * f];
}

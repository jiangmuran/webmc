export interface PillarSpec {
  index: number;
  radius: number;
  height: number;
  caged: boolean;
}

export const PILLAR_COUNT = 10;
export const INNER_RADIUS = 40;

export function pillarAt(i: number): PillarSpec {
  const r = INNER_RADIUS + 2 * (i % 5);
  const h = 76 + 3 * ((i * 13) % 7);
  const caged = i < PILLAR_COUNT / 2;
  return { index: i, radius: r, height: h, caged };
}

export function pillarsCaged(): number {
  let n = 0;
  for (let i = 0; i < PILLAR_COUNT; i++) if (pillarAt(i).caged) n++;
  return n;
}

export function pillarAngle(i: number): number {
  return (i * 2 * Math.PI) / PILLAR_COUNT;
}

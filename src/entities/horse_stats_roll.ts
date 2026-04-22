// Horse stats. Health 15–30 (7.5..15 hearts), jump 0.4–1.0,
// speed 0.1125–0.3375. Breeding tends toward the parents' average
// with random jitter.

export interface HorseStats {
  maxHealth: number;
  jumpStrength: number;
  speed: number;
}

export function rollHorseStats(rand: () => number): HorseStats {
  const h = 15 + rand() * 8 + rand() * 8 + (rand() < 0.5 ? 0 : 1);
  const j = 0.4 + rand() * 0.2 + rand() * 0.2 + rand() * 0.2;
  const s = 0.1125 + rand() * 0.075 + rand() * 0.075 + rand() * 0.075;
  return { maxHealth: Math.round(h), jumpStrength: j, speed: s };
}

export function breed(a: HorseStats, b: HorseStats, rand: () => number): HorseStats {
  const wild = rollHorseStats(rand);
  return {
    maxHealth: Math.round((a.maxHealth + b.maxHealth + wild.maxHealth) / 3),
    jumpStrength: (a.jumpStrength + b.jumpStrength + wild.jumpStrength) / 3,
    speed: (a.speed + b.speed + wild.speed) / 3,
  };
}

export function jumpHeightBlocks(jump: number): number {
  // simplified: h = -0.1817584952 * j^3 + 3.689713992 * j^2 + 2.128599134 * j - 0.343930367
  return (
    -0.1817584952 * jump * jump * jump +
    3.689713992 * jump * jump +
    2.128599134 * jump -
    0.343930367
  );
}

// Evoker "fangs" spell. Spawns a line of evoker fangs in the
// target's direction. 16 fangs in a row, each delayed by 1 tick;
// each deals 6 damage and pops up after ~20 ticks.
//
// Wiki (minecraft.wiki/w/Evoker#Fang_attack): "The evoker typically
// summons sixteen fangs in a straight line toward the target."
// Old constant FANG_LINE_LENGTH was 8 — half the wiki count, same
// bug as sibling evoker_fangs.ts (now fixed).

export interface FangCast {
  originX: number;
  originY: number;
  originZ: number;
  directionX: number;
  directionZ: number;
}

export interface Fang {
  x: number;
  y: number;
  z: number;
  spawnTickOffset: number;
  lifetimeTicks: number;
}

export const FANG_LINE_LENGTH = 16;
export const FANG_LIFETIME_TICKS = 22;

export function castFangsLine(c: FangCast): Fang[] {
  const out: Fang[] = [];
  const len = Math.sqrt(c.directionX * c.directionX + c.directionZ * c.directionZ) || 1;
  const ux = c.directionX / len;
  const uz = c.directionZ / len;
  for (let i = 1; i <= FANG_LINE_LENGTH; i++) {
    out.push({
      x: c.originX + ux * i,
      y: c.originY,
      z: c.originZ + uz * i,
      spawnTickOffset: i,
      lifetimeTicks: FANG_LIFETIME_TICKS,
    });
  }
  return out;
}

// Damage resolution: only on the tick when the fang's bite animation
// triggers (spawnTickOffset + ~4 ticks).
export const FANG_BITE_DELAY_TICKS = 4;
export const FANG_DAMAGE = 6;

export function fangHitsThisTick(f: Fang, castTick: number, nowTick: number): boolean {
  return nowTick - castTick === f.spawnTickOffset + FANG_BITE_DELAY_TICKS;
}

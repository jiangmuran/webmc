// Powder snow. Entities without leather boots sink slowly into powder
// snow and take freezing damage. Frost timer grows while standing in it;
// at max timer, damage ticks every 40 ticks. Leather boots let the
// player walk on top of the powder without sinking.

export interface PowderSnowQuery {
  inPowderSnow: boolean;
  hasLeatherBoots: boolean;
  freezeTicks: number;
}

const MAX_FREEZE_TICKS = 140;
const FREEZE_DAMAGE_INTERVAL = 40;
const FREEZE_DAMAGE_AMOUNT = 1;

export interface PowderSnowResult {
  sinking: boolean;
  freezeTicks: number;
  damage: number;
}

export function tickPowderSnow(q: PowderSnowQuery, dtTicks: number): PowderSnowResult {
  if (q.hasLeatherBoots && q.inPowderSnow) {
    // stand on top without sinking; freeze timer decays
    return {
      sinking: false,
      freezeTicks: Math.max(0, q.freezeTicks - dtTicks * 2),
      damage: 0,
    };
  }
  if (!q.inPowderSnow) {
    return {
      sinking: false,
      freezeTicks: Math.max(0, q.freezeTicks - dtTicks * 2),
      damage: 0,
    };
  }
  const newTicks = q.freezeTicks + dtTicks;
  let dmg = 0;
  if (newTicks >= MAX_FREEZE_TICKS) {
    const prevPast = Math.max(0, q.freezeTicks - MAX_FREEZE_TICKS);
    const curPast = newTicks - MAX_FREEZE_TICKS;
    const ticksAcross =
      Math.floor(curPast / FREEZE_DAMAGE_INTERVAL) - Math.floor(prevPast / FREEZE_DAMAGE_INTERVAL);
    dmg = ticksAcross * FREEZE_DAMAGE_AMOUNT;
    if (q.freezeTicks < MAX_FREEZE_TICKS) dmg += FREEZE_DAMAGE_AMOUNT;
  }
  return { sinking: true, freezeTicks: newTicks, damage: dmg };
}

// Some mobs are immune: strider (fire), blaze (fire), polar bear, snow
// golem, stray, wither skeleton.
const FREEZE_IMMUNE = new Set([
  'strider',
  'blaze',
  'polar_bear',
  'snow_golem',
  'stray',
  'wither_skeleton',
  'skeleton_horse',
]);

export function isFreezeImmune(mob: string): boolean {
  return FREEZE_IMMUNE.has(mob);
}

// Freeze vignette tint fraction for HUD (0..1). Scales linearly.
export function freezeVignetteFraction(freezeTicks: number): number {
  return Math.max(0, Math.min(1, freezeTicks / MAX_FREEZE_TICKS));
}

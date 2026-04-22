// HUD status bar layout. Renders hearts (health), drumsticks (hunger),
// armor chevrons, oxygen bubbles, XP bar, hotbar selection.
// Bars use half-unit icons (1 heart = 2 HP). Absorption adds golden
// hearts on the right; extra health (health-boost) adds extra rows.

export interface HudStats {
  health: number;
  maxHealth: number;
  absorption: number;
  hunger: number;
  saturation: number;
  breathSec: number;
  maxBreathSec: number;
  armor: number;
  xpLevel: number;
  xpProgress: number; // 0..1
  selectedHotbarSlot: number;
}

export interface HeartIcon {
  index: number;
  kind: 'full' | 'half' | 'empty' | 'absorption_full' | 'absorption_half' | 'absorption_empty';
}

// Standard MC heart row holds 10 icons (= 20 HP = 1 row).
export const HEARTS_PER_ROW = 10;

export function renderHearts(stats: HudStats): HeartIcon[] {
  const out: HeartIcon[] = [];
  const halves = Math.max(0, Math.round(stats.health));
  const maxHalves = Math.max(20, Math.round(stats.maxHealth));
  for (let i = 0; i < Math.ceil(maxHalves / 2); i++) {
    const pairIdx = i * 2;
    if (halves >= pairIdx + 2) out.push({ index: i, kind: 'full' });
    else if (halves === pairIdx + 1) out.push({ index: i, kind: 'half' });
    else out.push({ index: i, kind: 'empty' });
  }
  const absorbHalves = Math.max(0, Math.round(stats.absorption));
  const absorbHearts = Math.ceil(absorbHalves / 2);
  for (let i = 0; i < absorbHearts; i++) {
    const pairIdx = i * 2;
    if (absorbHalves >= pairIdx + 2) {
      out.push({ index: i + out.length, kind: 'absorption_full' });
    } else {
      out.push({ index: i + out.length, kind: 'absorption_half' });
    }
  }
  return out;
}

export interface HungerIcon {
  index: number;
  kind: 'full' | 'half' | 'empty';
}

export function renderHunger(stats: HudStats): HungerIcon[] {
  const out: HungerIcon[] = [];
  const halves = Math.max(0, Math.round(stats.hunger));
  for (let i = 0; i < 10; i++) {
    const pairIdx = i * 2;
    if (halves >= pairIdx + 2) out.push({ index: i, kind: 'full' });
    else if (halves === pairIdx + 1) out.push({ index: i, kind: 'half' });
    else out.push({ index: i, kind: 'empty' });
  }
  return out;
}

// Oxygen bubbles appear when drowning. 10 bubbles = 15s breath.
export function renderBubbles(stats: HudStats): number {
  if (stats.breathSec >= stats.maxBreathSec - 0.01) return 0;
  const ratio = Math.max(0, stats.breathSec / stats.maxBreathSec);
  return Math.round(ratio * 10);
}

// XP bar: return fill fraction 0..1.
export function xpBarFraction(stats: HudStats): number {
  return Math.max(0, Math.min(1, stats.xpProgress));
}

// Flash effect when taking damage: returns tint alpha 0..1 over a 0.5s
// flash window.
export function damageTintAlpha(timeSinceDamageSec: number): number {
  if (timeSinceDamageSec >= 0.5) return 0;
  return 1 - timeSinceDamageSec / 0.5;
}

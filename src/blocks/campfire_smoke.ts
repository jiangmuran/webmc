// Campfire smoke plumes. A lit campfire (or soul campfire) emits smoke
// particles rising straight up; if a hay bale sits below, the plume
// reaches 24 blocks ("signal fire") for multiplayer markers.

export type CampfireKind = 'campfire' | 'soul_campfire';

export interface CampfireState {
  kind: CampfireKind;
  lit: boolean;
  signalFire: boolean; // hay bale below
}

export function makeCampfire(kind: CampfireKind = 'campfire'): CampfireState {
  return { kind, lit: true, signalFire: false };
}

export interface SmokeEmission {
  height: number; // number of blocks the plume reaches
  density: number; // particles per second
  colorTint: 'normal' | 'blue';
}

const NORMAL_PLUME_HEIGHT = 10;
const SIGNAL_PLUME_HEIGHT = 24;

export function smokeEmission(state: CampfireState): SmokeEmission {
  if (!state.lit) return { height: 0, density: 0, colorTint: 'normal' };
  return {
    height: state.signalFire ? SIGNAL_PLUME_HEIGHT : NORMAL_PLUME_HEIGHT,
    density: state.signalFire ? 12 : 6,
    colorTint: state.kind === 'soul_campfire' ? 'blue' : 'normal',
  };
}

// Campfire cooks food placed on top (4 items at a time). Cook time is
// 30 seconds per item; output goes into a "cooking slot" for the player
// to pick up.
export interface CampfireSlot {
  item: string | null;
  cookedFraction: number; // 0..1
}

export interface CampfireCook {
  slots: CampfireSlot[]; // length 4
}

export function makeCook(): CampfireCook {
  return {
    slots: [
      { item: null, cookedFraction: 0 },
      { item: null, cookedFraction: 0 },
      { item: null, cookedFraction: 0 },
      { item: null, cookedFraction: 0 },
    ],
  };
}

const COOK_DURATION_SEC = 30;

export function placeFood(cook: CampfireCook, rawItem: string): number {
  for (let i = 0; i < cook.slots.length; i++) {
    const slot = cook.slots[i];
    if (!slot) continue;
    if (slot.item === null) {
      slot.item = rawItem;
      slot.cookedFraction = 0;
      return i;
    }
  }
  return -1;
}

export function tickCook(cook: CampfireCook, dtSec: number): number[] {
  const finished: number[] = [];
  for (let i = 0; i < cook.slots.length; i++) {
    const slot = cook.slots[i];
    if (!slot?.item) continue;
    slot.cookedFraction += dtSec / COOK_DURATION_SEC;
    if (slot.cookedFraction >= 1) {
      finished.push(i);
      slot.cookedFraction = 1;
    }
  }
  return finished;
}

// Campfire damages entities standing on top. 1 damage per half-second
// for normal, 2 per half-second for soul.
export function campfireContactDamage(kind: CampfireKind, dtSec: number): number {
  const perSec = kind === 'soul_campfire' ? 4 : 2;
  return dtSec * perSec;
}

// Crosshair rendering + feedback. The crosshair turns green when
// aimed at an interactable block / entity, red on a dead target, and
// shows a small "hit indicator" when a weapon cooldown is ready.

export type CrosshairColor = 'default' | 'friendly' | 'hostile' | 'dead';

export interface CrosshairQuery {
  targetKind: 'none' | 'block' | 'entity';
  targetIsHostile: boolean;
  targetIsDead: boolean;
  attackCooldown: number; // 0..1 (1 = fully charged)
  spectatorMode: boolean;
}

export interface CrosshairState {
  visible: boolean;
  color: CrosshairColor;
  showAttackRing: boolean;
  attackRingFill: number; // 0..1
}

export function renderCrosshair(q: CrosshairQuery): CrosshairState {
  if (q.spectatorMode) {
    return {
      visible: false,
      color: 'default',
      showAttackRing: false,
      attackRingFill: 0,
    };
  }
  let color: CrosshairColor = 'default';
  if (q.targetIsDead) color = 'dead';
  else if (q.targetKind === 'entity') color = q.targetIsHostile ? 'hostile' : 'friendly';
  return {
    visible: true,
    color,
    showAttackRing: q.attackCooldown < 1,
    attackRingFill: Math.max(0, Math.min(1, q.attackCooldown)),
  };
}

// Item pickup feedback: when the player picks up an item, the HUD
// temporarily shows a "+N" indicator near the crosshair with the
// item texture. The indicator fades out over 2 seconds.

export interface PickupIndicator {
  itemId: string;
  count: number;
  displaySec: number;
  remainingSec: number;
}

export function pickupIndicator(itemId: string, count: number): PickupIndicator {
  return { itemId, count, displaySec: 2, remainingSec: 2 };
}

export function tickPickupIndicator(p: PickupIndicator, dtSec: number): boolean {
  p.remainingSec = Math.max(0, p.remainingSec - dtSec);
  return p.remainingSec > 0;
}

export function pickupOpacity(p: PickupIndicator): number {
  return Math.max(0, Math.min(1, p.remainingSec / p.displaySec));
}

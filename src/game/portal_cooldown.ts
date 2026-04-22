// Portal cooldown. After traveling through a nether / end / gateway
// portal, an entity has a cooldown before it can be teleported again.
// Without this, entities can oscillate between dimensions every tick.
//
//   Player: 300 ticks = 15 seconds (300 in survival, 0 in creative)
//   Mob:    300 ticks
//   End gateway: 40 ticks (much shorter to allow bouncing)

export type CooldownReason = 'nether_portal' | 'end_portal' | 'end_gateway';

export const PORTAL_COOLDOWN_TICKS: Record<CooldownReason, number> = {
  nether_portal: 300,
  end_portal: 300,
  end_gateway: 40,
};

export interface PortalCooldownState {
  ticksRemaining: number;
  reason: CooldownReason | null;
}

export function makeCooldown(): PortalCooldownState {
  return { ticksRemaining: 0, reason: null };
}

export function startCooldown(state: PortalCooldownState, reason: CooldownReason): void {
  state.ticksRemaining = PORTAL_COOLDOWN_TICKS[reason];
  state.reason = reason;
}

export function tickCooldown(state: PortalCooldownState, dtTicks: number): void {
  state.ticksRemaining = Math.max(0, state.ticksRemaining - dtTicks);
  if (state.ticksRemaining === 0) state.reason = null;
}

export function canTeleport(state: PortalCooldownState, creative: boolean): boolean {
  if (creative) return true;
  return state.ticksRemaining === 0;
}

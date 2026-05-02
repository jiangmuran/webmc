// Portal cooldown. After traveling, entities have a cooldown during
// which they don't re-trigger the portal. Prevents ping-pong.
//
// Wiki (minecraft.wiki/w/Nether_Portal): "After being teleported by
// a portal, the entity is given an immunity period during which they
// don't trigger the portal again. For players, this is 10 seconds
// (200 ticks). For mobs, it's 15 seconds (300 ticks)."
//
// Old PLAYER_PORTAL_COOLDOWN_TICKS = 10 (0.5s) was 20× too short —
// players would get bounced back through the portal almost
// immediately if they stayed within the destination portal's bounds.

export const PLAYER_PORTAL_COOLDOWN_TICKS = 200;
export const MOB_PORTAL_COOLDOWN_TICKS = 300;

export interface PortalTraveler {
  entityType: 'player' | 'mob';
  cooldownTicksRemaining: number;
  insidePortal: boolean;
  ticksInsidePortal: number;
}

export const PORTAL_ACTIVATION_TICKS = 80; // player must stand 4s before teleport
export const PORTAL_ACTIVATION_TICKS_CREATIVE = 0;

export function shouldTeleport(t: PortalTraveler): boolean {
  if (t.cooldownTicksRemaining > 0) return false;
  if (!t.insidePortal) return false;
  const threshold = t.entityType === 'player' ? PORTAL_ACTIVATION_TICKS : 0;
  return t.ticksInsidePortal >= threshold;
}

export function afterTeleport(t: PortalTraveler): PortalTraveler {
  const cooldown =
    t.entityType === 'player' ? PLAYER_PORTAL_COOLDOWN_TICKS : MOB_PORTAL_COOLDOWN_TICKS;
  return { ...t, cooldownTicksRemaining: cooldown, insidePortal: false, ticksInsidePortal: 0 };
}

export function tick(t: PortalTraveler): PortalTraveler {
  return {
    ...t,
    cooldownTicksRemaining: Math.max(0, t.cooldownTicksRemaining - 1),
    ticksInsidePortal: t.insidePortal ? t.ticksInsidePortal + 1 : 0,
  };
}

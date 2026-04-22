// End gateway. Activated by throwing an ender pearl; teleports player
// to outer end islands (or back toward center if beyond 1000 blocks
// from origin).

export const OUTER_THRESHOLD = 1000;

export interface GatewayEntry {
  centerX: number;
  centerZ: number;
  throwerX: number;
  throwerZ: number;
}

export interface TeleportTarget {
  x: number;
  y: number;
  z: number;
}

export function targetFor(q: GatewayEntry): TeleportTarget {
  const dx = q.throwerX - q.centerX;
  const dz = q.throwerZ - q.centerZ;
  const dist = Math.sqrt(dx * dx + dz * dz);
  if (dist < OUTER_THRESHOLD) {
    // Outbound: project outward ~1024 blocks in the throw direction
    const len = Math.max(dist, 1);
    const tx = q.centerX + (dx / len) * 1024;
    const tz = q.centerZ + (dz / len) * 1024;
    return { x: Math.round(tx), y: 75, z: Math.round(tz) };
  }
  // Inbound: send back toward main island.
  return { x: 0, y: 75, z: 0 };
}

// Each gateway can only be used every 40 ticks (2s).
export const GATEWAY_COOLDOWN_TICKS = 40;

export interface GatewayState {
  lastUseTick: number;
}

export function canUse(s: GatewayState, nowTick: number): boolean {
  return nowTick - s.lastUseTick >= GATEWAY_COOLDOWN_TICKS;
}

export function use(s: GatewayState, nowTick: number): void {
  s.lastUseTick = nowTick;
}

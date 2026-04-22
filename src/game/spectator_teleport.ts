// Spectator teleport + camera-bound. Spectator mode lets a player click
// another entity to bind their camera to it (F5 view). Walking through
// walls is allowed; being hit by projectiles is not.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SpectatorState {
  playerId: string;
  position: Vec3;
  boundToEntityId: number | null;
  cameraUnboundFromDeath: boolean;
}

export function makeSpectator(playerId: string, at: Vec3): SpectatorState {
  return {
    playerId,
    position: { ...at },
    boundToEntityId: null,
    cameraUnboundFromDeath: false,
  };
}

export interface TeleportRequest {
  targetEntityId: number;
  targetPos: Vec3 | null;
}

export interface TeleportResult {
  accepted: boolean;
  newPos: Vec3;
  boundTo: number | null;
}

export function teleportSpectator(state: SpectatorState, r: TeleportRequest): TeleportResult {
  if (!r.targetPos) {
    return { accepted: false, newPos: state.position, boundTo: state.boundToEntityId };
  }
  state.position = { ...r.targetPos };
  state.boundToEntityId = r.targetEntityId;
  return { accepted: true, newPos: state.position, boundTo: r.targetEntityId };
}

export function unbindCamera(state: SpectatorState): void {
  state.boundToEntityId = null;
}

// When the bound entity dies or despawns, the camera snaps back to the
// spectator's last known position.
export interface UnbindOnDeathCtx {
  lastKnownPos: Vec3;
}

export function unbindOnTargetDeath(state: SpectatorState, ctx: UnbindOnDeathCtx): void {
  state.boundToEntityId = null;
  state.position = { ...ctx.lastKnownPos };
  state.cameraUnboundFromDeath = true;
}

// Spectator player-list tab shows spectators in italics.
export function displayName(name: string): string {
  return `§o${name}§r`;
}

// Map decoration tracker. Maps carry a list of 4-bit "decorations" —
// player markers, banner markers, mansion/monument icons, frame icons
// for map-in-frame, red X for buried-treasure destination, etc.

export type DecorationKind =
  | 'player'
  | 'banner_white'
  | 'banner_orange'
  | 'banner_magenta'
  | 'banner_light_blue'
  | 'banner_yellow'
  | 'banner_lime'
  | 'banner_pink'
  | 'banner_gray'
  | 'banner_light_gray'
  | 'banner_cyan'
  | 'banner_purple'
  | 'banner_blue'
  | 'banner_brown'
  | 'banner_green'
  | 'banner_red'
  | 'banner_black'
  | 'red_marker' // buried treasure X
  | 'mansion'
  | 'monument'
  | 'frame'
  | 'trial_chambers';

export interface MapDecoration {
  id: string; // uuid or "banner:<coords>"
  kind: DecorationKind;
  worldX: number;
  worldZ: number;
  yawDegrees: number;
  label?: string;
}

export class MapDecorationTracker {
  private readonly byId = new Map<string, MapDecoration>();

  add(d: MapDecoration): void {
    this.byId.set(d.id, d);
  }

  remove(id: string): boolean {
    return this.byId.delete(id);
  }

  all(): MapDecoration[] {
    return Array.from(this.byId.values());
  }

  // Banners within map bounds are auto-added when a player right-clicks
  // the banner with the map. Movement of the banner (impossible, blocks
  // don't move with pistons for banners) isn't tracked.
  addBannerMarker(x: number, z: number, colorSuffix: string, label?: string): void {
    const base: Omit<MapDecoration, 'label'> = {
      id: `banner:${x},${z}`,
      kind: `banner_${colorSuffix}` as DecorationKind,
      worldX: x,
      worldZ: z,
      yawDegrees: 0,
    };
    this.byId.set(base.id, label !== undefined ? { ...base, label } : base);
  }

  // Player markers auto-track the player's current position; here we
  // expose an update-in-place API for the engine to call on movement.
  updatePlayerMarker(playerId: string, x: number, z: number, yaw: number): void {
    const existing = this.byId.get(playerId);
    if (existing) {
      existing.worldX = x;
      existing.worldZ = z;
      existing.yawDegrees = yaw;
      return;
    }
    this.byId.set(playerId, {
      id: playerId,
      kind: 'player',
      worldX: x,
      worldZ: z,
      yawDegrees: yaw,
    });
  }

  // Filter decorations to those whose world position lies within the
  // map's visible AABB.
  inBounds(minX: number, minZ: number, maxX: number, maxZ: number): MapDecoration[] {
    return this.all().filter(
      (d) => d.worldX >= minX && d.worldX <= maxX && d.worldZ >= minZ && d.worldZ <= maxZ,
    );
  }
}

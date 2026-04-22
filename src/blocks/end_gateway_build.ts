// End gateway construction. After the Ender Dragon is killed, placing 4
// end crystals in a 1×1×1 "+ pattern" around an end crystal spawns a
// gateway portal that teleports the player to a random far-end island.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface GatewayLookup {
  isEndCrystal: (x: number, y: number, z: number) => boolean;
}

// Returns true if the 4 axis-aligned positions around (x, y, z) all host
// end crystals — the configuration that spawns a gateway.
export function isGatewayConfiguration(center: Vec3, lookup: GatewayLookup): boolean {
  const deltas = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];
  return deltas.every((d) => lookup.isEndCrystal(center.x + d.x, center.y + d.y, center.z + d.z));
}

// Gateway destination: somewhere on the ring of outer end islands at
// distance 1024 + n*1024 from origin. The angle is deterministic per
// gateway index (0..19).
export function gatewayDestination(index: number): Vec3 {
  const ring = 1024 + Math.floor(index / 20) * 1024;
  const angle = (index % 20) * ((Math.PI * 2) / 20);
  return {
    x: Math.round(Math.cos(angle) * ring),
    y: 75,
    z: Math.round(Math.sin(angle) * ring),
  };
}

// Gateway portal consumes the 4 crystals and leaves a hollow bedrock
// frame + a beacon beam announcing the portal's presence.
export interface GatewayBuildResult {
  crystalsConsumed: number;
  portalOrigin: Vec3;
  beaconBeam: boolean;
}

export function buildGateway(center: Vec3, index: number): GatewayBuildResult {
  const _dest = gatewayDestination(index);
  void _dest;
  return {
    crystalsConsumed: 4,
    portalOrigin: { ...center },
    beaconBeam: true,
  };
}

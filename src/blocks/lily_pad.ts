// Lily pad. 1-pixel-tall block placed on top of water sources. Supports
// walking across; a boat collides with lily pads and breaks them;
// frozen-ocean variant destroys them on ice contact.

export interface LilyPadPlaceQuery {
  targetBlock: string; // the block the player clicked on
  aboveIsAir: boolean;
}

export function canPlaceLilyPad(q: LilyPadPlaceQuery): boolean {
  if (!q.aboveIsAir) return false;
  // Wiki: lily pads can be placed on water source, ice, packed_ice,
  // blue_ice, frosted_ice. Was water + ice only.
  return (
    q.targetBlock === 'webmc:water' ||
    q.targetBlock === 'webmc:ice' ||
    q.targetBlock === 'webmc:packed_ice' ||
    q.targetBlock === 'webmc:blue_ice' ||
    q.targetBlock === 'webmc:frosted_ice'
  );
}

// A boat moving into a lily pad breaks the pad (no drop).
export interface BoatCollisionResult {
  broken: boolean;
  drops: { item: string; count: number }[];
}

export function onBoatCollide(): BoatCollisionResult {
  return { broken: true, drops: [] };
}

// Breaking by hand or any tool drops the lily pad.
export function breakLilyPad(byBoat: boolean): BoatCollisionResult {
  if (byBoat) return { broken: true, drops: [] };
  return { broken: true, drops: [{ item: 'webmc:lily_pad', count: 1 }] };
}

// Bone meal on a lily pad doesn't grow anything — it only spreads grass/
// moss nearby in a 3×3 on tillable soil.
export function boneMealLilyPad(): boolean {
  return false;
}

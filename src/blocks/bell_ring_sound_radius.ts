// Bell ringing radius + mob alert. Hostile illagers highlighted for
// 3s within 32 blocks; villagers nearby seek shelter.

export const ALERT_RADIUS = 32;
export const GLOW_DURATION_TICKS = 60;

export interface RingQuery {
  bellPos: { x: number; y: number; z: number };
  entities: {
    id: string;
    pos: { x: number; y: number; z: number };
    kind: 'illager' | 'villager' | 'other';
  }[];
}

export interface RingResult {
  highlightedIds: string[];
  villagersToShelter: string[];
}

export function ringEffects(q: RingQuery): RingResult {
  const high: string[] = [];
  const shel: string[] = [];
  for (const e of q.entities) {
    const dx = e.pos.x - q.bellPos.x;
    const dy = e.pos.y - q.bellPos.y;
    const dz = e.pos.z - q.bellPos.z;
    if (dx * dx + dy * dy + dz * dz > ALERT_RADIUS * ALERT_RADIUS) continue;
    if (e.kind === 'illager') high.push(e.id);
    else if (e.kind === 'villager') shel.push(e.id);
  }
  return { highlightedIds: high, villagersToShelter: shel };
}

// Bell sound carries further than alert: attenuates over 48 blocks.
export const SOUND_RADIUS = 48;

export function audibleAt(distance: number): number {
  if (distance > SOUND_RADIUS) return 0;
  return 1 - distance / SOUND_RADIUS;
}

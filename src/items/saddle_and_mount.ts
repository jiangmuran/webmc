// Saddles. Horses, donkeys, mules, striders, pigs (with carrot-on-stick),
// camels, and the two undead horse variants accept saddles. A saddled
// mount can be ridden; steering speed depends on mount type.
//
// Wiki (minecraft.wiki/w/Saddle): saddleable mobs in Java Edition are
// horse, donkey, mule, pig, strider, camel (1.20+), skeleton_horse,
// and zombie_horse. Old set was missing camel and the two undead
// horse variants — saddling any of those silently no-op'd.

export type MountKind =
  | 'horse'
  | 'donkey'
  | 'mule'
  | 'pig'
  | 'strider'
  | 'camel'
  | 'skeleton_horse'
  | 'zombie_horse';

export interface Mount {
  kind: MountKind;
  saddled: boolean;
  speedAttribute: number; // base speed
  riderId: string | null;
}

const ALLOWED_SADDLE = new Set<MountKind>([
  'horse',
  'donkey',
  'mule',
  'pig',
  'strider',
  'camel',
  'skeleton_horse',
  'zombie_horse',
]);

export function canSaddle(m: Mount): boolean {
  return ALLOWED_SADDLE.has(m.kind);
}

export function saddle(m: Mount): boolean {
  if (!canSaddle(m)) return false;
  if (m.saddled) return false;
  m.saddled = true;
  return true;
}

export function unsaddle(m: Mount): boolean {
  if (!m.saddled) return false;
  m.saddled = false;
  return true;
}

export function mount(m: Mount, riderId: string): boolean {
  if (!m.saddled && m.kind !== 'horse') return false;
  if (m.riderId !== null) return false;
  m.riderId = riderId;
  return true;
}

export function dismount(m: Mount): string | null {
  const r = m.riderId;
  m.riderId = null;
  return r;
}

// Horse speed random in 0.1125..0.3375; donkey/mule lower; strider lava
// speed; pig fixed.
export function effectiveSpeed(m: Mount, carrotOnStick: boolean): number {
  if (m.kind === 'pig' && !carrotOnStick) return m.speedAttribute * 0.25;
  return m.speedAttribute;
}

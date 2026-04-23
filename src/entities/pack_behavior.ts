// Pack hostile mob behavior. Wolves + polar bears become aggressive
// in packs when one member is hurt.

export interface PackMember {
  id: string;
  hurtAtTick: number | null;
  retaliating: boolean;
}

export interface Pack {
  members: Map<string, PackMember>;
  retaliationDurationTicks: number;
}

export function makePack(retaliationDurationTicks = 600): Pack {
  return { members: new Map(), retaliationDurationTicks };
}

export function addMember(p: Pack, id: string): void {
  p.members.set(id, { id, hurtAtTick: null, retaliating: false });
}

export function onMemberHurt(p: Pack, id: string, nowTick: number): void {
  const m = p.members.get(id);
  if (!m) return;
  m.hurtAtTick = nowTick;
  m.retaliating = true;
  for (const other of p.members.values()) {
    if (other.id !== id) other.retaliating = true;
  }
}

export function tick(p: Pack, nowTick: number): void {
  for (const m of p.members.values()) {
    if (m.hurtAtTick === null) continue;
    if (nowTick - m.hurtAtTick > p.retaliationDurationTicks) {
      m.retaliating = false;
      m.hurtAtTick = null;
    }
  }
}

export function anyRetaliating(p: Pack): boolean {
  for (const m of p.members.values()) if (m.retaliating) return true;
  return false;
}

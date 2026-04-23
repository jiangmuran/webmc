// Mount/dismount state machine.

export interface Mountable {
  id: string;
  canMount: boolean;
  riderId: string | null;
  saddled: boolean;
  requiresSaddle: boolean;
}

export function mount(m: Mountable, playerId: string): boolean {
  if (!m.canMount) return false;
  if (m.riderId !== null) return false;
  if (m.requiresSaddle && !m.saddled) return false;
  m.riderId = playerId;
  return true;
}

export function dismount(m: Mountable, playerId: string): boolean {
  if (m.riderId !== playerId) return false;
  m.riderId = null;
  return true;
}

export function currentRider(m: Mountable): string | null {
  return m.riderId;
}

export function canSteer(m: Mountable, playerId: string): boolean {
  return m.riderId === playerId && m.saddled;
}

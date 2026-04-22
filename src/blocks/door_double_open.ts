// Double doors. Placing a door next to an existing door mirrors it so
// both halves open outward as a pair. A redstone signal to one opens
// the whole pair.

export type Hinge = 'left' | 'right';
export type DoorFacing = 'north' | 'south' | 'east' | 'west';

export interface DoorState {
  facing: DoorFacing;
  hinge: Hinge;
  open: boolean;
}

// Hinge inference on placement: mirrors neighbor if the neighbor is a
// door of the same material on the adjacent cell.
export interface PlaceQuery {
  facing: DoorFacing;
  neighborLeft: DoorState | null;
  neighborRight: DoorState | null;
}

export function hingeFor(q: PlaceQuery): Hinge {
  if (q.neighborLeft?.facing === q.facing && q.neighborLeft.hinge === 'left') {
    return 'right';
  }
  if (q.neighborRight?.facing === q.facing && q.neighborRight.hinge === 'right') {
    return 'left';
  }
  return 'left';
}

// Open both halves of a pair. Returns ids-to-update.
export interface Door {
  id: string;
  state: DoorState;
}

export function openPair(a: Door, b: Door | null): string[] {
  a.state.open = true;
  const out = [a.id];
  if (b?.state.facing === a.state.facing && b.state.hinge !== a.state.hinge) {
    b.state.open = true;
    out.push(b.id);
  }
  return out;
}

export function closePair(a: Door, b: Door | null): string[] {
  a.state.open = false;
  const out = [a.id];
  if (b?.state.facing === a.state.facing && b.state.hinge !== a.state.hinge) {
    b.state.open = false;
    out.push(b.id);
  }
  return out;
}

// Piston push limit. A piston can push at most 12 blocks. Obsidian,
// bedrock, crying obsidian, enchanting tables, etc. are immovable.
// Slime/honey blocks drag their neighbors.

export interface PushQuery {
  headPos: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
  blockAt: (
    x: number,
    y: number,
    z: number,
  ) => {
    id: string;
    movability: 'normal' | 'immovable' | 'destroyed_on_push' | 'slime' | 'honey' | 'air';
  };
}

export const PISTON_MAX = 12;

export interface PushPlan {
  success: boolean;
  moved: { x: number; y: number; z: number; id: string }[];
  destroyed: { x: number; y: number; z: number; id: string }[];
}

// Simple linear push (no slime/honey chains); returns a plan or failure.
export function planLinearPush(q: PushQuery): PushPlan {
  const moved: PushPlan['moved'] = [];
  const destroyed: PushPlan['destroyed'] = [];
  let x = q.headPos.x;
  let y = q.headPos.y;
  let z = q.headPos.z;
  for (let step = 0; step < PISTON_MAX + 1; step++) {
    const b = q.blockAt(x, y, z);
    if (b.movability === 'air') {
      return { success: true, moved, destroyed };
    }
    if (b.movability === 'immovable') {
      return { success: false, moved: [], destroyed: [] };
    }
    if (b.movability === 'destroyed_on_push') {
      destroyed.push({ x, y, z, id: b.id });
      return { success: true, moved, destroyed };
    }
    moved.push({ x, y, z, id: b.id });
    if (moved.length > PISTON_MAX) {
      return { success: false, moved: [], destroyed: [] };
    }
    x += q.direction.x;
    y += q.direction.y;
    z += q.direction.z;
  }
  return { success: false, moved: [], destroyed: [] };
}

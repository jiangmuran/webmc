// Piston adhesion rules for slime and honey blocks. Slime sticks to every
// neighboring non-honey block; honey sticks to every neighboring non-slime
// block. Slime and honey do NOT stick to each other — this is the trick
// that lets farmers build diagonal flying machines.

export type StickyKind = 'slime' | 'honey' | 'neither';

export function stickyKindOf(blockId: string): StickyKind {
  if (blockId === 'webmc:slime_block') return 'slime';
  if (blockId === 'webmc:honey_block') return 'honey';
  return 'neither';
}

// Returns true if `a` should move together with its neighbor `b`.
export function sticksTo(a: string, b: string): boolean {
  const ka = stickyKindOf(a);
  const kb = stickyKindOf(b);
  if (ka === 'neither' && kb === 'neither') return false;
  if (ka === 'slime' && kb === 'honey') return false; // the famous exception
  if (kb === 'slime' && ka === 'honey') return false;
  if (ka === 'slime' || kb === 'slime') return true;
  if (ka === 'honey' || kb === 'honey') return true;
  return false;
}

// Flood-fill "push group": starting from `origin`, collect all the blocks
// that should travel together with the piston push. `neighbors` is the
// graph: for each block position key, the neighbor positions to consider
// for adhesion. `blockAt` returns the block id at a key.
export interface StickyGraph {
  neighborsOf: (key: string) => readonly string[];
  blockAt: (key: string) => string;
}

export function collectPushGroup(origin: string, graph: StickyGraph): Set<string> {
  const out = new Set<string>([origin]);
  const stack: string[] = [origin];
  while (stack.length > 0) {
    const cur = stack.pop();
    if (cur === undefined) break;
    const curBlock = graph.blockAt(cur);
    for (const n of graph.neighborsOf(cur)) {
      if (out.has(n)) continue;
      const nb = graph.blockAt(n);
      if (sticksTo(curBlock, nb)) {
        out.add(n);
        stack.push(n);
      }
    }
  }
  return out;
}

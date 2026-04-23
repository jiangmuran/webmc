// Binary heap priority queue keyed on numeric priority (min-heap).
// Used for A* path-finding frontier and block-update ordering.

export interface HeapNode<T> {
  value: T;
  priority: number;
}

export interface MinHeap<T> {
  nodes: HeapNode<T>[];
}

export function makeHeap<T>(): MinHeap<T> {
  return { nodes: [] };
}

export function push<T>(h: MinHeap<T>, value: T, priority: number): void {
  h.nodes.push({ value, priority });
  siftUp(h, h.nodes.length - 1);
}

export function pop<T>(h: MinHeap<T>): T | undefined {
  if (h.nodes.length === 0) return undefined;
  const top = h.nodes[0];
  const last = h.nodes.pop();
  if (!top) return undefined;
  if (h.nodes.length > 0 && last) {
    h.nodes[0] = last;
    siftDown(h, 0);
  }
  return top.value;
}

export function size<T>(h: MinHeap<T>): number {
  return h.nodes.length;
}

function siftUp<T>(h: MinHeap<T>, i: number): void {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    const a = h.nodes[i];
    const b = h.nodes[parent];
    if (!a || !b || a.priority >= b.priority) break;
    h.nodes[i] = b;
    h.nodes[parent] = a;
    i = parent;
  }
}

function siftDown<T>(h: MinHeap<T>, i: number): void {
  const n = h.nodes.length;
  for (;;) {
    const l = i * 2 + 1;
    const r = i * 2 + 2;
    let smallest = i;
    const curr = h.nodes[smallest];
    const ln = l < n ? h.nodes[l] : undefined;
    const rn = r < n ? h.nodes[r] : undefined;
    if (!curr) break;
    if (ln && ln.priority < curr.priority) smallest = l;
    const sn = h.nodes[smallest];
    if (rn && sn && rn.priority < sn.priority) smallest = r;
    if (smallest === i) break;
    const a = h.nodes[i];
    const b = h.nodes[smallest];
    if (!a || !b) break;
    h.nodes[i] = b;
    h.nodes[smallest] = a;
    i = smallest;
  }
}
